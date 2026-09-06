/**
 * Utilidades de respuesta HTTP.
 *
 * Sin `Access-Control-Allow-Origin: *`. El editor se sirve desde el mismo
 * origen que la API, así que no hace falta CORS. El aplicativo anterior lo
 * abría en todos los endpoints, incluidos los autenticados, sin necesitarlo.
 */

const CABECERAS_BASE: Readonly<Record<string, string>> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export function json(datos: unknown, estado = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { ...CABECERAS_BASE, ...extra },
  });
}

/** Error con forma estable: el editor siempre puede leer `error`. */
export function error(mensaje: string, estado = 400, extra: Record<string, string> = {}): Response {
  return json({ ok: false, error: mensaje }, estado, extra);
}

export const noAutenticado = () => error('No has iniciado sesión.', 401);
export const sinPermiso = () => error('No tienes permiso para esto.', 403);
export const noEncontrado = () => error('No existe.', 404);

/** Lee el cuerpo como JSON, devolviendo `null` si no lo es. */
export async function leerJson<T>(peticion: Request): Promise<T | null> {
  try {
    return (await peticion.json()) as T;
  } catch {
    return null;
  }
}

export function leerCookie(peticion: Request, nombre: string): string | null {
  const cabecera = peticion.headers.get('Cookie');
  if (!cabecera) return null;
  for (const parte of cabecera.split(';')) {
    const corte = parte.indexOf('=');
    if (corte === -1) continue;
    if (parte.slice(0, corte).trim() === nombre) {
      return decodeURIComponent(parte.slice(corte + 1));
    }
  }
  return null;
}
