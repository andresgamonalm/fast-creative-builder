/* Empaqueta las propuestas en un solo archivo que se abre con doble clic.
   CSS, JavaScript e imágenes quedan dentro: cero referencias externas, así
   no depende del navegador ni de permisos de archivos locales.
   Uso:  node mockups/construir.mjs                                        */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const salida = path.join(dir, 'FastCreativeBuilder-Propuestas.html');

let html = fs.readFileSync(path.join(dir, 'mockups_fast_creative_builder.html'), 'utf8');

html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, f) =>
  '<style>\n/* ' + f + ' */\n' + fs.readFileSync(path.join(dir, f), 'utf8') + '\n</style>');

html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, f) =>
  '<script>\n/* ' + f + ' */\n' + fs.readFileSync(path.join(dir, f), 'utf8') + '\n<\/script>');

for (const n of fs.readdirSync(path.join(dir, 'imagenes'))) {
  const b = fs.readFileSync(path.join(dir, 'imagenes', n));
  html = html.split("'imagenes/" + n + "'").join("'data:image/jpeg;base64," + b.toString('base64') + "'");
}

fs.writeFileSync(salida, html);

/* Hay una copia en docs/ que el usuario abre con doble clic. Se reescribe
   aquí para que no pueda quedarse atrás respecto de esta. */
const copia = path.join(dir, '..', 'docs', 'FastCreativeBuilderPropuestas.html');
if (fs.existsSync(path.dirname(copia))) fs.writeFileSync(copia, html);

console.log('Listo:', (fs.statSync(salida).size / 1024 / 1024).toFixed(2), 'MB');
