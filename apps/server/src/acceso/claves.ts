/**
 * Contraseñas y tokens.
 *
 * En Workers no hay bcrypt ni argon2, así que se usa PBKDF2-SHA256 de la
 * WebCrypto, que sí está disponible y es adecuado con un número de
 * iteraciones alto. El número se guarda junto al hash para poder subirlo en
 * el futuro sin invalidar las contraseñas existentes.
 */

const ITERACIONES = 210_000;
const LARGO_CLAVE = 32;

const codificador = new TextEncoder();

function aBase64(bytes: Uint8Array): string {
  let cadena = '';
  for (const byte of bytes) cadena += String.fromCharCode(byte);
  return btoa(cadena);
}

function desdeBase64(texto: string): Uint8Array {
  const binario = atob(texto);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

function aBase64Url(bytes: Uint8Array): string {
  return aBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function derivar(clave: string, sal: Uint8Array, iteraciones: number): Promise<Uint8Array> {
  const material = await crypto.subtle.importKey('raw', codificador.encode(clave), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: sal as BufferSource, iterations: iteraciones, hash: 'SHA-256' },
    material,
    LARGO_CLAVE * 8,
  );
  return new Uint8Array(bits);
}

export interface ClaveGuardada {
  readonly hash: string;
  readonly sal: string;
  readonly iteraciones: number;
}

export async function cifrarClave(clave: string): Promise<ClaveGuardada> {
  const sal = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivar(clave, sal, ITERACIONES);
  return { hash: aBase64(hash), sal: aBase64(sal), iteraciones: ITERACIONES };
}

/** Comparación en tiempo constante: no revela por dónde difieren los bytes. */
export async function verificarClave(clave: string, guardada: ClaveGuardada): Promise<boolean> {
  const esperado = desdeBase64(guardada.hash);
  const obtenido = await derivar(clave, desdeBase64(guardada.sal), guardada.iteraciones);
  if (esperado.length !== obtenido.length) return false;
  let diferencia = 0;
  for (let i = 0; i < esperado.length; i++) diferencia |= esperado[i]! ^ obtenido[i]!;
  return diferencia === 0;
}

/** Token opaco para enlaces de invitación, recuperación y cookies de sesión. */
export function generarToken(bytes = 32): string {
  return aBase64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

/** Los tokens se guardan siempre cifrados: si alguien lee la base, no puede usarlos. */
export async function hashToken(token: string): Promise<string> {
  const resumen = await crypto.subtle.digest('SHA-256', codificador.encode(token));
  return aBase64(new Uint8Array(resumen));
}

export function uuid(): string {
  return crypto.randomUUID();
}

export function ahora(): string {
  return new Date().toISOString();
}

export function enMinutos(minutos: number): string {
  return new Date(Date.now() + minutos * 60_000).toISOString();
}

export function enDias(dias: number): string {
  return new Date(Date.now() + dias * 86_400_000).toISOString();
}

/**
 * Requisitos mínimos de contraseña. Deliberadamente simples: longitud por
 * encima de todo, que es lo que de verdad importa, sin exigir símbolos raros
 * que empujan a la gente a escribirlas en un papel.
 */
export function validarClave(clave: string): string | null {
  if (clave.length < 10) return 'La contraseña debe tener al menos 10 caracteres.';
  if (clave.length > 200) return 'La contraseña es demasiado larga.';
  if (!/[a-zA-Z]/.test(clave)) return 'La contraseña debe incluir alguna letra.';
  if (!/[0-9]/.test(clave)) return 'La contraseña debe incluir algún número.';
  return null;
}
