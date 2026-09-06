# Referencia de campos por componente

**Qué es esto.** Antes de Fast Creative Builder existió otro constructor visual con 35 bloques y 22 elementos en producción. Su arquitectura no sirve y no se hereda, pero sí sirve lo que aprendió sobre **qué campos necesita cada componente para ser útil de verdad**. Ese conocimiento está aquí.

**Qué no es.** No es un catálogo. El catálogo vinculante está en [`00-brief.md`](00-brief.md) §10 y en el anexo funcional. Esto es solo una ayuda de partida: cuando escribas el manifiesto de un componente, mira si aparece en esta lista y arranca desde estos campos en vez de desde cero.

**Advertencia sobre los valores.** Aquí no hay ni un solo color, ni una sola medida por defecto. Los valores por defecto del aplicativo anterior estaban cableados a la paleta de un cliente concreto, y ese fue su error más caro. En Fast Creative Builder **todo valor por defecto referencia un token**.

---

## Cómo leer las tablas

- **Campo** — nombre propuesto, en español.
- **Tipo** — el tipo del esquema del manifiesto.
- **Nota** — por qué existe. Solo cuando no es evidente.

Los campos de espaciado, color de fondo, borde, sombra y tipografía **no aparecen aquí**: los aporta el inspector común a todos los componentes (§9 del brief). Aquí solo va lo propio de cada uno.

---

## 1. Estructura y distribución

### Columnas / Cuadrícula

| Campo | Tipo | Nota |
|---|---|---|
| `distribucion` | enum | Presets de reparto de ancho. La experiencia previa mostró que hacen falta al menos: iguales, 2:1, 1:2, 3:1, 1:3 para dos columnas; y las combinaciones equivalentes para tres y cuatro. |
| `columnas` | número | |
| `separacion` | número | |
| `altoCelda` | número | Alto mínimo de cada celda. Sin esto, una columna vacía colapsa y el usuario no puede soltar nada dentro. |
| `apilarEnMovil` | booleano | |
| `invertirEnMovil` | booleano | |

**Aprendizaje:** el preset de distribución debe ser una lista cerrada y con nombre legible, no dos campos numéricos. El usuario no piensa en fracciones.

### Separador

| Campo | Tipo |
|---|---|
| `estilo` | enum: sólida, guiones, puntos, degradado |
| `grosor` | número |
| `largo` | número o porcentaje |
| `orientacion` | enum |
| `textoCentral` | texto opcional |

### Espaciador

| Campo | Tipo | Nota |
|---|---|---|
| `alto` | número | |
| `orientacion` | enum | Horizontal o vertical. |

---

## 2. Texto, imagen y acciones

### Título

| Campo | Tipo | Nota |
|---|---|---|
| `texto` | texto | |
| `nivel` | enum H1–H6 | **Semántico, independiente del tamaño visual.** Fue una fuente constante de confusión: el usuario elegía H1 para agrandar el texto y rompía la jerarquía de la página. La interfaz debe separar las dos cosas. |
| `antetitulo` | texto opcional | |
| `subtitulo` | texto opcional | |
| `enlace` | enlace opcional | |

### Texto enriquecido

| Campo | Tipo | Nota |
|---|---|---|
| `contenido` | texto enriquecido | Párrafo, lista con viñetas, lista numerada y cita. |
| `limpiarFormatoPegado` | acción | Imprescindible. Sin esto, pegar desde Word arrastra estilos que rompen la pieza. |

### Cita

| Campo | Tipo |
|---|---|
| `texto` | texto |
| `autor` | texto |
| `cargo` | texto opcional |

### Imagen

| Campo | Tipo | Nota |
|---|---|---|
| `origen` | recurso | De la biblioteca o subida. |
| `alt` | texto | **Con aviso visible cuando falta.** El aplicativo anterior lo pedía pero no avisaba, y las piezas salían sin texto alternativo. |
| `ajuste` | enum: cubrir, contener, estirar, original | |
| `puntoFoco` | punto | Rejilla de nueve posiciones, más coordenadas exactas. La rejilla resuelve el 90% de los casos en un clic. |
| `alto` | número | |
| `enlace` | enlace opcional | |
| `pie` | texto opcional | |

### Botón / CTA

| Campo | Tipo | Nota |
|---|---|---|
| `texto` | texto | |
| `enlace` | enlace | |
| `destino` | enum | Misma pestaña o nueva. |
| `estilo` | enum: primario, secundario, contorno, texto, con icono | |
| `iconoAntes` / `iconoDespues` | icono opcional | |
| `ancho` | número o auto | Auto ajusta al texto. Debe poder fijarse en píxeles: es el caso más pedido para alinear varios botones. |
| `alto` | número o auto | |
| `alineacion` | enum | Del botón dentro de su contenedor, no del texto dentro del botón. Son dos cosas distintas y hay que separarlas. |

Los estados normal, hover y focus los aporta el inspector común.

### Enlace de texto

| Campo | Tipo | Nota |
|---|---|---|
| `texto` | texto | |
| `enlace` | enlace | |
| `subrayado` | booleano | |
| `flecha` | enum: ninguna, simple, doble | Muy usado. Merece ser un campo, no un carácter que el usuario escriba a mano. |

### Icono individual

| Campo | Tipo | Nota |
|---|---|---|
| `icono` | icono del sistema | |
| `acabado` | enum: relleno, línea, duotono | |
| `contenedor` | enum: ninguno, círculo, cuadrado | |
| `tamaño` | número | |
| `etiquetaAccesible` | texto | Obligatoria si el icono es informativo; se omite si es decorativo. |
| `enlace` | enlace opcional | |

### Bloque de iconos / Lista de iconos / Beneficios

Los tres comparten anatomía de ítem:

| Campo del ítem | Tipo |
|---|---|
| `icono` | icono |
| `titulo` | texto |
| `texto` | texto |
| `enlace` | enlace opcional |

| Campo del componente | Tipo | Nota |
|---|---|---|
| `cantidad` | enum | Cantidades exactas, no un rango libre. |
| `columnas` | número por dispositivo | |
| `estilo` | enum: simple, círculo, tarjeta, numerado | |
| `igualarAlturas` | booleano | Sin esto, tres tarjetas con texto de distinto largo quedan desalineadas. Es de las primeras cosas que se piden. |

### Tarjeta

| Campo | Tipo | Nota |
|---|---|---|
| `anatomia` | enum: imagen arriba, imagen lateral, fondo con velo, solo contenido | |
| `etiqueta` | texto opcional | |
| `titulo` | texto |
| `texto` | texto |
| `imagen` | recurso |
| `alt` | texto |
| `acciones` | lista de 0–2 CTA | |
| `tipoAccion` | enum: enlace con flecha, botón, botón con borde, ninguna | La experiencia previa mostró que el enlace con flecha es el más usado y debe ser el valor por defecto. |
| `tarjetaEnlazable` | booleano | Toda la tarjeta como zona clicable. |

### Tabla

| Campo | Tipo | Nota |
|---|---|---|
| `variante` | enum: simple, datos, comparativa | |
| `columnas` | lista de textos | |
| `filas` | lista de filas, cada una con etiqueta y un valor por columna | |
| `columnaDestacada` | número opcional | |
| `encabezadoFijo` | booleano | |
| `comportamientoMovil` | enum: desplazamiento, tarjetas, prioridad de columnas | |

### Video

| Campo | Tipo | Nota |
|---|---|---|
| `insercion` | inserción | Ver el sistema del brief §11. Reemplaza el parser propio que tenía el aplicativo anterior. |
| `proporcion` | enum | |
| `poster` | recurso | Obligatorio: es lo que aparece en correo y en las capturas. |
| `controles` | enum: completos, mínimos, sin controles | |

### Audio / Podcast

| Campo | Tipo | Nota |
|---|---|---|
| `insercion` | inserción | O un MP3 enlazado. |
| `titulo` | texto | |
| `subtitulo` | texto | |
| `caratula` | recurso o color con símbolo | Cuando no hay imagen, un fondo de color con un carácter funciona sorprendentemente bien y ahorra pedirle una portada al usuario. |

### Redes sociales

| Campo | Tipo | Nota |
|---|---|---|
| `redes` | lista de { red, url } | Las redes se activan con fichas seleccionables y solo se muestran las que tienen URL. |
| `forma` | enum: simple, círculo, cuadrado | |
| `tamaño` | número | |
| `separacion` | número | |
| `mostrarNombre` | booleano | |

**Normalizaciones necesarias:** WhatsApp acepta un número y lo convierte a enlace; el correo acepta una dirección y la convierte a `mailto:`. Sin esto el usuario pega mal el enlace y no se entera.

---

## 3. Marketing y presentación

### Portada / hero y Carrusel de portada

Por diapositiva:

| Campo | Tipo | Nota |
|---|---|---|
| `layout` | enum | Fondo con velo, mitad y mitad, imagen con tarjeta flotante, imagen completa con CTA. |
| `antetitulo` / `titulo` / `texto` | texto | |
| `acciones` | 1–2 CTA | |
| `imagen` | recurso | |
| `puntoFoco` | punto | Rejilla de nueve posiciones. |
| `velo` | número 0–1 | |
| `colorVelo` | token | |
| `lado` | enum | Para los layouts partidos. |

Del componente:

| Campo | Tipo | Nota |
|---|---|---|
| `alto` | número | |
| `navegacion` | enum: flechas, puntos, ambas, ninguna | |
| `bucle` / `automatico` / `intervalo` | | El automático debe **pausarse al pasar el cursor**. |
| `diapositivaDeCaptura` | número | Cuál se congela en imagen y en correo. |

**Aprendizaje caro:** el JavaScript del carrusel del aplicativo anterior estaba dentro del HTML que se inyectaba con `innerHTML`, y ese código nunca se ejecuta. El carrusel público estuvo roto desde el primer día sin que nadie lo notara. El JavaScript va siempre fuera, con arranque por atributo.

### Testimonios

| Campo del ítem | Tipo |
|---|---|
| `foto` | recurso opcional |
| `cita` | texto |
| `nombre` | texto |
| `cargo` | texto |
| `valoracion` | número 1–5 opcional |

### Precios / planes

| Campo del plan | Tipo | Nota |
|---|---|---|
| `nombre` | texto | |
| `precio` | texto o número | Debe aceptar texto: "A medida" es un precio válido. |
| `periodo` | texto | |
| `descripcion` | texto | |
| `destacado` | booleano | |
| `caracteristicas` | lista de textos | Repetidor anidado dentro de cada plan. |
| `accion` | CTA | |
| `anchoBoton` | número opcional | Hereda del global si está vacío. |

| Campo del componente | Tipo | Nota |
|---|---|---|
| `moneda` | enum | |
| `formatoNumerico` | enum de locales | Chile y México separan miles y decimales al revés. Sin este campo, los precios salen mal en la mitad de los casos. |
| `igualarAlturas` | booleano | |

### Comparador

| Campo | Tipo |
|---|---|
| `opciones` | lista de 2–4 columnas |
| `caracteristicas` | lista de filas, cada una con etiqueta y un valor por opción |
| `columnaDestacada` | número |
| `versionMovil` | enum: tarjetas, desplazamiento |

### Métricas / KPIs

| Campo del ítem | Tipo | Nota |
|---|---|---|
| `valor` | número o texto | |
| `etiqueta` | texto | |
| `prefijo` / `sufijo` | texto | |
| `formato` | enum: número, moneda, porcentaje, compacto | El formato compacto ("1,2 M") es el más usado y el que peor sale si se escribe a mano. |
| `moneda` | enum | |
| `decimales` | número | |
| `icono` | icono opcional | |

| Campo del componente | Tipo |
|---|---|
| `formatoNumerico` | enum de locales |
| `contador` | booleano, con valor final para captura |

### Gráfico

| Campo | Tipo | Nota |
|---|---|---|
| `tipo` | enum: barras, líneas, torta, dona | |
| `orientacion` | enum | |
| `series` | 1–6 | |
| `categorias` | 2–20, cada una con etiqueta, valor y unidad | |
| `origenDatos` | enum: manual, CSV | |
| `ejes` / `leyenda` / `etiquetas` | booleanos | |

**Aviso:** las barras deben animarse solo si hay tiempo real de entrada. En el aplicativo anterior tenían transición pero se pintaban ya completas, así que la animación nunca se veía.

### Pasos / línea de tiempo

| Campo del ítem | Tipo |
|---|---|
| `titulo` | texto |
| `texto` | texto |
| `icono` | icono opcional |
| `estado` | enum: pendiente, actual, completo |

| Campo del componente | Tipo |
|---|---|
| `orientacion` | enum: horizontal, vertical, alternada |
| `conector` | booleano |

### FAQ / acordeón

| Campo del ítem | Tipo |
|---|---|
| `pregunta` | texto |
| `respuesta` | texto enriquecido |

| Campo del componente | Tipo | Nota |
|---|---|---|
| `columnas` | 1 o 2 | |
| `aperturaInicial` | enum: primera abierta, varias abiertas, todas cerradas | |
| `panelDeCaptura` | número | Cuál aparece abierto en imagen y en correo. |

### Nube de logos

| Campo del ítem | Tipo |
|---|---|
| `imagen` | recurso |
| `alt` | texto |
| `enlace` | enlace opcional |

| Campo del componente | Tipo | Nota |
|---|---|---|
| `disposicion` | enum: fila, cuadrícula, carrusel | |
| `monocromo` | booleano | Con color al pasar el cursor. |
| `alturaUniforme` | número | Los logos vienen en proporciones distintas; sin altura uniforme la fila queda desordenada. |

### Banda de conceptos en movimiento

| Campo del ítem | Tipo |
|---|---|
| `texto` | texto |
| `icono` | icono |

| Campo del componente | Tipo | Nota |
|---|---|---|
| `duracion` | número en segundos | Etiquetado como velocidad, no como duración: "más segundos, más lento". |
| `separador` | booleano | |

**Nota técnica:** el bucle infinito exige duplicar los elementos en el marcado. Y debe respetar la preferencia de movimiento reducido del sistema, cosa que el aplicativo anterior no hacía.

---

## 4. Navegación, datos y Email

### Menú / navegación

| Campo | Tipo | Nota |
|---|---|---|
| `variante` | enum: horizontal, vertical, hamburguesa, anclas | |
| `opciones` | lista de 2–8, cada una con texto, enlace y submenú | El aplicativo anterior declaraba submenús pero su panel decía literalmente "editar en código". **El submenú se edita en la interfaz.** |
| `logo` | recurso o texto | |
| `anchoLogo` | número | |
| `accion` | CTA opcional | |
| `fijo` | booleano | |
| `estadoActivo` | automático | |

### Pie de página

| Campo | Tipo |
|---|---|
| `logo` | recurso o texto |
| `columnas` | lista, cada una con título y lista de enlaces |
| `copyright` | texto |

### Formulario

Contenedor de inserción, no constructor. Ver brief §11.

| Campo | Tipo |
|---|---|
| `insercion` | inserción |
| `alto` | número o auto |
| `respaldoEmail` | CTA enlazado |

### Campo de formulario (solo maqueta)

| Campo | Tipo | Nota |
|---|---|---|
| `tipo` | enum de 12 | Texto, correo, teléfono, área, selector, opción única, casilla, fecha, número, archivo, oculto, consentimiento. |
| `etiqueta` / `marcadorDePosicion` / `ayuda` | texto | |
| `requerido` | booleano | |
| `ancho` | enum | |

Marcado en la interfaz como visual: no envía nada.

### Mapa

| Campo | Tipo |
|---|---|
| `insercion` | inserción |
| `marcadores` | lista de 1–10 |
| `zoom` | número |
| `alto` | número |

### Contenido externo / feed

| Campo | Tipo | Nota |
|---|---|---|
| `origen` | URL de feed | |
| `cantidad` | número | |
| `columnas` | número | |
| `mostrarImagen` / `mostrarFecha` | booleanos | |
| `respaldo` | contenido estático | Un feed que falla no puede dejar un hueco en blanco. |

---

## 5. Ajustes de página — SEO y GEO

El aplicativo anterior tenía aquí su mejor trabajo. Se conserva la estructura y se corrige lo roto.

### SEO

`titulo` · `descripcion` · `imagenParaCompartir` · `canonica` · `indexar` · `seguirEnlaces`

Con contador de caracteres —aviso a partir de 50 y error a partir de 60 en el título; aviso a partir de 140 en la descripción— y vista previa del resultado en buscador.

**Corregido:** la canónica se deriva del dominio real del proyecto. En el aplicativo anterior estaba escrita a mano con un dominio fijo y la forma fea de la URL, así que toda página publicada declaraba una canónica que apuntaba a otro sitio.

### GEO — motores de respuesta

`resumenParaIA` · `temaPrincipal` · `autor` · `fechaPublicacion` · `fechaActualizacion` · `hechosClave` (3–7) · `preguntasFrecuentes` · `permitirIA`

Cuando `permitirIA` está desactivado, se emiten las directivas de exclusión para los rastreadores de IA conocidos.

### Datos estructurados

`tipo` — página genérica, artículo, entrada de blog, producto, servicio, preguntas frecuentes, página sobre nosotros, página de contacto, negocio local.

---

## 6. Errores del aplicativo anterior que no se repiten

Lista corta y concreta. Cada uno costó algo.

1. **Controles que no hacen nada.** Había un campo de CSS personalizado que se guardaba en la base de datos y no se aplicaba jamás. Si un campo aparece, funciona.
2. **Funciones inalcanzables.** El botón de historial de versiones comprobaba un identificador que nunca se asignaba, así que siempre respondía "guarda la página primero". Toda la función —interfaz, dos endpoints, tabla, limpieza automática— era inaccesible.
3. **Editor y publicación que no coinciden.** Un elemento existía en el editor y no en el renderer público: se componía, se veía en la vista previa, se guardaba, y desaparecía al publicar. Y el margen por defecto de los elementos difería en 6 píxeles entre uno y otro.
4. **Vista previa responsive que miente.** Los bloques nuevos usaban consultas de ventana en lugar de consultas de contenedor, así que en la vista previa móvil seguían mostrándose a tres columnas.
5. **Permisos solo en el cliente.** La lista de administradores estaba escrita en el HTML del navegador y ningún endpoint la verificaba.
6. **Marca del cliente cableada en el motor.** Los tokens que el producto llamaba "de marca" eran la paleta de un cliente concreto.
7. **Un parser por servicio.** LinkedIn, YouTube, HubSpot, formularios, mapas y feeds tenían cada uno su propio código de reconocimiento, con su propio manejo de errores y ningún respaldo para correo.
8. **Sin gestión de archivos.** Todas las imágenes eran URLs que el usuario pegaba a mano, incluida la foto de fondo del acceso, servida desde un enlace de terceros.
9. **Borrado sin retorno.** Eliminar un proyecto lo borraba de verdad, sin papelera, y dejaba huérfano su historial de versiones.
10. **Etiquetas de texto alternativo pedidas pero no exigidas.** Se pedía el `alt` y no pasaba nada si faltaba.
