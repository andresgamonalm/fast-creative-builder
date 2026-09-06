const fs = require('fs');
const path = require('path');
const { Document, Packer } = require('docx');
const C = require('./comun.cjs');
const { p, pm, h1, h2, h3, etiqueta, vinieta, vm, numerada, salto, recuadro, tabla, numeracion, portada, seccion } = C;

const hijos = [
  ...portada(
    'Documento de traspaso',
    'Fast Creative Builder',
    [
      'Historia completa, estado del código, decisiones tomadas y trabajo pendiente.',
      'Escrito para retomar el proyecto en una conversación nueva sin perder nada.',
      'Léelo entero antes de tocar una línea.'
    ]
  ),
  salto(),

  /* ═══ 0 · CÓMO USAR ESTE DOCUMENTO ═══ */
  h1('0. Cómo usar este documento'),

  recuadro('Si retomas el proyecto, haz esto en este orden', [
    ['1. Lee este documento entero.', true],
    ['2. Lee ', ['brief_final_fast_creative_builder.docx', true], ', que es el contrato funcional.'],
    ['3. Lee ', ['DECISIONES-VISUALES.md', true], ', con las dieciocho decisiones vigentes y lo ya rechazado.'],
    ['4. Carga los cinco skills obligatorios ', ['antes', true], ' de escribir código. Saltárselos costó rehacer la interfaz dos veces.'],
    ['5. Resuelve con el usuario la decisión abierta del capítulo 8. Bloquea todo lo demás.']
  ], C.AMBAR),

  p('El repositorio está en github.com/andresgamonalm/fast-creative-builder. Siete commits, rama main. Todo lo que se describe aquí está subido.'),

  salto(),

  /* ═══ 1 · QUÉ ES ═══ */
  h1('1. Qué es el producto'),

  p('Fast Creative Builder es un constructor visual para key visuals, gráficas digitales, landing pages y email marketing. Uso interno, máximo quince personas. Interfaz en español, sin tecnicismos, con edición visual y resultado inmediato.'),

  p('Tres modos —web, email y estilo libre— comparten un mismo catálogo de 65 componentes, un mismo inspector y un mismo sistema de exportación. Lo que cambia entre modos son las reglas de construcción y lo que se puede publicar.'),

  h2('1.1 De dónde viene'),

  p('Existía un aplicativo anterior, Easy Web Builder, en producción sobre Cloudflare Pages y D1. Funcionaba, pero estaba mal resuelto en tres frentes que son justamente el corazón de lo que se pide ahora. El proyecto empezó auditándolo a fondo; el conocimiento útil quedó en docs/01-referencia-campos.md y el original se borró por completo, junto con todo rastro del cliente cuya marca estaba cableada en su motor.'),

  h3('Los tres fallos estructurales del anterior'),
  vm([['Modelo plano.', true], ' Un bloque era una caja negra de un solo nivel, con campos fijos. No se podía meter un botón dentro de un hero. Treinta componentes monolíticos y sin anidación real.']),
  vm([['Espaciado impuesto.', true], ' Cada bloque nacía con 64 y 24 píxeles de relleno cocinados en su valor por defecto y emitidos como estilo en línea. El usuario veía separación que no había puesto y que no aparecía en ningún control.']),
  vm([['Tres motores de render.', true], ' El editor, el renderizador público y el editor móvil implementaban el mismo catálogo por separado. Ya habían divergido: un elemento se componía en el editor, se veía en la vista previa, se guardaba y desaparecía al publicar. Y el margen por defecto de los elementos difería en seis píxeles entre editor y publicación.']),

  h3('Otros defectos verificados en el original, que no se repiten'),
  tabla(
    ['Defecto', 'Evidencia'],
    [
      ['Controles decorativos', 'El campo «CSS personalizado» aparecía tres veces en el código: la condición que abría el panel, el textarea y el valor mostrado. Nunca en el render. Se guardaba en la base de datos y no hacía nada.'],
      ['Funciones inalcanzables', 'El botón de historial comprobaba pageData.id, pero el objeto se construía sin id. Siempre respondía «guarda la página primero». Modal, dos endpoints, tabla y limpieza automática: todo inaccesible.'],
      ['Permisos de mentira', 'La lista de administradores estaba escrita en el HTML del navegador y ningún endpoint la verificaba.'],
      ['Vista previa que miente', 'Los bloques nuevos usaban consultas de ventana en lugar de consultas de contenedor: en la vista previa móvil seguían a tres columnas.'],
      ['Un parser por servicio', 'LinkedIn, YouTube, HubSpot, formularios, mapas y feeds tenían cada uno su propio código de reconocimiento, sin respaldo para correo.'],
      ['Sin gestión de archivos', 'Todas las imágenes eran URLs pegadas a mano, incluida la foto de fondo del acceso, servida desde un enlace de terceros.'],
      ['Borrado sin retorno', 'Eliminar un proyecto lo borraba de verdad y dejaba huérfano su historial de versiones.'],
      ['Marca del cliente en el motor', 'Los tokens que el producto llamaba «de marca» eran la paleta de un cliente concreto, y el panel cargaba sus iconos.'],
      ['Carrusel roto desde el día uno', 'El JavaScript del carrusel iba dentro del HTML inyectado con innerHTML, que nunca se ejecuta. El carrusel público jamás funcionó.'],
      ['Configuración incoherente', 'La variable de entorno declaraba SUPER_ADMIN_EMAILS en plural y el código leía SUPER_ADMIN_EMAIL en singular: nunca coincidían.']
    ],
    [24, 76]
  ),

  salto(),

  /* ═══ 2 · HISTORIA ═══ */
  h1('2. Historia del proyecto'),

  p('Conviene conocerla, porque explica por qué hay decisiones que parecen arbitrarias y por qué ciertos errores no se pueden repetir.'),

  h2('2.1 Cronología'),

  tabla(
    ['Momento', 'Qué pasó'],
    [
      ['Auditoría', 'Se estudió Easy Web Builder a fondo: 35 bloques, 22 elementos, backend completo, esquema y defectos. El conocimiento de campos se guardó y el original se eliminó.'],
      ['Brief v1 a v6', 'Se consolidaron dos textos del usuario, se resolvieron cuatro contradicciones internas y se cerraron veinticuatro decisiones abiertas mediante preguntas concretas.'],
      ['Fase 0', 'Se implementó el acceso completo: sesión, invitación por correo, roles verificados en servidor, freno de fuerza bruta. Verificado de punta a punta.'],
      ['Interfaz v1 — RECHAZADA', 'Construida sin leer los skills obligatorios. El usuario la describió como «lo más horrendo que he visto» y «no hay nada». Incumplía prohibiciones expresas de marca.'],
      ['Interfaz v2 — RECHAZADA', 'Se leyeron los skills y se hicieron tres propuestas. El usuario rechazó el color: «azul, azul y más azul», y la repetición de «Crear» cuatro veces en la misma pantalla.'],
      ['Interfaz v3 — ENTREGADA', 'Rehecha con las capturas de zurich.cl que entregó el usuario: bandas pastel, círculos, botones píldora. Se corrigió el editor a edición directa, se añadieron reglas en píxeles y se arregló el móvil.'],
      ['Propuesta alternativa', 'Apareció en el proyecto un PDF con una propuesta visual distinta, que rechaza expresamente las bandas pastel. Sin resolver.']
    ],
    [18, 82]
  ),

  h2('2.2 Los errores que se cometieron y por qué'),

  p('Se documentan porque el patrón es más importante que el detalle: casi todos vienen de ejecutar antes de leer.'),

  numerada([{ text: 'No leer los skills.', bold: true }, { text: ' El propio skill de marca Zurich advertía que ui-ux-aplicativos-gamonal, movimiento-interacciones-gamonal y reglas-creacion-aplicativos siguen gobernando estructura, comportamiento e interacción. Se leyó esa frase y no se cargaron. Resultado: una interfaz que incumplía prohibiciones explícitas y hubo que rehacer entera.' }]),
  numerada([{ text: 'Escribir el brief sin las reglas delante.', bold: true }, { text: ' Al brief le faltaba una capa completa: entregables de identidad, proceso de tres propuestas, cuadrícula de doce columnas, login con fotografía real, cuerpo a 16 píxeles y la obligación de entregar sin consola.' }]),
  numerada([{ text: 'Ordenar mal las fases.', bold: true }, { text: ' La infraestructura iba primero y el editor en tercer lugar. El usuario abrió el aplicativo y no había nada que ver. Se invirtió el orden.' }]),
  numerada([{ text: 'Pedirle al usuario que ejecutara comandos.', bold: true }, { text: ' Está expresamente prohibido. Instalar, compilar y arrancar es responsabilidad de quien desarrolla.' }]),
  numerada([{ text: 'Entregar en varios archivos.', bold: true }, { text: ' El usuario hizo doble clic y no vio nada: el navegador cargaba el documento pero bloqueaba los archivos vecinos. La solución no fue diagnosticar su navegador, sino empaquetar todo en uno.' }]),
  numerada([{ text: 'Romper un archivo con una edición automatizada.', bold: true }, { text: ' Un script de reemplazo truncó base.js y borró la mitad de las definiciones. La comprobación de sintaxis pasaba igual. Desde entonces se verifica ejecutando, no compilando.' }]),
  numerada([{ text: 'Juzgar el color a ojo.', bold: true }, { text: ' Se puso un botón coral sobre banda ámbar: rojo sobre naranja, prohibición expresa. Desde entonces cada botón se comprueba con medición automática contra su fondo.' }]),

  salto(),

  /* ═══ 3 · ESTADO DEL CÓDIGO ═══ */
  h1('3. Estado del código'),

  h2('3.1 Estructura del repositorio'),

  tabla(
    ['Ruta', 'Qué contiene', 'Estado'],
    [
      ['packages/core/', 'Núcleo en TypeScript puro: modelo de valores, estilos y árbol de nodos.', 'Tipos definidos; falta la lógica de mutación'],
      ['apps/server/', 'Worker de Cloudflare: acceso, sesiones, usuarios, correo, límites.', 'Funcionando y verificado'],
      ['apps/editor/', 'Editor en React y Vite: acceso, invitación, recuperación, inicio y personas.', 'Funciona, pero su interfaz es la v1 rechazada'],
      ['esquema/', 'Migración inicial de la base de datos, nueve tablas.', 'Aplicada en local'],
      ['mockups/', 'Las tres propuestas de interfaz, el empaquetador y el generador del PDF.', 'Entregado, esperando elección'],
      ['docs/', 'Brief, referencia de campos y este documento.', 'Al día'],
      ['marca/', 'Logotipo del aplicativo en PNG.', 'Sólo PNG; faltan SVG, ICO y 1000 × 1000'],
      ['otros/', 'PDFs que dejó el usuario, incluida la propuesta visual alternativa.', 'Sin resolver']
    ],
    [17, 58, 25]
  ),

  h2('3.2 Stack'),

  tabla(
    ['Capa', 'Elección', 'Por qué'],
    [
      ['Lenguaje', 'TypeScript en todo', '65 manifiestos tipados es lo único que hace verificable el catálogo'],
      ['Núcleo', 'Paquete puro sin framework', 'El mismo código en editor, exportador y rasterizador'],
      ['Editor', 'React 19 y Vite 7', 'Deshacer y rehacer de 50 pasos exige estado inmutable'],
      ['Servidor', 'Cloudflare Workers, plan gratuito', 'Es el destino declarado; wrangler dev reproduce producción en local'],
      ['Base de datos', 'D1', 'Con quince usuarios va sobrado'],
      ['Archivos', 'R2, pendiente de confirmar', 'Diez gigas gratis, pero Cloudflare pide tarjeta registrada'],
      ['Correo', 'Resend, plan gratuito', 'Sólo invitaciones y recuperación'],
      ['Rasterización', 'Captura en el navegador', 'Descartada la de pago; ver limitaciones en el brief'],
      ['Compilación', 'TypeScript 7', 'Sin errores en núcleo, servidor y editor']
    ],
    [16, 30, 54]
  ),

  h2('3.3 Base de datos'),

  p('Nueve tablas en esquema/0001_inicial.sql. Los puntos que importan:'),

  vm([['usuarios', true], ' — el rol vive aquí y se comprueba en cada petición. Contraseñas con PBKDF2-SHA256, 210 000 iteraciones, sal por usuario y comparación en tiempo constante.']),
  vm([['sesiones', true], ' — en tabla, no en JWT autocontenido. Así bloquear una cuenta la expulsa en la siguiente petición, sin esperar a que caduque la cookie.']),
  vm([['tokens_acceso', true], ' — invitación y recuperación comparten tabla. Un solo uso, guardados cifrados.']),
  vm([['intentos_acceso', true], ' — freno de fuerza bruta por correo y por acción. El anterior no tenía ninguno.']),
  vm([['proyectos', true], ' — el árbol se guarda serializado con esquema_version, para poder migrar el formato sin adivinar. Papelera por eliminado_en.']),
  vm([['recursos', true], ' — logos, imágenes y tipografías. Cada uno con un único dueño; no hay capa compartida.']),
  vm([['marcas', true], ' — la marca es un conjunto de tokens, no código.']),

  h2('3.4 Lo que ya funciona y está verificado'),

  p('Comprobado ejecutando, no leyendo:'),
  vinieta('La primera petición crea la cuenta de administrador y emite su invitación.'),
  vinieta('La invitación se acepta una sola vez; el segundo intento con el mismo enlace se rechaza.'),
  vinieta('Un usuario recibe 403 en todo lo de administración: listar personas, invitar y bloquear.'),
  vinieta('Sin sesión, 401.'),
  vinieta('Bloquear a alguien le corta la sesión abierta al instante.'),
  vinieta('El noveno intento de contraseña fallida se frena, y sigue frenado aunque después se acierte.'),
  vinieta('UTF-8 correcto de extremo a extremo.'),
  vinieta('Los 57 renders de las propuestas se generan sin errores, sin valores indefinidos y sin pantallas vacías.'),
  vinieta('Cero desbordes horizontales en móvil, medidos recorriendo el DOM de las 57 pantallas.'),
  vinieta('Cero violaciones de contraste y de familia cromática en todos los botones de las 57 pantallas.'),

  h2('3.5 Cómo se levanta'),

  p('Todo en local, sin depender de ninguna cuenta:'),
  vinieta('Instalar dependencias, compilar el núcleo y el editor.'),
  vinieta('Aplicar el esquema a la base local con wrangler.'),
  vinieta('Arrancar el Worker, que sirve también el editor compilado.'),
  vinieta('La primera petición imprime en consola el enlace de invitación del administrador, porque todavía no hay clave de Resend configurada.'),

  p('Las propuestas de interfaz se abren aparte, con doble clic, en mockups/FastCreativeBuilder-Propuestas.html. Es un solo archivo con todo dentro.'),

  salto(),

  /* ═══ 4 · MODELO DE DATOS ═══ */
  h1('4. Modelo de datos'),

  p('Es la parte del diseño que más importa acertar, porque todo lo demás depende de ella.'),

  h2('4.1 El nodo'),

  p('Un árbol recursivo, no una lista plana. Cada nodo tiene identidad, posición en el árbol, variante activa, ranuras con sus hijos en orden, contenido validado contra el esquema de su manifiesto, estilos base más sobrescrituras por dispositivo y por estado, disposición en flujo o superpuesta, visibilidad y estado de captura.'),

  recuadro('Tres reglas codificadas en los tipos, no en la documentación', [
    ['Cero, auto y ausente son tres cosas distintas.', true],
    'Cero es un valor explícito, auto es una regla y la propiedad ausente significa heredado. El tsconfig activa exactOptionalPropertyTypes justo para impedir que se mezclen.',
    ['Margen, relleno y separación no se contaminan.', true],
    'El margen vive fuera de la caja y nunca se convierte en relleno. El relleno vive entre el borde y los hijos y no separa el componente de sus hermanos. La separación afecta sólo a hijos directos en flex o rejilla.',
    ['La superposición sale del flujo.', true],
    'Coordenadas relativas al padre, nunca a la página. No empuja hermanos, no crea filas y no aumenta la altura del padre.'
  ], C.MENTA),

  h2('4.2 El catálogo como dato'),

  p('Cada componente se declara como un manifiesto. De ahí se generan solos la tarjeta del panel, el inspector, la validación, la serialización, el respaldo y las tres exportaciones. Añadir un componente es escribir un manifiesto y dos funciones de render.'),

  p('El aplicativo anterior implementaba 57 componentes como 53 casos de switch repartidos en tres archivos, y ya divergían. Con 65 componentes, variantes obligatorias, tres modos, tres breakpoints, cuatro estados y cuatro formatos de salida, ese enfoque no llega ni a la mitad.'),

  h2('4.3 El sistema de inserción'),

  p('Segundo subsistema transversal. Existe porque ocho componentes hacen lo mismo —traer algo de fuera y enmarcarlo— y no pueden resolverlo cada uno por su cuenta.'),

  p('Un solo formato de datos, un solo campo donde el usuario pega lo que sea, y los proveedores declarados como manifiestos: patrones de reconocimiento, normalización, dominios permitidos, proporción por defecto, parámetros propios y comportamiento en correo.'),

  p('Toda inserción exige respaldo, y el aplicativo no deja exportar sin él: ningún marco externo sobrevive a un cliente de correo ni a una captura de pantalla.'),

  salto(),

  /* ═══ 5 · USABILIDAD ═══ */
  h1('5. Usabilidad: lo que el usuario pidió expresamente'),

  p('Estas no son preferencias de diseño; son requisitos que el usuario formuló y que hay que respetar.'),

  h2('5.1 Edición directa'),

  p('Textual: «yo pongo el cursor en una parte del texto y puedo editar directo. Eso de la caja es muy complejo».'),
  vinieta('Se escribe sobre el lienzo. El cursor entra en el texto y se teclea.'),
  vinieta('Lo que se cambia a menudo —tamaño, peso, alineación, color, enlace— vive en una barra flotante pegada a la selección.'),
  vinieta('El espaciado se ajusta arrastrando el borde, con la cifra en vivo.'),
  vinieta('El mapa de caja y los valores exactos quedan detrás de «Avanzado». Es lo que el usuario llamó complejo: no puede ser la vía principal.'),

  h2('5.2 Reglas en píxeles reales'),

  p('Textual: «quiero que los editores de web, email y estilo libre tengan líneas o reglas que me permitan ver los píxeles reales. Esto es clave. Pero tiene que ser preciso».'),
  vinieta('La regla mide la pieza, no la pantalla. Si el lienzo se reduce para caber, la regla se reduce con él y la cifra sigue siendo el píxel real.'),
  vinieta('Paso adaptativo: nunca dibuja marcas a menos de cinco píxeles de distancia en pantalla.'),
  vinieta('La extensión de lo seleccionado se marca sobre la propia regla.'),
  vinieta('Lectura de posición y tamaño, cotas de distancia entre elementos y guías arrastrables.'),
  vinieta('Medidas por modo: web 1200, email 600, libre 1080 × 1080.'),

  h2('5.3 Arrastre'),

  vinieta('Umbral para evitar arrastres accidentales; el puntero se captura después de iniciar el gesto.'),
  vinieta('Línea de inserción con la posición exacta en píxeles.'),
  vinieta('Al soltar sobre un componente, elección explícita entre insertar dentro o superponer. Nunca decide solo.'),
  vinieta('Imantado a las guías con cota visible.'),
  vinieta('Un movimiento equivale a una acción del historial; se guarda al terminar, no por cada píxel.'),

  h2('5.4 Móvil'),

  p('El móvil estaba roto y el usuario lo señaló: scroll horizontal, botón encima del titular y tarjetas cortadas.'),
  vinieta('Una sola columna. Los anchos máximos pensados para escritorio no se aplican.'),
  vinieta('Las tablas se convierten en fichas apiladas: nunca scroll horizontal.'),
  vinieta('Las filas de botones se envuelven.'),
  vinieta('Barra inferior con cuatro destinos.'),
  vinieta('El editor se reduce a revisar y corregir texto, con un aviso que lo dice en vez de fingir que se puede componer en un teléfono.'),

  h2('5.5 Repetición de acciones'),

  p('El usuario señaló que «Crear» aparecía cuatro veces en la misma pantalla. La regla resultante: una sola acción principal en todo el aplicativo, en la barra superior. Crear deja de ser destino de navegación.'),

  salto(),

  /* ═══ 6 · SISTEMA VISUAL ═══ */
  h1('6. Sistema visual y su verificación'),

  h2('6.1 Cómo se decidió'),

  p('El usuario indicó: aplicar todo lo de la marca Gamonal, pero con los colores y las tipografías de Zurich. Después entregó capturas de zurich.cl como referencia. De ahí salió la dirección de la versión 3: bandas pastel a todo el ancho, círculos como lenguaje de formas, botones píldora y titulares grandes de peso normal.'),

  h2('6.2 La paleta'),

  p('El usuario subió al proyecto Paleta_Fast_Creative_Builder.pptx, que fija los valores autorizados:'),

  tabla(
    ['Nombre', 'Valor', 'Nombre', 'Valor'],
    [
      ['Azul oscuro', '#23366F', 'Piedra arenisca', '#DAD2BD'],
      ['Azul de Zúrich', '#2167AE', 'Paloma', '#DDE4E3'],
      ['Azul medio', '#5495CF', 'Blanco de Zúrich', '#ECEEEF'],
      ['Azul claro', '#91BFE3', 'Menta', '#A6E9AB'],
      ['Celeste', '#1FB1E6', 'Limón', '#FFF773'],
      ['Durazno', '#FF7569', '', '']
    ],
    [26, 24, 26, 24]
  ),

  recuadro('Discrepancia sin resolver', [
    ['La paleta del usuario no incluye el rosa #FFC5EA ni el ámbar #E4B273 que se usaron como bandas.', true],
    'El rosa viene de la paleta secundaria del brandbook y el ámbar de un color inclusivo de campaña. Ninguno está en el documento que el usuario subió.',
    'Si se conserva la dirección de bandas, hay que sustituirlos por colores de la lista autorizada: arenisca, paloma, hueso, menta, celeste y limón.'
  ], C.ROSA),

  h2('6.3 La tabla de botón sobre banda'),

  p('Calculada, no estimada. Dos condiciones a la vez: separación mínima de 3:1 y familias cromáticas distintas, que es lo que prohíbe Gamonal.'),

  tabla(
    ['Banda', 'Héroe #2167AE', 'Navy #23366F', 'Coral #CC4038'],
    [
      ['Ámbar', '3,02  válido', '5,97  válido', '2,50  misma familia'],
      ['Rosa', '3,99  válido', '7,89  válido', '3,31  misma familia'],
      ['Menta', '4,11  válido', '8,13  válido', '3,41  válido'],
      ['Arenisca', '3,85  válido', '7,62  válido', '3,20  misma familia'],
      ['Celeste', '2,98  no', '5,89  misma familia', '2,47  no'],
      ['Hueso', '4,99  válido', '9,87  válido', '4,14  válido'],
      ['Blanco', '5,81  válido', '11,48  válido', '4,82  válido']
    ],
    [22, 26, 26, 26]
  ),

  p('Consecuencias: la banda celeste no admite ningún botón, y el coral sólo va sobre neutro, blanco o verde. El coral de campaña de Zurich, #F16F6D, da 2,90 con texto blanco y no cumple AA; se oscureció a #CC4038, que da 4,82.'),

  h2('6.4 Cómo se verifica'),

  p('Dos comprobaciones automáticas, ejecutadas sobre las 57 pantallas de las tres propuestas. Conviene volver a correrlas después de cualquier cambio de color o de layout.'),

  vm([['Botones.', true], ' Recorre cada botón, lee su color de relleno o de contorno y el de su fondo real ascendiendo por el árbol, y comprueba separación y familia cromática. Distingue el botón secundario, que se define por su borde y no por su relleno.']),
  vm([['Desborde en móvil.', true], ' Recorre cada elemento de cada pantalla a 390 píxeles y compara su borde derecho con el del marco.']),

  h2('6.5 Prohibiciones que costaron una versión'),

  vinieta('Nunca un color sobre su misma familia, aunque se cambie transparencia o intensidad.'),
  vinieta('Nunca una pantalla resuelta como acumulación de tarjetas blancas.'),
  vinieta('Nunca sustituir una fotografía por cajas de color, círculos o iconos.'),
  vinieta('Nunca filetes, franjas ni contornos decorativos. Las superficies se separan con fondos sólidos.'),
  vinieta('Nunca degradados, brillos, difuminados ni sombras con color.'),
  vinieta('Radio uniforme entre 5 y 10 píxeles en todo el sistema. Se fijó en 8; los botones en píldora son la excepción funcional.'),
  vinieta('Nunca emojis en lugar de iconos.'),

  salto(),

  /* ═══ 7 · LAS TRES PROPUESTAS ═══ */
  h1('7. Las tres propuestas de interfaz'),

  p('Entregadas y esperando elección. Se abren con doble clic en mockups/FastCreativeBuilder-Propuestas.html, un solo archivo con el CSS, el código y las seis fotografías dentro. El PDF de revisión, con cada pantalla marcada como decisión o como visto bueno, está en mockups/FastCreativeBuilder-Pantallas.pdf.'),

  tabla(
    ['Propuesta', 'Navegación', 'Apertura', 'Editor'],
    [
      ['A · Taller', 'Lateral fijo de destinos y barra superior de acciones', 'Banda ámbar con fotografía en círculo', 'Tres paneles: componentes, lienzo e inspector'],
      ['B · Lienzo', 'Riel de iconos, sin lateral de texto', 'Búsqueda dominante sobre banda rosa', 'Sin paneles fijos: flotan sobre el lienzo, el inspector se ancla a la selección'],
      ['C · Escritorio', 'Barra superior ancha con secciones', 'Resumen operativo con cifras', 'Propiedades en barra horizontal bajo la cabecera']
    ],
    [16, 28, 26, 30]
  ),

  p('Cada propuesta trae su propio logotipo. Pueden mezclarse: el logo de una con la interfaz de otra, o la navegación de una con el editor de otra.'),

  p('Las 19 pantallas cubiertas son: acceso, invitación, recuperación, inicio, crear, los tres editores, exportar, insertar contenido, proyectos, ficha, papelera, las tres bibliotecas y las tres de configuración.'),

  salto(),

  /* ═══ 8 · DECISIÓN ABIERTA ═══ */
  h1('8. La decisión que bloquea todo'),

  recuadro('Dos direcciones visuales incompatibles sobre la mesa', [
    ['Dirección 1 · bandas pastel.', true],
    'Es la versión 3 entregada. Sale de las capturas de zurich.cl que entregó el usuario: bandas de color a todo el ancho, círculos, botones píldora, titulares grandes y ligeros.',
    ['Dirección 2 · neutros con acentos acotados.', true],
    'Está en otros/Fast_Creative_Builder_Propuesta_Visual (GPT).pdf, veintiuna páginas. Dice expresamente «sin bandas pastel: no se colorean encabezados completos sin una razón funcional», y propone 80% neutros, 15% azules y 5% estados, con los secundarios restringidos a estados y avisos.',
    ['El argumento de la segunda es sólido y hay que tomarlo en serio.', true],
    'zurich.cl es un sitio público de marketing, donde el color vende. Fast Creative Builder es una herramienta de trabajo que alguien mira ocho horas seguidas, y donde el color debería significar algo: qué está seleccionado, qué está en revisión, qué falló. Bandas decorativas en una herramienta compiten con el contenido que el usuario está creando.',
    ['No pueden convivir. Hay que elegir una, y esa elección arrastra todo el sistema visual.', true]
  ], C.ARENISCA),

  p('Esa propuesta alternativa también consolida las tres mías de otra forma: navegación de A, acceso de B y editores de A. Es una combinación legítima y compatible con cualquiera de las dos direcciones de color.'),

  h2('8.1 Recomendación'),

  p('Si hay que apostar: la dirección de neutros con acentos acotados es la correcta para una herramienta de trabajo, y la de bandas pastel es la correcta para las piezas que el usuario produzca con ella. Se pueden tener las dos, en sitios distintos: interfaz sobria, y todo el color en el lienzo y en las plantillas de arranque de los proyectos.'),

  p('Esa lectura resuelve además la discrepancia de la paleta: sin bandas, el rosa y el ámbar que no están en la lista autorizada dejan de ser un problema.'),

  salto(),

  /* ═══ 9 · PENDIENTE ═══ */
  h1('9. Trabajo pendiente'),

  h2('9.1 Decisiones que necesita el usuario'),

  tabla(
    ['Asunto', 'Qué falta', 'Bloquea'],
    [
      ['Dirección visual', 'Elegir entre bandas pastel y neutros con acentos acotados. Ver capítulo 8.', 'Todo'],
      ['Propuesta de interfaz', 'Elegir A, B o C, o una combinación.', 'Fase 1'],
      ['Almacenamiento', 'R2 pide tarjeta registrada aunque no cobre; la alternativa limita las subidas a un mega.', 'Fase 5'],
      ['Zurich Sans', 'Los archivos de la tipografía, para cargarla como base.', 'Nada, hay respaldo en Arial'],
      ['Versión de Sitecore', 'Saber si es XM Cloud o la clásica.', 'Nada, el fragmento sirve para ambas'],
      ['Set de iconos', 'Elegir familia con relleno, línea y duotono.', 'Fase 4']
    ],
    [22, 56, 22]
  ),

  h2('9.2 Trabajo técnico pendiente'),

  vinieta('Fase 1 · implementar la propuesta elegida en el editor real. Hoy la aplicación tiene la interfaz de la versión 1, que fue rechazada.'),
  vinieta('Fase 2 · lógica de mutación del árbol, cinco niveles de selección, arrastre, flujo y superposición, historial de cincuenta pasos.'),
  vinieta('Fase 3 · inspector completo, reglas, tokens, subida de tipografías, estados y breakpoints.'),
  vinieta('Fase 4 · los 65 componentes, una categoría a la vez. Es el grueso del trabajo.'),
  vinieta('Fase 5 · reglas de los tres modos, biblioteca, proyectos y papelera.'),
  vinieta('Fase 6 · exportación en HTML, fragmento, JPG y PNG, con validación y comparación visual.'),

  h2('9.3 Entregables de producto pendientes'),

  vinieta('Logo en SVG; icono ICO multirresolución; PNG de 1000 × 1000. Sólo existe el PNG del logotipo.'),
  vinieta('Favicon integrado y comprobado en el aplicativo.'),
  vinieta('Tres capturas reales del producto funcionando, en 1920 × 1080, y portada de presentación.'),
  vinieta('Descripción publicitaria en Word.'),
  vinieta('Descripción de archivos, después de la aprobación final.'),

  h2('9.4 Limpieza'),

  vinieta('La carpeta referencia-anterior quedó vacía pero bloqueada por Windows. Borrarla.'),
  vinieta('En otros/ hay tres copias del mismo PDF de pantallas. Dejar una.'),

  salto(),

  /* ═══ 10 · REGLAS DE TRABAJO ═══ */
  h1('10. Cómo trabajar en este proyecto'),

  p('Resumen operativo de lo aprendido. Si se respeta, no se repiten los errores del capítulo 2.'),

  recuadro('Antes de ejecutar', [
    'Cargar los cinco skills y leer sus referencias obligatorias.',
    'Leer DECISIONES-VISUALES.md y comprobar que nada de lo que se va a proponer está marcado como rechazado.',
    'Para cualquier rediseño amplio, tres propuestas materialmente distintas antes de tocar la implementación.'
  ], C.HUESO),

  recuadro('Al ejecutar', [
    'Verificar con números: contraste calculado, desborde medido, renders ejecutados.',
    'Comprobar en escritorio, tableta y móvil antes de presentar.',
    'Ningún control que no funcione. Ninguna pantalla que aparente estar hecha.',
    'Las decisiones técnicas ordinarias se resuelven solas; se consulta sólo por alcance, coste, credenciales, publicación o acción irreversible.'
  ], C.HUESO),

  recuadro('Al entregar', [
    'Un solo archivo o una URL. El usuario no abre la consola.',
    'Decir con precisión qué se hizo, qué se verificó y qué queda pendiente.',
    'Registrar en DECISIONES-VISUALES.md cada corrección recibida, para no volver a proponer lo descartado.'
  ], C.HUESO),

  h2('10.1 Fuentes de verdad, en orden'),

  numerada('El encargo del usuario y sus correcciones expresas.'),
  numerada('Los materiales oficiales: paleta subida por el usuario, brandbook Zurich, capturas de referencia.'),
  numerada('brief_final_fast_creative_builder.docx, que es el contrato funcional.'),
  numerada('Los skills: reglas-creacion-aplicativos para producto y entregables; lineamientos-marca-gamonal para identidad; ui-ux-aplicativos-gamonal para interfaz; movimiento-interacciones-gamonal para gestos.'),
  numerada('Este documento, para el contexto y el estado.')
];

const doc = new Document({
  creator: 'Andrés Gamonal',
  title: 'Fast Creative Builder · Documento de traspaso',
  description: 'Historia, estado técnico, usabilidad y pendientes. Para retomar en una conversación nueva.',
  numbering: numeracion,
  styles: { default: { document: { run: { font: C.FUENTE, size: 21, color: C.SUAVE } } } },
  sections: [seccion('Documento de traspaso', hijos)]
});

const salida = path.join(C.raiz, 'docs', 'documentacion_general_tecnica_fast_creative_builder.docx');
Packer.toBuffer(doc).then((b) => {
  fs.writeFileSync(salida, b);
  console.log('Traspaso listo:', (b.length / 1024).toFixed(0), 'KB');
});
