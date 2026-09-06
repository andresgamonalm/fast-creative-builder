/* ═══════════════════════════════════════════════════════════════════════
   Acceso, pantallas interiores y modales
   ═══════════════════════════════════════════════════════════════════════ */

function envolver(prop, cfg) {
  var cabecera =
    '<section class="banda banda--corta banda--' + (cfg.banda || 'hueso') + '">' +
      '<div class="contenedor fila g5 fila--apila" style="align-items:flex-end">' +
        '<div class="crece">' +
          (cfg.migas ? '<span class="etiqueta tenue">' + cfg.migas + '</span>' : '') +
          '<h1 style="margin-top:' + (cfg.migas ? 'var(--e2)' : '0') + '">' + esc(cfg.titulo) + '</h1>' +
          (cfg.bajada ? '<p class="lead" style="margin-top:var(--e3);max-width:60ch">' + esc(cfg.bajada) + '</p>' : '') +
        '</div>' +
        (cfg.accion || '') +
      '</div>' +
    '</section>';

  var contenido =
    cabecera +
    '<section class="banda banda--corta banda--blanca"><div class="contenedor">' +
      (cfg.pestanas || '') + cfg.cuerpo +
    '</div></section>';

  if (prop === 'a') return marcoA(cfg.activo, cfg.titulo, contenido);
  if (prop === 'b') return marcoB(cfg.activo, contenido);
  return marcoC(cfg.activo, contenido);
}

function pestanas(items, activa) {
  return '<div class="fila g1" style="background:var(--banda-hueso);padding:4px;border-radius:var(--pildora);margin-bottom:var(--e6);display:inline-flex">' +
    items.map(function (t) {
      var on = t === activa;
      return '<span class="cta cta--bajo" style="background:' + (on ? 'var(--papel)' : 'transparent') +
        ';color:' + (on ? 'var(--navy)' : 'var(--tinta-suave)') + '">' + esc(t) + '</span>';
    }).join('') + '</div>';
}

function campo(et, tipo, valor, ayuda) {
  return '<label class="campo"><span class="campo__et">' + esc(et) + '</span>' +
    '<input class="campo__in" type="' + tipo + '" value="' + esc(valor || '') + '">' +
    (ayuda ? '<span class="campo__ayuda">' + esc(ayuda) + '</span>' : '') + '</label>';
}

/* ═══ Acceso ════════════════════════════════════════════════════════════
   Página completa, dos zonas, fotografía real en círculo sobre banda
   pastel. Ninguna tarjeta flotando sobre un fondo plano.               */

var VISUAL_LOGIN = {
  a: { clase: 'ambar', foto: 'loginA', alt: 'Persona trabajando en su puesto en casa' },
  b: { clase: 'celeste', foto: 'loginB', alt: 'Dos personas trabajando junto a la ventana' },
  c: { clase: 'rosa', foto: 'loginC', alt: 'Mesa de trabajo con bocetos' }
};

function ladoVisual(prop, mensaje) {
  var v = VISUAL_LOGIN[prop];
  return (
    '<div class="login__visual login__visual--' + v.clase + '">' +
      circuloFoto(FOTO[v.foto], 300, 'var(--papel)') +
      (mensaje
        ? '<div class="login__pie-msg"><span class="etiqueta">' + mensaje.et + '</span>' +
          '<h3 style="margin-top:var(--e2)">' + mensaje.t + '</h3></div>'
        : '') +
    '</div>'
  );
}

function panelAcceso(prop, titulo, intro, campos, boton, pie) {
  return (
    '<div class="login__panel"><div class="login__forma">' +
      '<div style="margin-bottom:var(--e4)">' + LOGOS[prop](46, '#2167ae', '#ffffff') + '</div>' +
      '<h2>' + esc(titulo) + '</h2>' +
      '<p class="suave" style="margin-bottom:var(--e2)">' + esc(intro) + '</p>' +
      campos +
      '<button class="cta cta--principal cta--alto cta--ancho" style="margin-top:var(--e2)">' + esc(boton) + '</button>' +
      (pie || '') +
    '</div></div>'
  );
}

function pLogin(prop) {
  var visual = ladoVisual(prop, { et: 'Una pieza, tres salidas', t: 'Diseña una vez y expórtalo en web, correo y gráfica.' });
  var panel = panelAcceso(prop, 'Entrar', 'Escribe tu correo y tu contraseña.',
    campo('Correo', 'email', 'andres@zurich.cl') + campo('Contraseña', 'password', '••••••••••'),
    'Entrar',
    '<p class="menor" style="margin-top:var(--e3)"><a href="#" style="color:var(--heroe)">¿Olvidaste tu contraseña?</a></p>');
  var orden = prop === 'b' ? visual + panel : panel + visual;
  return '<div class="login login--' + prop + '">' + orden + '</div>';
}

function pInvitacion(prop) {
  var visual = ladoVisual(prop, { et: 'Primer acceso', t: 'El enlace caduca en siete días y sólo se usa una vez.' });
  var panel = panelAcceso(prop, 'Te damos la bienvenida',
    'Estás creando la cuenta de javier@zurich.cl. Elige una contraseña y ya puedes empezar.',
    campo('Tu nombre', 'text', 'Javier Soto') +
      campo('Contraseña', 'password', '', 'Diez caracteres como mínimo, con alguna letra y algún número.') +
      campo('Repite la contraseña', 'password', ''),
    'Guardar y entrar');
  var orden = prop === 'b' ? visual + panel : panel + visual;
  return '<div class="login login--' + prop + '">' + orden + '</div>';
}

function pRecuperar(prop) {
  var visual = ladoVisual(prop, null);
  var panel = panelAcceso(prop, 'Recuperar acceso',
    'Escribe tu correo y te enviamos un enlace para elegir una contraseña nueva.',
    campo('Correo', 'email', ''), 'Enviarme el enlace',
    '<p class="menor" style="margin-top:var(--e3)"><a href="#" style="color:var(--heroe)">Volver a entrar</a></p>');
  var orden = prop === 'b' ? visual + panel : panel + visual;
  return '<div class="login login--' + prop + '">' + orden + '</div>';
}

/* ═══ Crear ═════════════════════════════════════════════════════════════ */

function pCrear(prop) {
  return envolver(prop, {
    activo: 'inicio', banda: 'hueso', titulo: 'Elige el modo',
    bajada: 'Los tres comparten el mismo catálogo y las mismas exportaciones. Lo que cambia son las reglas de construcción.',
    cuerpo: selectorModos() +
      '<div style="margin-top:var(--e8)"><h3 style="margin-bottom:var(--e5)">O duplica algo que ya hiciste</h3>' + tablaProyectos(3) + '</div>'
  });
}

/* ═══ Proyectos ═════════════════════════════════════════════════════════ */

function pProyectos(prop) {
  var filtros =
    '<div class="fila g3 fila--apila" style="margin-bottom:var(--e5);flex-wrap:wrap">' +
      '<div class="b-buscador" style="height:44px;max-width:320px;font-size:14px">' + ico('buscar', 'ico--16') + '<span>Buscar por nombre</span></div>' +
      '<button class="cta cta--secundario">Modo' + ico('abajo', 'ico--16') + '</button>' +
      '<button class="cta cta--secundario">Estado' + ico('abajo', 'ico--16') + '</button>' +
      '<div class="crece"></div>' +
      '<button class="cta cta--terciario">' + ico('papelera', 'ico--16') + 'Papelera</button>' +
    '</div>';
  return envolver(prop, {
    activo: 'proyectos', banda: 'celeste', titulo: 'Proyectos',
    bajada: 'Ves solo los tuyos. El administrador ve los de todo el equipo.',
    cuerpo: filtros + tablaProyectos()
  });
}

function pFicha(prop) {
  var cuerpo =
    '<div class="rejilla12">' +
      '<div style="grid-column:span 8" class="col g5">' +
        '<img src="' + FOTO.pieza1 + '" alt="Vista previa" style="width:100%;height:300px;object-fit:cover;border-radius:var(--radio)">' +
        '<div><h4 style="margin-bottom:var(--e4)">Versiones guardadas</h4>' +
          '<table class="tabla"><tbody>' +
            '<tr><td data-et="Versión"><b>Antes de cambiar la portada</b><div class="micro tenue">4 sept, 16:20 · Andrés Gamonal</div></td>' +
            '<td><button class="cta cta--bajo cta--secundario">Restaurar</button></td></tr>' +
            '<tr><td data-et="Versión"><b>Primera propuesta</b><div class="micro tenue">3 sept, 11:04 · Andrés Gamonal</div></td>' +
            '<td><button class="cta cta--bajo cta--secundario">Restaurar</button></td></tr>' +
          '</tbody></table></div>' +
      '</div>' +
      '<div style="grid-column:span 4" class="col g4">' +
        '<div style="background:var(--banda-menta);border-radius:var(--radio);padding:var(--e5)">' +
          '<span class="etiqueta">Estado</span>' +
          '<h4 style="margin:var(--e2) 0 var(--e2);font-weight:400;font-size:22px">Aprobado</h4>' +
          '<p class="micro suave" style="margin-bottom:var(--e4)">Por Andrés Gamonal el 4 de septiembre.</p>' +
          '<button class="cta cta--conversion cta--ancho">' + ico('exportar', 'ico--16') + 'Exportar</button></div>' +
        '<div style="background:var(--banda-hueso);border-radius:var(--radio);padding:var(--e5)">' +
          '<span class="etiqueta tenue">Ficha</span>' +
          '<div class="col g3 menor" style="margin-top:var(--e3)">' +
            [['Modo','Web'],['Creado','1 sept 2026'],['Editado','4 sept 2026'],['Dueño','Andrés Gamonal'],['Marca','Zurich']]
              .map(function (r) { return '<div class="fila"><span class="crece suave">' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('') +
          '</div></div>' +
      '</div>' +
    '</div>';
  return envolver(prop, {
    activo: 'proyectos', banda: 'hueso', migas: 'Proyectos',
    titulo: 'Seguro de hogar — landing de campaña',
    accion: '<button class="cta cta--principal cta--alto">Abrir en el editor</button>',
    cuerpo: cuerpo
  });
}

function pPapelera(prop) {
  var cuerpo =
    '<div style="background:var(--banda-arenisca);padding:var(--e4) var(--e5);border-radius:var(--radio);margin-bottom:var(--e5)" class="fila g3">' +
      ico('reloj', 'ico--16') + '<span class="menor">Lo que borras se guarda 30 días. Después se elimina de verdad.</span></div>' +
    '<table class="tabla"><thead><tr><th>Proyecto</th><th>Modo</th><th>Borrado</th><th></th></tr></thead><tbody>' +
      '<tr><td data-et="Proyecto"><b>Campaña invierno 2025</b></td><td data-et="Modo">Web</td>' +
      '<td data-et="Borrado" class="tenue">28 ago · quedan 21 días</td>' +
      '<td><div class="fila g2"><button class="cta cta--bajo cta--secundario">' + ico('restaurar', 'ico--16') + 'Restaurar</button>' +
      '<button class="cta cta--bajo cta--peligro">Eliminar</button></div></td></tr>' +
      '<tr><td data-et="Proyecto"><b>Prueba de correo</b></td><td data-et="Modo">Email</td>' +
      '<td data-et="Borrado" class="tenue">25 ago · quedan 18 días</td>' +
      '<td><div class="fila g2"><button class="cta cta--bajo cta--secundario">' + ico('restaurar', 'ico--16') + 'Restaurar</button>' +
      '<button class="cta cta--bajo cta--peligro">Eliminar</button></div></td></tr>' +
    '</tbody></table>';
  return envolver(prop, { activo: 'proyectos', banda: 'hueso', migas: 'Proyectos', titulo: 'Papelera', cuerpo: cuerpo });
}

/* ═══ Biblioteca ════════════════════════════════════════════════════════ */

function pBiblioteca(prop, tipo) {
  var cuerpo;
  if (tipo === 'Imágenes') {
    var fotos = [FOTO.pieza1, FOTO.pieza2, FOTO.home, FOTO.loginA, FOTO.loginB, FOTO.loginC];
    var celdas = '';
    for (var i = 0; i < 12; i++) {
      celdas += '<figure style="border-radius:var(--radio);overflow:hidden;background:var(--banda-hueso)">' +
        '<img src="' + fotos[i % fotos.length] + '" alt="" style="width:100%;height:140px;object-fit:cover">' +
        '<figcaption class="menor" style="padding:var(--e3)">imagen_' + (i + 1) + '.jpg' +
        '<div class="micro tenue">1600 × 900 · 240 KB</div></figcaption></figure>';
    }
    cuerpo = '<div class="cuadro-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--e4)">' + celdas + '</div>';
  } else if (tipo === 'Logos') {
    cuerpo = '<div class="cuadro-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--e4)">' +
      ['Zurich horizontal', 'Zurich vertical', 'Zurich negativo', 'Isotipo'].map(function (n) {
        return '<figure style="border-radius:var(--radio);overflow:hidden;background:var(--banda-hueso)">' +
          '<div style="height:140px;display:grid;place-items:center;background:var(--banda-paloma);color:var(--tinta-suave)">' +
          ico('logo', 'ico--28') + '</div>' +
          '<figcaption class="menor" style="padding:var(--e3)">' + n +
          '<div class="micro tenue">SVG · vectorial</div></figcaption></figure>';
      }).join('') + '</div>';
  } else {
    cuerpo = '<table class="tabla"><thead><tr><th>Familia</th><th>Peso</th><th>Formato</th><th></th></tr></thead><tbody>' +
      [['400 · Regular'], ['500 · Medium'], ['600 · SemiBold']].map(function (r) {
        return '<tr><td data-et="Familia"><b>Zurich Sans</b></td><td data-et="Peso">' + r[0] + '</td>' +
          '<td data-et="Formato">WOFF2</td><td><button class="cta cta--bajo cta--terciario">Quitar</button></td></tr>';
      }).join('') + '</tbody></table>' +
      '<div style="background:var(--banda-arenisca);border-radius:var(--radio);padding:var(--e6);margin-top:var(--e5)">' +
      '<h4 style="margin-bottom:var(--e2)">Sin tipografías propias se usa Arial</h4>' +
      '<p class="menor suave" style="max-width:60ch">Es lo que autoriza el manual de marca cuando Zurich Sans no está disponible. Las que subas aquí se incrustan en los HTML exportados.</p></div>';
  }

  return envolver(prop, {
    activo: 'biblioteca', banda: 'rosa', titulo: 'Biblioteca',
    bajada: 'Tus materiales. Nadie más los ve, salvo el administrador.',
    accion: '<button class="cta cta--principal cta--alto">' + ico('mas', 'ico--16') + 'Subir</button>',
    pestanas: pestanas(['Imágenes', 'Logos', 'Tipografías'], tipo),
    cuerpo: cuerpo
  });
}

/* ═══ Configuración ═════════════════════════════════════════════════════ */

function pConfigGeneral(prop) {
  var cuerpo =
    '<div class="rejilla12">' +
      '<div style="grid-column:span 7;background:var(--banda-hueso);border-radius:var(--radio);padding:var(--e6)">' +
        '<h4 style="margin-bottom:var(--e5)">Marca de las creatividades</h4>' +
        '<div class="col g5">' +
          '<label class="campo"><span class="campo__et">Marca activa</span>' +
            '<select class="campo__in"><option>Zurich</option><option>Añadir otra marca…</option></select>' +
            '<span class="campo__ayuda">Los proyectos nuevos nacen con sus colores y tipografías.</span></label>' +
          '<div><span class="campo__et" style="display:block;margin-bottom:var(--e2)">Paleta</span>' +
            '<div class="fila g2" style="flex-wrap:wrap">' +
              ['#2167ae','#23366f','#5495cf','#91bfe3','#ffc5ea','#a6e9ab','#e4b273','#dad2bd','#fff773','#cc4038']
                .map(function (c) { return '<span class="muestra" style="background:' + c + '" title="' + c + '"></span>'; }).join('') +
            '</div></div>' +
        '</div>' +
      '</div>' +
      '<div style="grid-column:span 5" class="col g4">' +
        '<div style="background:var(--banda-paloma);border-radius:var(--radio);padding:var(--e6)">' +
          '<h4 style="margin-bottom:var(--e2)">Dominios permitidos</h4>' +
          '<p class="menor" style="margin-bottom:var(--e4)">Sólo se puede insertar contenido de estos servicios.</p>' +
          '<div class="fila g2" style="flex-wrap:wrap">' +
            ['YouTube','Vimeo','Spotify','Power BI','Looker Studio','Typeform','Calendly'].map(function (d) {
              return '<span class="pastilla" style="background:var(--papel);color:var(--navy)">' + d + '</span>';
            }).join('') + '</div>' +
          '<button class="cta cta--secundario cta--bajo" style="margin-top:var(--e4)">' + ico('mas', 'ico--16') + 'Añadir</button></div>' +
        '<div style="background:var(--banda-hueso);border-radius:var(--radio);padding:var(--e6)">' +
          '<h4 style="margin-bottom:var(--e3)">Formatos de estilo libre</h4>' +
          '<div class="fila g2" style="flex-wrap:wrap">' +
            ['1080×1080','1080×1350','1080×1920','1200×628','Personalizado'].map(function (d) {
              return '<span class="pastilla pastilla--neutra">' + d + '</span>'; }).join('') + '</div></div>' +
      '</div>' +
    '</div>';
  return envolver(prop, {
    activo: 'config', banda: 'arenisca', titulo: 'Configuración',
    pestanas: pestanas(['General', 'Permisos', 'Usuarios'], 'General'), cuerpo: cuerpo
  });
}

function pConfigUsuarios(prop) {
  var gente = [
    ['AG', 'Andrés Gamonal', 'andres@zurich.cl', 'Administrador', 'exito', 'Activa', 'Hoy'],
    ['MP', 'María Pérez', 'maria@zurich.cl', 'Usuario', 'exito', 'Activa', 'Ayer'],
    ['JS', 'Javier Soto', 'javier@zurich.cl', 'Usuario', 'aviso', 'Sin entrar', '—']
  ];
  var cuerpo = '<table class="tabla"><thead><tr><th>Nombre</th><th>Correo</th><th>Permiso</th><th>Estado</th><th>Último acceso</th><th></th></tr></thead><tbody>' +
    gente.map(function (g) {
      return '<tr><td data-et="Nombre"><div class="fila g3"><span class="avatar" style="width:32px;height:32px;font-size:12px">' + g[0] + '</span><b>' + g[1] + '</b></div></td>' +
        '<td data-et="Correo" class="tenue">' + g[2] + '</td><td data-et="Permiso">' + g[3] + '</td>' +
        '<td data-et="Estado"><span class="pastilla pastilla--' + g[4] + '"><span class="punto"></span>' + g[5] + '</span></td>' +
        '<td data-et="Último acceso" class="tenue">' + g[6] + '</td>' +
        '<td><button class="cta cta--bajo cta--secundario">' + (g[5] === 'Sin entrar' ? 'Reenviar' : 'Editar') + '</button></td></tr>';
    }).join('') + '</tbody></table>';
  return envolver(prop, {
    activo: 'config', banda: 'arenisca', titulo: 'Configuración', bajada: 'Tres de quince cuentas usadas.',
    accion: '<button class="cta cta--principal cta--alto">' + ico('personas', 'ico--16') + 'Invitar</button>',
    pestanas: pestanas(['General', 'Permisos', 'Usuarios'], 'Usuarios'), cuerpo: cuerpo
  });
}

function pConfigPermisos(prop) {
  var cuerpo =
    '<div class="rejilla12">' +
      '<div style="grid-column:span 6;background:var(--banda-hueso);border-radius:var(--radio);padding:var(--e6)">' +
        '<h4 style="margin-bottom:var(--e5)">Invitar a alguien</h4>' +
        '<div class="col g4">' + campo('Correo', 'email', '') + campo('Nombre', 'text', '') +
          '<label class="campo"><span class="campo__et">Permiso</span>' +
          '<select class="campo__in"><option>Usuario</option><option>Administrador</option></select></label>' +
          '<button class="cta cta--principal cta--alto">Enviar invitación</button></div></div>' +
      '<div style="grid-column:span 6;background:var(--banda-menta);border-radius:var(--radio);padding:var(--e6)">' +
        '<h4 style="margin-bottom:var(--e5)">Qué puede hacer cada permiso</h4>' +
        '<div class="col g5">' +
          '<div><div style="font-weight:600;margin-bottom:4px">Administrador</div>' +
          '<p class="menor suave">Ve y administra todo, aprueba, exporta, invita y quita accesos.</p></div>' +
          '<div><div style="font-weight:600;margin-bottom:4px">Usuario</div>' +
          '<p class="menor suave">Ve, edita, guarda y exporta sólo sus proyectos. Usa sólo los materiales que él subió.</p></div>' +
        '</div></div>' +
    '</div>';
  return envolver(prop, {
    activo: 'config', banda: 'arenisca', titulo: 'Configuración',
    pestanas: pestanas(['General', 'Permisos', 'Usuarios'], 'Permisos'), cuerpo: cuerpo
  });
}

/* ═══ Modales ═══════════════════════════════════════════════════════════ */

function conModal(fondo, modal) {
  return '<div style="position:relative;height:100%;overflow:hidden">' + fondo +
    '<div style="position:absolute;inset:0;background:rgba(35,54,111,.5);display:grid;place-items:center;padding:var(--e6)">' +
    modal + '</div></div>';
}

function pExportar(prop) {
  var modal =
    '<div style="background:var(--papel);border-radius:var(--radio);width:100%;max-width:720px;overflow:hidden">' +
      '<div style="padding:var(--e5) var(--e6);background:var(--banda-hueso)" class="fila">' +
        '<h4 class="crece">Exportar la pieza</h4>' + ico('cerrar') + '</div>' +
      '<div style="padding:var(--e6)" class="col g5">' +
        '<div><div class="etiqueta tenue" style="margin-bottom:var(--e3)">Formato</div>' +
          '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--e3)">' +
            [['HTML','Completo',1],['Fragmento','Para el CMS',0],['JPG','Tres tamaños',0],['PNG','Con transparencia',0]]
              .map(function (f) {
                return '<div style="background:' + (f[2] ? 'var(--banda-celeste)' : 'var(--banda-hueso)') + ';padding:var(--e4);border-radius:var(--radio)">' +
                  '<div style="font-weight:600">' + f[0] + '</div><div class="micro suave">' + f[1] + '</div></div>';
              }).join('') + '</div></div>' +
        '<div style="background:var(--banda-arenisca);padding:var(--e4);border-radius:var(--radio)" class="fila g3">' +
          ico('reloj', 'ico--16') + '<span class="menor">La portada lleva un carrusel. Elige qué diapositiva se congela en la imagen.</span></div>' +
        '<div><div class="etiqueta tenue" style="margin-bottom:var(--e3)">Estado que se congela</div>' +
          '<div class="opciones"><span class="opcion opcion--on">Diapositiva 1</span>' +
          '<span class="opcion">Diapositiva 2</span><span class="opcion">Diapositiva 3</span></div></div>' +
        '<div class="fila g3"><div class="crece"></div><button class="cta cta--secundario">Cancelar</button>' +
          '<button class="cta cta--conversion">Comparar y exportar</button></div>' +
      '</div></div>';
  return conModal(EDITOR[prop]('web'), modal);
}

function pInsercion(prop) {
  var modal =
    '<div style="background:var(--papel);border-radius:var(--radio);width:100%;max-width:620px;overflow:hidden">' +
      '<div style="padding:var(--e5) var(--e6);background:var(--banda-hueso)" class="fila">' +
        '<h4 class="crece">Insertar contenido externo</h4>' + ico('cerrar') + '</div>' +
      '<div style="padding:var(--e6)" class="col g5">' +
        campo('Pega lo que sea', 'text', 'https://youtu.be/aB3xK9pQ2Lm') +
        '<p class="campo__ayuda" style="margin-top:-12px">Una dirección, un código de inserción o un identificador. Lo reconocemos solo.</p>' +
        '<div style="background:var(--banda-menta);padding:var(--e4);border-radius:var(--radio)" class="fila g3">' +
          ico('ojo', 'ico--16') + '<span class="menor"><b>YouTube reconocido.</b> Proporción 16:9 y portada tomada del propio video.</span></div>' +
        '<div><div class="etiqueta tenue" style="margin-bottom:var(--e2)">Respaldo en correo y en imagen</div>' +
          '<p class="menor suave" style="margin-bottom:var(--e3)">Ningún marco insertado sobrevive a un cliente de correo ni a una captura.</p>' +
          '<div class="opciones"><span class="opcion opcion--on">Portada enlazada</span>' +
          '<span class="opcion">Imagen propia</span><span class="opcion">Texto enlazado</span></div></div>' +
        '<div class="fila g3"><div class="crece"></div><button class="cta cta--secundario">Cancelar</button>' +
          '<button class="cta cta--principal">Insertar</button></div>' +
      '</div></div>';
  return conModal(EDITOR[prop]('web'), modal);
}

/* ═══ Índice ════════════════════════════════════════════════════════════ */

var PANTALLAS = [
  { id: 'login', n: 'Acceso', ruta: '/login', g: 'Acceso', f: pLogin },
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
