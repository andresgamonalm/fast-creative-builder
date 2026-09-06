/**
 * Cliente de la API.
 *
 * Una sola implementación en todo el editor. En el aplicativo anterior había
 * siete copias con tres variantes distintas de manejo de errores.
 */

export class ErrorApi extends Error {
  constructor(
    mensaje: string,
    readonly estado: number,
  ) {
    super(mensaje);
    this.name = 'ErrorApi';
  }

  get esNoAutenticado(): boolean {
    return this.estado === 401;
  }

  get esSinPermiso(): boolean {
    return this.estado === 403;
  }
}

interface Opciones {
  readonly metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readonly cuerpo?: unknown;
  readonly senal?: AbortSignal;
}

export async function api<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const { metodo = 'GET', cuerpo, senal } = opciones;

  let respuesta: Response;
  try {
    respuesta = await fetch(ruta, {
      method: metodo,
      credentials: 'same-origin',
      ...(cuerpo === undefined
        ? {}
        : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) }),
      ...(senal ? { signal: senal } : {}),
    });
  } catch {
    throw new ErrorApi('No hay conexión con el servidor.', 0);
  }

  let datos: unknown = null;
  try {
    datos = await respuesta.json();
  } catch {
    // Respuesta sin cuerpo JSON: se decide solo por el código.
  }

  if (!respuesta.ok) {
    const mensaje =
      typeof datos === 'object' && datos !== null && 'error' in datos
        ? String((datos as { error: unknown }).error)
        : 'Algo ha fallado.';
    throw new ErrorApi(mensaje, respuesta.status);
  }

  return datos as T;
}

export const obtener = <T,>(ruta: string, senal?: AbortSignal): Promise<T> =>
  api<T>(ruta, senal ? { senal } : {});

export const enviar = <T,>(ruta: string, cuerpo?: unknown): Promise<T> =>
  api<T>(ruta, cuerpo === undefined ? { metodo: 'POST' } : { metodo: 'POST', cuerpo });

export const borrar = <T,>(ruta: string): Promise<T> => api<T>(ruta, { metodo: 'DELETE' });
