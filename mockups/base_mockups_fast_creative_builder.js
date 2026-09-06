/* ═══════════════════════════════════════════════════════════════════════
   Fast Creative Builder — recursos compartidos de las propuestas
   Iconografía, logotipos, fotografía y contenido de ejemplo.
   Script clásico, sin módulos, para que el archivo abra con doble clic.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Iconografía ─────────────────────────────────────────────────────────
   Una sola familia: trazo 1.5, remates redondeados, caja de 24.
   Sin emojis y sin mezclar estilos, como exige la marca.            */

var ICO = {
  inicio: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/>',
  crear: '<path d="M12 5v14M5 12h14"/>',
  proyectos: '<path d="M3 7.5h7l1.6 2H21v9.5H3z"/><path d="M3 7.5V5h5"/>',
  biblioteca: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 15l4.5-4 3.5 3 3.5-4L21 16"/><circle cx="8.5" cy="8.5" r="1.5"/>',
  ajustes: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M22 12h-3M5 12H2M18.4 5.6l-2 2M7.6 16.4l-2 2M18.4 18.4l-2-2M7.6 7.6l-2-2"/>',
  personas: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M17 5.5a3 3 0 0 1 0 5.6M18.5 14.4c1.9.7 3 2.3 3 4.6"/>',
  papelera: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
  buscar: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  texto: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
  imagen: '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M3 15l4.5-4 3.5 3 3.5-4L21 16"/><circle cx="8.5" cy="9" r="1.4"/>',
  boton: '<rect x="2.5" y="7.5" width="19" height="9" rx="4.5"/>',
  seccion: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18"/>',
  columnas: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M9 4v16M15 4v16"/>',
  datos: '<path d="M5 20V11M12 20V4M19 20v-6"/>',
  insercion: '<path d="M9 6L3 12l6 6M15 6l6 6-6 6"/>',
  capas: '<path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12.5l9 4.5 9-4.5M3 17l9 4.5 9-4.5"/>',
  escritorio: '<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',
  tableta: '<rect x="6" y="2.5" width="12" height="19" rx="1.5"/><path d="M11 18.5h2"/>',
  movil: '<rect x="7.5" y="2.5" width="9" height="19" rx="1.5"/><path d="M11 18.5h2"/>',
  ojo: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>',
  exportar: '<path d="M12 3v11M8 10.5l4 3.5 4-3.5"/><path d="M4 16v3.5h16V16"/>',
  guardar: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
  deshacer: '<path d="M4 9h10a5 5 0 0 1 0 10H8"/><path d="M7.5 5.5 4 9l3.5 3.5"/>',
  rehacer: '<path d="M20 9H10a5 5 0 0 0 0 10h6"/><path d="M16.5 5.5 20 9l-3.5 3.5"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  atras: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  abajo: '<path d="M6 9.5l6 6 6-6"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  correo: '<rect x="2.5" y="5" width="19" height="14" rx="1.5"/><path d="M3 6.5l9 6.5 9-6.5"/>',
  fuente: '<path d="M4 19l6-14h1.5l6 14M7 14h9"/>',
  logo: '<path d="M12 3l8 4v6c0 4.2-3.2 7.2-8 8-4.8-.8-8-3.8-8-8V7z"/>',
  candado: '<rect x="4.5" y="10" width="15" height="10.5" rx="1.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.2 2"/>',
  cuadricula: '<rect x="3" y="3" width="7.5" height="7.5" rx="1"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1"/>',
  lista: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  filtro: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  restaurar: '<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/>',
  alinIzq: '<path d="M3 6h18M3 12h11M3 18h15"/>',
  alinCen: '<path d="M3 6h18M6.5 12h11M4.5 18h15"/>',
  alinDer: '<path d="M3 6h18M10 12h11M6 18h15"/>',
  enlace: '<path d="M10 13a4.5 4.5 0 0 0 6.4.4l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4l-1.5 1.5"/><path d="M14 11a4.5 4.5 0 0 0-6.4-.4L5 13.2a4.5 4.5 0 0 0 6.4 6.4l1.5-1.5"/>',
  agarre: '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
  regla: '<path d="M3 8h18v8H3z"/><path d="M7 8v4M11 8v3M15 8v4M19 8v3"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>'
};

/* ── Reglas con píxeles reales ────────────────────────────────────────────
   Dibuja la regla midiendo el LIENZO, no la pantalla. Marca menor cada
   10 px, media cada 50 y rotulada cada 100. Recibe la escala a la que se
   está mostrando el lienzo y multiplica por ella, de modo que la cifra de
   la regla siempre corresponde al píxel real de la pieza.               */

/* Paso adaptativo: la regla nunca dibuja marcas a menos de 5 px de
   distancia en pantalla, para que se siga leyendo al reducir el lienzo. */
function pasoRegla(escala) {
  var candidatos = [1, 2, 5, 10, 20, 25, 50, 100];
  for (var i = 0; i < candidatos.length; i++) {
    if (candidatos[i] * escala >= 5) return candidatos[i];
  }
  return 100;
}

function reglaHorizontal(anchoPieza, escala, seleccion) {
  var paso = pasoRegla(escala);
  var media = paso * 5;
  var mayor = paso * 10;
  var h = '';
  for (var x = 0; x <= anchoPieza; x += paso) {
    var px = Math.round(x * escala);
    var clase = x % mayor === 0 ? 'marca marca--mayor' : (x % media === 0 ? 'marca marca--media' : 'marca');
    h += '<i class="' + clase + '" style="left:' + px + 'px"></i>';
    if (x % mayor === 0) h += '<i class="regla-n" style="left:' + px + 'px">' + x + '</i>';
  }
  if (seleccion) {
    h += '<i class="regla-sel" style="left:' + Math.round(seleccion.x * escala) +
         'px;width:' + Math.round(seleccion.ancho * escala) + 'px"></i>';
  }
  return h;
}

function reglaVertical(altoPieza, escala, seleccion) {
  var paso = pasoRegla(escala);
  var media = paso * 5;
  var mayor = paso * 10;
  var h = '';
  for (var y = 0; y <= altoPieza; y += paso) {
    var px = Math.round(y * escala);
    var clase = y % mayor === 0 ? 'marca marca--mayor' : (y % media === 0 ? 'marca marca--media' : 'marca');
    h += '<i class="' + clase + '" style="top:' + px + 'px"></i>';
    if (y % mayor === 0 && y > 0) h += '<i class="regla-n" style="top:' + px + 'px">' + y + '</i>';
  }
  if (seleccion) {
    h += '<i class="regla-sel" style="top:' + Math.round(seleccion.y * escala) +
         'px;height:' + Math.round(seleccion.alto * escala) + 'px"></i>';
  }
  return h;
}

function ico(nombre, clase) {
  return '<svg class="ico ' + (clase || '') + '" viewBox="0 0 24 24" aria-hidden="true">' +
    (ICO[nombre] || '') + '</svg>';
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Logotipos. Uno por propuesta, del mismo concepto: la marca se
      construye con bloques sólidos dentro de una caja redondeada.
      No sustituyen al logotipo de Zurich, que es intocable.          */

var LOGOS = {
  a: function (t, fondo, tinta) {
    return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 48 48" aria-label="Fast Creative Builder">' +
      '<rect width="48" height="48" rx="10" fill="' + fondo + '"/>' +
      '<path d="M14 14h20v5H14z" fill="' + tinta + '"/>' +
      '<path d="M14 21.5h13v5H14z" fill="' + tinta + '" opacity=".55"/>' +
      '<path d="M14 29h20v5H14z" fill="' + tinta + '"/></svg>';
  },
  b: function (t, fondo, tinta) {
    return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 48 48" aria-label="Fast Creative Builder">' +
      '<rect width="48" height="48" rx="10" fill="' + fondo + '"/>' +
      '<circle cx="19" cy="19" r="7" fill="' + tinta + '"/>' +
      '<circle cx="31" cy="29" r="9" fill="' + tinta + '" opacity=".55"/></svg>';
  },
  c: function (t, fondo, tinta) {
    return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 48 48" aria-label="Fast Creative Builder">' +
      '<rect width="48" height="48" rx="10" fill="' + fondo + '"/>' +
      '<path d="M13 13h22v9H13z" fill="' + tinta + '"/>' +
      '<path d="M13 26h9v9h-9z" fill="' + tinta + '"/>' +
      '<path d="M26 26h9v9h-9z" fill="' + tinta + '" opacity=".55"/></svg>';
  }
};

/* ── Fotografía. Vistas previas de Envato, registradas en ENVATO_ASSETS.md */

var FOTO = {
  loginA: 'imagenes/login_a_YSEH2WZ.jpg',
  loginB: 'imagenes/login_b_7QSLU6D.jpg',
  loginC: 'imagenes/login_c_NBSJY9S.jpg',
  home: 'imagenes/home_6WRAZHB.jpg',
  pieza1: 'imagenes/pieza_PQKN7LR.jpg',
  pieza2: 'imagenes/pieza_BAM3CJP.jpg'
};

/* ── Contenido de ejemplo, realista y en español ─────────────────────── */

var PROYECTOS = [
  { n: 'Seguro de hogar — landing de campaña', m: 'Web', e: 'Aprobado', f: '4 sept', a: 'Andrés Gamonal', img: FOTO.pieza1 },
  { n: 'Renovación auto — correo de aviso', m: 'Email', e: 'En revisión', f: '4 sept', a: 'María Pérez', img: null },
  { n: 'Cobertura viaje — pieza para redes', m: 'Libre', e: 'Borrador', f: '3 sept', a: 'Andrés Gamonal', img: FOTO.pieza2 },
  { n: 'Bienvenida a nuevos asegurados', m: 'Email', e: 'Exportado', f: '2 sept', a: 'María Pérez', img: null },
  { n: 'Comparador de planes — página', m: 'Web', e: 'Borrador', f: '1 sept', a: 'Andrés Gamonal', img: null }
];

var ESTADO_PASTILLA = {
  Aprobado: 'exito', 'En revisión': 'aviso', Borrador: 'neutra', Exportado: 'acento'
};

/* Los 65 componentes del brief, agrupados para el panel del editor */
var CATALOGO = [
  { g: 'Estructura', c: [
    { i: 'seccion', n: 'Sección', d: '4 variantes' },
    { i: 'columnas', n: 'Columnas', d: '8 repartos' },
    { i: 'cuadricula', n: 'Cuadrícula', d: '2 a 6 columnas' },
    { i: 'capas', n: 'Pila', d: '2 a 12 elementos' } ] },
  { g: 'Contenido', c: [
    { i: 'texto', n: 'Título', d: 'H1 a H6' },
    { i: 'texto', n: 'Texto enriquecido', d: '4 composiciones' },
    { i: 'imagen', n: 'Imagen', d: '5 variantes' },
    { i: 'boton', n: 'Botón', d: '5 estilos' } ] },
  { g: 'Marketing', c: [
    { i: 'imagen', n: 'Portada', d: '5 variantes' },
    { i: 'datos', n: 'Métricas', d: '2, 3, 4 o 6' },
    { i: 'lista', n: 'Precios', d: '2 a 4 planes' },
    { i: 'lista', n: 'Preguntas frecuentes', d: '3 a 12' } ] },
  { g: 'Inserción', c: [
    { i: 'insercion', n: 'Inserción', d: 'YouTube, Spotify, Power BI…' },
    { i: 'datos', n: 'Panel de datos', d: 'Looker, Power BI' } ] }
];
