/* ═══════════════════════════════════════════════════════════════════════
   Editor. Es la pantalla central del producto y la que más cambia entre
   propuestas: A la resuelve con tres paneles, B con paneles flotantes
   sobre el lienzo, C con una barra horizontal de propiedades.
   ═══════════════════════════════════════════════════════════════════════ */

/* Contenido de la pieza que se está editando. Una landing real, no relleno. */
function hoja(seleccion) {
  var sel = seleccion || 'titular';
  function marca(id, contenido, etiqueta) {
    if (id !== sel) return contenido;
    return '<div class="sel">' + '<span class="sel__et">' + etiqueta + '</span>' + contenido + '</div>';
  }

  return (
    '<div class="ed__hoja">' +
      marca(
        'portada',
        '<div style="display:grid;grid-template-columns:6fr 5fr;background:#23366f;color:#fff">' +
          '<div style="padding:48px 40px;display:flex;flex-direction:column;justify-content:center;gap:16px">' +
            '<span class="etiqueta" style="color:#fff773">Seguro de hogar</span>' +
            marca(
              'titular',
              '<h2 style="color:#fff;font-size:34px;line-height:1.1">Tu casa protegida desde el primer día</h2>',
              'Título · H2'
            ) +
            '<p style="color:#91bfe3;font-size:16px;line-height:1.5">Cobertura inmediata, sin trámites y con asistencia 24 horas en todo Chile.</p>' +
            '<div class="fila g3" style="margin-top:8px">' +
              '<span class="cta cta--sobre-azul">Cotizar en un minuto</span>' +
              '<span class="cta cta--sobre-azul-secundario">Ver coberturas</span>' +
            '</div>' +
          '</div>' +
          '<img src="' + FOTO.pieza1 + '" alt="" style="width:100%;height:100%;object-fit:cover;min-height:280px">' +
        '</div>',
        'Portada · Contenido sobre imagen'
      ) +
      '<div style="padding:40px;display:flex;flex-direction:column;gap:24px">' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">' +
          '<div style="background:#eceeef;padding:24px;border-radius:8px">' +
            '<div style="font-size:28px;font-weight:600;color:#2167ae">24 h</div>' +
            '<div style="font-size:14px;color:#4a5570;margin-top:4px">Asistencia todos los días</div></div>' +
          '<div style="background:#eceeef;padding:24px;border-radius:8px">' +
            '<div style="font-size:28px;font-weight:600;color:#2167ae">0</div>' +
            '<div style="font-size:14px;color:#4a5570;margin-top:4px">Trámites en papel</div></div>' +
          '<div style="background:#eceeef;padding:24px;border-radius:8px">' +
            '<div style="font-size:28px;font-weight:600;color:#2167ae">1 min</div>' +
            '<div style="font-size:14px;color:#4a5570;margin-top:4px">Para cotizar</div></div>' +
        '</div>' +
        marca(
          'texto',
          '<p style="font-size:16px;line-height:1.6;color:#4a5570;max-width:62ch">La póliza cubre incendio, robo, daños por agua y responsabilidad civil. Puedes ampliarla con contenido, bicicletas o equipos de trabajo cuando lo necesites.</p>',
          'Texto enriquecido'
        ) +
      '</div>' +
    '</div>'
  );
}

function panelComponentes() {
  var grupos = CATALOGO.map(function (g) {
    return (
      '<div style="margin-bottom:var(--e4)">' +
        '<div class="etiqueta tenue" style="padding:0 var(--e3) var(--e2)">' + g.g + '</div>' +
        g.c
          .map(function (c) {
            return (
              '<div class="comp"><span class="comp__ico">' + ico(c.i, 'ico--16') + '</span>' +
              '<div class="crece"><div class="comp__n">' + c.n + '</div>' +
              '<div class="comp__d">' + c.d + '</div></div></div>'
            );
          })
          .join('') +
      '</div>'
    );
  }).join('');

  return grupos;
}

function panelInspector(compacto) {
  return (
    '<div class="ruta-sel">Portada <span>›</span> Contenedor de texto <span>›</span> <b>Título</b></div>' +
    '<div class="ed__panel-c">' +
      '<div class="fila g1" style="background:var(--pagina);padding:4px;border-radius:var(--radio);margin-bottom:var(--e4)">' +
        '<span class="cta cta--bajo crece" style="background:var(--papel);color:var(--estructura)">Contenido</span>' +
        '<span class="cta cta--bajo crece" style="background:transparent;color:var(--tinta-suave)">Estilo</span>' +
        '<span class="cta cta--bajo crece" style="background:transparent;color:var(--tinta-suave)">Disposición</span>' +
      '</div>' +

      '<div class="campo" style="margin-bottom:var(--e4)">' +
        '<span class="campo__et">Texto</span>' +
        '<textarea class="campo__in campo__in--area">Tu casa protegida desde el primer día</textarea>' +
      '</div>' +

      '<div class="campo" style="margin-bottom:var(--e4)">' +
        '<span class="campo__et">Importancia</span>' +
        '<select class="campo__in"><option>H2 · Subtítulo de página</option></select>' +
        '<span class="campo__ayuda">Define la jerarquía del documento, no el tamaño visual.</span>' +
      '</div>' +

      (compacto
        ? ''
        : '<div class="etiqueta tenue" style="margin-bottom:var(--e2)">Espaciado</div>' +
          '<div class="caja__m" style="margin-bottom:var(--e4)">' +
            '<div class="menor tenue" style="margin-bottom:4px">margen 0</div>' +
            '<div class="caja__p">' +
              '<div class="menor tenue" style="margin-bottom:4px">relleno 0</div>' +
              '<div class="caja__c">Contenido</div>' +
            '</div>' +
          '</div>' +
          '<p class="campo__ayuda" style="margin-bottom:var(--e4)">Todo nace en cero. Si ves separación, está escrita aquí y puedes cambiarla.</p>') +

      '<div class="etiqueta tenue" style="margin-bottom:var(--e2)">Dispositivo</div>' +
      '<div class="fila g1" style="background:var(--pagina);padding:4px;border-radius:var(--radio)">' +
        '<span class="cta cta--bajo crece" style="background:var(--papel);color:var(--estructura)">' + ico('escritorio', 'ico--16') + '</span>' +
        '<span class="cta cta--bajo crece" style="background:transparent;color:var(--tinta-suave)">' + ico('tableta', 'ico--16') + '</span>' +
        '<span class="cta cta--bajo crece" style="background:transparent;color:var(--tinta-suave)">' + ico('movil', 'ico--16') + '</span>' +
      '</div>' +
      '<p class="campo__ayuda" style="margin-top:var(--e2)">Escritorio es la base. Lo que cambies en tableta o móvil sólo afecta a ese tamaño.</p>' +
    '</div>'
  );
}

function barraEditor(modo, sobreOscuro) {
  var c = sobreOscuro ? 'cta--sobre-azul-secundario' : 'cta--secundario';
  return (
    '<button class="cta cta--bajo ' + c + '">' + ico('atras', 'ico--16') + 'Proyectos</button>' +
    '<div style="font-weight:600;font-size:14px">Seguro de hogar — landing de campaña</div>' +
    '<span class="pastilla pastilla--neutra"><span class="punto"></span>Guardado</span>' +
    '<div class="crece"></div>' +
    '<button class="cta cta--bajo ' + c + '">' + ico('deshacer', 'ico--16') + '</button>' +
    '<button class="cta cta--bajo ' + c + '">' + ico('rehacer', 'ico--16') + '</button>' +
    '<button class="cta cta--bajo ' + c + '">' + ico('ojo', 'ico--16') + 'Vista previa</button>' +
    '<button class="cta cta--bajo cta--principal">' + ico('exportar', 'ico--16') + 'Exportar</button>'
  );
}

/* ── A · tres paneles ────────────────────────────────────────────────── */

function editorA(modo) {
  var cuerpo =
    '<div class="ed ed--a">' +
      '<aside class="ed__panel">' +
        '<div class="ed__panel-t">' + ico('mas', 'ico--16') + 'Componentes</div>' +
        '<div class="ed__panel-c">' + panelComponentes() + '</div>' +
      '</aside>' +
      '<div class="ed__lienzo">' + hoja('titular') + '</div>' +
      '<aside class="ed__panel">' +
        '<div class="ed__panel-t">' + ico('ajustes', 'ico--16') + 'Propiedades</div>' +
        panelInspector(false) +
      '</aside>' +
    '</div>';

  return (
    '<div class="a-marco">' +
      '<aside class="a-lateral" style="width:76px;padding:var(--e4) var(--e2)">' +
        '<div style="display:flex;justify-content:center">' + LOGOS.a(36, '#ffffff', '#23366f') + '</div>' +
        '<div class="col g2" style="align-items:center">' +
          '<div class="b-icono b-icono--on">' + ico('capas', 'ico--24') + '</div>' +
          '<div class="b-icono">' + ico('cuadricula', 'ico--24') + '</div>' +
          '<div class="b-icono">' + ico('biblioteca', 'ico--24') + '</div>' +
        '</div>' +
      '</aside>' +
      '<div class="a-principal">' +
        '<header class="a-barra">' + barraEditor(modo) + '</header>' +
        '<div class="a-ruta">Portada <span>›</span> Contenedor de texto <span>›</span> <strong>Título</strong>' +
          '<div class="crece"></div><span>Escritorio · 1440 px</span></div>' +
        cuerpo +
      '</div>' +
    '</div>'
  );
}

/* ── B · paneles flotantes sobre el lienzo ───────────────────────────── */

function editorB(modo) {
  return (
    '<div class="b-marco">' +
      '<aside class="b-riel">' +
        '<div class="b-riel__marca">' + LOGOS.b(40, '#ffffff', '#2167ae') + '</div>' +
        '<div class="b-icono b-icono--on">' + ico('mas', 'ico--24') + '</div>' +
        '<div class="b-icono">' + ico('capas', 'ico--24') + '</div>' +
        '<div class="b-icono">' + ico('biblioteca', 'ico--24') + '</div>' +
        '<div class="b-icono">' + ico('cuadricula', 'ico--24') + '</div>' +
        '<div class="b-riel__pie"><div class="b-icono">' + ico('ajustes', 'ico--24') + '</div></div>' +
      '</aside>' +
      '<div class="b-principal" style="position:relative">' +
        '<header class="a-barra" style="background:var(--papel)">' + barraEditor(modo) + '</header>' +
        '<div class="ed ed--b">' +
          '<div class="ed__lienzo" style="padding:var(--e8) var(--e10)">' + hoja('portada') + '</div>' +
        '</div>' +

        // Panel flotante de componentes, anclado al borde
        '<aside class="ed__panel" style="position:absolute;left:var(--e4);top:88px;bottom:var(--e4);width:256px;border-radius:var(--radio);box-shadow:0 2px 12px rgba(0,0,0,.14)">' +
          '<div class="ed__panel-t">' + ico('mas', 'ico--16') + 'Componentes</div>' +
          '<div class="ed__panel-c">' + panelComponentes() + '</div>' +
        '</aside>' +

        // Rasgo propio: el inspector se ancla junto a la selección
        '<aside class="ed__panel" style="position:absolute;right:var(--e4);top:160px;width:296px;border-radius:var(--radio);box-shadow:0 2px 12px rgba(0,0,0,.14);max-height:70%">' +
          '<div class="ed__panel-t">' + ico('ajustes', 'ico--16') + 'Portada' +
            '<div class="crece"></div>' + ico('cerrar', 'ico--16') + '</div>' +
          panelInspector(true) +
        '</aside>' +
      '</div>' +
    '</div>'
  );
}

/* ── C · propiedades en barra horizontal ─────────────────────────────── */

function editorC(modo) {
  var propiedades =
    '<div style="height:56px;flex:none;background:var(--papel);display:flex;align-items:center;gap:var(--e4);padding:0 var(--e5)">' +
      '<span class="etiqueta tenue">Título</span>' +
      '<div class="fila g2"><span class="menor suave">Nivel</span>' +
        '<select class="campo__in" style="height:36px;width:auto">' +
          '<option>H2</option></select></div>' +
      '<div class="fila g2"><span class="menor suave">Tamaño</span>' +
        '<input class="campo__in" style="height:36px;width:80px" value="34"></div>' +
      '<div class="fila g2"><span class="menor suave">Peso</span>' +
        '<select class="campo__in" style="height:36px;width:auto"><option>600</option></select></div>' +
      '<div class="fila g2"><span class="menor suave">Margen</span>' +
        '<input class="campo__in" style="height:36px;width:64px" value="0"></div>' +
      '<div class="fila g2"><span class="menor suave">Relleno</span>' +
        '<input class="campo__in" style="height:36px;width:64px" value="0"></div>' +
      '<div class="crece"></div>' +
      '<span class="menor tenue">Portada › Contenedor › Título</span>' +
    '</div>';

  return (
    '<div class="c-marco">' +
      '<header class="c-barra">' + barraEditor(modo, true) + '</header>' +
      propiedades +
      '<div class="ed ed--c" style="flex:1">' +
        '<aside class="ed__panel">' +
          '<div class="ed__panel-t">' + ico('mas', 'ico--16') + 'Componentes</div>' +
          '<div class="ed__panel-c">' + panelComponentes() + '</div>' +
        '</aside>' +
        '<div class="ed__lienzo">' + hoja('texto') + '</div>' +
      '</div>' +
    '</div>'
  );
}

var EDITOR = { a: editorA, b: editorB, c: editorC };
