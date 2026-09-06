/**
 * Punto de entrada del Worker.
 *
 * Enruta `/api/*` y deja todo lo demás al servidor de estáticos, que sirve el
 * editor compilado. Una sola cosa que desplegar, y en local se comporta igual
 * gracias a `wrangler dev`.
 *
 * El permiso se resuelve aquí, antes de llamar a ninguna ruta: cada entrada de
 * la tabla declara si necesita sesión y si necesita ser administrador. Ninguna
 * ruta comprueba permisos por su cuenta, y ninguna se los salta.
 */

import type { Contexto, Entorno } from './entorno.js';
import { error, json, noAutenticado, noEncontrado, sinPermiso } from './http.js';
import { ahora, uuid } from './acceso/claves.js';
import { limpiarCaducados, usuarioDeLaPeticion } from './acceso/sesion.js';
import { podarIntentos } from './acceso/limite.js';
import * as acceso from './rutas/acceso.js';
import * as usuarios from './rutas/usuarios.js';

type Permiso = 'publico' | 'sesion' | 'administrador';

interface Ruta {
  readonly metodo: string;
  /** Segmentos; los que empiezan por ':' capturan. */
  readonly patron: readonly string[];
  readonly permiso: Permiso;
  readonly manejar: (c: Contexto, params: Record<string, string>) => Promise<Response>;
}

function ruta(
  metodo: string,
  camino: string,
  permiso: Permiso,
  manejar: Ruta['manejar'],
): Ruta {
  return { metodo, patron: camino.split('/').filter(Boolean), permiso, manejar };
}

const RUTAS: readonly Ruta[] = [
  ruta('GET', '/api/salud', 'publico', async () => json({ ok: true, servicio: 'fcb' })),

  // Acceso
  ruta('POST', '/api/acceso/entrar', 'publico', (c) => acceso.entrar(c.peticion, c.entorno, c.url)),
  ruta('POST', '/api/acceso/salir', 'publico', (c) => acceso.salir(c.peticion, c.entorno, c.url)),
  ruta('POST', '/api/acceso/recuperar', 'publico', (c) => acceso.recuperar(c.peticion, c.entorno)),
  ruta('GET', '/api/acceso/token/:token', 'publico', (c, p) =>
    acceso.comprobarToken(c.entorno, p['token'] ?? ''),
  ),
  ruta('POST', '/api/acceso/establecer', 'publico', (c) =>
    acceso.establecerClave(c.peticion, c.entorno, c.url),
  ),
  ruta('GET', '/api/acceso/yo', 'sesion', async (c) => json({ ok: true, usuario: c.usuario })),

  // Personas — solo el administrador
  ruta('GET', '/api/usuarios', 'administrador', (c) => usuarios.listar(c)),
  ruta('POST', '/api/usuarios', 'administrador', (c) => usuarios.invitar(c)),
  ruta('POST', '/api/usuarios/:id/reinvitar', 'administrador', (c, p) =>
    usuarios.reinvitar(c, p['id'] ?? ''),
  ),
  ruta('POST', '/api/usuarios/:id/estado', 'administrador', (c, p) =>
    usuarios.cambiarEstado(c, p['id'] ?? ''),
  ),
  ruta('DELETE', '/api/usuarios/:id', 'administrador', (c, p) => usuarios.eliminar(c, p['id'] ?? '')),
];

function decodificarSegmento(valor: string): string | null {
  try {
    return decodeURIComponent(valor);
  } catch {
    return null;
  }
}

function emparejar(
  metodo: string,
  segmentos: readonly string[],
): { ruta: Ruta; params: Record<string, string> } | 'metodo-no-permitido' | null {
  let hayCamino = false;

  for (const r of RUTAS) {
    if (r.patron.length !== segmentos.length) continue;

    const params: Record<string, string> = {};
    let coincide = true;
    for (let i = 0; i < r.patron.length; i++) {
      const trozo = r.patron[i]!;
      const valor = segmentos[i]!;
      if (trozo.startsWith(':')) {
        // decodeURIComponent lanza con cualquier escape inválido, y esto corre
        // ANTES de resolver el permiso: `DELETE /api/usuarios/%` tumbaba la
        // petición con un 500 sin necesidad de sesión. Un escape roto no es un
        // fallo del servidor, es una ruta que no existe.
        const decodificado = decodificarSegmento(valor);
        if (decodificado === null) {
          coincide = false;
          break;
        }
        params[trozo.slice(1)] = decodificado;
      } else if (trozo !== valor) {
        coincide = false;
        break;
      }
    }
    if (!coincide) continue;

    hayCamino = true;
    if (r.metodo === metodo) return { ruta: r, params };
  }

  return hayCamino ? 'metodo-no-permitido' : null;
}

/**
 * La primera vez que arranca no hay ninguna cuenta. Se crea la del
 * administrador a partir de `CORREO_ADMINISTRADOR` y se emite su invitación,
 * para que exista una forma de entrar sin tocar la base de datos a mano.
 */
let administradorComprobado = false;

async function garantizarAdministrador(entorno: Entorno): Promise<void> {
  if (administradorComprobado) return;

  const fila = await entorno.BD.prepare('SELECT COUNT(*) AS total FROM usuarios').first<{
    total: number;
  }>();
  if ((fila?.total ?? 0) > 0) {
    administradorComprobado = true;
    return;
  }

  const correo = (entorno.CORREO_ADMINISTRADOR || '').trim().toLowerCase();
  if (!correo) {
    console.error('[instalación] Falta CORREO_ADMINISTRADOR: no se puede crear la primera cuenta.');
    return;
  }

  const id = uuid();
  await entorno.BD.prepare(
    `INSERT INTO usuarios (id, correo, nombre, rol, estado, creado_en)
     VALUES (?, ?, ?, 'administrador', 'activo', ?)`,
  )
    .bind(id, correo, 'Administrador', ahora())
    .run();

  const { enlace, enviado } = await acceso.crearInvitacion(entorno, id, correo, id);
  if (!enviado) {
    console.info(`[instalación] Cuenta de administrador creada. Entra aquí: ${enlace}`);
  }
  administradorComprobado = true;
}

export default {
  async fetch(peticion: Request, entorno: Entorno, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(peticion.url);

    if (!url.pathname.startsWith('/api/')) {
      return entorno.ASSETS.fetch(peticion);
    }

    try {
      await garantizarAdministrador(entorno);

      const segmentos = url.pathname.split('/').filter(Boolean);
      const encontrada = emparejar(peticion.method, segmentos);

      if (encontrada === null) return noEncontrado();
      if (encontrada === 'metodo-no-permitido') return error('Método no permitido.', 405);

      const { ruta: r, params } = encontrada;

      const usuario = r.permiso === 'publico' ? null : await usuarioDeLaPeticion(entorno, peticion);
      if (r.permiso !== 'publico' && !usuario) return noAutenticado();
      if (r.permiso === 'administrador' && usuario?.rol !== 'administrador') return sinPermiso();

      // Limpieza de fondo, sin retrasar la respuesta.
      ctx.waitUntil(
        Promise.all([limpiarCaducados(entorno), podarIntentos(entorno)]).catch(() => undefined),
      );

      const contexto: Contexto = {
        peticion,
        entorno,
        ctx,
        url,
        // Las rutas públicas no leen `usuario`; el tipo lo exige y aquí se
        // rellena con un marcador inerte para no complicar cada firma.
        usuario: usuario ?? {
          id: '',
          correo: '',
          nombre: '',
          rol: 'usuario',
          estado: 'activo',
        },
      };

      return await r.manejar(contexto, params);
    } catch (fallo) {
      const mensaje = fallo instanceof Error ? fallo.message : String(fallo);
      console.error('[api] Error no controlado:', mensaje);
      ctx.waitUntil(
        entorno.BD.prepare(
          `INSERT INTO registro_errores (ocurrido_en, origen, nivel, mensaje, traza, url)
           VALUES (?, 'servidor', 'error', ?, ?, ?)`,
        )
          .bind(
            ahora(),
            mensaje.slice(0, 2000),
            (fallo instanceof Error ? (fallo.stack ?? '') : '').slice(0, 4000) || null,
            url.pathname,
          )
          .run()
          .then(() => undefined)
          .catch(() => undefined),
      );
      return error('Algo ha fallado en el servidor.', 500);
    }
  },
} satisfies ExportedHandler<Entorno>;
