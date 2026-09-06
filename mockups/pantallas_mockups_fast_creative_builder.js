/* ═══════════════════════════════════════════════════════════════════════
   Fast Creative Builder — pantallas de las tres propuestas
   ═══════════════════════════════════════════════════════════════════════ */

var DESTINOS = [
  { id: 'inicio', n: 'Inicio', i: 'inicio', ruta: '/home' },
  { id: 'crear', n: 'Crear', i: 'crear', ruta: '/crear' },
  { id: 'proyectos', n: 'Proyectos', i: 'proyectos', ruta: '/proyectos' },
  { id: 'biblioteca', n: 'Biblioteca', i: 'biblioteca', ruta: '/biblioteca/imagenes' },
  { id: 'config', n: 'Configuración', i: 'ajustes', ruta: '/configuracion/general' }
];

/* ═══ Marcos de aplicación ══════════════════════════════════════════════ */

function marcoA(activo, ruta, acciones, cuerpo) {
  var destinos = DESTINOS.map(function (d) {
    return (
      '<li class="a-dest' + (d.id === activo ? ' a-dest--on' : '') + '">' +
      ico(d.i) +
      '<span>' + d.n + '</span>' +
      '</li>'
    );
  }).join('');

  return (
    '<div class="a-marco">' +
      '<aside class="a-lateral">' +
        '<div class="a-marca">' +
          LOGOS.a(32, '#ffffff', '#23366f') +
          '<div><div class="a-marca__nombre">Fast Creative Builder</div>' +
          '<div class="a-marca__lema">Web · Email · Libre</div></div>' +
        '</div>' +
        '<nav class="a-grupo"><span class="a-grupo__t">Trabajo</span><ul class="a-grupo">' +
          destinos +
        '</ul></nav>' +
        '<div class="a-lateral__pie">' +
          '<span class="a-avatar">AG</span>' +
          '<div class="crece"><div style="font-size:14px;font-weight:500">Andrés Gamonal</div>' +
          '<div style="font-size:12px;color:var(--claro)">Administrador</div></div>' +
        '</div>' +
      '</aside>' +
      '<div class="a-principal">' +
        '<header class="a-barra">' +
          '<div class="crece fila g3">' + (acciones.izq || '') + '</div>' +
          '<div class="fila g2">' + (acciones.der || '') + '</div>' +
        '</header>' +
        '<div class="a-ruta">' + ruta + '</div>' +
        '<main class="a-cuerpo">' + cuerpo + '</main>' +
        movilNav(activo) +
      '</div>' +
    '</div>'
  );
}

function marcoB(activo, cabecera, cuerpo) {
  var iconos = DESTINOS.map(function (d) {
    return (
      '<div class="b-icono' + (d.id === activo ? ' b-icono--on' : '') + '" title="' + d.n + '">' +
      ico(d.i, 'ico--24') +
      '</div>'
    );
  }).join('');

  return (
    '<div class="b-marco">' +
      '<aside class="b-riel">' +
        '<div class="b-riel__marca">' + LOGOS.b(40, '#ffffff', '#2167ae') + '</div>' +
        iconos +
        '<div class="b-riel__pie"><span class="a-avatar">AG</span></div>' +
      '</aside>' +
      '<div class="b-principal">' +
        '<div class="b-cuerpo">' +
          cabecera +
          cuerpo +
        '</div>' +
        movilNav(activo) +
      '</div>' +
    '</div>'
  );
}

function marcoC(activo, acciones, cuerpo) {
  var secciones = DESTINOS.map(function (d) {
    return (
      '<div class="c-seccion' + (d.id === activo ? ' c-seccion--on' : '') + '">' +
      ico(d.i, 'ico--16') + '<span>' + d.n + '</span>' +
      '</div>'
    );
  }).join('');

  return (
    '<div class="c-marco">' +
      '<header class="c-barra">' +
        LOGOS.c(32, '#ffffff', '#23366f') +
        '<div style="font-size:14px;font-weight:600">Fast Creative Builder</div>' +
        '<div class="crece"></div>' +
        (acciones || '') +
        '<span class="a-avatar">AG</span>' +
      '</header>' +
      '<nav class="c-secciones">' + secciones + '</nav>' +
      '<main class="c-cuerpo">' + cuerpo + '</main>' +
      movilNav(activo) +
    '</div>'
  );
}

function movilNav(activo) {
  return (
    '<nav class="movil-nav">' +
    DESTINOS.slice(0, 4)
      .map(function (d) {
        return (
          '<div class="movil-nav__i' + (d.id === activo ? ' movil-nav__i--on' : '') + '">' +
          ico(d.i, 'ico--24') + '<span>' + d.n + '</span></div>'
        );
      })
      .join('') +
    '</nav>'
  );
}

/* ═══ Piezas reutilizables ══════════════════════════════════════════════ */

function tituloPagina(t, bajada, accion) {
  return (
    '<div class="fila g5" style="align-items:flex-end;margin-bottom:var(--e6)">' +
      '<div class="crece"><h2>' + esc(t) + '</h2>' +
      (bajada ? '<p class="lead" style="margin-top:8px;max-width:60ch">' + esc(bajada) + '</p>' : '') +
      '</div>' +
      (accion || '') +
    '</div>'
  );
}

function tablaProyectos(limite) {
  var filas = PROYECTOS.slice(0, limite || PROYECTOS.length)
    .map(function (p) {
      return (
        '<tr>' +
          '<td><div class="fila g3">' +
            (p.img
              ? '<img class="tabla__miniatura" src="' + p.img + '" alt="">'
              : '<span class="tabla__miniatura fila" style="justify-content:center;color:var(--tinta-tenue)">' + ico(p.m === 'Email' ? 'correo' : 'imagen', 'ico--16') + '</span>') +
            '<div><div style="font-weight:500">' + esc(p.n) + '</div>' +
            '<div class="menor tenue">' + esc(p.a) + '</div></div>' +
          '</div></td>' +
          '<td>' + esc(p.m) + '</td>' +
          '<td><span class="pastilla pastilla--' + ESTADO_PASTILLA[p.e] + '"><span class="punto"></span>' + esc(p.e) + '</span></td>' +
          '<td class="tenue">' + esc(p.f) + '</td>' +
          '<td style="text-align:right"><button class="cta cta--terciario cta--bajo">Abrir' + ico('flecha', 'ico--16') + '</button></td>' +
        '</tr>'
      );
    })
    .join('');

  return (
    '<table class="tabla"><thead><tr>' +
      '<th>Proyecto</th><th>Modo</th><th>Estado</th><th>Editado</th><th></th>' +
    '</tr></thead><tbody>' + filas + '</tbody></table>'
  );
}

function bandaCifras() {
  return (
    '<div class="banda banda--cifras">' +
      '<div class="cifra"><div class="cifra__n">12</div><div class="cifra__e">Proyectos activos</div></div>' +
      '<div class="cifra"><div class="cifra__n">3</div><div class="cifra__e">En revisión</div></div>' +
      '<div class="cifra"><div class="cifra__n">28</div><div class="cifra__e">Piezas exportadas</div></div>' +
      '<div class="cifra"><div class="cifra__n">2</div><div class="cifra__e">Personas con acceso</div></div>' +
    '</div>'
  );
}

function selectorModos() {
  return (
    '<div class="modos">' +
      '<div class="modo modo--web">' +
        ico('escritorio', 'ico--28') +
        '<div class="modo__n">Web</div>' +
        '<p class="modo__d">Landing pages y páginas de campaña. Contenedores flexibles, superposición e interacción. Sale en HTML, JPG, PNG y fragmento para Sitecore.</p>' +
        '<button class="cta cta--sobre-azul">Empezar en web</button>' +
      '</div>' +
      '<div class="modo modo--email">' +
        ico('correo', 'ico--28') +
        '<div class="modo__n">Email</div>' +
        '<p class="modo__d">Piezas de correo con estructura segura, 600 px de ancho y respaldo elegido para cada bloque interactivo. Sale en HTML con estilos en línea.</p>' +
        '<button class="cta cta--sobre-azul-secundario">Empezar en email</button>' +
      '</div>' +
      '<div class="modo modo--libre">' +
        ico('imagen', 'ico--28') +
        '<div class="modo__n">Estilo libre</div>' +
        '<p class="modo__d">Key visuals y gráficas para redes. Mesa de trabajo, capas, guías y recorte. Formatos 1080×1080, 1080×1350, 1200×628 y personalizado.</p>' +
        '<button class="cta cta--principal">Empezar en libre</button>' +
      '</div>' +
    '</div>'
  );
}

/* ═══ Login ═════════════════════════════════════════════════════════════ */

function formularioAcceso(titulo, intro, campos, botonTexto, pie, logo) {
  return (
    '<div class="login__forma">' +
      '<div style="margin-bottom:var(--e4)">' + logo + '</div>' +
      '<h2>' + esc(titulo) + '</h2>' +
      '<p class="suave" style="margin-bottom:var(--e2)">' + esc(intro) + '</p>' +
      campos +
      '<button class="cta cta--principal cta--alto cta--ancho" style="margin-top:var(--e2)">' + esc(botonTexto) + '</button>' +
      (pie || '') +
    '</div>'
  );
}

function campo(et, tipo, valor, ayuda) {
  return (
    '<label class="campo"><span class="campo__et">' + esc(et) + '</span>' +
    '<input class="campo__in" type="' + tipo + '" value="' + esc(valor || '') + '">' +
    (ayuda ? '<span class="campo__ayuda">' + esc(ayuda) + '</span>' : '') +
    '</label>'
  );
}

var LOGIN = {
  a: function () {
    return (
      '<div class="login login--a">' +
        '<div class="login__panel">' +
          formularioAcceso(
            'Entrar',
            'Escribe tu correo y tu contraseña.',
            campo('Correo', 'email', 'andres@zurich.cl') + campo('Contraseña', 'password', '••••••••••'),
            'Entrar',
            '<p class="menor" style="text-align:center;margin-top:var(--e3)"><a href="#" style="color:var(--heroe)">¿Olvidaste tu contraseña?</a></p>',
            LOGOS.a(44, '#2167ae', '#ffffff')
          ) +
        '</div>' +
        '<div class="login__visual">' +
          '<img class="login__foto" src="' + FOTO.loginA + '" alt="Persona trabajando en su puesto de trabajo">' +
          '<div class="login__mensaje">' +
            '<span class="etiqueta">Una pieza, tres salidas</span>' +
            '<p>Diseña una vez y expórtalo en web, correo y gráfica sin rehacer nada.</p>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  },
  b: function () {
    return (
      '<div class="login login--b">' +
        '<div class="login__visual">' +
          '<img class="login__foto" src="' + FOTO.loginB + '" alt="Dos personas trabajando juntas junto a la ventana">' +
          '<div class="login__mensaje" style="max-width:480px">' +
            '<span class="etiqueta">Del boceto a la campaña</span>' +
            '<p>Un solo lugar para las landings, los correos y las gráficas de todo el equipo.</p>' +
          '</div>' +
        '</div>' +
        '<div class="login__panel">' +
          formularioAcceso(
            'Bienvenido de vuelta',
            'Entra con la cuenta que te invitaron a crear.',
            campo('Correo', 'email', 'andres@zurich.cl') + campo('Contraseña', 'password', '••••••••••'),
            'Entrar',
            '<p class="menor" style="margin-top:var(--e3)"><a href="#" style="color:var(--heroe)">¿Olvidaste tu contraseña?</a></p>',
            LOGOS.b(44, '#2167ae', '#ffffff')
          ) +
        '</div>' +
      '</div>'
    );
  },
  c: function () {
    return (
      '<div class="login login--c">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;overflow:hidden">' +
          '<div class="login__panel" style="padding:var(--e11) var(--e10)">' +
            formularioAcceso(
              'Acceso al equipo',
              'Fast Creative Builder es de uso interno. Si no tienes cuenta, pídesela al administrador.',
              campo('Correo', 'email', 'andres@zurich.cl') + campo('Contraseña', 'password', '••••••••••'),
              'Entrar',
              '<p class="menor" style="margin-top:var(--e3)"><a href="#" style="color:var(--heroe)">¿Olvidaste tu contraseña?</a></p>',
              LOGOS.c(44, '#2167ae', '#ffffff')
            ) +
          '</div>' +
          '<div class="login__visual">' +
            '<img class="login__foto" src="' + FOTO.loginC + '" alt="Mesa de trabajo con bocetos">' +
          '</div>' +
        '</div>' +
        '<div style="background:var(--estructura);color:#fff;padding:var(--e5) var(--e10);display:flex;gap:var(--e9)">' +
          '<div><div style="font-size:24px;font-weight:600;color:var(--acento-calido)">HTML</div>' +
          '<div class="menor" style="color:var(--claro)">Web, correo y fragmento para el gestor de contenidos</div></div>' +
          '<div><div style="font-size:24px;font-weight:600;color:var(--acento-calido)">JPG · PNG</div>' +
          '<div class="menor" style="color:var(--claro)">Escritorio, tableta y móvil en un solo paso</div></div>' +
          '<div><div style="font-size:24px;font-weight:600;color:var(--acento-calido)">65</div>' +
          '<div class="menor" style="color:var(--claro)">Componentes con todas sus variantes</div></div>' +
        '</div>' +
      '</div>'
    );
  }
};

/* ═══ Home ══════════════════════════════════════════════════════════════ */

var HOME = {
  // A · apertura con banda editorial y acceso directo a la acción
  a: function () {
    var cuerpo =
      '<section class="banda" style="margin-bottom:var(--e6)">' +
        '<div class="banda__texto">' +
          '<span class="etiqueta">Buenos días, Andrés</span>' +
          '<h1>¿Qué vas a crear hoy?</h1>' +
          '<p>Elige el modo y empieza. La pieza se adapta sola a escritorio, tableta y móvil, y sale en los tres formatos.</p>' +
          '<div class="fila g3" style="margin-top:var(--e2)">' +
            '<button class="cta cta--sobre-azul cta--alto">' + ico('crear', 'ico--16') + 'Crear una pieza</button>' +
            '<button class="cta cta--sobre-azul-secundario cta--alto">Ver mis proyectos</button>' +
          '</div>' +
        '</div>' +
        '<img class="banda__foto" src="' + FOTO.home + '" alt="Equipo trabajando en la oficina">' +
      '</section>' +
      '<section style="margin-bottom:var(--e6)">' + bandaCifras() + '</section>' +
      '<section>' +
        '<div class="fila g4" style="margin-bottom:var(--e4)">' +
          '<h3 class="crece">Continúa donde lo dejaste</h3>' +
          '<button class="cta cta--terciario cta--bajo">Ver todos' + ico('flecha', 'ico--16') + '</button>' +
        '</div>' +
        tablaProyectos(4) +
      '</section>';

    return marcoA(
      'inicio',
      '<strong>Inicio</strong>',
      {
        izq: '<h4>Inicio</h4>',
        der:
          '<button class="cta cta--secundario">' + ico('buscar', 'ico--16') + 'Buscar</button>' +
          '<button class="cta cta--principal">' + ico('crear', 'ico--16') + 'Crear</button>'
      },
      cuerpo
    );
  },

  // B · apertura por búsqueda, listado en filas, foto lateral
  b: function () {
    var cabecera =
      '<div class="b-cabecera">' +
        '<div class="crece">' +
          '<span class="etiqueta tenue">Martes 6 de septiembre</span>' +
          '<h1 style="margin:8px 0 var(--e4)">Hola, Andrés</h1>' +
          '<div class="b-buscador">' + ico('buscar') + '<span>Busca un proyecto, una imagen o una tipografía</span></div>' +
        '</div>' +
        '<button class="cta cta--principal cta--alto">' + ico('crear', 'ico--16') + 'Crear una pieza</button>' +
      '</div>';

    var cuerpo =
      '<div class="b-seccion">' +
        '<div class="rejilla12" style="margin-bottom:var(--e6)">' +
          '<div style="grid-column:span 8">' +
            '<div class="fila g4" style="margin-bottom:var(--e4)">' +
              '<h3 class="crece">Recientes</h3>' +
              '<button class="cta cta--terciario cta--bajo">Ver todos' + ico('flecha', 'ico--16') + '</button>' +
            '</div>' +
            tablaProyectos(4) +
          '</div>' +
          '<div style="grid-column:span 4;display:flex;flex-direction:column;gap:var(--e4)">' +
            '<div style="border-radius:var(--radio);overflow:hidden">' +
              '<img src="' + FOTO.home + '" alt="Equipo trabajando" style="width:100%;height:200px;object-fit:cover">' +
            '</div>' +
            '<div style="background:var(--estructura);color:#fff;padding:var(--e5);border-radius:var(--radio)">' +
              '<span class="etiqueta" style="color:var(--acento-calido)">Pendiente</span>' +
              '<p style="margin:8px 0 var(--e4);font-size:18px;font-weight:500">Tienes 3 piezas esperando tu revisión.</p>' +
              '<button class="cta cta--sobre-azul">Revisarlas ahora</button>' +
            '</div>' +
            '<div style="background:var(--arenisca);padding:var(--e5);border-radius:var(--radio)">' +
              '<span class="etiqueta">Biblioteca</span>' +
              '<p class="menor" style="margin:8px 0 var(--e4)">18 imágenes, 4 logos y 2 tipografías subidas.</p>' +
              '<button class="cta cta--secundario cta--bajo">Abrir biblioteca</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    return marcoB('inicio', cabecera, cuerpo);
  },

  // C · resumen operativo primero, en banda sólida de color
  c: function () {
    var cuerpo =
      '<div style="background:var(--heroe);color:#fff;padding:var(--e7) var(--margen-pagina)">' +
        '<div class="fila g5" style="align-items:flex-end;margin-bottom:var(--e6)">' +
          '<div class="crece">' +
            '<span class="etiqueta" style="color:var(--acento-calido)">Resumen de hoy</span>' +
            '<h1 style="color:#fff;margin-top:8px">12 proyectos activos</h1>' +
          '</div>' +
          '<button class="cta cta--sobre-azul cta--alto">' + ico('crear', 'ico--16') + 'Crear una pieza</button>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--e4)">' +
          '<div style="background:var(--papel);padding:var(--e5);border-radius:var(--radio)">' +
            '<div style="font-size:32px;font-weight:600;color:var(--estructura)">3</div>' +
            '<div class="menor suave">En revisión</div></div>' +
          '<div style="background:var(--papel);padding:var(--e5);border-radius:var(--radio)">' +
            '<div style="font-size:32px;font-weight:600;color:var(--estructura)">5</div>' +
            '<div class="menor suave">Borradores</div></div>' +
          '<div style="background:var(--papel);padding:var(--e5);border-radius:var(--radio)">' +
            '<div style="font-size:32px;font-weight:600;color:var(--estructura)">28</div>' +
            '<div class="menor suave">Exportadas este mes</div></div>' +
          '<div style="background:var(--papel);padding:var(--e5);border-radius:var(--radio)">' +
            '<div style="font-size:32px;font-weight:600;color:var(--estructura)">2</div>' +
            '<div class="menor suave">Personas con acceso</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="c-ancho">' +
        '<div class="rejilla12" style="margin-bottom:var(--e7)">' +
          '<div style="grid-column:span 7;border-radius:var(--radio);overflow:hidden">' +
            '<img src="' + FOTO.home + '" alt="Equipo trabajando" style="width:100%;height:260px;object-fit:cover">' +
          '</div>' +
          '<div style="grid-column:span 5;background:var(--estructura);color:#fff;padding:var(--e6);border-radius:var(--radio);display:flex;flex-direction:column;justify-content:center;gap:var(--e3)">' +
            '<span class="etiqueta" style="color:var(--acento-calido)">Empieza aquí</span>' +
            '<h3 style="color:#fff">Web, correo o gráfica</h3>' +
            '<p style="color:var(--claro)">Los tres modos comparten el mismo catálogo de componentes y las mismas exportaciones.</p>' +
            '<button class="cta cta--sobre-azul" style="align-self:flex-start;margin-top:var(--e2)">Elegir modo</button>' +
          '</div>' +
        '</div>' +
        '<div class="fila g4" style="margin-bottom:var(--e4)">' +
          '<h3 class="crece">Últimos movimientos</h3>' +
          '<button class="cta cta--terciario cta--bajo">Ver todos' + ico('flecha', 'ico--16') + '</button>' +
        '</div>' +
        tablaProyectos(5) +
      '</div>';

    return marcoC('inicio', '<button class="cta cta--sobre-azul">' + ico('crear', 'ico--16') + 'Crear</button>', cuerpo);
  }
};
