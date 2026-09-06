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
  LIMITE_ORIGEN,
  LIMITE_RECUPERACION,
  anotarYComprobar,
  limpiarIntentos,
  origenDe,
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

/**
 * Credencial señuelo. Cuando el correo no existe se deriva igualmente contra
 * ésta, para que el coste de la respuesta no dependa de si la cuenta existe.
 * Sin esto, un correo desconocido respondía tras un SELECT indexado y uno
 * conocido tras 210.000 iteraciones de PBKDF2: la diferencia de tiempo era
 * un listado de cuentas.
 */
const SENUELO = {
  hash: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
  sal: 'AAAAAAAAAAAAAAAAAAAAAA==',
  iteraciones: 210_000,
};

export async function entrar(peticion: Request, entorno: Entorno, url: URL): Promise<Response> {
  const cuerpo = await leerJson<{ correo?: string; clave?: string }>(peticion);
  const correo = normalizar(cuerpo?.correo);
  const clave = typeof cuerpo?.clave === 'string' ? cuerpo.clave : '';

  if (!correo || !clave) return error('Escribe tu correo y tu contraseña.');

  const frenado = 'Demasiados intentos fallidos. Espera unos minutos y vuelve a probar.';
  // Se anota antes de verificar, no después: así el contador refleja también
  // las peticiones en vuelo.
  if (await anotarYComprobar(entorno, `entrar-origen:${origenDe(peticion)}`, LIMITE_ORIGEN)) {
    return error(frenado, 429);
  }
  if (await anotarYComprobar(entorno, `entrar:${correo}`, LIMITE_ENTRADA)) {
    return error(frenado, 429);
  }

  const fila = await entorno.BD.prepare(
    `SELECT id, correo, nombre, rol, estado, clave_hash, clave_sal, clave_iteraciones
       FROM usuarios WHERE correo = ? LIMIT 1`,
  )
    .bind(correo)
    .first<FilaUsuario>();

  const tieneClave = Boolean(fila?.clave_hash && fila.clave_sal && fila.clave_iteraciones);
  const correcta = await verificarClave(
    clave,
    tieneClave
      ? { hash: fila!.clave_hash!, sal: fila!.clave_sal!, iteraciones: fila!.clave_iteraciones! }
      : SENUELO,
  );

  // Mismo mensaje y ahora también mismo coste, exista o no la cuenta.
  if (!fila || !tieneClave || !correcta) {
    return error('Correo o contraseña incorrectos.', 401);
  }

  // Este mensaje sí confirma que la cuenta existe, a diferencia del anterior.
  // Es deliberado: en una herramienta interna de quince personas, que alguien
  // bloqueado sepa por qué no entra vale más que ocultárselo. Va DESPUÉS de
  // comprobar la contraseña, así que sólo lo ve quien ya la sabe.
  if (fila.estado !== 'activo') {
    return error('Esta cuenta está bloqueada. Habla con el administrador.', 403);
  }

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
  const respuestaNeutra = (): Response => json({ ok: true });

  if (await anotarYComprobar(entorno, `recuperar-origen:${origenDe(peticion)}`, LIMITE_ORIGEN)) {
    return respuestaNeutra();
  }
  if (await anotarYComprobar(entorno, `recuperar:${correo}`, LIMITE_RECUPERACION)) {
    return respuestaNeutra();
  }

  const fila = await entorno.BD.prepare(
    "SELECT id FROM usuarios WHERE correo = ? AND estado = 'activo' LIMIT 1",
  )
    .bind(correo)
    .first<{ id: string }>();
  if (!fila) return respuestaNeutra();

  const token = generarToken(32);
  // Sólo puede haber un enlace vivo por persona y propósito: pedir el enlace
  // dos veces dejaba los dos sirviendo, y el primero seguía valiendo media
  // hora en la bandeja de entrada aunque ya se hubiera usado el segundo.
  await entorno.BD.batch([
    entorno.BD.prepare(
      `UPDATE tokens_acceso SET usado_en = ?
        WHERE usuario_id = ? AND proposito = 'recuperacion' AND usado_en IS NULL`,
    ).bind(ahora(), fila.id),
    entorno.BD.prepare(
      `INSERT INTO tokens_acceso (id, usuario_id, proposito, token_hash, expira_en, creado_en)
       VALUES (?, ?, 'recuperacion', ?, ?, ?)`,
    ).bind(uuid(), fila.id, await hashToken(token), enMinutos(MINUTOS_RECUPERACION), ahora()),
  ]);

  const enlace = `${entorno.URL_SITIO}/recuperar/${token}`;
  // Si el envío falla —clave caducada, cuota, dominio sin verificar— la
  // excepción subía al catch general y devolvía un 500, pero SÓLO cuando la
  // cuenta existía. Eso convertía la respuesta neutra en un delator.
  try {
    await enviar(entorno, correoRecuperacion(entorno, correo, enlace));
  } catch (fallo) {
    console.error(
      '[recuperar] no se pudo enviar el correo:',
      fallo instanceof Error ? fallo.message : String(fallo),
    );
  }

  return respuestaNeutra();
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
    // Se anulan TODOS los enlaces vivos de esa persona, no sólo el usado.
    // Antes, si había pedido el enlace dos veces, el otro seguía sirviendo
    // para volver a cambiar la contraseña.
    entorno.BD.prepare(
      'UPDATE tokens_acceso SET usado_en = ? WHERE usuario_id = ? AND usado_en IS NULL',
    ).bind(ahora(), fila.usuario_id),
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
  // Una sola invitación viva por persona: reinvitar anula la anterior en vez
  // de dejar dos enlaces válidos siete días cada uno.
  await entorno.BD.batch([
    entorno.BD.prepare(
      `UPDATE tokens_acceso SET usado_en = ?
        WHERE usuario_id = ? AND proposito = 'invitacion' AND usado_en IS NULL`,
    ).bind(ahora(), usuarioId),
    entorno.BD.prepare(
      `INSERT INTO tokens_acceso (id, usuario_id, proposito, token_hash, expira_en, creado_por, creado_en)
       VALUES (?, ?, 'invitacion', ?, ?, ?, ?)`,
    ).bind(uuid(), usuarioId, await hashToken(token), enDias(DIAS_INVITACION), creadoPor, ahora()),
  ]);

  const enlace = `${entorno.URL_SITIO}/invitacion/${token}`;
  // El enlace ya existe y es válido: que el envío falle no puede tirar la
  // petición ni perderlo. Se devuelve igual para poder pasarlo a mano.
  let enviado = false;
  try {
    enviado = await enviar(entorno, correoInvitacion(entorno, correo, enlace));
  } catch (fallo) {
    console.error(
      '[invitacion] no se pudo enviar el correo:',
      fallo instanceof Error ? fallo.message : String(fallo),
    );
  }
  return { enlace, enviado };
}
