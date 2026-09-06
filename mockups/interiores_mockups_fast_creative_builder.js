/* ═══════════════════════════════════════════════════════════════════════
   Pantallas interiores. Comparten contenido entre propuestas, pero cada
   una vive dentro de su propio marco, con su densidad y su navegación.
   ═══════════════════════════════════════════════════════════════════════ */

function envolver(prop, cfg) {
  var accion = cfg.accion || '';
  if (prop === 'a') {
    return marcoA(
      cfg.activo,
      cfg.ruta,
      { izq: '<h4>' + esc(cfg.titulo) + '</h4>', der: accion },
      (cfg.bajada ? '<p class="lead" style="margin-bottom:var(--e6);max-width:64ch">' + esc(cfg.bajada) + '</p>' : '') +
        (cfg.pestanas || '') +
        cfg.cuerpo
    );
  }
  if (prop === 'b') {
    var cab =
      '<div class="b-cabecera">' +
        '<div class="crece">' +
          '<span class="etiqueta tenue">' + esc(cfg.ruta_llana || cfg.titulo) + '</span>' +
          '<h1 style="margin-top:8px">' + esc(cfg.titulo) + '</h1>' +
          (cfg.bajada ? '<p class="lead" style="margin-top:var(--e3);max-width:64ch">' + esc(cfg.bajada) + '</p>' : '') +
        '</div>' + accion +
      '</div>';
    return marcoB('' + cfg.activo, cab, '<div class="b-seccion">' + (cfg.pestanas || '') + cfg.cuerpo + '</div>');
  }
  return marcoC(
    cfg.activo,
    accion,
    '<div class="c-ancho">' +
      '<div class="fila g5" style="align-items:flex-end;margin-bottom:var(--e6)">' +
        '<div class="crece"><h2>' + esc(cfg.titulo) + '</h2>' +
        (cfg.bajada ? '<p class="lead" style="margin-top:8px;max-width:64ch">' + esc(cfg.bajada) + '</p>' : '') + '</div>' +
      '</div>' +
      (cfg.pestanas || '') + cfg.cuerpo +
    '</div>'
  );
}

function pestanas(items, activa) {
  return (
    '<div class="fila g1" style="background:var(--paloma);padding:4px;border-radius:var(--radio);margin-bottom:var(--e5);align-self:flex-start;display:inline-flex">' +
    items
      .map(function (t) {
        var on = t === activa;
        return (
          '<span class="cta cta--bajo" style="background:' +
          (on ? 'var(--papel)' : 'transparent') +
          ';color:' + (on ? 'var(--estructura)' : 'var(--tinta-suave)') + '">' + esc(t) + '</span>'
        );
      })
      .join('') +
    '</div>'
  );
}

/* ── Crear ───────────────────────────────────────────────────────────── */

function pCrear(prop) {
  return envolver(prop, {
    activo: 'crear',
    ruta: '<strong>Crear</strong>',
    ruta_llana: 'Crear',
    titulo: 'Elige el modo',
    bajada:
      'Los tres comparten el mismo catálogo de componentes y las mismas exportaciones. Lo que cambia son las reglas de construcción y lo que se puede publicar.',
    cuerpo:
      selectorModos() +
      '<div style="margin-top:var(--e7)">' +
        '<h3 style="margin-bottom:var(--e4)">O duplica algo que ya hiciste</h3>' +
        tablaProyectos(3) +
      '</div>'
  });
}

/* ── Proyectos ───────────────────────────────────────────────────────── */

function pProyectos(prop) {
  var filtros =
    '<div class="fila g3" style="margin-bottom:var(--e4)">' +
      '<div class="b-buscador" style="height:44px;max-width:340px;font-size:14px">' +
        ico('buscar', 'ico--16') + '<span>Buscar por nombre</span></div>' +
      '<button class="cta cta--secundario">' + ico('filtro', 'ico--16') + 'Modo</button>' +
      '<button class="cta cta--secundario">' + ico('filtro', 'ico--16') + 'Estado</button>' +
      '<div class="crece"></div>' +
      '<button class="cta cta--terciario">' + ico('papelera', 'ico--16') + 'Papelera</button>' +
    '</div>';

  return envolver(prop, {
    activo: 'proyectos',
    ruta: '<strong>Proyectos</strong>',
    ruta_llana: 'Proyectos',
    titulo: 'Proyectos',
    bajada: 'Ves solo los tuyos. El administrador ve los de todo el equipo.',
    accion: '<button class="cta cta--principal cta--alto">' + ico('crear', 'ico--16') + 'Crear</button>',
    cuerpo: filtros + tablaProyectos()
  });
}

function pFicha(prop) {
  var cuerpo =
    '<div class="rejilla12">' +
      '<div style="grid-column:span 8;display:flex;flex-direction:column;gap:var(--e5)">' +
        '<div style="border-radius:var(--radio);overflow:hidden;background:var(--papel)">' +
          '<img src="' + FOTO.pieza1 + '" alt="Vista previa de la pieza" style="width:100%;height:280px;object-fit:cover">' +
        '</div>' +
        '<div style="background:var(--papel);border-radius:var(--radio);padding:var(--e5)">' +
          '<h4 style="margin-bottom:var(--e4)">Versiones guardadas</h4>' +
          '<table class="tabla"><tbody>' +
            '<tr><td><b>Antes de cambiar la portada</b><div class="menor tenue">4 sept, 16:20 · Andrés Gamonal</div></td>' +
            '<td style="text-align:right"><button class="cta cta--secundario cta--bajo">Restaurar</button></td></tr>' +
            '<tr><td><b>Primera propuesta</b><div class="menor tenue">3 sept, 11:04 · Andrés Gamonal</div></td>' +
            '<td style="text-align:right"><button class="cta cta--secundario cta--bajo">Restaurar</button></td></tr>' +
          '</tbody></table>' +
        '</div>' +
      '</div>' +
      '<div style="grid-column:span 4;display:flex;flex-direction:column;gap:var(--e4)">' +
        '<div style="background:var(--papel);border-radius:var(--radio);padding:var(--e5)">' +
          '<div class="etiqueta tenue" style="margin-bottom:var(--e3)">Estado</div>' +
          '<span class="pastilla pastilla--exito"><span class="punto"></span>Aprobado</span>' +
          '<p class="menor suave" style="margin-top:var(--e3)">Aprobado por Andrés Gamonal el 4 de septiembre.</p>' +
          '<button class="cta cta--principal cta--ancho" style="margin-top:var(--e4)">' + ico('exportar', 'ico--16') + 'Exportar</button>' +
        '</div>' +
        '<div style="background:var(--papel);border-radius:var(--radio);padding:var(--e5)">' +
          '<div class="etiqueta tenue" style="margin-bottom:var(--e3)">Ficha</div>' +
          '<div class="col g3 menor">' +
            '<div class="fila"><span class="crece suave">Modo</span><b>Web</b></div>' +
            '<div class="fila"><span class="crece suave">Creado</span><b>1 sept 2026</b></div>' +
            '<div class="fila"><span class="crece suave">Editado</span><b>4 sept 2026</b></div>' +
            '<div class="fila"><span class="crece suave">Dueño</span><b>Andrés Gamonal</b></div>' +
            '<div class="fila"><span class="crece suave">Marca</span><b>Zurich</b></div>' +
          '</div>' +
        '</div>' +
        '<div style="background:var(--arenisca);border-radius:var(--radio);padding:var(--e5)">' +
          '<div class="etiqueta" style="margin-bottom:var(--e2)">Exportaciones</div>' +
          '<p class="menor" style="margin-bottom:var(--e4)">HTML completo, fragmento para el gestor de contenidos, JPG y PNG en tres tamaños.</p>' +
          '<button class="cta cta--secundario cta--bajo">Ver historial</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  return envolver(prop, {
    activo: 'proyectos',
    ruta: 'Proyectos <span>›</span> <strong>Seguro de hogar</strong>',
    ruta_llana: 'Proyectos',
    titulo: 'Seguro de hogar — landing de campaña',
    accion: '<button class="cta cta--principal cta--alto">Abrir en el editor</button>',
    cuerpo: cuerpo
  });
}

function pPapelera(prop) {
  var cuerpo =
    '<div class="aviso-barra" style="background:var(--aviso-fondo);color:var(--aviso);padding:var(--e4);border-radius:var(--radio);margin-bottom:var(--e5);display:flex;gap:var(--e3);align-items:center">' +
      ico('reloj', 'ico--16') +
      '<span class="menor">Lo que borres se guarda aquí 30 días. Después se elimina de verdad.</span>' +
    '</div>' +
    '<table class="tabla"><thead><tr><th>Proyecto</th><th>Modo</th><th>Borrado</th><th></th></tr></thead><tbody>' +
      '<tr><td><b>Campaña invierno 2025</b></td><td>Web</td><td class="tenue">28 ago · quedan 21 días</td>' +
      '<td style="text-align:right"><div class="fila g2" style="justify-content:flex-end">' +
        '<button class="cta cta--secundario cta--bajo">' + ico('restaurar', 'ico--16') + 'Restaurar</button>' +
        '<button class="cta cta--peligro cta--bajo">Eliminar</button></div></td></tr>' +
      '<tr><td><b>Prueba de correo</b></td><td>Email</td><td class="tenue">25 ago · quedan 18 días</td>' +
      '<td style="text-align:right"><div class="fila g2" style="justify-content:flex-end">' +
        '<button class="cta cta--secundario cta--bajo">' + ico('restaurar', 'ico--16') + 'Restaurar</button>' +
        '<button class="cta cta--peligro cta--bajo">Eliminar</button></div></td></tr>' +
    '</tbody></table>';

  return envolver(prop, {
    activo: 'proyectos',
    ruta: 'Proyectos <span>›</span> <strong>Papelera</strong>',
    ruta_llana: 'Proyectos',
    titulo: 'Papelera',
    cuerpo: cuerpo
  });
}

/* ── Biblioteca ──────────────────────────────────────────────────────── */

function rejillaMedios() {
  var celdas = '';
  var fotos = [FOTO.pieza1, FOTO.pieza2, FOTO.home, FOTO.loginA, FOTO.loginB, FOTO.loginC];
  for (var i = 0; i < 12; i++) {
    var f = fotos[i % fotos.length];
    celdas +=
      '<figure style="border-radius:var(--radio);overflow:hidden;background:var(--papel)">' +
        '<img src="' + f + '" alt="" style="width:100%;height:132px;object-fit:cover">' +
        '<figcaption class="menor" style="padding:var(--e3)">imagen_' + (i + 1) + '.jpg' +
        '<div class="tenue" style="font-size:12px">1600 × 900 · 240 KB</div></figcaption>' +
      '</figure>';
  }
  return '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--e4)">' + celdas + '</div>';
}

function pBiblioteca(prop, tipo) {
  var tabs = pestanas(['Imágenes', 'Logos', 'Tipografías'], tipo);
  var cuerpo;

  if (tipo === 'Imágenes') {
    cuerpo = rejillaMedios();
  } else if (tipo === 'Logos') {
    cuerpo =
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--e4)">' +
        ['Zurich horizontal', 'Zurich vertical', 'Zurich negativo', 'Isotipo'].map(function (n) {
          return (
            '<figure style="border-radius:var(--radio);overflow:hidden;background:var(--papel)">' +
              '<div style="height:132px;display:grid;place-items:center;background:var(--paloma);color:var(--tinta-tenue)">' +
                ico('logo', 'ico--28') + '</div>' +
              '<figcaption class="menor" style="padding:var(--e3)">' + n +
              '<div class="tenue" style="font-size:12px">SVG · vectorial</div></figcaption>' +
            '</figure>'
          );
        }).join('') +
      '</div>';
  } else {
    cuerpo =
      '<table class="tabla"><thead><tr><th>Familia</th><th>Peso</th><th>Estilo</th><th>Formato</th><th></th></tr></thead><tbody>' +
        '<tr><td><b>Zurich Sans</b></td><td>400 · Regular</td><td>Normal</td><td>WOFF2</td>' +
        '<td style="text-align:right"><button class="cta cta--terciario cta--bajo">Quitar</button></td></tr>' +
        '<tr><td><b>Zurich Sans</b></td><td>500 · Medium</td><td>Normal</td><td>WOFF2</td>' +
        '<td style="text-align:right"><button class="cta cta--terciario cta--bajo">Quitar</button></td></tr>' +
        '<tr><td><b>Zurich Sans</b></td><td>600 · SemiBold</td><td>Normal</td><td>WOFF2</td>' +
        '<td style="text-align:right"><button class="cta cta--terciario cta--bajo">Quitar</button></td></tr>' +
      '</tbody></table>' +
      '<div style="background:var(--arenisca);border-radius:var(--radio);padding:var(--e5);margin-top:var(--e5)">' +
        '<h4 style="margin-bottom:var(--e2)">Sin tipografías propias se usa Arial</h4>' +
        '<p class="menor" style="max-width:60ch">Es lo que autoriza el manual de marca cuando Zurich Sans no está disponible. Las que subas aquí se incrustan en los HTML exportados.</p>' +
      '</div>';
  }

  return envolver(prop, {
    activo: 'biblioteca',
    ruta: 'Biblioteca <span>›</span> <strong>' + tipo + '</strong>',
    ruta_llana: 'Biblioteca',
    titulo: 'Biblioteca',
    bajada: 'Tus materiales. Nadie más los ve, salvo el administrador.',
    accion: '<button class="cta cta--principal cta--alto">' + ico('mas', 'ico--16') + 'Subir</button>',
    pestanas: tabs,
    cuerpo: cuerpo
  });
}

/* ── Configuración ───────────────────────────────────────────────────── */

function pConfigGeneral(prop) {
  var cuerpo =
    '<div class="rejilla12">' +
      '<div style="grid-column:span 7;background:var(--papel);border-radius:var(--radio);padding:var(--e6)">' +
        '<h4 style="margin-bottom:var(--e4)">Marca de las creatividades</h4>' +
        '<div class="col g4">' +
          '<label class="campo"><span class="campo__et">Marca activa</span>' +
            '<select class="campo__in"><option>Zurich</option><option>Añadir otra marca…</option></select>' +
            '<span class="campo__ayuda">Los proyectos nuevos nacen con sus colores y tipografías.</span></label>' +
          '<div>' +
            '<span class="campo__et" style="display:block;margin-bottom:var(--e2)">Paleta</span>' +
            '<div class="fila g2">' +
              ['#2167ae', '#23366f', '#5495cf', '#91bfe3', '#1fb1e6', '#dad2bd', '#fff773', '#19bab6'].map(function (c) {
                return '<span style="width:40px;height:40px;border-radius:var(--radio);background:' + c + '" title="' + c + '"></span>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="grid-column:span 5;display:flex;flex-direction:column;gap:var(--e4)">' +
        '<div style="background:var(--papel);border-radius:var(--radio);padding:var(--e6)">' +
          '<h4 style="margin-bottom:var(--e3)">Dominios permitidos</h4>' +
          '<p class="menor suave" style="margin-bottom:var(--e4)">Sólo se puede insertar contenido de estos servicios.</p>' +
          '<div class="fila g2" style="flex-wrap:wrap">' +
            ['YouTube', 'Vimeo', 'Spotify', 'Power BI', 'Looker Studio', 'Typeform', 'Calendly'].map(function (d) {
              return '<span class="pastilla pastilla--neutra">' + d + '</span>';
            }).join('') +
          '</div>' +
          '<button class="cta cta--secundario cta--bajo" style="margin-top:var(--e4)">' + ico('mas', 'ico--16') + 'Añadir dominio</button>' +
        '</div>' +
        '<div style="background:var(--papel);border-radius:var(--radio);padding:var(--e6)">' +
          '<h4 style="margin-bottom:var(--e3)">Formatos de estilo libre</h4>' +
          '<div class="fila g2" style="flex-wrap:wrap">' +
            ['1080×1080', '1080×1350', '1080×1920', '1200×628', 'Personalizado'].map(function (d) {
              return '<span class="pastilla pastilla--neutra">' + d + '</span>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  return envolver(prop, {
    activo: 'config',
    ruta: 'Configuración <span>›</span> <strong>General</strong>',
    ruta_llana: 'Configuración',
    titulo: 'Configuración',
    pestanas: pestanas(['General', 'Permisos', 'Usuarios'], 'General'),
    cuerpo: cuerpo
  });
}

function pConfigUsuarios(prop) {
  var cuerpo =
    '<table class="tabla"><thead><tr><th>Nombre</th><th>Correo</th><th>Permiso</th><th>Estado</th><th>Último acceso</th><th></th></tr></thead><tbody>' +
      '<tr><td><div class="fila g3"><span class="a-avatar" style="width:32px;height:32px;font-size:12px">AG</span><b>Andrés Gamonal</b></div></td>' +
      '<td class="tenue">andres@zurich.cl</td><td>Administrador</td>' +
      '<td><span class="pastilla pastilla--exito"><span class="punto"></span>Activa</span></td>' +
      '<td class="tenue">Hoy</td><td style="text-align:right"><button class="cta cta--terciario cta--bajo">Editar</button></td></tr>' +
      '<tr><td><div class="fila g3"><span class="a-avatar" style="width:32px;height:32px;font-size:12px;background:var(--acento-frio)">MP</span><b>María Pérez</b></div></td>' +
      '<td class="tenue">maria@zurich.cl</td><td>Usuario</td>' +
      '<td><span class="pastilla pastilla--exito"><span class="punto"></span>Activa</span></td>' +
      '<td class="tenue">Ayer</td><td style="text-align:right"><button class="cta cta--terciario cta--bajo">Editar</button></td></tr>' +
      '<tr><td><div class="fila g3"><span class="a-avatar" style="width:32px;height:32px;font-size:12px;background:var(--paloma);color:var(--tinta-suave)">JS</span><b>Javier Soto</b></div></td>' +
      '<td class="tenue">javier@zurich.cl</td><td>Usuario</td>' +
      '<td><span class="pastilla pastilla--aviso"><span class="punto"></span>Sin entrar</span></td>' +
      '<td class="tenue">—</td><td style="text-align:right"><button class="cta cta--secundario cta--bajo">Reenviar invitación</button></td></tr>' +
    '</tbody></table>';

  return envolver(prop, {
    activo: 'config',
    ruta: 'Configuración <span>›</span> <strong>Usuarios</strong>',
    ruta_llana: 'Configuración',
    titulo: 'Configuración',
    bajada: 'Tres de quince cuentas usadas.',
    accion: '<button class="cta cta--principal cta--alto">' + ico('personas', 'ico--16') + 'Invitar</button>',
    pestanas: pestanas(['General', 'Permisos', 'Usuarios'], 'Usuarios'),
    cuerpo: cuerpo
  });
}

function pConfigPermisos(prop) {
  var cuerpo =
    '<div class="rejilla12">' +
      '<div style="grid-column:span 6;background:var(--papel);border-radius:var(--radio);padding:var(--e6)">' +
        '<h4 style="margin-bottom:var(--e4)">Invitar a alguien</h4>' +
        '<div class="col g4">' +
          campo('Correo', 'email', '') +
          campo('Nombre', 'text', '') +
          '<label class="campo"><span class="campo__et">Permiso</span>' +
            '<select class="campo__in"><option>Usuario</option><option>Administrador</option></select></label>' +
          '<button class="cta cta--principal cta--alto">Enviar invitación</button>' +
        '</div>' +
      '</div>' +
      '<div style="grid-column:span 6;background:var(--estructura);color:#fff;border-radius:var(--radio);padding:var(--e6)">' +
        '<h4 style="color:#fff;margin-bottom:var(--e4)">Qué puede hacer cada permiso</h4>' +
        '<div class="col g4">' +
          '<div><div style="font-weight:600;color:var(--acento-calido);margin-bottom:4px">Administrador</div>' +
          '<p class="menor" style="color:var(--claro)">Ve y administra todo, aprueba, exporta, invita y quita accesos.</p></div>' +
          '<div><div style="font-weight:600;color:var(--acento-calido);margin-bottom:4px">Usuario</div>' +
          '<p class="menor" style="color:var(--claro)">Ve, edita, guarda y exporta sólo sus proyectos. Usa sólo los materiales que él subió.</p></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  return envolver(prop, {
    activo: 'config',
    ruta: 'Configuración <span>›</span> <strong>Permisos</strong>',
    ruta_llana: 'Configuración',
    titulo: 'Configuración',
    pestanas: pestanas(['General', 'Permisos', 'Usuarios'], 'Permisos'),
    cuerpo: cuerpo
  });
}

/* ── Invitación y recuperación ───────────────────────────────────────── */

function pInvitacion(prop) {
  var logo = LOGOS[prop](44, '#2167ae', '#ffffff');
  return (
    '<div class="login login--' + prop + '">' +
      (prop === 'b' ? '<div class="login__visual"><img class="login__foto" src="' + FOTO.loginB + '" alt=""></div>' : '') +
      '<div class="login__panel">' +
        formularioAcceso(
          'Te damos la bienvenida',
          'Estás creando la cuenta de javier@zurich.cl. Elige una contraseña y ya puedes empezar.',
          campo('Tu nombre', 'text', 'Javier Soto') +
            campo('Contraseña', 'password', '', 'Diez caracteres como mínimo, con alguna letra y algún número.') +
            campo('Repite la contraseña', 'password', ''),
          'Guardar y entrar',
          '',
          logo
        ) +
      '</div>' +
      (prop !== 'b'
        ? '<div class="login__visual"><img class="login__foto" src="' + FOTO.loginA + '" alt="">' +
          '<div class="login__mensaje"><span class="etiqueta">Primer acceso</span>' +
          '<p>El enlace caduca en siete días y sólo se puede usar una vez.</p></div></div>'
        : '') +
    '</div>'
  );
}

function pRecuperar(prop) {
  var logo = LOGOS[prop](44, '#2167ae', '#ffffff');
  return (
    '<div class="login login--' + prop + '">' +
      (prop === 'b' ? '<div class="login__visual"><img class="login__foto" src="' + FOTO.loginB + '" alt=""></div>' : '') +
      '<div class="login__panel">' +
        formularioAcceso(
          'Recuperar acceso',
          'Escribe tu correo y te enviamos un enlace para elegir una contraseña nueva.',
          campo('Correo', 'email', ''),
          'Enviarme el enlace',
          '<p class="menor" style="margin-top:var(--e3)"><a href="#" style="color:var(--heroe)">Volver a entrar</a></p>',
          logo
        ) +
      '</div>' +
      (prop !== 'b'
        ? '<div class="login__visual"><img class="login__foto" src="' + FOTO.loginC + '" alt=""></div>'
        : '') +
    '</div>'
  );
}

/* ── Modales ─────────────────────────────────────────────────────────── */

function conModal(fondo, modal) {
  return (
    '<div style="position:relative;height:100%">' + fondo +
    '<div style="position:absolute;inset:0;background:rgba(35,54,111,.45);display:grid;place-items:center;padding:var(--e6)">' +
      modal +
    '</div></div>'
  );
}

function pExportar(prop) {
  var modal =
    '<div style="background:var(--papel);border-radius:var(--radio);width:100%;max-width:720px;overflow:hidden">' +
      '<div style="padding:var(--e5) var(--e6);background:var(--paloma);display:flex;align-items:center">' +
        '<h4 class="crece">Exportar la pieza</h4>' + ico('cerrar') + '</div>' +
      '<div style="padding:var(--e6);display:flex;flex-direction:column;gap:var(--e5)">' +
        '<div>' +
          '<div class="etiqueta tenue" style="margin-bottom:var(--e3)">Formato</div>' +
          '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--e3)">' +
            '<div style="background:var(--estructura);color:#fff;padding:var(--e4);border-radius:var(--radio)">' +
              '<div style="font-weight:600">HTML</div><div class="menor" style="color:var(--claro)">Completo</div></div>' +
            '<div style="background:var(--pagina);padding:var(--e4);border-radius:var(--radio)">' +
              '<div style="font-weight:600">Fragmento</div><div class="menor tenue">Para el CMS</div></div>' +
            '<div style="background:var(--pagina);padding:var(--e4);border-radius:var(--radio)">' +
              '<div style="font-weight:600">JPG</div><div class="menor tenue">Los tres tamaños</div></div>' +
            '<div style="background:var(--pagina);padding:var(--e4);border-radius:var(--radio)">' +
              '<div style="font-weight:600">PNG</div><div class="menor tenue">Con transparencia</div></div>' +
          '</div>' +
        '</div>' +
        '<div style="background:var(--aviso-fondo);color:var(--aviso);padding:var(--e4);border-radius:var(--radio)">' +
          '<div class="fila g3"><span>' + ico('reloj', 'ico--16') + '</span>' +
          '<span class="menor">La portada lleva un carrusel. Antes de capturar, elige qué diapositiva aparece en la imagen.</span></div>' +
        '</div>' +
        '<div>' +
          '<div class="etiqueta tenue" style="margin-bottom:var(--e3)">Estado que se congela</div>' +
          '<div class="fila g2">' +
            '<span class="pastilla pastilla--acento">Diapositiva 1</span>' +
            '<span class="pastilla pastilla--neutra">Diapositiva 2</span>' +
            '<span class="pastilla pastilla--neutra">Diapositiva 3</span>' +
          '</div>' +
        '</div>' +
        '<div class="fila g3"><div class="crece"></div>' +
          '<button class="cta cta--secundario">Cancelar</button>' +
          '<button class="cta cta--principal">Comparar y exportar</button></div>' +
      '</div>' +
    '</div>';
  return conModal(EDITOR[prop]('web'), modal);
}

function pInsercion(prop) {
  var modal =
    '<div style="background:var(--papel);border-radius:var(--radio);width:100%;max-width:640px;overflow:hidden">' +
      '<div style="padding:var(--e5) var(--e6);background:var(--paloma);display:flex;align-items:center">' +
        '<h4 class="crece">Insertar contenido externo</h4>' + ico('cerrar') + '</div>' +
      '<div style="padding:var(--e6);display:flex;flex-direction:column;gap:var(--e5)">' +
        '<label class="campo"><span class="campo__et">Pega lo que sea</span>' +
          '<input class="campo__in" value="https://youtu.be/aB3xK9pQ2Lm">' +
          '<span class="campo__ayuda">Una dirección, un código de inserción o un identificador. Lo reconocemos solo.</span></label>' +
        '<div style="background:var(--exito-fondo);color:var(--exito);padding:var(--e4);border-radius:var(--radio)" class="fila g3">' +
          ico('ojo', 'ico--16') + '<span class="menor"><b>YouTube reconocido.</b> Proporción 16:9 y portada tomada del propio video.</span></div>' +
        '<div>' +
          '<div class="etiqueta tenue" style="margin-bottom:var(--e3)">Respaldo en correo y en imagen</div>' +
          '<p class="menor suave" style="margin-bottom:var(--e3)">Ningún marco insertado sobrevive a un cliente de correo ni a una captura. Elige qué aparece en su lugar.</p>' +
          '<div class="fila g2">' +
            '<span class="pastilla pastilla--acento">Portada enlazada</span>' +
            '<span class="pastilla pastilla--neutra">Imagen propia</span>' +
            '<span class="pastilla pastilla--neutra">Texto enlazado</span></div>' +
        '</div>' +
        '<div class="fila g3"><div class="crece"></div>' +
          '<button class="cta cta--secundario">Cancelar</button>' +
          '<button class="cta cta--principal">Insertar</button></div>' +
      '</div>' +
    '</div>';
  return conModal(EDITOR[prop]('web'), modal);
}

/* ── Índice de pantallas ─────────────────────────────────────────────── */

var PANTALLAS = [
  { id: 'login', n: 'Acceso', ruta: '/login', g: 'Acceso', f: function (p) { return LOGIN[p](); } },
  { id: 'invitacion', n: 'Invitación', ruta: '/invitacion/:token', g: 'Acceso', f: pInvitacion },
  { id: 'recuperar', n: 'Recuperar acceso', ruta: '/recuperar', g: 'Acceso', f: pRecuperar },

  { id: 'home', n: 'Inicio', ruta: '/home', g: 'Trabajo', f: function (p) { return HOME[p](); } },
  { id: 'crear', n: 'Crear', ruta: '/crear', g: 'Trabajo', f: pCrear },
  { id: 'proyectos', n: 'Proyectos', ruta: '/proyectos', g: 'Trabajo', f: pProyectos },
  { id: 'ficha', n: 'Ficha de proyecto', ruta: '/proyectos/:id', g: 'Trabajo', f: pFicha },
  { id: 'papelera', n: 'Papelera', ruta: '/proyectos/papelera', g: 'Trabajo', f: pPapelera },

  { id: 'editor-web', n: 'Editor web', ruta: '/crear/web/:id', g: 'Editor', f: function (p) { return EDITOR[p]('web'); } },
  { id: 'editor-email', n: 'Editor email', ruta: '/crear/email/:id', g: 'Editor', f: function (p) { return EDITOR[p]('email'); } },
  { id: 'editor-libre', n: 'Editor libre', ruta: '/crear/libre/:id', g: 'Editor', f: function (p) { return EDITOR[p]('libre'); } },
  { id: 'exportar', n: 'Exportar', ruta: '/crear/web/:id · modal', g: 'Editor', f: pExportar },
  { id: 'insercion', n: 'Insertar contenido', ruta: '/crear/web/:id · modal', g: 'Editor', f: pInsercion },

  { id: 'bib-img', n: 'Biblioteca · imágenes', ruta: '/biblioteca/imagenes', g: 'Biblioteca', f: function (p) { return pBiblioteca(p, 'Imágenes'); } },
  { id: 'bib-logos', n: 'Biblioteca · logos', ruta: '/biblioteca/logos', g: 'Biblioteca', f: function (p) { return pBiblioteca(p, 'Logos'); } },
  { id: 'bib-tipo', n: 'Biblioteca · tipografías', ruta: '/biblioteca/tipografias', g: 'Biblioteca', f: function (p) { return pBiblioteca(p, 'Tipografías'); } },

  { id: 'cfg-general', n: 'Configuración general', ruta: '/configuracion/general', g: 'Configuración', f: pConfigGeneral },
  { id: 'cfg-permisos', n: 'Permisos', ruta: '/configuracion/permisos', g: 'Configuración', f: pConfigPermisos },
  { id: 'cfg-usuarios', n: 'Usuarios', ruta: '/configuracion/usuarios', g: 'Configuración', f: pConfigUsuarios }
];
