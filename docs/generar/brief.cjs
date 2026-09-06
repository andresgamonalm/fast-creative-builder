const fs = require('fs');
const path = require('path');
const { Document, Packer } = require('docx');
const C = require('./comun.cjs');
const { p, pm, h1, h2, h3, etiqueta, vinieta, vm, numerada, salto, recuadro, tabla, numeracion, portada, seccion } = C;

const hijos = [
  ...portada(
    'Brief final',
    'Fast Creative Builder',
    [
      'Constructor visual para key visuals, gráficas digitales, landing pages y email marketing.',
      'Versión 7. Reemplaza a todas las anteriores e incorpora las correcciones del 6 de septiembre.',
      'Destino: fast-creative-builder.gamonal.app'
    ]
  ),
  salto(),

  /* ══════════════ 1 · INSTRUCCIONES ══════════════ */
  h1('1. Instrucciones'),

  p('Este documento es el contrato funcional del aplicativo. Manda sobre cualquier versión anterior del brief y sobre cualquier decisión que no esté escrita aquí.'),

  h2('1.1 Antes de escribir una sola línea'),

  numerada([{ text: 'Lee los skills obligatorios y aplícalos. ', bold: true }, { text: 'No es opcional y saltárselos ya costó rehacer la interfaz entera dos veces.' }].map((x) => x)),
  vm([['reglas-creacion-aplicativos', true], ' — producto, arquitectura, rutas, archivos, entregables, documentación, pruebas y entrega. Incluye su anexo obligatorio de complementos.'], 1),
  vm([['ui-ux-aplicativos-gamonal', true], ' — layout, navegación, componentes, formularios, tablas, responsive, accesibilidad y auditoría.'], 1),
  vm([['lineamientos-marca-gamonal', true], ' — estructura, composición, personalidad, sistema de CTA y prohibiciones. Manda la dirección visual.'], 1),
  vm([['lineamientos-marca-zurich', true], ' — de aquí salen únicamente el color y la tipografía, mapeados a los roles de Gamonal.'], 1),
  vm([['movimiento-interacciones-gamonal', true], ' — sólo cuando haya animación, gesto o microinteracción.'], 1),

  numerada([{ text: 'Lee el registro de decisiones. ' , bold: true}, { text: 'DECISIONES-VISUALES.md lleva dieciocho decisiones vigentes con lo que ya fue rechazado. Volver a proponer algo marcado como rechazado es un error.' }]),
  numerada([{ text: 'Lee el documento de traspaso. ', bold: true }, { text: 'documentacion_general_tecnica_fast_creative_builder.docx tiene la historia completa, el estado del código y lo que falta.' }]),

  h2('1.2 Cómo se trabaja'),

  vm([['La dirección visual la manda Gamonal; Zurich aporta color y tipografía.', true], ' Nunca al revés.']),
  vm([['Tres propuestas antes de implementar cualquier rediseño amplio.', true], ' Materialmente distintas en navegación, composición, densidad, interacción e identidad. No la misma pantalla con otro color.']),
  vm([['Verifica con números, no a ojo.', true], ' Todo par de texto y fondo se calcula. Todo botón se comprueba contra su banda. El desborde en móvil se mide recorriendo el DOM, no mirando una captura.']),
  vm([['El usuario no toca la consola.', true], ' Instalar, configurar, compilar, arrancar y empaquetar es responsabilidad de quien desarrolla. Toda entrega se abre con doble clic o con una URL.']),
  vm([['Ningún control decorativo.', true], ' Si un campo aparece en la interfaz, funciona, guarda su estado y admite deshacer.']),
  vm([['Una entrega no está lista hasta abrirla y recorrerla.', true], ' En escritorio, tableta y móvil.']),

  h2('1.3 Las tres reglas innegociables del producto'),

  recuadro('Cero espaciado automático', [
    'Todo nodo nuevo nace con margen, relleno y separación en cero. Ningún componente, ninguna plantilla y ningún reset introduce espacio que el usuario no pueda ver y editar.',
    ['En el modelo de datos, ', ['0', true], ' es un valor explícito, ', ['auto', true], ' es una regla y la propiedad ausente significa heredado. La interfaz y los datos nunca los confunden.']
  ], C.ARENISCA),

  recuadro('La superposición no empuja', [
    'Un elemento colocado sobre otro pertenece a la capa superpuesta de su padre. No crea filas, no desplaza hermanos y no aumenta la altura del contenedor.',
    'Sus coordenadas son relativas al padre, nunca a la página. Al soltar sobre un componente, el editor pregunta «insertar dentro» o «superponer»; nunca decide solo.'
  ], C.MENTA),

  recuadro('Un solo motor de render', [
    'Las funciones de render son puras: reciben un nodo y devuelven una cadena. Viven en el núcleo y las consumen por igual el editor, el exportador de HTML y el rasterizador.',
    'No existe una segunda implementación en ningún sitio. El aplicativo anterior tenía tres y ya divergían entre sí.'
  ], C.ROSA),

  salto(),

  /* ══════════════ 2 · MEJORAS CLAVE ══════════════ */
  h1('2. Mejoras clave del aplicativo'),

  p('Fast Creative Builder nace para resolver lo que el aplicativo anterior no resolvía. Estas son las diferencias que justifican rehacerlo desde cero, no parchearlo.'),

  h2('2.1 Frente al aplicativo anterior'),

  tabla(
    ['Asunto', 'Antes', 'Ahora'],
    [
      ['Modelo de datos', 'Lista plana. Un bloque era una caja negra de un solo nivel: no se podía meter un botón dentro de un hero.', 'Árbol recursivo con ranuras. Cualquier componente admite hijos según su anatomía.'],
      ['Espaciado', 'Cada bloque inyectaba márgenes de 64 y 24 píxeles que el usuario no puso y no podía editar.', 'Todo nace en cero. Si hay separación, está escrita y es visible en el inspector.'],
      ['Superposición', 'No existía. Todo era flujo vertical.', 'Capa superpuesta por componente, con coordenadas relativas al padre.'],
      ['Motor de render', 'Tres implementaciones distintas, ya divergidas. Un elemento se componía y desaparecía al publicar.', 'Uno solo, compartido por editor, exportador y rasterizador.'],
      ['Catálogo', '57 componentes como 53 casos de switch repartidos en tres archivos.', '65 componentes declarados como datos. El inspector se genera del manifiesto.'],
      ['Edición', 'Todo pasaba por el panel de propiedades.', 'Se escribe sobre el lienzo. El panel es secundario.'],
      ['Reglas', 'No había.', 'Reglas que miden la pieza, con cotas y lectura en píxeles reales.'],
      ['Archivos', 'Ninguno. Todas las imágenes eran URLs pegadas a mano.', 'Biblioteca de logos, imágenes y tipografías con subida real.'],
      ['Permisos', 'La lista de administradores estaba en el HTML del navegador y ningún endpoint la comprobaba.', 'Rol verificado en el servidor, en el enrutador, antes de llegar a ninguna ruta.'],
      ['Borrado', 'Físico y sin retorno. Dejaba versiones huérfanas.', 'Papelera con restauración a 30 días.'],
      ['Marca', 'La paleta de un cliente concreto cableada en el motor.', 'Sistema de tokens multimarca. Ningún color escrito a mano en los componentes.'],
      ['Salidas', 'Sólo HTML, y con la canónica apuntando a otro dominio.', 'HTML, fragmento encapsulado para el gestor de contenidos, JPG y PNG.']
    ],
    [16, 42, 42]
  ),

  h2('2.2 Lo que el producto hace y nadie más hacía'),

  h3('Edición directa sobre el lienzo'),
  p('El cursor entra en el texto y se teclea. Lo que se cambia a menudo —tamaño, peso, alineación, color, enlace— vive en una barra flotante pegada a la selección. El mapa de caja y los valores exactos quedan detrás de «Avanzado», para quien los busque.'),

  h3('Reglas en píxeles reales'),
  p('Regla horizontal y vertical en los tres editores. Miden la pieza, no la pantalla: si el lienzo se reduce para caber, la regla se reduce con él y la cifra sigue siendo el píxel real de la pieza. El paso se adapta para que las marcas nunca queden a menos de cinco píxeles en pantalla. La extensión de lo seleccionado se marca sobre la propia regla, y hay lectura de posición y tamaño, cotas de distancia entre elementos y guías arrastrables.'),

  h3('Un formato único de inserción'),
  p('Un solo campo donde se pega lo que sea —una dirección, un iframe, un código de inserción, un identificador— y el sistema reconoce el servicio, deriva la URL canónica, aplica la proporción y busca la miniatura. Los proveedores son datos, no código: añadir uno nuevo es escribir un manifiesto.'),

  h3('Respaldo obligatorio'),
  p('Ningún marco insertado sobrevive a un cliente de correo ni a una captura de pantalla. Por eso toda inserción exige portada de respaldo, y el aplicativo no deja exportar sin ella. Lo mismo con los estados: antes de rasterizar se elige qué diapositiva, pestaña o panel se congela.'),

  h3('Fragmento para el gestor de contenidos'),
  p('Cuarto formato de salida, además de HTML completo, JPG y PNG. Entrega el marcado sin envoltorio, el CSS encapsulado bajo un contenedor raíz con las clases prefijadas, y el JavaScript sin variables globales y tolerante a varias instancias en la misma página. Pensado para que la pieza conviva dentro de Sitecore sin que su CSS arrase con el del sitio ni al revés.'),

  h3('Tres modos, un solo catálogo'),
  p('Web, email y estilo libre comparten los mismos 65 componentes y las mismas exportaciones. Lo que cambia son las reglas de construcción. Si el correo no admite una interacción, el mismo componente ofrece una salida estática o enlazada; no desaparece del editor.'),

  salto(),

  /* ══════════════ 3 · DECISIONES ══════════════ */
  h1('3. Decisiones tomadas'),

  tabla(
    ['#', 'Tema', 'Decisión'],
    [
      ['1', 'Punto de partida', 'Proyecto nuevo. Repositorio Git privado desde el primer commit.'],
      ['2', 'Aplicativo anterior', 'Eliminado por completo, junto con todo rastro del cliente cuya marca estaba cableada en el motor.'],
      ['3', 'Marca', 'Zurich es la base de las creatividades y de la interfaz. El motor es multimarca.'],
      ['4', 'Tipografías', 'Zurich Sans y Arial. El aplicativo incluye subida de tipografías propias.'],
      ['5', 'Desarrollo', 'Se construye y valida en local. Aprobado, se entrega para GitHub y Cloudflare. La subida la hace el usuario.'],
      ['6', 'Dominio', 'fast-creative-builder.gamonal.app'],
      ['7', 'Acceso', 'Invitación por correo. El administrador crea la cuenta, la persona define su contraseña.'],
      ['8', 'Escala', 'Máximo quince usuarios.'],
      ['9', 'Biblioteca', 'Logos, imágenes y tipografías. Los iconos son un set del sistema; los videos se enlazan.'],
      ['10', 'Materiales', 'Sin capa compartida. Cada usuario ve solo lo suyo; el administrador ve todo.'],
      ['11', 'SEO y GEO', 'Sí, para el modo web.'],
      ['12', 'Prioridad de salida', 'El HTML manda. JPG y PNG se resuelven sin coste, con las limitaciones declaradas.'],
      ['13', 'Papelera', 'Sí, con restauración a treinta días.'],
      ['14', 'Modo oscuro', 'Sí, en la interfaz del aplicativo, sobre neutros oscuros y nunca azul sobre azul.'],
      ['15', 'Idioma', 'Sólo español.'],
      ['16', 'Plantillas', 'Fuera por ahora.'],
      ['17', 'Contenido dinámico y A/B', 'Fuera por ahora.'],
      ['18', 'Formularios', 'Externos. El aplicativo garantiza que se puedan insertar.'],
      ['19', 'Mapa', 'OpenStreetMap con Leaflet, sin clave de pago.'],
      ['20', 'Video', 'Pierde la fuente «archivo». Quedan YouTube, Vimeo y portada enlazada.'],
      ['21', 'Audio y pódcast', 'Se añade al catálogo.'],
      ['22', 'Inserción externa', 'Un formato único para todos los servicios.'],
      ['23', 'Sitecore', 'Se añade el modo de exportación Fragmento.'],
      ['24', 'Interfaz', 'Tres propuestas de mockup antes de implementar. Pendiente de elección.']
    ],
    [5, 24, 71]
  ),

  salto(),

  /* ══════════════ 4 · SISTEMA VISUAL ══════════════ */
  h1('4. Sistema visual'),

  p('La dirección se tomó de zurich.cl, que es la referencia que entregó el usuario, y se leyó así: la página no es azul sobre azul, sino bandas pastel a todo el ancho con mucho aire; el azul saturado se reserva para los botones y los datos; el lenguaje de formas son círculos, con la fotografía enmascarada y burbujas superpuestas; los botones son píldora; y los titulares son grandes y de peso normal.'),

  h2('4.1 Color'),

  tabla(
    ['Rol', 'Valor', 'Uso'],
    [
      ['Azul héroe', '#2167AE', 'Botones, enlaces, cifras. Visibilidad constante, como exige el brandbook.'],
      ['Azul oscuro', '#23366F', 'Texto y titulares sobre cualquier banda. Barras y laterales.'],
      ['Banda rosa', '#FFC5EA', 'Fondo de sección. 7,89 con titular navy.'],
      ['Banda celeste', '#91BFE3', 'Fondo de sección. 5,89. No admite botones.'],
      ['Banda menta', '#A6E9AB', 'Fondo de sección. 8,13.'],
      ['Banda ámbar', '#E4B273', 'Fondo de sección. 5,97.'],
      ['Banda arenisca', '#DAD2BD', 'Fondo de sección. 7,62.'],
      ['Banda hueso', '#ECEEEF', 'Fondo neutro. 9,87. Sólo pantalla, prohibido en impresión.'],
      ['Lima', '#FFF773', 'Acento sobre fondo oscuro. 10,28.'],
      ['Coral', '#CC4038', 'Acción de conversión. El coral de campaña de Zurich, #F16F6D, da 2,90 con texto blanco y no cumple AA; se oscurece hasta 4,82.']
    ],
    [20, 16, 64]
  ),

  h3('Qué botón admite cada banda'),
  p('Tabla calculada, no estimada. Dos condiciones a la vez: separación mínima de 3:1 entre el botón y su fondo, y familias cromáticas distintas, que es lo que prohíbe Gamonal.'),

  tabla(
    ['Banda', 'Héroe', 'Navy', 'Coral'],
    [
      ['Ámbar', '3,02  sí', '5,97  sí', '2,50  no · misma familia'],
      ['Rosa', '3,99  sí', '7,89  sí', '3,31  no · misma familia'],
      ['Menta', '4,11  sí', '8,13  sí', '3,41  sí'],
      ['Arenisca', '3,85  sí', '7,62  sí', '3,20  no · misma familia'],
      ['Celeste', '2,98  no', '5,89  no', '2,47  no'],
      ['Hueso', '4,99  sí', '9,87  sí', '4,14  sí'],
      ['Blanco', '5,81  sí', '11,48  sí', '4,82  sí']
    ],
    [22, 22, 22, 34]
  ),

  recuadro('Dos consecuencias que hay que recordar', [
    ['La banda celeste no admite ningún botón.', true],
    'Con los dos azules es azul sobre azul y con el coral se queda en 2,47. Sirve de fondo para texto y fotografía, nunca para una acción.',
    ['El coral sólo va sobre neutro, blanco o verde.', true],
    'Sobre ámbar, rosa o arenisca sería rojo sobre naranja.'
  ], C.HUESO),

  h2('4.2 Tipografía'),
  p('Zurich Sans como principal; Arial cuando no esté disponible, que es lo que autoriza el propio brandbook. Pesos 400, 500 y 600, nunca superiores. Cuerpo a 16 píxeles. Los titulares son grandes y de peso normal, no compactos y pesados.'),

  h2('4.3 Forma y espacio'),
  vinieta('Radio de 8 píxeles en cajas, campos, tarjetas y contenedores. Los botones van en píldora: es la firma reconocible de Zurich y entra en la excepción funcional que permite Gamonal.'),
  vinieta('Escala de espaciado en múltiplos de ocho. Cuadrícula de doce columnas en escritorio.'),
  vinieta('Área táctil mínima de 44 píxeles en todo control.'),
  vinieta('Las superficies se separan con fondos sólidos. Prohibidos los filetes decorativos, los degradados, los brillos, los difuminados y las sombras con color.'),
  vinieta('El lenguaje de formas son círculos: fotografía enmascarada con burbujas azules superpuestas.'),

  salto(),

  /* ══════════════ 5 · ARQUITECTURA ══════════════ */
  h1('5. Arquitectura de la interfaz'),

  h2('5.1 Rutas'),
  tabla(
    ['Ruta', 'Qué es'],
    [
      ['/login', 'Acceso con correo y contraseña. Página completa, fotografía real, panel de formulario y área visual diferenciados.'],
      ['/invitacion/:token', 'La persona invitada define su contraseña. Enlace de un solo uso, caduca en siete días.'],
      ['/recuperar', 'Solicitud de enlace de recuperación. Respuesta idéntica exista o no la cuenta.'],
      ['/home', 'Accesos directos, recientes y pendientes. Composición distinta de las pantallas interiores, con fotografía real.'],
      ['/crear', 'Selector de modo: web, email o estilo libre.'],
      ['/crear/web/:proyecto', 'Editor web.'],
      ['/crear/email/:proyecto', 'Editor de email, 600 píxeles.'],
      ['/crear/libre/:proyecto', 'Editor de estilo libre, mesa de trabajo.'],
      ['/proyectos', 'Buscar, filtrar, duplicar, archivar y abrir.'],
      ['/proyectos/:proyecto', 'Ficha, estado, versiones y exportaciones.'],
      ['/proyectos/papelera', 'Restaurar o eliminar definitivamente.'],
      ['/biblioteca/logos', 'Logos subidos.'],
      ['/biblioteca/imagenes', 'Imágenes subidas.'],
      ['/biblioteca/tipografias', 'Tipografías propias, incrustadas en los HTML exportados.'],
      ['/configuracion/general', 'Marca, tokens, formatos y dominios permitidos para insertar.'],
      ['/configuracion/permisos', 'Invitar personas y definir su alcance.'],
      ['/configuracion/usuarios', 'Usuarios creados, su estado y sus permisos.']
    ],
    [26, 74]
  ),

  h2('5.2 Permisos'),
  p('Dos roles, verificados en el servidor. El rol que llega al navegador sirve para decidir qué se enseña, nunca para autorizar: ocultar un botón no es un permiso.'),
  vm([['Administrador', true], ' — ve y administra todo, aprueba, exporta, invita, otorga y quita accesos.']),
  vm([['Usuario', true], ' — ve, edita, guarda y exporta sólo sus proyectos. Usa sólo los materiales que él subió.']),

  h2('5.3 Cinco niveles de selección'),
  p('El inspector muestra siempre la ruta completa, por ejemplo «Carrusel › Slide 2 › Contenedor de texto › Botón», y permite subir de nivel sin perder la selección.'),
  vm([['Lienzo o página', true], ' — fondo exterior, ancho, alto, guías y estilos globales. No modifica componentes existentes.']),
  vm([['Componente', true], ' — caja exterior, ubicación, tamaño, margen, borde, fondo y visibilidad.']),
  vm([['Contenedor interno', true], ' — dirección, rejilla, alineación, relleno, separación y desbordamiento de sus hijos.']),
  vm([['Elemento', true], ' — contenido, tamaño, estilo y posición de un hijo. No toca al padre ni a los hermanos.']),
  vm([['Capa superpuesta', true], ' — X, Y, anclas, tamaño, transformación y z-index. Fuera del flujo.']),

  salto(),

  /* ══════════════ 6 · CATÁLOGO ══════════════ */
  h1('6. Catálogo de componentes'),

  p('Sesenta y cinco componentes, cada uno con sus cantidades y variantes obligatorias. Un componente no está terminado si sólo existe su tarjeta en el panel: deben funcionar su anatomía, todas sus variantes, sus controles, su responsive, su guardado y sus tres exportaciones.'),

  tabla(
    ['Categoría', 'N.º', 'Componentes'],
    [
      ['Estructura y distribución', '10', 'Sección · Contenedor interno · Columnas · Cuadrícula · Pila · Grupo · Lista repetidora · Espaciador · Separador · Forma y fondo'],
      ['Texto, imagen y acciones', '18', 'Título · Texto enriquecido · Texto en trayectoria · Imagen · Logo · Imagen y texto · Botón · Icono · Bloque de iconos · Lista de iconos · Tarjeta · Tabla · Video · Playlist · Audio y pódcast · Inserción · Código QR · Redes sociales'],
      ['Marketing y presentación', '21', 'Portada · Carrusel de portada · Banner · Galería · Portfolio · Antes y después · Imagen con puntos activos · Beneficios · Testimonios · Valoración · Precios · Comparador · Métricas · Pasos y línea de tiempo · Progreso · Gráfico · Llamado final · Nube de logos · Preguntas frecuentes · Pestañas · Cuenta regresiva'],
      ['Navegación, datos y correo', '16', 'Menú · Breadcrumb · Ancla · Formulario · Campo de formulario · Acceso · Búsqueda · Ventana emergente · Mapa · Panel de datos · HTML propio · Contenido externo · Cabecera de correo · Preheader · Layout de correo · Pie legal']
    ],
    [24, 7, 69]
  ),

  h3('Contrato de cada componente'),
  p('Cada componente se declara como un manifiesto de datos, no como código. De ahí se generan solos la tarjeta del panel, el inspector, la validación, la serialización, el respaldo y las tres exportaciones.'),
  vinieta('Identidad: tipo, nombre, icono y categoría.'),
  vinieta('Anatomía: ranuras con su tipo y sus reglas de anidación. Cada ranura se puede seleccionar sin afectar a sus hermanas.'),
  vinieta('Campos: esquema tipado con límites, valor inicial y texto alternativo cuando corresponda.'),
  vinieta('Variantes: todas las cantidades y composiciones, con una predeterminada y cambio sin perder contenido.'),
  vinieta('Modos: comportamiento y respaldo en web, correo y libre.'),
  vinieta('Estado de captura: qué diapositiva, pestaña, panel o estado aparece en JPG, PNG y en el respaldo de correo.'),
  vinieta('Render: una función para web y otra para correo, ambas puras.'),

  salto(),

  /* ══════════════ 7 · EXPORTACIÓN ══════════════ */
  h1('7. Salidas y exportación'),

  tabla(
    ['Formato', 'Qué entrega'],
    [
      ['HTML completo', 'Documento autocontenido, o ZIP con index.html y una carpeta de recursos, rutas relativas y nombres seguros.'],
      ['Fragmento', 'Marcado sin envoltorio, CSS encapsulado bajo un contenedor raíz con clases prefijadas, JavaScript sin variables globales y tolerante a varias instancias. Rutas de recursos configurables y marcado opcional de campos editables.'],
      ['HTML de correo', 'CSS en línea, estructuras de tabla, allowlist de propiedades, sin JavaScript. Texto plano adicional.'],
      ['JPG y PNG', 'De la mesa o del breakpoint activo, o en lote. Antes de rasterizar se elige el estado que se congela.']
    ],
    [22, 78]
  ),

  recuadro('Expectativa honesta sobre JPG y PNG', [
    'Descartada la rasterización de pago, la captura se hace en el navegador. Funciona bien con tipografía, color, imágenes, bordes, radios, degradados lineales, flex y rejilla. Aproxima o falla en filtros CSS, modos de mezcla, sombras internas y máscaras complejas.',
    'Tres mitigaciones: el motor sólo genera CSS que sabemos capturar; el aplicativo muestra la captura junto a la vista previa antes de descargar; y el criterio de aceptación queda en «HTML idéntico a la vista previa, JPG y PNG fieles salvo aviso explícito del propio aplicativo».',
    'Si en algún momento se quiere fidelidad total, se cambia el rasterizador sin tocar nada más: el motor de render ya está separado.'
  ], C.ARENISCA),

  salto(),

  /* ══════════════ 8 · FASES ══════════════ */
  h1('8. Fases'),

  p('Cada fase termina en algo que el usuario puede abrir y romper. El orden pone el producto antes que la infraestructura: en la primera versión del brief el editor estaba en tercer lugar y el usuario abrió el aplicativo y no había nada.'),

  tabla(
    ['Fase', 'Resultado', 'Cómo se comprueba'],
    [
      ['0 · Acceso', 'Repositorio, sesión, invitación por correo, roles en servidor.', 'Invitas una cuenta, entra y no ve nada tuyo.'],
      ['1 · Interfaz', 'Tres propuestas, elección e implementación de la elegida, con identidad, favicon y todas las rutas navegables.', 'Recorres el aplicativo entero y nada parece de mentira.'],
      ['2 · Base espacial', 'Árbol de nodos, cinco niveles de selección, cero espaciado automático, flujo y superposición, arrastre, historial.', '50 movimientos seguidos sin pérdidas ni espacios ocultos.'],
      ['3 · Estilos', 'Inspector completo, reglas en píxeles, tokens, tipografías subidas, estados y breakpoints.', 'Un cambio en tableta no altera escritorio.'],
      ['4 · Componentes', 'El catálogo por categoría, con cantidades, variantes y respaldos.', 'Cada componente pasa su lista de aceptación.'],
      ['5 · Modos y biblioteca', 'Reglas web, email y libre; biblioteca, proyectos y papelera.', 'La misma pieza se comporta bien en los tres modos.'],
      ['6 · Exportación', 'HTML, fragmento, JPG y PNG, con validación y comparación visual.', 'Los archivos abiertos coinciden con la vista previa.']
    ],
    [17, 45, 38]
  ),

  p('La fase 4 es el grueso del trabajo. Se valida una categoría a la vez.'),

  h2('8.1 Entregables de producto'),
  p('Obligatorios según reglas-creacion-aplicativos, y ausentes de las primeras versiones del brief.'),
  vinieta('Logo en SVG y PNG con fondo transparente; icono ICO multirresolución; PNG de 1000 × 1000 para audiovisual; favicon integrado y comprobado.'),
  vinieta('Tres capturas reales del producto funcionando, en 1920 × 1080, y portada de presentación del mismo tamaño.'),
  vinieta('Documentación general y técnica, descripción publicitaria y, tras la aprobación, descripción de archivos.'),
  vinieta('Nomenclatura tema_nombre_proyecto.extension, en minúsculas, sin espacios, acentos ni eñes.'),

  salto(),

  /* ══════════════ 9 · ACEPTACIÓN ══════════════ */
  h1('9. Criterios de aceptación'),

  tabla(
    ['Área', 'Terminado cuando…'],
    [
      ['Componentes', 'Cada fila del catálogo cumple anatomía, cantidades, variantes, controles, responsive, respaldo y exportación.'],
      ['Separación', 'Un nodo nuevo tiene margen, relleno y separación en cero, y no aparece ningún espacio que el usuario no pueda identificar y editar.'],
      ['Superposición', 'Un texto o un botón sobre una imagen no crea fila, no empuja hermanos y conserva sus coordenadas al recargar.'],
      ['Selección', 'La ruta del inspector identifica lienzo, componente, contenedor, elemento y capa sin ambigüedad.'],
      ['Responsive', 'Los cambios heredados y locales funcionan sin duplicar nodos ni alterar otros breakpoints.'],
      ['Arrastre', 'Cincuenta movimientos consecutivos sin pérdidas, duplicados, cambios de estilo ni espacios ocultos.'],
      ['Reglas', 'La cifra de la regla corresponde al píxel real de la pieza a cualquier escala de visualización.'],
      ['Permisos', 'Un usuario no ve trabajos ajenos ni accede por URL a funciones de administrador.'],
      ['Color', 'Todo par de texto y fondo cumple AA. Ningún botón queda sobre su misma familia ni por debajo de 3:1. Verificado con medición, no a ojo.'],
      ['Móvil', 'Cero desbordes horizontales, medidos recorriendo el DOM en todas las pantallas.'],
      ['Exportación', 'HTML idéntico a la vista previa en los tres modos. JPG y PNG fieles salvo aviso explícito del aplicativo.'],
      ['Interfaz', 'No hay botones simulados, valores invisibles ni tecnicismos sin ayuda breve.'],
      ['Publicación', 'El aplicativo no modifica GitHub ni Cloudflare automáticamente.']
    ],
    [20, 80]
  ),

  h2('9.1 Fuera de alcance'),
  p('Envío de campañas, journeys, comercio electrónico, gestor de noticias, publicación automática, contenido dinámico, pruebas A/B y plantillas.'),

  h2('9.2 Pendiente de resolver'),
  vinieta('Qué propuesta de interfaz se implementa. Las tres están entregadas y esperan elección.'),
  vinieta('Dónde se guardan los archivos: R2 pide una tarjeta registrada aunque no cobre; la alternativa obliga a limitar las subidas a un mega.'),
  vinieta('Los archivos de Zurich Sans, para cargarlos como tipografía base.'),
  vinieta('Qué versión de Sitecore usa la empresa. No bloquea: el formato Fragmento sirve para todas.'),
  vinieta('El set de iconos del sistema, con sus tres acabados.')
];

const doc = new Document({
  creator: 'Andrés Gamonal',
  title: 'Fast Creative Builder · Brief final',
  description: 'Contrato funcional del aplicativo. Versión 7.',
  numbering: numeracion,
  styles: { default: { document: { run: { font: C.FUENTE, size: 21, color: C.SUAVE } } } },
  sections: [seccion('Brief final', hijos)]
});

const salida = path.join(C.raiz, 'docs', 'brief_final_fast_creative_builder.docx');
Packer.toBuffer(doc).then((b) => {
  fs.writeFileSync(salida, b);
  console.log('Brief listo:', (b.length / 1024).toFixed(0), 'KB');
});
