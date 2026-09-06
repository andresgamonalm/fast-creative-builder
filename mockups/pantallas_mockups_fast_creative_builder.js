/* ═══════════════════════════════════════════════════════════════════════
   Marcos de aplicación y pantalla de inicio
   ───────────────────────────────────────────────────────────────────────
   Correcciones aplicadas:
     · «Azul, azul y más azul.» El inicio se resuelve con bandas pastel a
       todo el ancho, como zurich.cl. El azul queda para botones y datos.
     · «La repetición del Crear.» Antes aparecía cuatro veces en la misma
       pantalla. Ahora hay UNA acción principal, en la barra superior.
       Crear deja de ser un destino de navegación.
   ═══════════════════════════════════════════════════════════════════════ */

var DESTINOS = [
  { id: 'inicio', n: 'Inicio', i: 'inicio', ruta: '/home' },
  { id: 'proyectos', n: 'Proyectos', i: 'proyectos', ruta: '/proyectos' },
  { id: 'biblioteca', n: 'Biblioteca', i: 'biblioteca', ruta: '/biblioteca/imagenes' },
  { id: 'config', n: 'Configuración', i: 'ajustes', ruta: '/configuracion/general' }
];

/* La única acción principal de todo el aplicativo */
function ctaCrear(alto) {
  return '<button class="cta cta--principal' + (alto ? ' cta--alto' : '') + '">' +
    ico('crear', 'ico--16') + 'Crear una pieza</button>';
}

function movilNav(activo) {
  return '<nav class="movil-nav">' + DESTINOS.map(function (d) {
    return '<div class="movil-nav__i' + (d.id === activo ? ' movil-nav__i--on' : '') + '">' +
      ico(d.i, 'ico--24') + '<span>' + d.n + '</span></div>';
  }).join('') + '</nav>';
}

/* ── A · Taller ──────────────────────────────────────────────────────── */

function marcoA(activo, titulo, cuerpo, accion) {
  return (
    '<div class="a-marco">' +
      '<aside class="a-lateral">' +
        '<div class="a-marca">' + LOGOS.a(34, 'var(--superficie)', 'var(--estructura)') +
          '<div><div class="a-marca__n">Fast Creative Builder</div>' +
          '<div class="a-marca__l">Web · Email · Libre</div></div></div>' +
        '<nav class="a-grupo">' + DESTINOS.map(function (d) {
          return '<div class="a-dest' + (d.id === activo ? ' a-dest--on' : '') + '">' +
            ico(d.i) + '<span>' + d.n + '</span></div>';
        }).join('') + '</nav>' +
        '<div class="a-pie"><span class="avatar">AG</span>' +
          '<div class="crece"><div class="menor" style="font-weight:500">Andrés Gamonal</div>' +
          '<div class="micro" style="color:var(--sobre-estructura-suave)">Administrador</div></div></div>' +
      '</aside>' +
      '<div class="a-principal">' +
        '<header class="a-barra">' +
          '<h4 class="crece">' + esc(titulo) + '</h4>' +
          '<button class="cta cta--bajo cta--terciario">' + ico('buscar', 'ico--16') + 'Buscar</button>' +
          (accion === false ? '' : ctaCrear()) +
        '</header>' +
        '<div class="a-cuerpo">' + cuerpo + '</div>' +
        movilNav(activo) +
      '</div>' +
    '</div>'
  );
}

/* ── B · Lienzo ──────────────────────────────────────────────────────── */

function marcoB(activo, cuerpo) {
  return (
    '<div class="b-marco">' +
      '<aside class="b-riel">' +
        '<div style="margin-bottom:var(--e4)">' + LOGOS.b(40, 'var(--superficie)', 'var(--estructura)') + '</div>' +
        DESTINOS.map(function (d) {
          return '<div class="b-icono' + (d.id === activo ? ' b-icono--on' : '') + '" title="' + d.n + '">' +
            ico(d.i, 'ico--24') + '</div>';
        }).join('') +
        '<div class="b-riel__pie"><span class="avatar">AG</span></div>' +
      '</aside>' +
      '<div class="b-principal"><div class="b-cuerpo">' + cuerpo + '</div>' + movilNav(activo) + '</div>' +
    '</div>'
  );
}

/* ── C · Escritorio ──────────────────────────────────────────────────── */

function marcoC(activo, cuerpo) {
  return (
    '<div class="c-marco">' +
      '<header class="c-barra">' + LOGOS.c(32, 'var(--superficie)', 'var(--estructura)') +
        '<div style="font-size:14px;font-weight:600">Fast Creative Builder</div>' +
        '<div class="crece"></div>' + ctaCrear() + '<span class="avatar">AG</span></header>' +
      '<nav class="c-secciones">' + DESTINOS.map(function (d) {
        return '<div class="c-seccion' + (d.id === activo ? ' c-seccion--on' : '') + '">' +
          ico(d.i, 'ico--16') + '<span>' + d.n + '</span></div>';
      }).join('') + '</nav>' +
      '<div class="c-cuerpo">' + cuerpo + '</div>' + movilNav(activo) +
    '</div>'
  );
}

/* ── Piezas compartidas ──────────────────────────────────────────────── */

/* Foto en círculo con burbujas: el lenguaje de formas de la referencia */
function circuloFoto(src, tam, fondo) {
  var d = tam;
  return (
    '<div class="circulo" style="width:' + d + 'px;height:' + d + 'px">' +
      (fondo ? '<span class="circulo__fondo" style="width:' + d + 'px;height:' + d + 'px;background:' + fondo + ';left:-14px;top:-14px"></span>' : '') +
      '<img class="circulo__foto" src="' + src + '" alt="" style="width:' + d + 'px;height:' + d + 'px">' +
      '<span class="burbuja burbuja--1" style="left:-6px;bottom:26px"></span>' +
      '<span class="burbuja burbuja--2" style="left:14px;bottom:-16px"></span>' +
      '<span class="burbuja burbuja--3" style="left:66px;bottom:-6px"></span>' +
    '</div>'
  );
}

/* Fila de accesos rápidos, como la de la referencia */
function filaAccesos() {
  var a = [
    { i: 'crear', n: 'Nueva landing' }, { i: 'correo', n: 'Nuevo correo' },
    { i: 'imagen', n: 'Nueva gráfica' }, { i: 'proyectos', n: 'En revisión' },
    { i: 'biblioteca', n: 'Subir imagen' }, { i: 'fuente', n: 'Subir tipografía' }
  ];
  return '<div class="cuadro-accesos" style="display:grid;grid-template-columns:repeat(6,1fr);gap:var(--e3)">' +
    a.map(function (x) {
      return '<div class="acceso"><span class="acceso__ico">' + ico(x.i, 'ico--24') + '</span>' +
        '<span class="acceso__n">' + x.n + '</span></div>';
    }).join('') + '</div>';
}

function tablaProyectos(limite) {
  var filas = PROYECTOS.slice(0, limite || PROYECTOS.length).map(function (p) {
    return '<tr>' +
      '<td data-et="Proyecto"><div class="fila g3">' +
        (p.img ? '<img class="tabla__miniatura" src="' + p.img + '" alt="">'
               : '<span class="tabla__miniatura fila" style="justify-content:center;color:var(--texto-tenue)">' + ico(p.m === 'Email' ? 'correo' : 'imagen', 'ico--16') + '</span>') +
        '<div><div style="font-weight:500">' + esc(p.n) + '</div>' +
        '<div class="micro tenue">' + esc(p.a) + '</div></div></div></td>' +
      '<td data-et="Modo"><span style="color:#2167AE;font-weight:500">' + esc(p.m) + '</span></td>' +
      '<td data-et="Estado"><span class="pastilla pastilla--' + ESTADO_PASTILLA[p.e] + '"><span class="punto"></span>' + esc(p.e) + '</span></td>' +
      '<td data-et="Editado" class="tenue">' + esc(p.f) + '</td>' +
      '<td><button class="cta cta--bajo cta--secundario">Abrir</button></td>' +
    '</tr>';
  }).join('');
  return '<table class="tabla"><thead><tr><th>Proyecto</th><th>Modo</th><th>Estado</th><th>Editado</th><th></th></tr></thead>' +
    '<tbody>' + filas + '</tbody></table>';
}

function selectorModos() {
  return (
    '<div class="modos cuadro-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--e4)">' +
      '<div class="modo modo--oscuro" style="background:#23366F">' +
        '<span class="acceso__ico" style="background:var(--superficie);color:#23366F">' + ico('escritorio', 'ico--24') + '</span>' +
        '<h3>Web</h3><p class="menor">Landing pages y páginas de campaña. Sale en HTML, JPG, PNG y fragmento para el gestor de contenidos.</p>' +
        '<button class="cta" style="align-self:flex-start;background:#FFFFFF;color:#23366F">Empezar</button></div>' +
      '<div class="modo modo--oscuro" style="background:#2167AE">' +
        '<span class="acceso__ico" style="background:var(--superficie);color:#2167AE">' + ico('correo', 'ico--24') + '</span>' +
        '<h3>Email</h3><p class="menor">Piezas de correo de 600 px, con estructura segura y un respaldo elegido para cada bloque interactivo.</p>' +
        '<button class="cta" style="align-self:flex-start;background:#FFFFFF;color:#2167AE">Empezar</button></div>' +
      '<div class="modo" style="background:#DAD2BD">' +
        '<span class="acceso__ico" style="background:var(--superficie);color:#23366F">' + ico('imagen', 'ico--24') + '</span>' +
        '<h3>Estilo libre</h3><p class="menor">Key visuals y gráficas. Mesa de trabajo con capas, guías y reglas en píxeles reales.</p>' +
        '<button class="cta" style="align-self:flex-start;background:#23366F;color:#FFFFFF">Empezar</button></div>' +
    '</div>'
  );
}

/* ═══ Inicio ════════════════════════════════════════════════════════════ */

var HOME = {
  /* A · abre con una banda ámbar y la foto en círculo */
  a: function () {
    var cuerpo =
      '<section class="banda banda--inicio">' +
        '<div class="contenedor fila g9 fila--apila hero-split" style="display:grid;grid-template-columns:7fr 5fr;align-items:center">' +
          '<div class="col g4">' +
            '<span class="etiqueta">Martes 6 de septiembre</span>' +
            '<h1>Buenos días, Andrés</h1>' +
            '<p class="lead" style="color:var(--estructura);max-width:46ch">Tienes tres piezas esperando revisión y dos campañas en borrador.</p>' +
            '<div class="fila g3" style="margin-top:var(--e2)">' +
              '<button class="cta cta--alto" style="background:#1FB1E6;color:#FFFFFF;box-shadow:inset 0 0 0 1px var(--estructura)">Revisar pendientes</button>' +
              '<button class="cta cta--alto" style="background:#2167AE;color:#ECEEEF">Ver proyectos</button>' +
            '</div>' +
          '</div>' +
          '<div style="justify-self:center">' + circuloFoto(FOTO.home, 240, '#5495CF') + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="banda banda--corta banda--superficie">' +
        '<div class="contenedor">' + filaAccesos() + '</div>' +
      '</section>' +

      '<section class="banda banda--corta banda--neutra">' +
        '<div class="contenedor">' +
          '<div class="fila g4" style="margin-bottom:var(--e5)"><h3 class="crece">Continúa donde lo dejaste</h3>' +
          '<button class="cta cta--terciario">Ver todos' + ico('chevron', 'ico--16') + '</button></div>' +
          tablaProyectos(4) +
        '</div>' +
      '</section>' +

      '<section class="banda banda--corta banda--c">' +
        '<div class="contenedor centro">' +
          '<h2 style="margin-bottom:var(--e3)">Una pieza, tres salidas</h2>' +
          '<p class="lead" style="color:var(--estructura);max-width:56ch;margin:0 auto var(--e6)">Diseña una vez y expórtalo en web, correo y gráfica sin rehacer nada.</p>' +
          '<button class="cta cta--secundario cta--alto">Ver los tres modos</button>' +
        '</div>' +
      '</section>';

    return marcoA('inicio', 'Inicio', cuerpo);
  },

  /* B · abre por búsqueda sobre banda rosa */
  b: function () {
    var cuerpo =
      '<section class="banda banda--b">' +
        '<div class="contenedor">' +
          '<h1 style="margin-bottom:var(--e5)">Hola, Andrés</h1>' +
          '<div class="b-buscador" style="max-width:620px">' + ico('buscar') +
            '<span>Busca un proyecto, una imagen o una tipografía</span></div>' +
          '<div class="fila g2" style="margin-top:var(--e4);flex-wrap:wrap">' +
            '<span class="pastilla pastilla--neutra">Últimos 7 días</span>' +
            '<span class="pastilla pastilla--neutra">En revisión</span>' +
            '<span class="pastilla pastilla--neutra">Solo web</span>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="banda banda--corta banda--superficie">' +
        '<div class="contenedor rejilla12">' +
          '<div style="grid-column:span 8">' +
            '<div class="fila g4" style="margin-bottom:var(--e4)"><h3 class="crece">Recientes</h3>' +
            '<button class="cta cta--terciario">Ver todos' + ico('chevron', 'ico--16') + '</button></div>' +
            tablaProyectos(4) +
          '</div>' +
          '<div style="grid-column:span 4" class="col g4">' +
            '<div style="background:var(--banda-e);border-radius:var(--radio);padding:var(--e6)">' +
              '<span class="etiqueta">Pendiente</span>' +
              '<h4 style="margin:var(--e2) 0 var(--e4);font-weight:400;font-size:22px">Tres piezas esperan tu revisión</h4>' +
              '<button class="cta cta--principal">Revisarlas</button></div>' +
            '<div style="background:var(--banda-d);border-radius:var(--radio);padding:var(--e6)">' +
              '<span class="etiqueta">Biblioteca</span>' +
              '<p class="menor" style="margin:var(--e2) 0 var(--e4)">18 imágenes, 4 logos y 3 tipografías subidas.</p>' +
              '<button class="cta cta--secundario cta--bajo">Abrir biblioteca</button></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="banda banda--corta banda--neutra">' +
        '<div class="contenedor">' + filaAccesos() + '</div>' +
      '</section>';

    return marcoB('inicio', cuerpo);
  },

  /* C · abre con el resumen operativo sobre banda celeste */
  c: function () {
    var cuerpo =
      '<section class="banda banda--d">' +
        '<div class="contenedor">' +
          '<div class="fila g5 fila--apila" style="align-items:flex-end;margin-bottom:var(--e7)">' +
            '<div class="crece"><span class="etiqueta">Resumen de hoy</span>' +
            '<h1 style="margin-top:var(--e2)">12 proyectos activos</h1></div>' +
            '<button class="cta cta--principal cta--alto">Revisar pendientes</button>' +
          '</div>' +
          '<div class="cuadro-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--e4)">' +
            [['3','En revisión'],['5','Borradores'],['28','Exportadas este mes'],['3','Personas con acceso']]
              .map(function (c) {
                return '<div style="background:var(--superficie);padding:var(--e5);border-radius:var(--radio)">' +
                  '<div style="font-size:34px;font-weight:600;color:var(--accion);line-height:1">' + c[0] + '</div>' +
                  '<div class="menor suave" style="margin-top:var(--e2)">' + c[1] + '</div></div>';
              }).join('') +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="banda banda--corta banda--superficie">' +
        '<div class="contenedor">' + filaAccesos() + '</div>' +
      '</section>' +

      '<section class="banda banda--corta banda--b">' +
        '<div class="contenedor fila g8 fila--apila hero-split" style="display:grid;grid-template-columns:5fr 7fr;align-items:center">' +
          '<div style="justify-self:center">' + circuloFoto(FOTO.pieza2, 220, 'var(--superficie)') + '</div>' +
          '<div class="col g4"><span class="etiqueta">Empieza aquí</span>' +
            '<h2>Web, correo o gráfica</h2>' +
            '<p class="lead" style="max-width:48ch">Los tres modos comparten el mismo catálogo de componentes y las mismas exportaciones.</p>' +
            '<button class="cta cta--principal cta--alto" style="align-self:flex-start">Elegir modo</button></div>' +
        '</div>' +
      '</section>' +

      '<section class="banda banda--corta banda--neutra">' +
        '<div class="contenedor">' +
          '<div class="fila g4" style="margin-bottom:var(--e5)"><h3 class="crece">Últimos movimientos</h3>' +
          '<button class="cta cta--terciario">Ver todos' + ico('chevron', 'ico--16') + '</button></div>' +
          tablaProyectos(5) +
        '</div>' +
      '</section>';

    return marcoC('inicio', cuerpo);
  }
};
