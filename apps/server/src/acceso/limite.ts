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

function desdeHace(minutos: number): string {
  return new Date(Date.now() - minutos * 60_000).toISOString();
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
