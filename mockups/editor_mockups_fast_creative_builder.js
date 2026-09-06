/* ═══════════════════════════════════════════════════════════════════════
   Editor — edición directa, reglas en píxeles reales y arrastre depurado
   ───────────────────────────────────────────────────────────────────────
   Correcciones pedidas:
     1. «Pongo el cursor en el texto y edito directo.» Se escribe sobre el
        lienzo. Lo frecuente vive en una barra pegada a la selección; el
        mapa de caja queda detrás de «Avanzado».
     2. «Líneas o reglas que me permitan ver los píxeles reales, preciso.»
        Regla horizontal y vertical que miden la PIEZA, no la pantalla.
        Si el lienzo se reduce para caber, la regla se reduce con él y el
        número sigue siendo el píxel real. Paso adaptativo para que nunca
        se apelmacen las marcas.
     3. Arrastre con umbral, línea de inserción, imantado con cota en
        píxeles y elección explícita entre insertar dentro o superponer.
   ═══════════════════════════════════════════════════════════════════════ */

/* Medidas reales de cada modo */
var PIEZA = {
  web:   { ancho: 1200, alto: 1480, n: 'Web · 1200 px' },
  email: { ancho: 600,  alto: 1400, n: 'Email · 600 px' },
  libre: { ancho: 1080, alto: 1080, n: 'Libre · 1080 × 1080' }
};

/* Ancho útil del lienzo en cada propuesta, ya descontados paneles y regla */
var UTIL = { a: 812, b: 1296, c: 1120 };

/* ── Lienzo envuelto en reglas ───────────────────────────────────────── */

function lienzoConReglas(modo, prop, contenido, sel, extras) {
  var pz = PIEZA[modo];
  var disponible = UTIL[prop];
  var escala = Math.min(1, disponible / pz.ancho);
  var w = pz.ancho * escala;
  var h = pz.alto * escala;

  /* Esto es sólo el primer dibujado. UTIL es una estimación de escritorio y
     en tableta se queda corta: la pieza no cabe y el chip miente. Después de
     pintar, ajustarLienzos mide el contenedor de verdad y recalcula. */
  return (
    '<div class="ed__lienzo" data-modo="' + modo + '"' +
      (sel ? ' data-sel="' + esc(JSON.stringify(sel)) + '"' : '') + '>' +
      '<div class="zona-regla">' +
        '<div class="regla-esq">px</div>' +
        '<div class="regla-h" style="width:' + pxRegla(w) + '">' + reglaHorizontal(pz.ancho, escala, sel) + '</div>' +
        '<div class="regla-v" style="height:' + pxRegla(h) + '">' + reglaVertical(pz.alto, escala, sel) + '</div>' +
        '<div class="lienzo-area" style="width:' + pxRegla(w) + '">' +
          '<div class="hoja-escala" style="width:' + pxRegla(w) + ';height:' + pxRegla(h) + '">' +
            '<div class="hoja" style="width:' + pz.ancho + 'px;transform:scale(' + escala + ')">' +
              contenido +
            '</div>' +
          '</div>' +
          (extras || '') +
        '</div>' +
      '</div>' +
      '<div class="zoom-chip">' + pz.n + ' · ' + Math.round(escala * 100) + '%</div>' +
    '</div>'
  );
}

/* ── Ajuste real, medido después de pintar ────────────────────────────────
   La escala no puede salir de una constante: depende del ancho que quede de
   verdad, y ese cambia con la propuesta, con el dispositivo y con el tamaño
   del marco. Se mide el contenedor, se recalcula la escala y se redibujan
   las dos reglas. Así el número de la regla es el píxel real de la pieza en
   escritorio, en tableta y en móvil.                                      */
function ajustarLienzos(raiz) {
  var lienzos = raiz.querySelectorAll('.ed__lienzo[data-modo]');
  for (var i = 0; i < lienzos.length; i++) {
    var l = lienzos[i];
    var pz = PIEZA[l.getAttribute('data-modo')];
    if (!pz) continue;

    var zona = l.querySelector('.zona-regla');
    var hoja = l.querySelector('.hoja');
    var caja = l.querySelector('.hoja-escala');
    var area = l.querySelector('.lienzo-area');
    var rh = l.querySelector('.regla-h');
    var rv = l.querySelector('.regla-v');
    if (!hoja || !caja || !zona) continue;

    /* Ancho libre = interior del lienzo, menos la columna de la regla
       vertical y menos el aire que reserva la zona a la derecha. */
    var ez = getComputedStyle(zona);
    var columnaRegla = (rv && ez.display === 'grid' && getComputedStyle(rv).display !== 'none')
      ? parseFloat(ez.gridTemplateColumns) || 24 : 0;
    var aire = (parseFloat(ez.paddingLeft) || 0) + (parseFloat(ez.paddingRight) || 0);
    var libre = l.clientWidth - columnaRegla - aire;
    if (!(libre > 0)) continue;

    var escala = Math.min(1, libre / pz.ancho);
    var w = pz.ancho * escala, h = pz.alto * escala;

    var sel = null;
    var crudo = l.getAttribute('data-sel');
    if (crudo) { try { sel = JSON.parse(crudo); } catch (e) { sel = null; } }

    hoja.style.transform = 'scale(' + escala + ')';
    caja.style.width = pxRegla(w); caja.style.height = pxRegla(h);
    if (area) area.style.width = pxRegla(w);
    if (rh) { rh.style.width = pxRegla(w); rh.innerHTML = reglaHorizontal(pz.ancho, escala, sel); }
    if (rv) { rv.style.height = pxRegla(h); rv.innerHTML = reglaVertical(pz.alto, escala, sel); }

    /* Las capas que anotan la pieza siguen a la misma escala */
    var capas = l.querySelectorAll('[data-px]');
    for (var j = 0; j < capas.length; j++) {
      var cp = capas[j];
      var px = parseFloat(cp.getAttribute('data-px'));
      var py = cp.getAttribute('data-py');
      var ph = cp.getAttribute('data-ph');
      var dx = parseFloat(cp.getAttribute('data-dx') || '0');
      var dy = parseFloat(cp.getAttribute('data-dy') || '0');
      if (!isNaN(px)) cp.style.left = pxRegla(px * escala + dx);
      if (py !== null) cp.style.top = pxRegla(parseFloat(py) * escala + dy);
      if (ph !== null) cp.style.height = pxRegla(parseFloat(ph) * escala);
    }

    var chip = l.querySelector('.zoom-chip');
    if (chip) chip.textContent = pz.n + ' · ' + Math.round(escala * 100) + '%';
  }
}

/* ── Contenido de la pieza ───────────────────────────────────────────── */

function hoja(e) {
  e = e || {};
  return (
    '<section class="hoja__portada' + (e.sel === 'portada' ? ' sel' : '') + '">' +
      (e.sel === 'portada' ? '<span class="sel__et">Portada · Contenido sobre imagen</span>' : '') +
      '<div class="hoja__portada-txt">' +
        '<span class="etiqueta" style="color:var(--acento)">Seguro de hogar</span>' +
        '<h2 class="' + (e.editando === 'titular' ? 'editando' : '') + '" style="color:var(--sobre-estructura);font-size:38px">' +
          'Tu casa protegida desde el primer día' +
          (e.editando === 'titular' ? '<span class="cursor"></span>' : '') +
        '</h2>' +
        '<p style="color:var(--sobre-estructura-suave);font-size:17px">Cobertura inmediata, sin trámites y con asistencia 24 horas en todo Chile.</p>' +
        '<div class="fila g3" style="margin-top:10px">' +
          '<span class="cta cta--conversion">Cotizar en un minuto</span>' +
          '<span class="cta" style="background:var(--sobre-estructura);color:var(--estructura)">Ver coberturas</span>' +
        '</div>' +
      '</div>' +
      '<img src="' + FOTO.pieza1 + '" alt="">' +
    '</section>' +

    '<section class="hoja__cifras' + (e.sel === 'cifras' ? ' sel' : '') + '">' +
      (e.sel === 'cifras' ? '<span class="sel__et">Métricas · 3 cifras</span>' : '') +
      '<div><b>24 h</b><span>Asistencia todos los días</span></div>' +
      '<div><b>0</b><span>Trámites en papel</span></div>' +
      '<div><b>1 min</b><span>Para cotizar</span></div>' +
    '</section>' +

    (e.insercion ? '<div class="linea-insercion"><span>Insertar aquí · y 664</span></div>' : '') +

    '<section class="hoja__texto' + (e.sel === 'texto' ? ' sel' : '') + '">' +
      (e.sel === 'texto' ? '<span class="sel__et">Texto enriquecido</span>' : '') +
      '<p class="' + (e.editando === 'texto' ? 'editando' : '') + '">' +
        'La póliza cubre incendio, robo, daños por agua y responsabilidad civil. ' +
        'Puedes ampliarla con contenido, bicicletas o equipos de trabajo cuando lo necesites.' +
        (e.editando === 'texto' ? '<span class="cursor"></span>' : '') +
      '</p>' +
    '</section>'
  );
}

/* Pieza de estilo libre: mesa de trabajo cuadrada */
function hojaLibre(e) {
  e = e || {};
  return (
    '<div class="mesa">' +
      '<img class="mesa__fondo" src="' + FOTO.pieza2 + '" alt="">' +
      '<div class="mesa__bloque' + (e.sel === 'bloque' ? ' sel' : '') + '">' +
        (e.sel === 'bloque' ? '<span class="sel__et">Bloque de texto · capa 3</span>' : '') +
        '<span class="etiqueta" style="color:var(--estructura)">Cobertura viaje</span>' +
        '<h2 style="color:var(--estructura);font-size:44px;line-height:1.05">Viaja sin pensar en lo que puede pasar</h2>' +
        '<span class="cta cta--conversion" style="align-self:flex-start;margin-top:12px">Cotiza en un minuto</span>' +
      '</div>' +
      '<span class="mesa__burbuja mesa__burbuja--1"></span>' +
      '<span class="mesa__burbuja mesa__burbuja--2"></span>' +
    '</div>'
  );
}

/* Pieza de email: 600 px, estructura de tabla */
function hojaEmail(e) {
  e = e || {};
  return (
    '<div class="email">' +
      '<div class="email__cab"><span class="micro tenue">Ver en el navegador</span></div>' +
      '<div class="email__logo">' + LOGOS.a(36, 'var(--accion)', 'var(--superficie)') + '</div>' +
      '<img class="email__foto" src="' + FOTO.pieza1 + '" alt="">' +
      '<div class="email__cuerpo' + (e.sel === 'texto' ? ' sel' : '') + '">' +
        (e.sel === 'texto' ? '<span class="sel__et">Texto enriquecido</span>' : '') +
        '<h3 class="' + (e.editando === 'texto' ? 'editando' : '') + '" style="color:var(--estructura)">' +
          'Tu renovación está lista' + (e.editando === 'texto' ? '<span class="cursor"></span>' : '') + '</h3>' +
        '<p class="menor suave" style="margin-top:10px">Revisa las condiciones de tu póliza y renueva en línea antes del 30 de septiembre.</p>' +
        '<span class="cta cta--conversion" style="margin-top:18px">Renovar ahora</span>' +
      '</div>' +
      '<div class="email__pie"><span class="micro tenue">Zurich Chile · Av. Pedro de Valdivia 100, Providencia<br>Darse de baja · Preferencias</span></div>' +
    '</div>'
  );
}

/* ── Barra flotante de edición ───────────────────────────────────────── */

/* Las capas que anotan el lienzo guardan su posición en píxeles de la
   PIEZA, no de la pantalla. Así ajustarLienzos las recoloca junto con la
   hoja y las reglas; antes se quedaban en la escala vieja y se separaban
   del elemento que anotan. data-dx y data-dy son separaciones de interfaz
   que no deben escalar. */
function barraFlotante(px, py) {
  return (
    '<div class="flotante" data-px="' + px + '" data-py="' + py + '" data-dy="-50">' +
      '<span class="flotante__t">Título</span><span class="flotante__sep"></span>' +
      '<button class="flotante__b">A−</button><span class="flotante__v">38</span><button class="flotante__b">A+</button>' +
      '<span class="flotante__sep"></span>' +
      '<button class="flotante__b flotante__b--on"><b>N</b></button>' +
      '<button class="flotante__b"><i>C</i></button>' +
      '<span class="flotante__sep"></span>' +
      '<button class="flotante__b">' + ico('alinIzq', 'ico--16') + '</button>' +
      '<button class="flotante__b">' + ico('alinCen', 'ico--16') + '</button>' +
      '<span class="flotante__sep"></span>' +
      '<button class="flotante__b"><span class="flotante__color"></span></button>' +
      '<button class="flotante__b">' + ico('enlace', 'ico--16') + '</button>' +
      '<span class="flotante__sep"></span>' +
      '<button class="flotante__b">' + ico('mas', 'ico--16') + '</button>' +
    '</div>'
  );
}

/* Lectura de posición y tamaño, siempre en píxeles de la pieza */
function lectura(px, py, x, y, ancho, alto) {
  return (
    '<div class="lectura" data-px="' + px + '" data-py="' + py + '" data-dy="8">' +
      '<b><span>x</span> ' + x + '</b><b><span>y</span> ' + y + '</b>' +
      '<b>' + ancho + ' <span>×</span> ' + alto + '</b>' +
    '</div>'
  );
}

/* Cota de distancia entre dos elementos */
function cotaVertical(px, py, altoPieza, valor) {
  return (
    '<div class="cota cota--v" data-px="' + px + '" data-py="' + py + '" data-ph="' + altoPieza + '">' +
      '<span class="cota__linea"></span><span class="cota__n">' + valor + '</span><span class="cota__linea"></span>' +
    '</div>'
  );
}

function guiaVertical(px, valor) {
  return '<div class="guia guia--v" data-px="' + px + '"><span class="guia__n">x ' + valor + '</span></div>';
}

/* ── Paneles ─────────────────────────────────────────────────────────── */

function panelComponentes(arrastrando) {
  return CATALOGO.map(function (g) {
    return (
      '<div style="margin-bottom:var(--e5)">' +
        '<div class="etiqueta tenue" style="padding:0 var(--e2) var(--e2)">' + g.g + '</div>' +
        g.c.map(function (c, i) {
          var act = arrastrando && g.g === 'Contenido' && i === 1 ? ' comp--arrastrando' : '';
          return (
            '<div class="comp' + act + '"><span class="comp__ico">' + ico(c.i, 'ico--16') + '</span>' +
            '<div class="crece"><div class="comp__n">' + c.n + '</div><div class="comp__d">' + c.d + '</div></div>' +
            ico('agarre', 'ico--16') + '</div>'
          );
        }).join('') +
      '</div>'
    );
  }).join('');
}

function panelSeccion(avanzado) {
  if (avanzado) {
    return (
      '<div class="lat__tabs"><span class="lat__tab">Contenido</span><span class="lat__tab lat__tab--on">Avanzado</span></div>' +
      '<div class="lat__c">' +
        '<div class="etiqueta tenue" style="margin-bottom:var(--e3)">Espaciado exacto</div>' +
        '<div class="caja-mapa"><span class="caja-mapa__et">margen</span>' +
          '<input class="caja-mapa__v" value="0">' +
          '<div class="caja-mapa__p"><span class="caja-mapa__et">relleno</span>' +
          '<div class="caja-mapa__c">Contenido</div></div></div>' +
        '<p class="campo__ayuda" style="margin:var(--e3) 0 var(--e5)">Todo nace en cero. Si ves separación, está escrita aquí.</p>' +
        '<div class="col g4">' +
          '<label class="campo"><span class="campo__et">Ancho máximo</span><input class="campo__in" value="auto"></label>' +
          '<label class="campo"><span class="campo__et">Ancla</span><input class="campo__in" placeholder="portada"></label>' +
        '</div>' +
      '</div>'
    );
  }
  return (
    '<div class="lat__tabs"><span class="lat__tab lat__tab--on">Contenido</span><span class="lat__tab">Avanzado</span></div>' +
    '<div class="lat__c">' +
      '<div class="etiqueta tenue" style="margin-bottom:var(--e3)">Esta sección</div>' +
      '<div class="col g5">' +
        '<div><span class="campo__et" style="display:block;margin-bottom:var(--e2)">Fondo</span>' +
          '<div class="fila g2" style="flex-wrap:wrap">' +
            ['var(--estructura)','var(--banda-b)','var(--banda-b)','var(--banda-c)','var(--banda-a)','var(--banda-d)','var(--superficie)']
              .map(function (c, i) { return '<span class="muestra' + (i === 0 ? ' muestra--on' : '') + '" style="background:' + c + '"></span>'; }).join('') +
          '</div></div>' +
        '<div><span class="campo__et" style="display:block;margin-bottom:var(--e2)">Imagen</span>' +
          '<div class="campo-img"><img src="' + FOTO.pieza1 + '" alt="">' +
          '<div class="crece"><div class="menor">pieza_hogar.jpg</div><div class="micro tenue">1600 × 900</div></div></div></div>' +
        '<div><span class="campo__et" style="display:block;margin-bottom:var(--e2)">Disposición</span>' +
          '<div class="opciones"><span class="opcion opcion--on">Texto izquierda</span><span class="opcion">Texto derecha</span>' +
          '<span class="opcion">Centrado</span><span class="opcion">Sobre la imagen</span></div></div>' +
        '<div><span class="campo__et" style="display:block;margin-bottom:var(--e2)">Alto</span>' +
          '<div class="opciones"><span class="opcion">Ajustar</span><span class="opcion opcion--on">Cómodo</span>' +
          '<span class="opcion">Amplio</span></div></div>' +
      '</div>' +
    '</div>'
  );
}

function panelCapas() {
  var items = [
    { n: 'Portada', d: 0, on: true }, { n: 'Título', d: 1 }, { n: 'Texto', d: 1 },
    { n: 'Botones', d: 1 }, { n: 'Métricas', d: 0 }, { n: 'Texto enriquecido', d: 0 }
  ];
  return items.map(function (i) {
    return '<div class="capa' + (i.on ? ' capa--on' : '') + '" style="padding-left:' + (10 + i.d * 16) + 'px">' +
      ico(i.d ? 'texto' : 'seccion', 'ico--16') + '<span class="crece">' + i.n + '</span>' + ico('ojo', 'ico--16') + '</div>';
  }).join('');
}

function barraEditor(modo, oscuro) {
  var sec = oscuro ? 'style="background:rgba(255,255,255,.16);color:var(--sobre-estructura)"' : '';
  return (
    '<button class="cta cta--bajo cta--terciario" ' + (oscuro ? 'style="color:var(--sobre-estructura)"' : '') + '>' + ico('atras', 'ico--16') + 'Proyectos</button>' +
    '<div style="font-weight:600;font-size:14px">' + (modo === 'email' ? 'Renovación auto — correo' : modo === 'libre' ? 'Cobertura viaje — pieza' : 'Seguro de hogar — landing') + '</div>' +
    '<span class="pastilla pastilla--neutra"><span class="punto"></span>Guardado</span>' +
    '<div class="crece"></div>' +
    '<div class="grupo-disp">' +
      '<span class="grupo-disp__b grupo-disp__b--on">' + ico('escritorio', 'ico--16') + '</span>' +
      '<span class="grupo-disp__b">' + ico('tableta', 'ico--16') + '</span>' +
      '<span class="grupo-disp__b">' + ico('movil', 'ico--16') + '</span>' +
    '</div>' +
    '<button class="cta cta--bajo" ' + sec + '>' + ico('deshacer', 'ico--16') + '</button>' +
    '<button class="cta cta--bajo" ' + sec + '>' + ico('rehacer', 'ico--16') + '</button>' +
    '<button class="cta cta--bajo cta--secundario">' + ico('ojo', 'ico--16') + 'Previsualizar</button>' +
    '<button class="cta cta--bajo cta--principal">' + ico('exportar', 'ico--16') + 'Exportar</button>'
  );
}

function contenidoModo(modo, estado) {
  if (modo === 'libre') return hojaLibre(estado);
  if (modo === 'email') return hojaEmail(estado);
  return hoja(estado);
}

/* ═══ A · Taller ════════════════════════════════════════════════════════ */

function editorA(modo) {
  /* La barra va ENCIMA de la selección, no sobre el texto. La lectura de
     medidas va debajo, para que nunca se tapen entre ellas. */
  var sel = { x: 80, y: 150, ancho: 560, alto: 132 };
  var extras =
    barraFlotante(sel.x, sel.y) +
    lectura(sel.x, sel.y + sel.alto, sel.x, sel.y, sel.ancho, sel.alto) +
    cotaVertical(24, 490, 40, '40');

  return (
    '<div class="ed-marco">' +
      '<header class="ed-barra">' + barraEditor(modo) + '</header>' +
      '<div class="ed ed--a">' +
        '<aside class="ed__panel"><div class="ed__panel-t">Componentes</div>' +
          '<div class="ed__panel-c">' + panelComponentes(false) + '</div></aside>' +
        lienzoConReglas(modo, 'a', contenidoModo(modo, { sel: 'portada', editando: 'titular' }), sel, extras) +
        '<aside class="ed__panel">' + panelSeccion(false) + '</aside>' +
      '</div>' +
    '</div>'
  );
}

/* ═══ B · Lienzo ════════════════════════════════════════════════════════ */

function editorB(modo) {
  var selB = { x: 40, y: 760, ancho: 1120, alto: 96 };
  var extras =
    guiaVertical(40, 40) +
    guiaVertical(1160, 1160) +
    barraFlotante(selB.x, selB.y) +
    lectura(selB.x, selB.y + selB.alto, selB.x, selB.y, selB.ancho, selB.alto);

  return (
    '<div class="ed-marco">' +
      '<header class="ed-barra">' + barraEditor(modo) + '</header>' +
      '<div class="ed ed--b">' +
        '<aside class="ed-riel">' +
          '<span class="ed-riel__b ed-riel__b--on">' + ico('mas', 'ico--24') + '</span>' +
          '<span class="ed-riel__b">' + ico('capas', 'ico--24') + '</span>' +
          '<span class="ed-riel__b">' + ico('biblioteca', 'ico--24') + '</span>' +
          '<span class="ed-riel__b">' + ico('regla', 'ico--24') + '</span>' +
        '</aside>' +
        lienzoConReglas(modo, 'b', contenidoModo(modo, { sel: 'texto', editando: 'texto', insercion: true }), selB, extras) +
        '<aside class="ed-flotante ed-flotante--izq">' +
          '<div class="ed__panel-t">Componentes<div class="crece"></div>' + ico('cerrar', 'ico--16') + '</div>' +
          '<div class="ed__panel-c">' + panelComponentes(true) + '</div>' +
        '</aside>' +
        '<div class="eleccion-soltar"><b>Suéltalo aquí</b>' +
          '<div class="fila g2"><span class="cta cta--bajo cta--principal">Insertar dentro</span>' +
          '<span class="cta cta--bajo cta--secundario">Superponer encima</span></div></div>' +
      '</div>' +
    '</div>'
  );
}

/* ═══ C · Escritorio ════════════════════════════════════════════════════ */

function editorC(modo) {
  var selC = { x: 40, y: 420, ancho: 1120, alto: 200 };
  var extras = lectura(selC.x, selC.y + selC.alto, selC.x, selC.y, selC.ancho, selC.alto);

  return (
    '<div class="ed-marco">' +
      '<header class="ed-barra ed-barra--navy">' + barraEditor(modo, true) + '</header>' +
      '<div class="ed-props">' +
        '<span class="ed-props__q">' + ico('datos', 'ico--16') + 'Métricas</span>' +
        '<span class="ed-props__sep"></span>' +
        '<span class="ed-props__g"><span class="menor tenue">Columnas</span>' +
          '<span class="opciones"><span class="opcion">2</span><span class="opcion opcion--on">3</span><span class="opcion">4</span></span></span>' +
        '<span class="ed-props__g"><span class="menor tenue">Separación</span><button class="flotante__b">−</button>' +
          '<span class="flotante__v">16</span><button class="flotante__b">+</button></span>' +
        '<span class="ed-props__g"><span class="menor tenue">Relleno</span><button class="flotante__b">−</button>' +
          '<span class="flotante__v">40</span><button class="flotante__b">+</button></span>' +
        '<span class="ed-props__g"><button class="flotante__b"><span class="flotante__color"></span></button></span>' +
        '<div class="crece"></div>' +
        '<span class="ed-props__ruta">Página › Métricas</span>' +
      '</div>' +
      '<div class="ed ed--c">' +
        '<aside class="ed__panel">' +
          '<div class="lat__tabs"><span class="lat__tab lat__tab--on">Capas</span><span class="lat__tab">Componentes</span></div>' +
          '<div class="ed__panel-c" style="padding:var(--e2)">' + panelCapas() + '</div>' +
        '</aside>' +
        lienzoConReglas(modo, 'c', contenidoModo(modo, { sel: 'cifras', editando: 'titular' }), selC, extras) +
      '</div>' +
    '</div>'
  );
}

var EDITOR = { a: editorA, b: editorB, c: editorC };
