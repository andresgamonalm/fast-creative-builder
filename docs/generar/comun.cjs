/* Piezas compartidas por los documentos Word de Fast Creative Builder.
   Tipografía Arial: es lo que autoriza el brandbook Zurich cuando el
   archivo sale de la organización o se abre sin Zurich Sans instalada. */

const fs = require('fs');
const path = require('path');
const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, BorderStyle, HeadingLevel, Header, Footer, PageNumber,
  ImageRun, PageBreak, LevelFormat, convertInchesToTwip
} = require('docx');

const NAVY = '23366F';
const HEROE = '2167AE';
const CORAL = 'CC4038';
const TINTA = '23366F';
const SUAVE = '4A5570';
const TENUE = '68717F';
const HUESO = 'ECEEEF';
const PALOMA = 'DDE4E3';
const ARENISCA = 'DAD2BD';
const MENTA = 'A6E9AB';
const ROSA = 'FFC5EA';
const AMBAR = 'E4B273';

const ANCHO = 9026; // A4 vertical con márgenes de una pulgada
const FUENTE = 'Arial';

const raiz = path.resolve(__dirname, '..', '..');
const logo = fs.readFileSync(path.join(raiz, 'marca', 'logo_fast_creative_builder.png'));

/* ── Bloques de texto ─────────────────────────────────────────────────── */

const p = (texto, o = {}) =>
  new Paragraph({
    spacing: { before: o.antes ?? 0, after: o.despues ?? 140, line: 288 },
    alignment: o.alineacion,
    indent: o.sangria ? { left: o.sangria } : undefined,
    children: Array.isArray(texto) ? texto : [
      new TextRun({
        text: texto,
        font: FUENTE,
        size: o.tam ?? 21,
        color: o.color ?? SUAVE,
        bold: o.negrita,
        italics: o.cursiva
      })
    ]
  });

/* Mezcla de negrita y normal en un mismo párrafo: pasa un array de
   ['texto', true] para negrita, o 'texto' a secas. */
const pm = (partes, o = {}) =>
  p(partes.map((x) => {
    const [t, n] = Array.isArray(x) ? x : [x, false];
    return new TextRun({ text: t, font: FUENTE, size: o.tam ?? 21, color: o.color ?? SUAVE, bold: n });
  }), o);

const h1 = (texto) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 420, after: 200 },
    children: [new TextRun({ text: texto, font: FUENTE, size: 34, bold: false, color: NAVY })]
  });

const h2 = (texto) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 340, after: 150 },
    children: [new TextRun({ text: texto, font: FUENTE, size: 26, bold: true, color: NAVY })]
  });

const h3 = (texto) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 260, after: 110 },
    children: [new TextRun({ text: texto, font: FUENTE, size: 22, bold: true, color: HEROE })]
  });

const etiqueta = (texto) =>
  new Paragraph({
    spacing: { before: 220, after: 80 },
    children: [new TextRun({
      text: texto.toUpperCase(), font: FUENTE, size: 16, bold: true,
      color: TENUE, characterSpacing: 30
    })]
  });

const vinieta = (texto, nivel = 0) =>
  new Paragraph({
    numbering: { reference: 'puntos', level: nivel },
    spacing: { after: 90, line: 288 },
    children: Array.isArray(texto) ? texto : [
      new TextRun({ text: texto, font: FUENTE, size: 21, color: SUAVE })
    ]
  });

const vm = (partes, nivel = 0) =>
  vinieta(partes.map((x) => {
    const [t, n] = Array.isArray(x) ? x : [x, false];
    return new TextRun({ text: t, font: FUENTE, size: 21, color: SUAVE, bold: n });
  }), nivel);

const numerada = (texto) =>
  new Paragraph({
    numbering: { reference: 'pasos', level: 0 },
    spacing: { after: 110, line: 288 },
    children: Array.isArray(texto) ? texto : [
      new TextRun({ text: texto, font: FUENTE, size: 21, color: SUAVE })
    ]
  });

const salto = () => new Paragraph({ children: [new PageBreak()] });

const filete = () =>
  new Paragraph({
    spacing: { before: 160, after: 220 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PALOMA } },
    children: [new TextRun({ text: '', font: FUENTE, size: 2 })]
  });

/* Recuadro sólido para lo que hay que leer sí o sí */
const recuadro = (titulo, lineas, fondo = ARENISCA) =>
  new Table({
    width: { size: ANCHO, type: WidthType.DXA },
    columnWidths: [ANCHO],
    borders: sinBordes(),
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: ANCHO, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: fondo, color: 'auto' },
        margins: { top: 220, bottom: 220, left: 280, right: 280 },
        children: [
          ...(titulo ? [new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text: titulo, font: FUENTE, size: 22, bold: true, color: NAVY })]
          })] : []),
          ...lineas.map((l, i) => new Paragraph({
            spacing: { after: i === lineas.length - 1 ? 0 : 100, line: 288 },
            children: Array.isArray(l)
              ? l.map((x) => {
                  const [t, n] = Array.isArray(x) ? x : [x, false];
                  return new TextRun({ text: t, font: FUENTE, size: 20, color: NAVY, bold: n });
                })
              : [new TextRun({ text: l, font: FUENTE, size: 20, color: NAVY })]
          }))
        ]
      })]
    })]
  });

const sinBordes = () => {
  const n = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  return { top: n, bottom: n, left: n, right: n, insideHorizontal: n, insideVertical: n };
};

/* ── Tabla ────────────────────────────────────────────────────────────── */

function tabla(cabeceras, filas, proporciones) {
  const total = proporciones.reduce((a, b) => a + b, 0);
  const anchos = proporciones.map((x) => Math.round((x / total) * ANCHO));
  anchos[anchos.length - 1] = ANCHO - anchos.slice(0, -1).reduce((a, b) => a + b, 0);

  const linea = { style: BorderStyle.SINGLE, size: 4, color: PALOMA };
  const ninguna = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };

  const celda = (texto, i, encabezado, ultimaFila) =>
    new TableCell({
      width: { size: anchos[i], type: WidthType.DXA },
      shading: encabezado ? { type: ShadingType.CLEAR, fill: HUESO, color: 'auto' } : undefined,
      margins: { top: 110, bottom: 110, left: 150, right: 150 },
      borders: { top: ninguna, left: ninguna, right: ninguna, bottom: encabezado || ultimaFila ? ninguna : linea },
      children: [new Paragraph({
        spacing: { after: 0, line: 276 },
        children: Array.isArray(texto)
          ? texto.map((x) => {
              const [t, n] = Array.isArray(x) ? x : [x, false];
              return new TextRun({ text: t, font: FUENTE, size: 19, color: encabezado ? TENUE : SUAVE, bold: encabezado || n });
            })
          : [new TextRun({
              text: texto, font: FUENTE, size: encabezado ? 16 : 19,
              color: encabezado ? TENUE : SUAVE, bold: encabezado,
              characterSpacing: encabezado ? 20 : 0
            })]
      })]
    });

  return new Table({
    width: { size: ANCHO, type: WidthType.DXA },
    columnWidths: anchos,
    borders: { ...sinBordes(), insideHorizontal: linea },
    rows: [
      new TableRow({
        tableHeader: true,
        children: cabeceras.map((c, i) => celda(c.toUpperCase(), i, true))
      }),
      ...filas.map((f, fi) => new TableRow({
        children: f.map((c, i) => celda(c, i, false, fi === filas.length - 1))
      }))
    ]
  });
}

/* ── Cabecera, pie y numeración ───────────────────────────────────────── */

function cabecera(titulo) {
  return new Header({
    children: [new Table({
      width: { size: ANCHO, type: WidthType.DXA },
      columnWidths: [700, ANCHO - 700],
      borders: sinBordes(),
      rows: [new TableRow({
        children: [
          new TableCell({
            width: { size: 700, type: WidthType.DXA },
            borders: sinBordes(),
            margins: { top: 0, bottom: 0, left: 0, right: 140 },
            children: [new Paragraph({
              spacing: { after: 0 },
              children: [new ImageRun({ data: logo, type: 'png', transformation: { width: 26, height: 26 } })]
            })]
          }),
          new TableCell({
            width: { size: ANCHO - 700, type: WidthType.DXA },
            borders: sinBordes(),
            verticalAlign: 'center',
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            children: [new Paragraph({
              spacing: { after: 0 },
              children: [
                new TextRun({ text: 'Fast Creative Builder', font: FUENTE, size: 17, bold: true, color: NAVY }),
                new TextRun({ text: '  ·  ' + titulo, font: FUENTE, size: 17, color: TENUE })
              ]
            })]
          })
        ]
      })]
    }),
    new Paragraph({
      spacing: { before: 60, after: 0 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PALOMA } },
      children: [new TextRun({ text: '', font: FUENTE, size: 2 })]
    })]
  });
}

function pie() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ children: [PageNumber.CURRENT], font: FUENTE, size: 16, color: TENUE })]
    })]
  });
}

const numeracion = {
  config: [
    {
      reference: 'puntos',
      levels: [0, 1].map((n) => ({
        level: n,
        format: LevelFormat.BULLET,
        text: n === 0 ? '•' : '–',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360 + n * 340, hanging: 240 } } }
      }))
    },
    {
      reference: 'pasos',
      levels: [{
        level: 0,
        format: LevelFormat.DECIMAL,
        text: '%1.',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 400, hanging: 280 } } }
      }]
    }
  ]
};

function portada(titulo, subtitulo, lineas) {
  return [
    new Paragraph({
      spacing: { before: 1400, after: 320 },
      children: [new ImageRun({ data: logo, type: 'png', transformation: { width: 68, height: 68 } })]
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({
        text: '6 DE SEPTIEMBRE DE 2026', font: FUENTE, size: 17, bold: true,
        color: TENUE, characterSpacing: 40
      })]
    }),
    new Paragraph({
      spacing: { after: 140 },
      children: [new TextRun({ text: titulo, font: FUENTE, size: 52, color: NAVY })]
    }),
    new Paragraph({
      spacing: { after: 420 },
      children: [new TextRun({ text: subtitulo, font: FUENTE, size: 26, color: HEROE })]
    }),
    ...lineas.map((l) => p(l, { tam: 21 }))
  ];
}

const seccion = (titulo, hijos) => ({
  properties: {
    page: {
      margin: { top: 1560, right: 1440, bottom: 1440, left: 1440, header: 720, footer: 720 }
    }
  },
  headers: { default: cabecera(titulo) },
  footers: { default: pie() },
  children: hijos
});

module.exports = {
  NAVY, HEROE, CORAL, TINTA, SUAVE, TENUE, HUESO, PALOMA, ARENISCA, MENTA, ROSA, AMBAR,
  ANCHO, FUENTE, raiz, logo,
  p, pm, h1, h2, h3, etiqueta, vinieta, vm, numerada, salto, filete, recuadro, tabla,
  cabecera, pie, numeracion, portada, seccion, sinBordes
};
