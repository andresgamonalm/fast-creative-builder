/**
 * Gestión de personas. Todo esto es solo del administrador, y el permiso se
 * comprueba en el enrutador antes de llegar aquí.
 */

import type { Contexto, Rol } from '../entorno.js';
import { error, json, leerJson, noEncontrado } from '../http.js';
import { ahora, uuid } from '../acceso/claves.js';
import { cerrarTodasLasSesiones } from '../acceso/sesion.js';
import { crearInvitacion } from './acceso.js';

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Tope acordado: el aplicativo está pensado para un equipo pequeño. */
const MAXIMO_USUARIOS = 15;

interface FilaListado {
  readonly id: string;
  readonly correo: string;
  readonly nombre: string;
  readonly rol: string;
  readonly estado: string;
  readonly creado_en: string;
  readonly ultimo_acceso: string | null;
  readonly tiene_clave: number;
  readonly invitacion_pendiente: number;
}

export async function listar(c: Contexto): Promise<Response> {
  const { results } = await c.entorno.BD.prepare(
    `SELECT u.id, u.correo, u.nombre, u.rol, u.estado, u.creado_en, u.ultimo_acceso,
            CASE WHEN u.clave_hash IS NOT NULL THEN 1 ELSE 0 END AS tiene_clave,
            (SELECT COUNT(*) FROM tokens_acceso t
              WHERE t.usuario_id = u.id AND t.proposito = 'invitacion'
                AND t.usado_en IS NULL AND t.expira_en > ?) AS invitacion_pendiente
       FROM usuarios u
      ORDER BY u.creado_en ASC`,
  )
    .bind(ahora())
    .all<FilaListado>();

  const usuarios = (results ?? []).map((f) => ({
    id: f.id,
    correo: f.correo,
    nombre: f.nombre,
    rol: f.rol,
    estado: f.estado,
    creadoEn: f.creado_en,
    ultimoAcceso: f.ultimo_acceso,
    // Sin contraseña y con invitación viva = todavía no ha entrado nunca.
    pendienteDeEntrar: f.tiene_clave === 0,
    invitacionPendiente: f.invitacion_pendiente > 0,
  }));

  return json({ ok: true, usuarios, maximo: MAXIMO_USUARIOS });
}

export async function invitar(c: Contexto): Promise<Response> {
  const cuerpo = await leerJson<{ correo?: string; nombre?: string; rol?: string }>(c.peticion);
  const correo = typeof cuerpo?.correo === 'string' ? cuerpo.correo.trim().toLowerCase() : '';
  const nombre = typeof cuerpo?.nombre === 'string' ? cuerpo.nombre.trim() : '';
  const rol: Rol = cuerpo?.rol === 'administrador' ? 'administrador' : 'usuario';

  if (!CORREO_VALIDO.test(correo)) return error('Ese correo no parece válido.');
  if (!nombre) return error('Escribe el nombre de la persona.');

  const existente = await c.entorno.BD.prepare('SELECT id FROM usuarios WHERE correo = ? LIMIT 1')
    .bind(correo)
    .first<{ id: string }>();
  if (existente) return error('Ya hay una cuenta con ese correo.', 409);

  const total = await c.entorno.BD.prepare('SELECT COUNT(*) AS total FROM usuarios').first<{
    total: number;
  }>();
  if ((total?.total ?? 0) >= MAXIMO_USUARIOS) {
    return error(`Has llegado al máximo de ${MAXIMO_USUARIOS} cuentas.`, 409);
  }

  const id = uuid();
  await c.entorno.BD.prepare(
    `INSERT INTO usuarios (id, correo, nombre, rol, estado, creado_en)
     VALUES (?, ?, ?, ?, 'activo', ?)`,
  )
    .bind(id, correo, nombre, rol, ahora())
    .run();

  const { enlace, enviado } = await crearInvitacion(c.entorno, id, correo, c.usuario.id);

  // Cuando no hay servicio de correo configurado se devuelve el enlace para
  // poder pasarlo a mano. Nunca falla en silencio.
  return json({ ok: true, id, enviado, ...(enviado ? {} : { enlace }) });
}

export async function reinvitar(c: Contexto, id: string): Promise<Response> {
  const fila = await c.entorno.BD.prepare(
    "SELECT id, correo FROM usuarios WHERE id = ? AND estado = 'activo' LIMIT 1",
  )
    .bind(id)
    .first<{ id: string; correo: string }>();
  if (!fila) return noEncontrado();

  const { enlace, enviado } = await crearInvitacion(c.entorno, fila.id, fila.correo, c.usuario.id);
  return json({ ok: true, enviado, ...(enviado ? {} : { enlace }) });
}

export async function cambiarEstado(c: Contexto, id: string): Promise<Response> {
  const cuerpo = await leerJson<{ estado?: string }>(c.peticion);
  const estado = cuerpo?.estado;
  if (estado !== 'activo' && estado !== 'bloqueado') {
    return error('El estado tiene que ser activo o bloqueado.');
  }
  if (id === c.usuario.id) return error('No puedes bloquearte a ti mismo.');

  const fila = await c.entorno.BD.prepare('SELECT id, rol FROM usuarios WHERE id = ? LIMIT 1')
    .bind(id)
    .first<{ id: string; rol: string }>();
  if (!fila) return noEncontrado();

  if (estado === 'bloqueado') {
    const sinAdministrador = await dejariaSinAdministrador(c, id, fila.rol);
    if (sinAdministrador) return sinAdministrador;
  }

  await c.entorno.BD.prepare('UPDATE usuarios SET estado = ? WHERE id = ?').bind(estado, id).run();

  // Bloquear expulsa de inmediato: las sesiones abiertas dejan de servir.
  if (estado === 'bloqueado') await cerrarTodasLasSesiones(c.entorno, id);

  return json({ ok: true });
}

export async function eliminar(c: Contexto, id: string): Promise<Response> {
  if (id === c.usuario.id) return error('No puedes eliminar tu propia cuenta.');

  const fila = await c.entorno.BD.prepare('SELECT id, rol FROM usuarios WHERE id = ? LIMIT 1')
    .bind(id)
    .first<{ id: string; rol: string }>();
  if (!fila) return noEncontrado();

  const sinAdministrador = await dejariaSinAdministrador(c, id, fila.rol);
  if (sinAdministrador) return sinAdministrador;

  // Se cuentan TODOS los proyectos, también los de la papelera, y también los
  // recursos: antes sólo se miraban los proyectos vivos, así que alguien con
  // trabajo en la papelera pasaba el filtro y el DELETE reventaba con un 500
  // por clave foránea.
  const dependencias = await c.entorno.BD.prepare(
    `SELECT (SELECT COUNT(*) FROM proyectos WHERE propietario_id = ?1) AS proyectos,
            (SELECT COUNT(*) FROM recursos  WHERE propietario_id = ?1) AS recursos`,
  )
    .bind(id)
    .first<{ proyectos: number; recursos: number }>();

  const proyectos = dependencias?.proyectos ?? 0;
  const recursos = dependencias?.recursos ?? 0;
  if (proyectos > 0 || recursos > 0) {
    const partes: string[] = [];
    if (proyectos > 0) partes.push(`${proyectos} proyecto(s), contando la papelera`);
    if (recursos > 0) partes.push(`${recursos} archivo(s) en la biblioteca`);
    return error(
      `Esta persona tiene ${partes.join(' y ')}. Bloquea la cuenta en vez de eliminarla, ` +
        'o traspasa antes su trabajo.',
      409,
    );
  }

  await cerrarTodasLasSesiones(c.entorno, id);
  await c.entorno.BD.prepare('DELETE FROM usuarios WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

/**
 * Devuelve una respuesta de error si quitar a esta persona dejaría el
 * aplicativo sin ningún administrador activo. Sin administrador no hay forma
 * de invitar a nadie ni de recuperar el control desde la propia interfaz.
 */
async function dejariaSinAdministrador(
  c: Contexto,
  id: string,
  rol: string,
): Promise<Response | null> {
  if (rol !== 'administrador') return null;
  const fila = await c.entorno.BD.prepare(
    `SELECT COUNT(*) AS total FROM usuarios
      WHERE rol = 'administrador' AND estado = 'activo' AND id <> ?`,
  )
    .bind(id)
    .first<{ total: number }>();
  if ((fila?.total ?? 0) > 0) return null;
  return error(
    'Es la única cuenta de administrador activa. Nombra antes a otra persona administradora.',
    409,
  );
}
