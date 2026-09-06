/**
 * La caja de estilos de un nodo.
 *
 * Todas las propiedades son opcionales, y la ausencia significa "heredado".
 * Un nodo recién creado tiene la caja vacía, y por tanto margen, relleno y
 * separación en cero: el reset del aplicativo los pone a cero y aquí no hay
 * nada que los cambie.
 *
 * Esto es la regla espacial principal del producto, y es una propiedad del
 * modelo de datos, no una convención que haya que recordar.
 */

import type { Color, Medida, Recurso } from './valores.js';

export type Alineacion = 'inicio' | 'centro' | 'fin';
export type AlineacionTexto = 'izquierda' | 'centro' | 'derecha' | 'justificado';
export type Distribucion = 'inicio' | 'centro' | 'fin' | 'entre' | 'alrededor' | 'uniforme';
export type Direccion = 'fila' | 'columna' | 'fila-inversa' | 'columna-inversa';
export type ModoLayout = 'bloque' | 'flex' | 'grid' | 'linea' | 'ninguno';
export type Posicion = 'flujo' | 'relativa' | 'absoluta' | 'fija' | 'pegajosa';
export type Overflow = 'visible' | 'oculto' | 'recorte' | 'desplazamiento';
export type EstiloBorde = 'solido' | 'guiones' | 'puntos';
export type Ajuste = 'cubrir' | 'contener' | 'estirar' | 'original';

/** Las cuatro caras de una caja. Cada una se omite si es heredada. */
export interface Lados {
  readonly arriba?: Medida;
  readonly derecha?: Medida;
  readonly abajo?: Medida;
  readonly izquierda?: Medida;
}

export interface Esquinas {
  readonly supIzq?: Medida;
  readonly supDer?: Medida;
  readonly infDer?: Medida;
  readonly infIzq?: Medida;
}

export interface Tipografia {
  readonly familia?: string;
  readonly tamano?: Medida;
  readonly grosor?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  readonly cursiva?: boolean;
  readonly alturaLinea?: number;
  readonly espaciadoLetras?: Medida;
  readonly transformacion?: 'ninguna' | 'mayusculas' | 'minusculas' | 'capitalizar';
  readonly decoracion?: 'ninguna' | 'subrayado' | 'tachado';
  readonly alineacion?: AlineacionTexto;
}

export interface Fondo {
  readonly color?: Color;
  readonly degradado?: string;
  readonly imagen?: Recurso;
  readonly ajuste?: Ajuste;
  /** Punto focal en porcentaje, 0–100. La rejilla de nueve posiciones del inspector escribe aquí. */
  readonly focoX?: number;
  readonly focoY?: number;
  readonly repetir?: boolean;
  /** Velo sobre la imagen, 0–1. */
  readonly velo?: number;
  readonly colorVelo?: Color;
}

export interface Borde {
  readonly grosor?: Lados;
  readonly estilo?: EstiloBorde;
  readonly color?: Color;
  readonly radio?: Esquinas;
}

export interface Efectos {
  readonly sombra?: string;
  readonly sombraInterior?: string;
  readonly opacidad?: number;
  readonly desenfoque?: Medida;
  readonly mezcla?: string;
}

export interface Transformacion {
  readonly moverX?: Medida;
  readonly moverY?: Medida;
  readonly escala?: number;
  readonly rotacion?: number;
  readonly inclinacionX?: number;
  readonly inclinacionY?: number;
  readonly voltearH?: boolean;
  readonly voltearV?: boolean;
  readonly origen?: string;
}

/**
 * Caja de estilos completa.
 *
 * Ojo con la separación entre las tres magnitudes espaciales, porque es donde
 * el aplicativo anterior se rompió:
 *
 *   `margen`     vive FUERA de la caja. Nunca se convierte en relleno ni se suma a la separación.
 *   `relleno`    vive entre el borde del contenedor y sus hijos. No separa el componente de sus hermanos.
 *   `separacion` separa ÚNICAMENTE hijos directos en flex o grid. No toca el borde del contenedor.
 */
export interface Estilos {
  // Tamaño
  readonly ancho?: Medida;
  readonly alto?: Medida;
  readonly anchoMin?: Medida;
  readonly anchoMax?: Medida;
  readonly altoMin?: Medida;
  readonly altoMax?: Medida;
  readonly proporcion?: string;

  // Espaciado — las tres magnitudes, separadas y sin contaminarse
  readonly margen?: Lados;
  readonly relleno?: Lados;
  readonly separacion?: { readonly x?: Medida; readonly y?: Medida };

  // Disposición
  readonly layout?: ModoLayout;
  readonly direccion?: Direccion;
  readonly ajusteLinea?: boolean;
  readonly alineacion?: Alineacion;
  readonly distribucion?: Distribucion;
  readonly columnas?: string;
  readonly filas?: string;
  readonly orden?: number;

  // Posición
  readonly posicion?: Posicion;
  readonly x?: Medida;
  readonly y?: Medida;
  readonly capa?: number;

  readonly overflow?: Overflow;

  // Apariencia
  readonly tipografia?: Tipografia;
  readonly color?: Color;
  readonly fondo?: Fondo;
  readonly borde?: Borde;
  readonly efectos?: Efectos;
  readonly transformacion?: Transformacion;
}

/** Caja vacía. Es lo que recibe todo nodo nuevo: sin espaciado, sin nada heredado de más. */
export const ESTILOS_VACIOS: Estilos = Object.freeze({});
