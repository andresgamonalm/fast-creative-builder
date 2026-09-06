/**
 * Freno de fuerza bruta.
 *
 * Cuenta intentos por clave —el correo, o el correo más la acción— en una
 * ventana de tiempo. No pretende ser un limitador general de tráfico: solo
 * evita que se pueda probar contraseñas o pedir correos sin tope.
 */

import type { Entorno } from '../entorno.js';
import { ahora } from './claves.js';

export interface Limite {
  readonly maximo: number;
  readonly ventanaMinutos: number;
}

export const LIMITE_ENTRADA: Limite = { maximo: 8, ventanaMinutos: 15 };
export const LIMITE_RECUPERACION: Limite = { maximo: 4, ventanaMinutos: 60 };
/** Tope por origen: evita que se deje fuera a una persona conocida probando
 *  su correo, y frena al que reparte intentos entre muchas cuentas. */
export const LIMITE_ORIGEN: Limite = { maximo: 40, ventanaMinutos: 15 };

/** El origen de la petición, para contar por IP además de por cuenta. */
export function origenDe(peticion: Request): string {
  return (
    peticion.headers.get('CF-Connecting-IP') ??
    peticion.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    'desconocido'
  );
}

function desdeHace(minutos: number): string {
  return new Date(Date.now() - minutos * 60_000).toISOString();
}

/**
 * Anota el intento y devuelve `true` si con éste ya se superó el límite.
 *
 * Anotar ANTES de verificar es deliberado: antes se consultaba el contador y
 * el intento se registraba mucho después, tras una derivación PBKDF2 de
 * 210.000 iteraciones. En esa ventana cabían cientos de peticiones
 * simultáneas que leían el mismo contador bajo (comprobar-y-luego-actuar) y
 * el freno no frenaba nada.
 */
export async function anotarYComprobar(
  entorno: Entorno,
  clave: string,
  limite: Limite,
): Promise<boolean> {
  await registrarIntento(entorno, clave);
  return superaLimite(entorno, clave, limite);
}

/** `true` si la clave ya superó su límite y hay que rechazar. */
export async function superaLimite(
  entorno: Entorno,
  clave: string,
  limite: Limite,
): Promise<boolean> {
  const fila = await entorno.BD.prepare(
    'SELECT COUNT(*) AS total FROM intentos_acceso WHERE clave = ? AND ocurrido > ?',
  )
    .bind(clave, desdeHace(limite.ventanaMinutos))
    .first<{ total: number }>();
  return (fila?.total ?? 0) >= limite.maximo;
}

export async function registrarIntento(entorno: Entorno, clave: string): Promise<void> {
  await entorno.BD.prepare('INSERT INTO intentos_acceso (clave, ocurrido) VALUES (?, ?)')
    .bind(clave, ahora())
    .run();
}

/** Al acertar se borra el historial: no penalizamos a quien ya entró bien. */
export async function limpiarIntentos(entorno: Entorno, clave: string): Promise<void> {
  await entorno.BD.prepare('DELETE FROM intentos_acceso WHERE clave = ?').bind(clave).run();
}

/** Poda general, para que la tabla no crezca sin fin. */
export async function podarIntentos(entorno: Entorno): Promise<void> {
  await entorno.BD.prepare('DELETE FROM intentos_acceso WHERE ocurrido < ?')
    .bind(desdeHace(60 * 24))
    .run();
}
