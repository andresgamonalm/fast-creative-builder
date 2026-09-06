/** Entrar, salir, aceptar una invitación y recuperar el acceso. */

import type { Entorno, Usuario } from '../entorno.js';
import { error, json, leerJson } from '../http.js';
import {
  ahora,
  cifrarClave,
  enDias,
  enMinutos,
  generarToken,
  hashToken,
  uuid,
  validarClave,
  verificarClave,
} from '../acceso/claves.js';
import {
  LIMITE_ENTRADA,
  LIMITE_RECUPERACION,
  limpiarIntentos,
  registrarIntento,
  superaLimite,
} from '../acceso/limite.js';
import {
  cerrarSesion,
  cerrarTodasLasSesiones,
  cookieCierre,
  cookieSesion,
  crearSesion,
  esSeguro,
} from '../acceso/sesion.js';
import { correoInvitacion, correoRecuperacion, enviar } from '../correo.js';

const DIAS_INVITACION = 7;
const MINUTOS_RECUPERACION = 30;

function normalizar(correo: unknown): string {
  return typeof correo === 'string' ? correo.trim().toLowerCase() : '';
}

interface FilaUsuario {
  readonly id: string;
  readonly correo: string;
  readonly nombre: string;
  readonly rol: string;
  readonly estado: string;
  readonly clave_hash: string | null;
  readonly clave_sal: string | null;
  readonly clave_iteraciones: number | null;
}

// ── Entrar ────────────────────────────────────────────────────────────────

export async function entrar(peticion: Request, entorno: Entorno, url: URL): Promise<Response> {
  const cuerpo = await leerJson<{ correo?: string; clave?: string }>(peticion);
  const correo = normalizar(cuerpo?.correo);
  const clave = typeof cuerpo?.clave === 'string' ? cuerpo.clave : '';

  if (!correo || !clave) return error('Escribe tu correo y tu contraseña.');

  if (await superaLimite(entorno, `entrar:${correo}`, LIMITE_ENTRADA)) {
    return error('Demasiados intentos fallidos. Espera unos minutos y vuelve a probar.', 429);
  }

  const fila = await entorno.BD.prepare(
    `SELECT id, correo, nombre, rol, estado, clave_hash, clave_sal, clave_iteraciones
       FROM usuarios WHERE correo = ? LIMIT 1`,
  )
    .bind(correo)
    .first<FilaUsuario>();

  // Mismo mensaje y mismo coste tanto si el correo no existe como si la
  // contraseña falla: no revelamos quién tiene cuenta.
  const credencialesMal = async (): Promise<Response> => {
    await registrarIntento(entorno, `entrar:${correo}`);
    return error('Correo o contraseña incorrectos.', 401);
  };

  if (!fila || !fila.clave_hash || !fila.clave_sal || !fila.clave_iteraciones) {
    return credencialesMal();
  }
  // Este mensaje sí confirma que la cuenta existe, a diferencia del anterior.
  // Es deliberado: en una herramienta interna de quince personas, que alguien
  // bloqueado sepa por qué no entra vale más que ocultar su existencia a un
  // atacante que necesitaría igualmente su contraseña.
  if (fila.estado !== 'activo') {
    return error('Esta cuenta está bloqueada. Habla con el administrador.', 403);
  }

  const correcta = await verificarClave(clave, {
    hash: fila.clave_hash,
    sal: fila.clave_sal,
    iteraciones: fila.clave_iteraciones,
  });
  if (!correcta) return credencialesMal();

  await limpiarIntentos(entorno, `entrar:${correo}`);

  const token = await crearSesion(entorno, fila.id, peticion.headers.get('User-Agent'));
  await entorno.BD.prepare('UPDATE usuarios SET ultimo_acceso = ? WHERE id = ?')
    .bind(ahora(), fila.id)
    .run();

  const usuario: Usuario = {
    id: fila.id,
    correo: fila.correo,
    nombre: fila.nombre,
    rol: fila.rol === 'administrador' ? 'administrador' : 'usuario',
    estado: 'activo',
  };

  return json({ ok: true, usuario }, 200, { 'Set-Cookie': cookieSesion(token, esSeguro(url)) });
}

// ── Salir ─────────────────────────────────────────────────────────────────

export async function salir(peticion: Request, entorno: Entorno, url: URL): Promise<Response> {
  await cerrarSesion(entorno, peticion);
  return json({ ok: true }, 200, { 'Set-Cookie': cookieCierre(esSeguro(url)) });
}

// ── Recuperar acceso ──────────────────────────────────────────────────────

export async function recuperar(peticion: Request, entorno: Entorno): Promise<Response> {
  const cuerpo = await leerJson<{ correo?: string }>(peticion);
  const correo = normalizar(cuerpo?.correo);
  if (!correo) return error('Escribe tu correo.');

  // Respuesta idéntica exista o no la cuenta.
  const respuestaNeutra = json({ ok: true });

  if (await superaLimite(entorno, `recuperar:${correo}`, LIMITE_RECUPERACION)) {
    return respuestaNeutra;
  }
  await registrarIntento(entorno, `recuperar:${correo}`);

  const fila = await entorno.BD.prepare(
    "SELECT id FROM usuarios WHERE correo = ? AND estado = 'activo' LIMIT 1",
  )
    .bind(correo)
    .first<{ id: string }>();
  if (!fila) return respuestaNeutra;

  const token = generarToken(32);
  await entorno.BD.prepare(
    `INSERT INTO tokens_acceso (id, usuario_id, proposito, token_hash, expira_en, creado_en)
     VALUES (?, ?, 'recuperacion', ?, ?, ?)`,
  )
    .bind(uuid(), fila.id, await hashToken(token), enMinutos(MINUTOS_RECUPERACION), ahora())
    .run();

  const enlace = `${entorno.URL_SITIO}/recuperar/${token}`;
  await enviar(entorno, correoRecuperacion(entorno, correo, enlace));

  return respuestaNeutra;
}

// ── Comprobar un token de invitación o recuperación ────────────────────────

interface FilaToken {
  readonly id: string;
  readonly usuario_id: string;
  readonly proposito: string;
  readonly correo: string;
  readonly nombre: string;
}

async function buscarToken(entorno: Entorno, token: string): Promise<FilaToken | null> {
  if (!token) return null;
  return entorno.BD.prepare(
    `SELECT t.id, t.usuario_id, t.proposito, u.correo, u.nombre
       FROM tokens_acceso t
       JOIN usuarios u ON u.id = t.usuario_id
      WHERE t.token_hash = ?
        AND t.usado_en IS NULL
        AND t.expira_en > ?
        AND u.estado = 'activo'
      LIMIT 1`,
  )
    .bind(await hashToken(token), ahora())
    .first<FilaToken>();
}

/** Lo consulta la pantalla de "elige tu contraseña" antes de mostrar el formulario. */
export async function comprobarToken(entorno: Entorno, token: string): Promise<Response> {
  const fila = await buscarToken(entorno, token);
  if (!fila) return error('Este enlace ya no es válido. Pide uno nuevo.', 410);
  return json({
    ok: true,
    proposito: fila.proposito,
    correo: fila.correo,
    nombre: fila.nombre,
  });
}

// ── Establecer contraseña (cierra invitación y recuperación) ───────────────

export async function establecerClave(
  peticion: Request,
  entorno: Entorno,
  url: URL,
): Promise<Response> {
  const cuerpo = await leerJson<{ token?: string; clave?: string; nombre?: string }>(peticion);
  const token = typeof cuerpo?.token === 'string' ? cuerpo.token : '';
  const clave = typeof cuerpo?.clave === 'string' ? cuerpo.clave : '';

  const fila = await buscarToken(entorno, token);
  if (!fila) return error('Este enlace ya no es válido. Pide uno nuevo.', 410);

  const problema = validarClave(clave);
  if (problema) return error(problema);

  const guardada = await cifrarClave(clave);
  const nombre =
    typeof cuerpo?.nombre === 'string' && cuerpo.nombre.trim() ? cuerpo.nombre.trim() : fila.nombre;

  await entorno.BD.batch([
    entorno.BD.prepare(
      `UPDATE usuarios
          SET clave_hash = ?, clave_sal = ?, clave_iteraciones = ?, nombre = ?, ultimo_acceso = ?
        WHERE id = ?`,
    ).bind(guardada.hash, guardada.sal, guardada.iteraciones, nombre, ahora(), fila.usuario_id),
    entorno.BD.prepare('UPDATE tokens_acceso SET usado_en = ? WHERE id = ?').bind(ahora(), fila.id),
  ]);

  // Cambiar la contraseña invalida cualquier sesión previa.
  await cerrarTodasLasSesiones(entorno, fila.usuario_id);
  await limpiarIntentos(entorno, `entrar:${fila.correo}`);

  const sesion = await crearSesion(entorno, fila.usuario_id, peticion.headers.get('User-Agent'));
  return json({ ok: true }, 200, { 'Set-Cookie': cookieSesion(sesion, esSeguro(url)) });
}

// ── Crear la invitación (lo llama la ruta de usuarios, ya con permisos) ────

export async function crearInvitacion(
  entorno: Entorno,
  usuarioId: string,
  correo: string,
  creadoPor: string,
): Promise<{ enlace: string; enviado: boolean }> {
  const token = generarToken(32);
  await entorno.BD.prepare(
    `INSERT INTO tokens_acceso (id, usuario_id, proposito, token_hash, expira_en, creado_por, creado_en)
     VALUES (?, ?, 'invitacion', ?, ?, ?, ?)`,
  )
    .bind(uuid(), usuarioId, await hashToken(token), enDias(DIAS_INVITACION), creadoPor, ahora())
    .run();

  const enlace = `${entorno.URL_SITIO}/invitacion/${token}`;
  const enviado = await enviar(entorno, correoInvitacion(entorno, correo, enlace));
  return { enlace, enviado };
}
