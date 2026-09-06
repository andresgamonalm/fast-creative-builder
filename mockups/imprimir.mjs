/* Genera el documento para imprimir a PDF: una pantalla por página, cada
   una marcada como decisión o como visto bueno.
   Uso:  node mockups/imprimir.mjs                                        */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const leer = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

const css = ['sistema', 'propuestas'].map((n) => leer(`${n}_mockups_fast_creative_builder.css`)).join('\n');
let js = ['base', 'pantallas', 'editor', 'interiores']
  .map((n) => leer(`${n}_mockups_fast_creative_builder.js`))
  .join('\n');

for (const n of fs.readdirSync(path.join(dir, 'imagenes'))) {
  const b = fs.readFileSync(path.join(dir, 'imagenes', n));
  js = js.split("'imagenes/" + n + "'").join("'data:image/jpeg;base64," + b.toString('base64') + "'");
}

/* Qué se decide y qué sólo se aprueba.
   Las cuatro pantallas donde las propuestas difieren de verdad son
   decisiones; el resto adopta el marco de la que elijas.               */
const DECIDIR = ['login', 'home', 'editor-web', 'editor-libre'];

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Fast Creative Builder · Propuestas de interfaz</title>
<style>
${css}

@page { size: A4 landscape; margin: 0; }

html, body { margin: 0; padding: 0; background: #fff; }
body { font-family: Arial, Helvetica, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

.pagina {
  width: 297mm; height: 210mm;
  page-break-after: always; break-after: page;
  padding: 10mm 12mm; box-sizing: border-box;
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
}
.pagina:last-child { page-break-after: auto; }

.ph { display: flex; align-items: center; gap: 10px; margin-bottom: 6mm; flex: none; }
.ph__n { font-size: 11px; font-weight: 700; color: #9aa2ae; font-variant-numeric: tabular-nums; }
.ph__t { font-size: 13px; font-weight: 700; color: #23366f; }
.ph__t span { font-weight: 400; color: #4a5570; }
.ph__r { font-family: Consolas, monospace; font-size: 11px; color: #68717f; }
.ph__x { flex: 1; }
.marca-pag {
  font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 999px;
}
.marca-pag--elegir { background: #cc4038; color: #fff; }
.marca-pag--vb { background: #dde4e3; color: #23366f; }

.encaje { flex: 1; display: flex; align-items: flex-start; justify-content: center; }
.pantalla-marco {
  width: 1440px; height: 900px; flex: none;
  transform-origin: top center;
  box-shadow: 0 0 0 1px #dde1e5;
  overflow: hidden; background: #fff;
}
.pantalla-marco.movil { width: 390px; height: 844px; }

.pie { position: absolute; left: 12mm; right: 12mm; bottom: 6mm; display: flex; font-size: 9px; color: #9aa2ae; }
.pie span { flex: 1; }
.pie b { color: #4a5570; }

/* ── Páginas de texto ─────────────────────────────────────────────── */
.portada { justify-content: center; align-items: flex-start; padding: 26mm 30mm; }
.portada h1 { font-size: 46px; font-weight: 400; color: #23366f; letter-spacing: -.02em; line-height: 1.1; margin: 0 0 14px; }
.portada p { font-size: 16px; color: #4a5570; line-height: 1.6; max-width: 74ch; margin: 0 0 10px; }
.portada .fecha { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: #68717f; font-weight: 700; margin-bottom: 24px; }

.guia h2 { font-size: 30px; font-weight: 400; color: #23366f; margin: 0 0 6mm; }
.guia table { width: 100%; border-collapse: collapse; font-size: 12px; }
.guia th { text-align: left; padding: 8px 10px; background: #eceeef; color: #68717f;
  font-size: 10px; letter-spacing: .07em; text-transform: uppercase; }
.guia td { padding: 9px 10px; border-top: 1px solid #dde1e5; color: #23366f; vertical-align: top; }
.guia td:first-child { font-weight: 700; white-space: nowrap; }
.guia .n { color: #4a5570; }

.logos-fila { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14mm; align-items: start; padding-top: 8mm; }
.logo-caja { text-align: center; }
.logo-caja h3 { font-size: 17px; font-weight: 600; color: #23366f; margin: 14px 0 6px; }
.logo-caja p { font-size: 12px; color: #4a5570; line-height: 1.55; margin: 0; }
</style></head>
<body><div id="doc"></div>
<script>${js}</script>
<script>
var DECIDIR = ${JSON.stringify(DECIDIR)};
var PROPS = {
  a: { n: 'A · Taller', d: 'Barra lateral de destinos y barra superior de acciones. Densidad media, pensada para trabajar rápido.' },
  b: { n: 'B · Lienzo', d: 'Riel de íconos y paneles flotantes. El inicio abre por búsqueda y el lienzo ocupa toda la pantalla.' },
  c: { n: 'C · Escritorio', d: 'Barra superior ancha con secciones. Las propiedades van en una barra horizontal, no en un panel.' }
};

var doc = document.getElementById('doc');
var num = 0;
function pag(clase) {
  var d = document.createElement('div');
  d.className = 'pagina ' + (clase || '');
  doc.appendChild(d);
  return d;
}
function pie(p, texto) {
  var f = document.createElement('div');
  f.className = 'pie';
  f.innerHTML = '<span><b>Fast Creative Builder</b> · Propuestas de interfaz</span>' +
    '<span style="text-align:center">' + (texto || '') + '</span>' +
    '<span style="text-align:right">' + (++num) + '</span>';
  p.appendChild(f);
}
function pantalla(prop, s, movil) {
  var p = pag();
  var decide = DECIDIR.indexOf(s.id) !== -1;
  p.innerHTML =
    '<div class="ph">' +
      '<span class="ph__n">' + PROPS[prop].n + '</span>' +
      '<span class="ph__t">' + s.n + (movil ? ' <span>· móvil</span>' : '') + '</span>' +
      '<span class="ph__r">' + s.ruta + '</span>' +
      '<span class="ph__x"></span>' +
      '<span class="marca-pag marca-pag--' + (decide && !movil ? 'elegir' : 'vb') + '">' +
        (decide && !movil ? 'Elegir' : 'Visto bueno') + '</span>' +
    '</div>' +
    '<div class="encaje"><div class="pantalla-marco' + (movil ? ' movil' : '') + '">' +
      '<div class="p' + (movil ? ' movil' : '') + '" data-propuesta="' + prop + '">' + s.f(prop) + '</div>' +
    '</div></div>';
  /* El lienzo de los editores mide su contenedor: sin esto, las páginas de
     editor salían con la escala cableada y la pieza no cabía. */
  if (typeof ajustarLienzos === 'function') ajustarLienzos(p);
  var marco = p.querySelector('.pantalla-marco');
  var esc = movil ? 690 / 844 : Math.min(1000 / 1440, 660 / 900);
  marco.style.transform = 'scale(' + esc + ')';
  marco.style.marginBottom = -(( movil ? 844 : 900) * (1 - esc)) + 'px';
  pie(p, movil ? '390 × 844' : '1440 × 900');
}
function busca(id) { for (var i = 0; i < PANTALLAS.length; i++) if (PANTALLAS[i].id === id) return PANTALLAS[i]; }

/* 1 · Portada */
var pt = pag('portada');
pt.innerHTML =
  '<div class="fecha">6 de septiembre de 2026 · Versión 3</div>' +
  '<h1>Fast Creative Builder<br>Tres propuestas de interfaz</h1>' +
  '<p>Constructor visual para key visuals, gráficas digitales, landing pages y email marketing. ' +
  'Dirección visual de Gamonal; color y tipografía de Zurich, mapeados a los roles de Gamonal.</p>' +
  '<p>Las tres propuestas cambian navegación, apertura, densidad y lógica del editor. No son la misma ' +
  'pantalla con otro color.</p>' +
  '<p style="margin-top:18px;font-size:13px;color:#68717f">Las fotografías son vistas previas de Envato Elements y llevan marca de agua. ' +
  'Los archivos licenciados se sustituyen al cierre.</p>';
pie(pt);

/* 2 · Guía de revisión */
var g = pag('guia');
g.innerHTML =
  '<h2>Qué tienes que elegir y qué sólo aprobar</h2>' +
  '<p style="font-size:14px;color:#4a5570;line-height:1.6;margin:0 0 6mm;max-width:80ch">' +
  'Hay <b>una sola decisión de fondo</b>: qué propuesta tomamos. Esa elección arrastra la navegación de ' +
  'todo el aplicativo. Lo demás son confirmaciones: si algo no te convence, lo dices y lo cambio.</p>' +
  '<table><thead><tr><th>Marca</th><th>Qué significa</th><th>Cuántas páginas</th></tr></thead><tbody>' +
  '<tr><td><span class="marca-pag marca-pag--elegir">Elegir</span></td>' +
  '<td class="n">Las tres propuestas difieren de verdad. Compara y dime cuál. Puedes mezclar: quedarte con el inicio de una y el editor de otra.</td>' +
  '<td class="n">12 páginas · 4 pantallas × 3 propuestas</td></tr>' +
  '<tr><td><span class="marca-pag marca-pag--vb">Visto bueno</span></td>' +
  '<td class="n">El contenido es el mismo en las tres; sólo cambia el marco, que ya queda definido por la propuesta que elijas. Se muestran en el marco de A.</td>' +
  '<td class="n">El resto</td></tr>' +
  '</tbody></table>' +
  '<h2 style="margin-top:9mm;font-size:22px">Lo que decides</h2>' +
  '<table><thead><tr><th>Decisión</th><th>Opciones</th></tr></thead><tbody>' +
  '<tr><td>Propuesta</td><td class="n"><b>A · Taller</b> lateral fijo de destinos, ruta de selección siempre visible · ' +
  '<b>B · Lienzo</b> riel de íconos y paneles flotantes, máxima superficie · ' +
  '<b>C · Escritorio</b> barra superior ancha, propiedades en horizontal</td></tr>' +
  '<tr><td>Logotipo</td><td class="n">Cada propuesta trae el suyo. Puede ir separado: el logo de una con la interfaz de otra.</td></tr>' +
  '<tr><td>Editor</td><td class="n">También puede ir separado de la propuesta, si prefieres una navegación con otro editor.</td></tr>' +
  '</tbody></table>' +
  '<h2 style="margin-top:9mm;font-size:22px">Lo que ya está resuelto y sólo confirmas</h2>' +
  '<table><tbody>' +
  '<tr><td>Color</td><td class="n">Bandas pastel a todo el ancho, azul para botones y datos. Tabla calculada de qué botón admite cada banda: verificada en las 57 pantallas, cero violaciones.</td></tr>' +
  '<tr><td>Edición</td><td class="n">Se escribe sobre el lienzo. Barra flotante pegada a la selección; el mapa de caja queda detrás de «Avanzado».</td></tr>' +
  '<tr><td>Reglas</td><td class="n">Miden la pieza y no la pantalla, con la selección marcada sobre la regla y cotas en píxeles reales.</td></tr>' +
  '<tr><td>Móvil</td><td class="n">Una columna, tablas convertidas en fichas, barra inferior. Cero desbordes, medidos.</td></tr>' +
  '</tbody></table>';
pie(g);

/* 3 · Logotipos */
var lg = pag();
lg.innerHTML =
  '<div class="ph"><span class="ph__t">Logotipo del aplicativo</span>' +
  '<span class="ph__x"></span><span class="marca-pag marca-pag--elegir">Elegir</span></div>' +
  '<p style="font-size:13px;color:#4a5570;max-width:90ch;margin:0">Uno por propuesta, del mismo concepto: la marca se construye ' +
  'con bloques sólidos dentro de una caja redondeada. No sustituyen al logotipo de Zurich, que es intocable; ' +
  'conviven con él según las reglas de co-branding.</p>' +
  '<div class="logos-fila">' +
    '<div class="logo-caja">' + LOGOS.a(150, '#2167ae', '#ffffff') +
      '<h3>A · Taller</h3><p>Tres barras sólidas. La del medio se acorta: es el gesto de una pieza en construcción.</p></div>' +
    '<div class="logo-caja">' + LOGOS.b(150, '#2167ae', '#ffffff') +
      '<h3>B · Lienzo</h3><p>Dos círculos superpuestos. Recoge el lenguaje de burbujas de Zurich.</p></div>' +
    '<div class="logo-caja">' + LOGOS.c(150, '#2167ae', '#ffffff') +
      '<h3>C · Escritorio</h3><p>Un bloque partido en dos. La composición como retícula.</p></div>' +
  '</div>';
pie(lg);

/* 4 · Decisiones: cada pantalla en las tres propuestas */
DECIDIR.forEach(function (id) {
  var s = busca(id);
  ['a', 'b', 'c'].forEach(function (p) { pantalla(p, s); });
});

/* 5 · Visto bueno: el resto, en el marco de A */
PANTALLAS.forEach(function (s) {
  if (DECIDIR.indexOf(s.id) === -1) pantalla('a', s);
});

/* 6 · Móvil */
['home', 'proyectos', 'login', 'editor-web'].forEach(function (id) {
  pantalla('a', busca(id), true);
});

document.title = 'Fast Creative Builder · Propuestas de interfaz';
</script></body></html>`;

const salida = path.join(dir, 'FastCreativeBuilder-Pantallas.html');
fs.writeFileSync(salida, html);
console.log('Documento listo:', (fs.statSync(salida).size / 1024 / 1024).toFixed(2), 'MB');
