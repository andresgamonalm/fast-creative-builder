/**
 * Sesiones.
 *
 * La cookie guarda un token opaco; el estado vive en la tabla `sesiones`.
 * Así, quitarle el acceso a alguien surte efecto en la siguiente petición,
 * sin esperar a que caduque nada.
 *
 * El rol se lee de la base en cada petición, nunca de la cookie ni del
 * navegador. En el aplicativo anterior la lista de administradores estaba
 * escrita en el HTML del cliente y ningún endpoint la comprobaba.
 */

import type { Entorno, Usuario } from '../entorno.js';
import { leerCookie } from '../http.js';
import { ahora, enDias, generarToken, hashToken, uuid } from './claves.js';

const COOKIE = 'fcb_sesion';
const DIAS_SESION = 14;

export function cookieSesion(token: string, seguro: boolean): string {
  const maxAge = DIAS_SESION * 86_400;
  const partes = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (seguro) partes.push('Secure');
  return partes.join('; ');
}

export function cookieCierre(seguro: boolean): string {
  const partes = [`${COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (seguro) partes.push('Secure');
  return partes.join('; ');
}

/** `Secure` rompe el desarrollo local sobre http, así que se decide por protocolo. */
export function esSeguro(url: URL): boolean {
  return url.protocol === 'https:';
}

export async function crearSesion(
  entorno: Entorno,
  usuarioId: string,
  agente: string | null,
): Promise<string> {
  const token = generarToken(32);
  await entorno.BD.prepare(
    `INSERT INTO sesiones (id, usuario_id, token_hash, expira_en, creada_en, ultimo_uso, agente)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(uuid(), usuarioId, await hashToken(token), enDias(DIAS_SESION), ahora(), ahora(), agente)
    .run();
  return token;
}

export async function cerrarSesion(entorno: Entorno, peticion: Request): Promise<void> {
  const token = leerCookie(peticion, COOKIE);
  if (!token) return;
  await entorno.BD.prepare('DELETE FROM sesiones WHERE token_hash = ?')
    .bind(await hashToken(token))
    .run();
}

/** Cierra todas las sesiones de alguien. Se usa al bloquear o al cambiar la contraseña. */
export async function cerrarTodasLasSesiones(entorno: Entorno, usuarioId: string): Promise<void> {
  await entorno.BD.prepare('DELETE FROM sesiones WHERE usuario_id = ?').bind(usuarioId).run();
}

interface FilaSesion {
  readonly sesion_id: string;
  readonly id: string;
  readonly correo: string;
  readonly nombre: string;
  readonly rol: string;
  readonly estado: string;
}

/**
 * Lee el usuario de la petición, o `null`.
 *
 * Comprueba en la misma consulta que la sesión no haya caducado y que la
 * cuenta siga activa: una cuenta bloqueada deja de tener acceso al instante,
 * aunque su cookie siga siendo válida.
 */
export async function usuarioDeLaPeticion(
  entorno: Entorno,
  peticion: Request,
): Promise<Usuario | null> {
  const token = leerCookie(peticion, COOKIE);
  if (!token) return null;

  const fila = await entorno.BD.prepare(
    `SELECT s.id AS sesion_id, u.id, u.correo, u.nombre, u.rol, u.estado
       FROM sesiones s
       JOIN usuarios u ON u.id = s.usuario_id
      WHERE s.token_hash = ?
        AND s.expira_en > ?
        AND u.estado = 'activo'
      LIMIT 1`,
  )
    .bind(await hashToken(token), ahora())
    .first<FilaSesion>();

  if (!fila) return null;

  return {
    id: fila.id,
    correo: fila.correo,
    nombre: fila.nombre,
    rol: fila.rol === 'administrador' ? 'administrador' : 'usuario',
    estado: 'activo',
  };
}

/**
 * Limpieza de sesiones, tokens caducados y errores viejos.
 *
 * Corría en CADA petición a /api/*, tres DELETE que recorrían las tablas.
 * Ahora se espacia: como mucho una vez cada cuarto de hora por instancia del
 * Worker. Sigue ejecutándose de fondo, sin retrasar la respuesta.
 */
const CADA_MS = 15 * 60_000;
const DIAS_DE_ERRORES = 30;
let ultimaLimpieza = 0;

export async function limpiarCaducados(entorno: Entorno): Promise<void> {
  const marca = Date.now();
  if (marca - ultimaLimpieza < CADA_MS) return;
  ultimaLimpieza = marca;

  const t = ahora();
  const horizonte = new Date(marca - DIAS_DE_ERRORES * 24 * 60 * 60_000).toISOString();
  await entorno.BD.batch([
    entorno.BD.prepare('DELETE FROM sesiones WHERE expira_en < ?').bind(t),
    entorno.BD.prepare(
      'DELETE FROM tokens_acceso WHERE expira_en < ? OR usado_en IS NOT NULL',
    ).bind(t),
    // El registro de errores no se podaba nunca: cualquiera podía hacerlo
    // crecer sin límite pidiendo rutas mal formadas.
    entorno.BD.prepare('DELETE FROM registro_errores WHERE ocurrido_en < ?').bind(horizonte),
  ]);
}
