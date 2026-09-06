/**
 * El árbol de nodos.
 *
 * Un nodo es recursivo: tiene ranuras con nombre y cada ranura contiene hijos.
 * No hay dos categorías de pieza —bloque de sección y elemento suelto— como en
 * el aplicativo anterior, donde un bloque era una caja negra con campos fijos y
 * no se podía meter nada dentro. Aquí todo es el mismo tipo de nodo y la
 * anatomía de cada componente decide qué admite cada ranura.
 */

import type { Estilos } from './estilos.js';
import type { Dispositivo, EstadoInteraccion, Medida } from './valores.js';

export type IdNodo = string;

/**
 * Cómo participa un nodo en el espacio de su padre.
 *
 *   'flujo'   → ocupa sitio. Fila, columna o celda de rejilla.
 *   'overlay' → no ocupa sitio. Se posiciona contra el padre y no empuja a nadie.
 *
 * Un overlay NUNCA aumenta la altura de su padre ni desplaza a sus hermanos.
 * Es la segunda regla innegociable del producto.
 */
export type Disposicion = 'flujo' | 'overlay';

/** Los nueve puntos de anclaje de una capa superpuesta. */
export type Ancla =
  | 'sup-izq' | 'sup-centro' | 'sup-der'
  | 'centro-izq' | 'centro' | 'centro-der'
  | 'inf-izq' | 'inf-centro' | 'inf-der';

export interface ColocacionOverlay {
  /** Coordenadas relativas AL PADRE, nunca a la página. */
  readonly x: Medida;
  readonly y: Medida;
  readonly ancla: Ancla;
  readonly capa: number;
}

export interface Visibilidad {
  readonly escritorio?: boolean;
  readonly tableta?: boolean;
  readonly movil?: boolean;
}

/**
 * Qué estado del componente se congela al rasterizar a JPG o PNG, y al generar
 * el respaldo de correo.
 *
 * Vive en el nodo desde el primer día, no se añade al final. Cualquier
 * componente con estados —carrusel, pestañas, acordeón, ventana emergente,
 * antes y después, puntos activos, contador, progreso— lo declara aquí.
 */
export interface EstadoCaptura {
  readonly indice?: number;
  readonly ranura?: string;
  readonly abierto?: boolean;
  readonly valor?: number;
}

/** Las sobrescrituras de estilo por dispositivo. Escritorio es la base. */
export type EstilosPorDispositivo = Partial<Record<Dispositivo, Estilos>>;

/** Las sobrescrituras por estado. `normal` es la base; los demás guardan solo lo que difiere. */
export type EstilosPorEstado = Partial<Record<EstadoInteraccion, Estilos>>;

export interface Nodo {
  readonly id: IdNodo;
  /** Identificador del componente en el registro. */
  readonly tipo: string;
  /** Nombre editable, el que aparece en el panel de capas. */
  readonly nombre: string;
  /** Cuál de las variantes obligatorias del componente está activa. */
  readonly variante: string;

  /** Dónde vive este nodo. `null` solo en la raíz. */
  readonly padre: IdNodo | null;
  /** En qué ranura del padre. `null` solo en la raíz. */
  readonly ranuraPadre: string | null;

  /**
   * Hijos por ranura, en orden.
   *
   * Junto con `padre` y `ranuraPadre` del hijo, es la única fuente de verdad
   * de la estructura. Ambos lados se escriben siempre a la vez, desde las
   * funciones de mutación del árbol. Nunca a mano.
   */
  readonly ranuras: Readonly<Record<string, readonly IdNodo[]>>;

  /** Contenido propio del componente, validado contra el esquema de su manifiesto. */
  readonly contenido: Readonly<Record<string, unknown>>;

  /** Estilos base: escritorio, estado normal. */
  readonly estilos: Estilos;
  readonly porDispositivo: EstilosPorDispositivo;
  readonly porEstado: EstilosPorEstado;

  readonly disposicion: Disposicion;
  /** Presente solo cuando `disposicion` es `'overlay'`. */
  readonly overlay?: ColocacionOverlay;

  readonly visibilidad: Visibilidad;
  readonly captura?: EstadoCaptura;

  readonly bloqueado: boolean;
  readonly oculto: boolean;
}

/** Almacén normalizado. El árbol se recorre por identificadores, no por anidación de objetos. */
export interface ArbolNodos {
  readonly raiz: IdNodo;
  readonly nodos: Readonly<Record<IdNodo, Nodo>>;
}
