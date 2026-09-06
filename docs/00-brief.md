# Fast Creative Builder — Brief corregido y plan de construcción

**Versión:** 6 · 6 de septiembre de 2026
**Reemplaza a:** `Fast_Creative_Builder_Especificacion_Funcional.docx` + texto complementario + respuestas del 5 de septiembre
**Destino:** `fast-creative-builder.gamonal.app`
**Estado:** contrato funcional para aprobación. Nada implementado.

---

## Contexto: por qué existe este documento

Hay un aplicativo anterior, **Easy Web Builder**, que funciona pero está mal resuelto en tres frentes que son justamente el corazón de lo que se pide ahora: no controla el espaciado (cada bloque inyecta márgenes que el usuario no puso y no puede editar), no tiene superposición (todo es flujo vertical, no se puede poner un texto sobre una imagen), y tiene tres motores de render distintos que ya divergieron entre sí.

Fast Creative Builder se construye **desde cero**. De Easy Web Builder se toma únicamente el conocimiento de qué campos necesita cada componente —ya extraído y en contexto—. No se hereda código, ni modelo de datos, ni diseño de interfaz, ni contenido.

El brief original tenía cuatro contradicciones internas y diecisiete decisiones abiertas. Este documento las resuelve todas y consolida ambos textos en un solo contrato.

---

## 1. Decisiones tomadas

| # | Tema | Decisión |
|---|---|---|
| 1 | Punto de partida | Proyecto nuevo. Repositorio Git privado desde el primer commit. |
| 2 | Radar | **Eliminado de todo.** Se borra la carpeta de referencia completa (ver §16). |
| 3 | Marca | Zurich es la base de las creatividades y de la interfaz, con licencia total. El motor es multimarca. |
| 4 | Tipografías | **Zurich Sans y Arial.** El aplicativo incluye subida de tipografías propias. |
| 5 | Desarrollo | Se construye y valida en local. Aprobado, se entrega para GitHub → Cloudflare. La subida la haces tú. |
| 6 | Dominio | `fast-creative-builder.gamonal.app` |
| 7 | Acceso | Invitación por correo. El administrador crea la cuenta, la persona define su contraseña. |
| 8 | Escala | Máximo 15 usuarios. |
| 9 | Biblioteca | **Logos, imágenes y tipografías.** Iconos: set del sistema. Videos: enlazados. |
| 10 | Materiales | Sin capa compartida. Cada usuario ve solo lo suyo. El administrador ve todo. |
| 11 | SEO y GEO | Sí, para el modo Web. |
| 12 | Prioridad de salida | **HTML es la prioridad.** JPG y PNG se resuelven sin coste, con las limitaciones de §5. |
| 13 | Papelera | Sí, con restauración. |
| 14 | Modo oscuro | Sí, en la interfaz del aplicativo. |
| 15 | Idioma | Solo español. |
| 16 | Plantillas | **Fuera por ahora.** Ni de fábrica ni biblioteca de plantillas. |
| 17 | Contenido dinámico y A/B | **Fuera por ahora.** |
| 18 | Formularios | **Externos.** El aplicativo garantiza que se puedan embeber o insertar. |
| 19 | Mapa | Sin clave de pago. OpenStreetMap con Leaflet, como prueba. |
| 20 | Video | Pierde la fuente "archivo". Quedan YouTube/Vimeo y portada enlazada. |
| 21 | Audio / Podcast | **Se añade** al catálogo. |
| 22 | Iconos | Elijo yo el set y te lo muestro antes de integrarlo. |
| 23 | Inserción externa | **Un formato único** para embeber YouTube, Spotify, podcasts, formularios, Power BI, Looker Studio, HTML y demás. Ver §11. |
| 24 | Sitecore | Las landings pueden acabar en Sitecore. Se añade un modo de exportación **Fragmento**, encapsulado y listo para insertar. Ver §17. |

### Contradicciones del brief original, resueltas

- **`/proyectos`** decía "general / permisos / usuarios" — pegado desde `/configuracion`. Se usa la definición correcta.
- **Biblioteca**: el documento pedía cinco tipos, el texto complementario dos. Queda en tres, distintos de ambos: logos, imágenes y **tipografías**.
- **Materiales compartidos**: gana la versión restrictiva.
- **Acceso**: gana invitación por correo.
- **Rutas con tilde** (`/configuración`, `/imágenes`): se normalizan sin acentos.
- **"Trabaja sobre el aplicativo existente"**: instrucción heredada de plantilla. La auditoría que pedía ya está hecha.

---

## 2. Producto

Constructor visual para **key visuals, gráficas digitales, landing pages y email marketing**. Interfaz en español, directa, sin tecnicismos. Edición visual con resultado inmediato.

**Tres modos sobre un mismo motor:**

| Modo | Construcción | Exportación |
|---|---|---|
| **Web** | Contenedores flex/grid, overlays, interacciones, estilos por breakpoint | HTML funcional + JPG + PNG. ZIP con CSS, JS y recursos |
| **Email** | Filas y bloques compatibles, 600 px inicial, apilado mobile, fallbacks visibles | HTML con CSS inline + JPG + PNG + texto plano. Sin JavaScript |
| **Estilo libre** | Mesa de trabajo, posición libre, capas, guías, rotación, recorte, formatos | HTML de composición + JPG + PNG |

El resultado puede ser un **mockup** o una **landing publicable**; en ambos casos el entregable central es HTML, que tú subes cuando decidas.

**Fuera de alcance:** envío de campañas, journeys, ecommerce, CMS, publicación automática, contenido dinámico, A/B, plantillas. El aplicativo nunca toca GitHub ni Cloudflare por su cuenta.

---

## 3. La decisión que lo determina todo: el catálogo es dato, no código

Easy Web Builder implementa sus 57 componentes como 53 casos de `switch` repartidos en tres archivos. Ya divergieron: un elemento se compone en el editor y desaparece al publicar, y hay 6 píxeles de diferencia entre lo que se ve y lo que se exporta.

Fast Creative Builder tiene **64 componentes con variantes obligatorias** por tres modos, tres breakpoints, cuatro estados y tres formatos de salida. Con un `switch` no se llega ni a la mitad.

Cada componente se declara como **manifiesto de datos**:

```
{
  tipo, nombre, icono, categoría,
  anatomía:    slots con su tipo y sus reglas de anidación
  campos:      esquema tipado (texto, número, color, enlace, imagen, lista, enum…)
  variantes:   lista, con la predeterminada, y el mapeo de contenido entre ellas
  controles:   qué grupos del inspector aplican y cuáles propios añade
  modos:       comportamiento y fallback en Web / Email / Libre
  captura:     qué estado se congela en JPG/PNG y en el fallback de Email
  render:      web(nodo) → HTML · email(nodo) → tablas con CSS inline
}
```

De ahí se generan solos la tarjeta del panel, el inspector, la validación, la serialización, el fallback y las tres exportaciones. Añadir un componente es escribir un manifiesto y dos funciones de render.

**Un solo motor.** Las funciones de render son puras (`nodo → string`), viven en el núcleo y las consumen por igual el editor, el exportador y el rasterizador. No hay una segunda implementación en ningún sitio.

---

## 4. Modelo de datos

Un **árbol recursivo**, no una lista plana. Es el cambio estructural frente a Easy Web Builder, donde un bloque era una caja negra de un solo nivel.

```
Nodo {
  id, tipo, nombre
  padre, orden
  variante
  slots: { nombre: [ids de hijos] }
  contenido: { … }
  estilos: {
    base:   { … }              // desktop, estado normal
    tablet: { … }              // solo sobrescrituras
    mobile: { … }
    hover / focus / active     // solo propiedades distintas
  }
  disposicion: 'flujo' | 'overlay'
  overlay?: { x, y, ancla, z }
  visibilidad: { desktop, tablet, mobile, rol }
  captura?: { slide | pestaña | panel | estado }
  bloqueado, oculto
}
```

**Tres reglas que se cumplen desde el primer commit:**

1. **Todo nodo nuevo nace con `margin: 0`, `padding: 0`, `gap: 0`.** Ningún componente y ningún reset introduce separación que el usuario no vea en el inspector. Se envía un reset propio que normaliza títulos, párrafos, listas, imágenes y botones a cero.

2. **`disposicion: 'overlay'` saca al nodo del flujo.** Coordenadas relativas al padre, no a la página. No empuja hermanos, no crea filas, no aumenta la altura del padre. Al soltar sobre un componente, el editor **pregunta** "insertar dentro" o "superponer"; nunca decide solo.

3. **`0`, `auto` y vacío son tres cosas distintas.** `0` es un valor explícito, `auto` es una regla, vacío significa heredado. Ni la interfaz ni los datos los confunden.

**El estado de captura vive en el nodo desde el día uno**, no se atornilla al final.

---

## 5. Exportación de JPG y PNG sin coste — expectativa realista

Descartada la rasterización de pago, el camino es **capturar el DOM en el navegador** con `modern-screenshot`, embebiendo tipografías como datos y sirviendo todos los recursos desde el mismo origen.

Te lo digo claro para que no haya sorpresa en la fase 5: **esto no alcanza el 100% de fidelidad.** Funciona muy bien con tipografía, color, imágenes, bordes, radios, degradados lineales, flex y grid. Falla o aproxima en filtros CSS, modos de mezcla, sombras internas, máscaras complejas y algún degradado cónico.

Propongo tres mitigaciones:

- **El motor evita generar lo que no se puede capturar.** Como controlamos el render, los componentes usan solo CSS que sabemos rasterizar. Los efectos exóticos quedan disponibles pero marcados con un aviso de "puede variar en JPG/PNG".
- **Comparación visual antes de descargar**: el aplicativo muestra la captura junto a la vista previa para que apruebes antes de exportar.
- **El criterio de aceptación se ajusta**: en lugar de "visualmente equivalentes", queda **"HTML idéntico a la vista previa; JPG y PNG fieles salvo aviso explícito del propio aplicativo"**.

Si en algún momento quieres fidelidad total, se cambia el rasterizador sin tocar nada más: el motor de render ya está separado.

---

## 6. Stack

Todo gratuito y todo corre igual en local y desplegado.

| Capa | Elección | Nota |
|---|---|---|
| Lenguaje | TypeScript | 64 manifiestos tipados es lo único que hace verificable el catálogo |
| Núcleo | Paquete puro sin framework: árbol, registro, render web, render email, exportadores | El mismo código en editor y exportación |
| Editor | React + Vite, estado inmutable con historial, `dnd-kit` | Deshacer/rehacer de 50 pasos exige inmutabilidad |
| Backend | Cloudflare Workers (plan gratuito) | `wrangler dev` reproduce producción en local |
| Base de datos | D1 | Con 15 usuarios va sobrado |
| Archivos | R2 | Logos, imágenes y tipografías |
| Correo | Resend (plan gratuito) | Solo invitaciones y recuperación |
| Rasterización | `modern-screenshot` en el navegador | Ver §5 |
| CSS de Email | Inlining propio con allowlist | Ningún paquete hace exactamente lo que pide §12 |

**Aviso sobre R2:** tiene 10 GB gratis, de sobra para 15 usuarios, pero Cloudflare exige una tarjeta registrada para activarlo aunque no cobre. Si prefieres no registrarla, la alternativa es limitar las subidas a 1 MB y guardarlas en D1, con pérdida de calidad en imágenes grandes. Dime cuál prefieres.

---

## 7. Navegación

| Ruta | Función |
|---|---|
| `/login` | Usuario y contraseña |
| `/invitacion/:token` | La persona invitada define su contraseña |
| `/recuperar` | Recuperar acceso |
| `/home` | Accesos directos, proyectos recientes, borradores y pendientes |
| `/crear` | Elegir Web, Email o Estilo libre |
| `/crear/web/:proyecto` · `/crear/email/:proyecto` · `/crear/libre/:proyecto` | Los tres editores |
| `/proyectos` | Buscar, filtrar, duplicar, archivar y abrir |
| `/proyectos/:proyecto` | Ficha, estado, versiones, permisos y exportaciones |
| `/proyectos/papelera` | Restaurar o eliminar definitivamente |
| `/biblioteca/logos` · `/biblioteca/imagenes` · `/biblioteca/tipografias` | Los tres tipos de recurso |
| `/configuracion/general` | Marca, formatos, estilos globales y valores iniciales |
| `/configuracion/permisos` | Invitar personas y definir su alcance |
| `/configuracion/usuarios` | Usuarios creados, su estado y sus permisos |

**Permisos**, verificados **en el servidor**. Easy Web Builder tenía la lista de administradores escrita en el HTML del navegador y ningún endpoint la comprobaba.

- **Administrador** (solo tú): ve y administra todo, aprueba, exporta, invita, otorga y quita accesos.
- **Usuario**: ve, edita, guarda y exporta solo sus proyectos; usa solo los materiales que él subió.

---

## 8. Editor

| Zona | Contenido |
|---|---|
| Barra superior | Volver, nombre, estado de guardado, deshacer/rehacer, dispositivo, vista previa, estado, exportar |
| Panel izquierdo | Componentes, estructuras, biblioteca, capas, búsqueda |
| Lienzo | Edición en vivo, guías, zonas de inserción, selección y edición directa |
| Panel derecho | Contenido · Estilo · Disposición · Avanzado |
| Barra inferior | Zoom, ajustar al lienzo, cuadrícula/guías, tamaño activo |

**Cinco niveles de selección**, con ruta visible —`Carrusel › Slide 2 › Contenedor de texto › Botón`— y posibilidad de subir de nivel sin perder la selección: lienzo, componente, contenedor interno, elemento y capa superpuesta.

---

## 9. Inspector

Diecisiete grupos generados desde el manifiesto: Tamaño · Margen externo · Espacio interno · Separación · **Mapa de caja** editable que resalta el área en el lienzo · Layout · Posición · Overflow · Tipografía · Color y fondo · Borde y radio · Imagen y media · Efectos · Transformación · Visibilidad · Interacción · Accesibilidad.

**Reglas transversales:**

- Cada control indica si su valor es **Global, Heredado, Local o de Estado**, y permite restablecer.
- Desktop es la base; tablet y mobile heredan. Editar crea solo esa sobrescritura.
- Normal es la base de estados; hover, focus y active guardan solo lo que difiere.
- **Tokens globales** de color, tipografía, espaciado, radio, sombra, ancho y botón.
- Todo control numérico admite escritura y teclado. Los sliders nunca son la única vía.
- **Ningún control decorativo.** Easy Web Builder tiene un campo "CSS personalizado" que se guarda y jamás se aplica, y un botón de Historial que nunca abre porque comprueba un identificador que no existe. Aquí, si un campo aparece, funciona, se guarda y admite deshacer.

---

## 10. Catálogo — 65 componentes

**Un componente no está terminado si solo existe su tarjeta en el panel:** deben funcionar su anatomía, todas sus variantes, sus controles, su responsive, su guardado y sus tres exportaciones.

| Categoría | N.º | Componentes |
|---|---|---|
| **Estructura y distribución** | 10 | Sección · Contenedor interno · Columnas · Cuadrícula · Pila · Grupo · Lista repetidora · Espaciador · Separador · Forma y fondo |
| **Texto, imagen y acciones** | 18 | Título · Texto enriquecido · Texto en trayectoria · Imagen · Logo · Imagen + texto · Botón/CTA · Icono individual · Bloque de iconos · Lista de iconos · Tarjeta · Tabla · Video · Playlist de video · **Audio/Podcast** · **Inserción** · Código QR · Redes sociales |
| **Marketing y presentación** | 21 | Portada/hero · Carrusel de portada · Banner · Galería · Portfolio · Antes/después · Imagen con hotspots · Beneficios · Testimonios · Valoración · Precios · Comparador · Métricas/KPIs · Pasos/línea de tiempo · Progreso · Gráfico · Llamado final · Nube de logos · FAQ/acordeón · Pestañas · Cuenta regresiva |
| **Navegación, datos y Email** | 16 | Menú · Breadcrumb/índice · Ancla · Formulario · Campo de formulario · Acceso/login · Búsqueda · Popup/modal · Mapa · **Panel de datos** · HTML/código · Contenido externo/feed · Cabecera de Email · Preheader de Email · Layout de Email · Pie legal de Email |

Las variantes obligatorias son las del documento original, que sigue siendo anexo vinculante. **Cambios sobre ese catálogo:**

- **Fuera:** Contenido dinámico y Contenido A/B.
- **Dentro:** Audio / Podcast y **Panel de datos** (Power BI, Looker Studio y similares).
- **Embed / animación** se convierte en **Inserción**, el componente genérico del sistema de §11.
- **Video** pierde la fuente "archivo".
- **Mapa** usa OpenStreetMap con Leaflet, sin clave.

**Formularios.** Como son externos, **Formulario** pasa a ser una inserción especializada: acepta el código o la URL de un servicio externo y lo enmarca con los estilos del proyecto. **Campo de formulario** se conserva con sus 12 tipos pero **solo para maquetar**: dibuja el campo con el estilo de la marca para mockups y capturas, no envía nada, y va marcado como visual en la interfaz.

---

## 11. Sistema de inserción de contenido externo

Este es el segundo subsistema transversal del aplicativo, junto al registro de componentes. Existe porque hay ocho componentes que hacen esencialmente lo mismo —traer algo de fuera y enmarcarlo— y no pueden resolverlo cada uno por su cuenta.

Easy Web Builder es el contraejemplo exacto: tiene un parser distinto para LinkedIn, otro para YouTube, otro para HubSpot, otro para Google Forms, otro para mapas y otro para feeds RSS. Cada uno con su propio manejo de errores, sus propias medidas y ningún respaldo para email.

### 11.1 Un solo formato

Cualquier componente que inserte contenido externo guarda exactamente esta estructura:

```
insercion: {
  proveedor:   identificador del servicio reconocido, o 'generico'
  entrada:     lo que pegó el usuario, tal cual, para poder reeditarlo
  url:         URL canónica de embebido, derivada automáticamente
  parametros:  opciones propias del proveedor (inicio, tema, controles, página…)
  proporcion:  16:9 · 4:3 · 1:1 · A4 · auto · personalizada
  alto:        número o automático
  titulo:      etiqueta accesible, obligatoria
  poster:      imagen de respaldo, automática cuando el proveedor la ofrece
  fallback:    qué se muestra en Email y en JPG/PNG
  permisos:    atributos de aislamiento del marco
}
```

### 11.2 Un solo campo para pegar

El usuario pega **lo que sea** —una URL, un `<iframe>` completo, un código de inserción, un identificador— en un único campo. El sistema reconoce el servicio, deriva la URL canónica, aplica la proporción correcta, busca la miniatura si existe y muestra la vista previa en vivo. Sin pestañas por tipo de servicio, sin "pega aquí el código de HubSpot" repetido en cinco sitios.

Si no reconoce el proveedor, cae en modo genérico: valida que el dominio esté permitido y pide proporción y título a mano.

### 11.3 Proveedores como datos, no como código

Igual que el catálogo de componentes, cada proveedor es un manifiesto:

```
{ id, nombre, icono,
  reconoce:    patrones de URL y de código de inserción
  normaliza:   entrada → URL canónica
  dominios:    lista permitida, alimenta la política de seguridad
  proporcion:  valor por defecto
  parametros:  esquema de sus opciones propias
  poster:      cómo obtener la miniatura, si la hay
  email:       comportamiento y respaldo en correo }
```

Añadir un servicio nuevo es escribir un manifiesto. Ninguna otra parte del aplicativo se entera.

**Proveedores del primer lote:**

| Familia | Servicios |
|---|---|
| Video | YouTube, Vimeo, Loom, Wistia |
| Audio | Spotify (tema, álbum, lista, podcast), Apple Podcasts, SoundCloud, iVoox, archivo MP3 enlazado |
| Datos | **Power BI**, **Looker Studio**, Tableau Public |
| Formularios | Google Forms, Typeform, HubSpot, Jotform, Microsoft Forms |
| Mapas | OpenStreetMap, Google Maps |
| Agenda | Calendly |
| Diseño | Figma, Canva |
| Social | LinkedIn, Instagram, X, Facebook, TikTok |
| Tablas | Airtable, Google Sheets publicado |
| Animación | GIF, Lottie |
| Genérico | Cualquier dominio de la lista permitida |
| Código | HTML propio, **solo administrador** |

### 11.4 Seguridad

- **Lista de dominios permitidos**, gestionable desde `/configuracion/general`. Nada fuera de ella se inserta.
- Todo marco insertado lleva **aislamiento** con los permisos mínimos que el proveedor necesite.
- **HTML y JavaScript propios solo para el administrador**, como ya pedía el brief original.
- En Email se **elimina todo script** y se aplica la allowlist de propiedades.

### 11.5 Respaldo obligatorio en Email y en imagen

Ningún marco insertado sobrevive ni a un cliente de correo ni a una captura de pantalla. Por eso **toda inserción exige un respaldo**, y el aplicativo no deja exportar sin él:

- **Poster enlazado** — imagen de portada con el enlace al contenido. Es el predeterminado, y se genera solo cuando el proveedor ofrece miniatura (YouTube, Vimeo, Spotify).
- **Imagen propia** — la que suba el usuario.
- **Texto enlazado** — un botón o enlace con el título.

Esto conecta directamente con la limitación de §5: como los marcos externos nunca se rasterizan, el respaldo es lo que aparece en JPG y PNG. No es una concesión, es la única forma correcta.

### 11.6 Quién lo usa

Consumen este sistema, con la lista de proveedores filtrada y sus controles propios encima: **Inserción** (genérico), **Video**, **Playlist de video**, **Audio/Podcast**, **Panel de datos**, **Formulario**, **Mapa**, **Contenido externo/feed** y **HTML/código**.

---

## 12. Marca, tokens y tipografías

La marca **no se cablea en el motor**. Es un conjunto de tokens que se selecciona por proyecto.

- **Zurich viene precargada** como marca base: paleta, escala, radios y sombras, aplicando el manual con las licencias que exige un editor visual.
- **Tipografía**: Zurich Sans como principal y Arial como secundaria y respaldo. Como Zurich Sans no es una fuente web pública, el aplicativo incluye **subida de tipografías** en `/biblioteca/tipografias`: aceptas WOFF2, WOFF, TTF y OTF, defines familia, peso y estilo por archivo, y el aplicativo genera las declaraciones `@font-face` y las incrusta en los HTML exportados. Sin subir nada, se usa Arial.
- Se pueden **definir otras marcas** desde `/configuracion/general`.
- **Ningún hex suelto en el código de los componentes.** Los valores por defecto referencian tokens. Éste fue el error más caro de Easy Web Builder: los tokens que llamaba "de marca" eran la paleta de un cliente, hardcodeada en el motor.

---

## 13. Reglas de Email

- Lienzo de 600 px, editable hasta 640. Fondo exterior separado del contenido.
- CSS inline, estructuras seguras basadas en tablas, allowlist de propiedades.
- Prioridad a `px` y `%`; se ocultan las propiedades incompatibles.
- No se exporta `absolute`, `fixed`, `sticky`, z-index complejo ni JavaScript.
- Apilado, orden y separación mobile definidos de forma explícita.
- Carrusel, pestañas, acordeón, popup, video, formulario y contador **requieren fallback elegido**.
- Validación de preheader, alt, enlaces, contraste, desuscripción y desborde horizontal.
- Vista previa desktop/mobile y tema claro/oscuro.

---

## 14. Estilo libre

- Mesas de trabajo: desktop, tablet, mobile, 1080×1080, 1080×1350, 1080×1920, 1200×628 y personalizado.
- Capas con nombre, búsqueda, orden, bloqueo y ocultación.
- Mover, redimensionar, rotar, voltear, recortar y fijar proporción.
- Agrupar, alinear, distribuir, traer al frente, enviar atrás.
- Reglas, cuadrícula, guías, imantado, X/Y exactos y anclas.
- Máscaras: círculo, rectángulo redondeado y forma personalizada.
- Duplicar formato manteniendo el contenido vinculado o separándolo por tamaño.

---

## 15. SEO y GEO — modo Web

- **SEO**: título con plantilla, descripción, imagen para compartir, canónica, index/follow, contadores de caracteres y vista previa del resultado en buscador.
- **Open Graph y Twitter Card** completos, con tipo coherente con el contenido.
- **GEO**: resumen para IA, tema principal, autor, fechas, hechos clave, preguntas frecuentes y control de acceso por bot.
- **Datos estructurados**: página, organización, negocio local y FAQ.
- **Corregido**: en Easy Web Builder la canónica apuntaba siempre a `https://easy-web-builder.gamonal.app/p.html?slug=X`, con el dominio y la forma de URL escritos a mano. Aquí se deriva del dominio real del proyecto.

---

## 16. Guardado y exportación

- **Autosave** al terminar cada acción, con estado visible y recuperación tras recarga.
- **Historial** de al menos 50 acciones, más versiones manuales con nombre y fecha.
- **Estados**: Borrador → En revisión → Aprobado → Exportado. Solo el administrador aprueba.
- **Papelera** con restauración; el borrado definitivo es explícito y confirmado.
- **HTML** en los tres modos, con las reglas de cada uno.
- **JPG y PNG** de la mesa o el breakpoint activo, o en lote, con tamaño, escala, calidad y fondo, según §5.
- **Antes de rasterizar** se elige slide, pestaña, panel, popup, frame y estado visual.
- **Entrega** como HTML autocontenido o ZIP con `index.html` y `/assets`, rutas relativas y nombres seguros.

**Límites de subida propuestos:** imágenes hasta 10 MB en JPG, PNG, WebP, AVIF y SVG; logos hasta 5 MB en SVG, PNG y WebP; tipografías hasta 2 MB en WOFF2, WOFF, TTF y OTF. Cuota de 500 MB por usuario. Todo se puede ajustar.

---

## 17. Compatibilidad con Sitecore

Las landings pueden terminar en Sitecore, el gestor de contenidos de la empresa. Eso no cambia el motor, pero sí impone condiciones al HTML que sale, porque una pieza que se pega dentro de un CMS ajeno convive con el CSS, el JavaScript y el marcado de ese CMS.

Si el HTML sale como una página completa con su propio reset, al insertarlo en Sitecore pasa una de dos cosas: o nuestro reset arrasa con la tipografía del sitio, o el CSS del sitio deforma nuestra pieza. Las dos son inaceptables.

### 17.1 Modo de exportación "Fragmento"

Se añade un cuarto formato de salida, junto a HTML completo, JPG y PNG. Entrega tres archivos más los recursos:

- **`fragmento.html`** — solo el marcado de la pieza, sin `<html>`, `<head>` ni `<body>`, envuelto en un contenedor raíz único.
- **`fragmento.css`** — todo el CSS **encapsulado bajo ese contenedor raíz**, con las clases prefijadas. Ni una sola regla global. El reset a cero, que en modo página completa es global, aquí vive únicamente dentro del contenedor.
- **`fragmento.js`** — solo si la pieza tiene interacción. Sin variables globales, con arranque automático por atributo de datos y **tolerante a varias instancias en la misma página**. Easy Web Builder cometió justo el error contrario: metía un `<script>` dentro del HTML que inyectaba, y ese script nunca se ejecuta, así que el carrusel del renderer público está roto desde siempre.

### 17.2 Rutas de recursos configurables

Sitecore sirve sus medios desde sus propias rutas. Al exportar se elige entre rutas relativas, una URL base que se antepone a todo, o dejar marcadores para que los reemplace quien publique. Se entrega además un listado de los recursos usados.

### 17.3 Marcado de campos editables

Opcional, pero es lo que convierte una maqueta en algo aprovechable de verdad. Cada texto, imagen y enlace puede salir con un atributo que lo identifique, más un archivo con el listado de campos —nombre, tipo, valor por defecto—. Con eso, quien monte el componente en Sitecore sabe en un vistazo qué es contenido editable y qué es estructura, en vez de tener que deducirlo del marcado.

### 17.4 Reglas que aplican siempre

- Clases prefijadas, sin colisiones con nombres genéricos.
- Sin selectores de elemento desnudos fuera del contenedor raíz.
- Sin `!important` salvo donde sea inevitable, y documentado.
- HTML semántico y válido, con una jerarquía de encabezados coherente.
- La pieza se comporta bien aunque la envuelvan en contenedores adicionales, que es lo que hace el editor de Sitecore.

### 17.5 Email

Si el correo se envía desde Sitecore Send, el HTML con CSS inline y estructura de tablas que ya produce el modo Email es directamente importable. No requiere trabajo adicional.

### 17.6 Versión de Sitecore: pendiente, y no bloquea

No sabemos aún qué versión usa la empresa. **No hace falta saberlo para arrancar:** el formato Fragmento sirve igual para todas, porque el trabajo duro —encapsular el CSS, aislar el JavaScript, hacer configurables las rutas y marcar los campos— es el mismo en cualquier caso.

Lo único que cambia según la versión es un añadido opcional al final:

- **XM Cloud** (headless, front en React): tendría sentido generar además el esqueleto del componente con sus campos ya mapeados. Se añade cuando se confirme.
- **XP o XM clásico** (.NET, renderings en Razor): el fragmento más el listado de campos ya es el entregable correcto. No hace falta nada más.

Se retoma cuando lo averigües.

---

## 18. Eliminación de Radar y de la referencia

Radar desaparece por completo: ni paleta, ni iconos, ni copy, ni assets, ni el nombre en ningún archivo.

La carpeta `referencia-anterior` —que contiene Easy Web Builder y todos los assets de Radar, incluido el `.zip`— **se borra**. Propongo hacerlo **al cerrar la fase 0**, no antes, por una razón práctica: el conocimiento del catálogo está en mi contexto de esta sesión, pero si la sesión se corta lo pierdo. En la fase 0 lo dejo escrito como documento de referencia de campos, ya sin rastro de Radar, dentro del repositorio nuevo. Con eso guardado, la carpeta se borra y no vuelve.

Si prefieres borrarla ya mismo, se borra y asumo el riesgo.

---

## 19. Entregables de producto e identidad

Faltaban en la versión 5 porque el brief se redactó sin leer
`reglas-creacion-aplicativos`. Son obligatorios.

### 19.1 Identidad del aplicativo

Logo propio, derivado del nombre y la función, con el lenguaje visual Zurich.
De un mismo concepto salen todas las piezas:

| Archivo | Formato |
|---|---|
| `logo_fast_creative_builder.svg` | Vectorial |
| `logo_fast_creative_builder.png` | Fondo transparente, alta resolución |
| `icono_fast_creative_builder.ico` | ICO real y multirresolución, para acceso directo e instalador |
| `icono_fast_creative_builder_1000x1000.png` | 1000 × 1000 reales, para audiovisual |
| Favicon | Integrado y comprobado dentro del aplicativo |

El logotipo de Zurich no se sustituye ni se modifica: la marca del aplicativo
es propia y convive con la de Zurich según las reglas de co-branding.

### 19.2 Capturas y portada

Tres capturas reales del producto funcionando, en 1920 × 1080 y JPG de calidad:
pantalla principal, función diferencial y resultado. Más
`portada_presentacion_fast_creative_builder.jpg`, también 1920 × 1080.

### 19.3 Documentación

- `documentacion_general_tecnica_fast_creative_builder.docx`
- `descripcion_publicitaria_fast_creative_builder.docx`
- `descripcion_archivos_fast_creative_builder.docx`, después de la aprobación

### 19.4 Nomenclatura

`tema_nombre_proyecto.extension`, en minúsculas, sin espacios, acentos ni ñ.

### 19.5 Cómo se entrega

Cada entrega se abre con **doble clic o con una URL**. Nunca con la consola:
instalar, configurar, compilar y arrancar es responsabilidad mía.

---

## 20. Diseño de interfaz: el proceso que faltaba

La versión 5 no decía nada sobre cómo se diseña la interfaz. Sin ese proceso,
la primera implementación salió mal y hubo que rehacerla entera.

- **Tres propuestas de mockup de alta fidelidad** antes de tocar la
  implementación, materialmente distintas en navegación, composición,
  densidad, interacción e identidad. Se eligen una y se implementa esa.
- **Cuadrícula de 12 columnas** en escritorio y **escala de espaciado de 8 px**.
- **Investigar tres productos comparables** antes de fijar la navegación.
- **Login con fotografía real de Envato**, a página completa, con panel de
  formulario y área visual diferenciados. Nunca una tarjeta sobre fondo plano.
- **Cuerpo de texto a 16 px**; pesos 400, 500 y 600.
- **Área táctil mínima de 44 px** en todo control.
- **Radio único entre 5 y 10 px** en todo el sistema. Se fija en 8.
- Sin sombras cromáticas, degradados, brillos ni difuminados.
- Ningún color sobre su misma familia; las superficies se separan con fondos
  sólidos, nunca con líneas ni filetes decorativos.
- Ningún home resuelto como acumulación de cards blancas.
- `DECISIONES-VISUALES.md` y `ENVATO_ASSETS.md` se mantienen al día.

**Dirección visual.** La estructura, la composición, la personalidad y los
criterios son de `lineamientos-marca-gamonal`. Zurich aporta el color y la
tipografía, mapeados a los roles de Gamonal.

---

## 21. Fases

El orden de la versión 5 estaba mal: ponía la infraestructura primero y el
editor —que es el producto— en la fase 3. Se invierte, para que cada fase
entregue algo que se pueda ver y usar.

| Fase | Resultado | Cómo se comprueba |
|---|---|---|
| **0 · Acceso** | Repositorio, sesión, invitación por correo, roles en servidor | Invitas una cuenta, entra y no ve nada tuyo |
| **1 · Interfaz** | Tres propuestas de la interfaz completa, elección e implementación de la elegida, con identidad, favicon y todas las rutas navegables | Recorres el aplicativo entero y nada parece de mentira |
| **2 · Base espacial** | Árbol de nodos, cinco niveles de selección, cero espaciado automático, flujo y superposición, arrastre, historial | 50 movimientos seguidos sin pérdidas ni espacios ocultos |
| **3 · Estilos** | Inspector completo, mapa de caja, tokens, tipografías subidas, estados, breakpoints | Un cambio en tableta no altera escritorio |
| **4 · Componentes** | El catálogo por categoría, con cantidades, variantes y respaldos | Cada componente pasa su lista de aceptación |
| **5 · Modos y biblioteca** | Reglas web, email y libre; biblioteca, proyectos, papelera | La misma pieza se comporta bien en los tres modos |
| **6 · Exportación** | HTML, fragmento, JPG y PNG, con validación y comparación visual | Los archivos abiertos coinciden con la vista previa |

La fase 4 sigue siendo el grueso del trabajo. Se valida una categoría a la vez.

---

## 22. Criterios de aceptación

| Área | Terminado cuando… |
|---|---|
| Componentes | Cada fila del catálogo cumple anatomía, cantidades, variantes, controles, responsive, fallback y exportación |
| Separación | Un nodo nuevo tiene margin, padding y gap en 0, y no aparece ningún espacio que el usuario no pueda identificar y editar |
| Superposición | Un texto o CTA sobre imagen o hero no crea fila, no empuja hermanos y conserva X/Y al recargar |
| Selección | La ruta del inspector identifica lienzo, componente, contenedor, elemento y capa sin ambigüedad |
| Responsive | Los cambios heredados y locales funcionan sin duplicar nodos ni alterar otros breakpoints |
| Arrastre | 50 movimientos consecutivos sin pérdidas, duplicados, cambios de estilo ni espacios ocultos |
| Permisos | Un usuario no ve trabajos ajenos ni accede por URL a funciones de administrador |
| Exportación | El HTML es idéntico a la vista previa en los tres modos. JPG y PNG son fieles salvo aviso explícito del aplicativo |
| Interfaz | No hay botones simulados, valores invisibles ni tecnicismos sin ayuda breve |
| Publicación | El aplicativo no modifica GitHub ni Cloudflare automáticamente |
| Radar | Cero coincidencias de "radar" en todo el repositorio |

---

## 23. Lo que necesito de ti antes de arrancar

1. **R2 o D1** para los archivos: R2 pide tarjeta registrada aunque no cobre; D1 obliga a limitar las subidas a 1 MB.
2. **Los archivos de Zurich Sans**, si los tienes, para cargarlos como tipografía base.
3. **Confirmar cuándo borro** `referencia-anterior` (§18): al cerrar la fase 0, o ahora mismo.
4. **Crear el repositorio privado en GitHub** y decirme el nombre, o autorizarme a crearlo con `gh`.

Nada de esto bloquea la fase 0 salvo el punto 4. Los demás se pueden resolver sobre la marcha.

---

> **Nota sobre los archivos de este brief.** Este `.md` es el documento canónico:
> es el que se edita y el que se versiona. `00-brief-v5-word.docx` es el mismo
> contenido en Word, congelado en la versión 5, para compartir con quien no
> lea Markdown. Si los dos difieren, manda el `.md`.
