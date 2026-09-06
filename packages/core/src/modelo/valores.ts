/**
 * Tipos de valor del sistema de estilos.
 *
 * La regla más importante de este archivo está en `Medida`:
 * `0`, `auto` y ausente son tres cosas distintas y nunca se confunden.
 *
 *   { valor: 0, unidad: 'px' }  → cero explícito. El usuario lo puso.
 *   'auto'                      → una regla. El navegador decide.
 *   propiedad ausente           → heredado. Del breakpoint base o del token.
 *
 * Por eso `exactOptionalPropertyTypes` está activo en el tsconfig: impide
 * escribir `undefined` en una propiedad opcional, que es justo la forma en
 * que estas tres cosas se acaban mezclando.
 */

export type Unidad = 'px' | '%' | 'rem' | 'em' | 'vw' | 'vh';

/** Una longitud concreta. */
export interface Longitud {
  readonly valor: number;
  readonly unidad: Unidad;
}

/** Una longitud, o la regla `auto`. Nunca `undefined`: eso se expresa omitiendo la propiedad. */
export type Medida = Longitud | 'auto';

/**
 * Un color. O apunta a un token de la marca activa, o es un valor literal.
 *
 * Los componentes del catálogo usan SIEMPRE `token`. El literal existe para
 * cuando el usuario elige un color a mano en el inspector.
 */
export type Color =
  | { readonly tipo: 'token'; readonly token: string }
  | { readonly tipo: 'literal'; readonly valor: string; readonly opacidad?: number };

/** Referencia a un recurso de la biblioteca, o a una URL externa. */
export type Recurso =
  | { readonly tipo: 'biblioteca'; readonly id: string }
  | { readonly tipo: 'url'; readonly url: string };

export type Dispositivo = 'escritorio' | 'tableta' | 'movil';

export type EstadoInteraccion = 'normal' | 'hover' | 'foco' | 'activo';

export type Modo = 'web' | 'email' | 'libre';

/**
 * De dónde viene el valor que se está mostrando en el inspector.
 * El inspector lo indica en cada control y permite restablecer.
 */
export type Procedencia = 'global' | 'heredado' | 'local' | 'estado';

export const DISPOSITIVOS: readonly Dispositivo[] = ['escritorio', 'tableta', 'movil'];

/** Escritorio es la base. Tableta y móvil heredan de él, en este orden. */
export const CADENA_HERENCIA: Readonly<Record<Dispositivo, readonly Dispositivo[]>> = {
  escritorio: [],
  tableta: ['escritorio'],
  movil: ['tableta', 'escritorio'],
};

export const ESTADOS: readonly EstadoInteraccion[] = ['normal', 'hover', 'foco', 'activo'];

export const MODOS: readonly Modo[] = ['web', 'email', 'libre'];

/** Construye una longitud en píxeles. Atajo para el caso más común. */
export function px(valor: number): Longitud {
  return { valor, unidad: 'px' };
}

/** Serializa una medida a CSS. `auto` sale tal cual; el cero sale como `0`. */
export function medidaACss(medida: Medida): string {
  if (medida === 'auto') return 'auto';
  if (medida.valor === 0) return '0';
  return `${medida.valor}${medida.unidad}`;
}
