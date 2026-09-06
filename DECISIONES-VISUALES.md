# Decisiones visuales

Registro de correcciones y rechazos, obligatorio según `lineamientos-marca-gamonal`.
Se lee **antes** de presentar cualquier propuesta y se amplía después de cada ronda.

| ID | Pieza o pantalla | Corrección o rechazo | Decisión vigente | Estado |
|---|---|---|---|---|
| DEC-001 | Interfaz completa (v1) | Rechazada por el usuario: «lo más horrendo que he visto», «no hay nada». Se construyó sin leer `reglas-creacion-aplicativos`, `ui-ux-aplicativos-gamonal` ni `lineamientos-marca-gamonal`. | La interfaz se rehace por completo siguiendo el flujo de tres propuestas de §16. | VIGENTE |
| DEC-002 | Dirección visual | El sistema visual lo manda Gamonal; Zurich aporta únicamente color y tipografía. | Estructura, composición, personalidad y criterios de Gamonal, con la paleta y las tipografías Zurich mapeadas a los roles Gamonal. | VIGENTE |
| DEC-003 | Home (v1) | Rechazado: rejilla de cards blancas, sin fotografía. Prohibición expresa de Gamonal. | El home lleva fotografía real y una composición distinta de las pantallas interiores. Nunca una acumulación de cards. | VIGENTE |
| DEC-004 | Login (v1) | Rechazado: tarjeta centrada sobre fondo plano, sin fotografía. Incumple `reglas-creacion-aplicativos` §18. | Login a página completa, cuadrícula, panel de formulario y área visual con fotografía real de Envato. | VIGENTE |
| DEC-005 | Radios | Rechazado: se usaron 4, 8, 12 y 999 px. | Radio único de **8 px** en botones, cajas, campos, cards y contenedores. Excepción funcional sólo en avatar circular y contenedor de imagen a sangre. | VIGENTE |
| DEC-006 | Sombras | Rechazado: sombras con tinte azul. Gamonal prohíbe sombras cromáticas. | Separación por fondos sólidos. Sombra neutra y mínima sólo en elementos flotantes reales, como menús desplegables y modales. | VIGENTE |
| DEC-007 | Modo oscuro (v1) | Rechazado: superficies azules sobre fondo azul. Gamonal prohíbe color sobre su misma familia. | El modo oscuro usa neutros oscuros como superficie y reserva el azul Zurich para acento y acción. | VIGENTE |
| DEC-008 | Navegación activa (v1) | Rechazado: subrayado decorativo con `box-shadow` bajo el ítem activo. | El estado activo se marca con fondo sólido distinto y peso tipográfico, nunca con línea o filete. | VIGENTE |
| DEC-009 | Tipografía | Cuerpo a 14 px. | Cuerpo a **16 px**. Pesos 400, 500 y 600; nunca superiores. | VIGENTE |
| DEC-010 | Entrega | Se pidió al usuario ejecutar comandos en consola. Prohibido por `reglas-creacion-aplicativos` §19. | Toda entrega se abre con doble clic o URL. La consola es responsabilidad mía, no suya. | VIGENTE |
| DEC-011 | Interfaz (v2) | Rechazada: «azul, azul y más azul», «la repetición del Crear». | El inicio se resuelve con bandas pastel a todo el ancho, como zurich.cl. El azul queda para botones y datos. Una sola acción «Crear una pieza», en la barra superior; Crear deja de ser destino de navegación. | VIGENTE |
| DEC-012 | Lenguaje de formas | No se estaba usando. La referencia de Zurich lo apoya todo en círculos. | Fotografía enmascarada en círculo con burbujas azules superpuestas. Es el rasgo reconocible del sistema. | VIGENTE |
| DEC-013 | Botones | Eran rectángulos de 8 px con amarillo. | Píldora, azul héroe sólido. El coral es la acción de conversión. El radio de 8 px se mantiene en cajas, campos y contenedores: la píldora es la excepción funcional que permite Gamonal, porque es la firma de Zurich. | VIGENTE |
| DEC-014 | Coral | El coral de campaña de Zurich, #F16F6D, da 2,90 con texto blanco y no cumple AA. | Se oscurece a #CC4038, que da 4,82. | VIGENTE |
| DEC-015 | Botón sobre banda | Rechazado: botón coral sobre banda ámbar, «rojo sobre naranja». | Tabla calculada de combinaciones válidas, en el encabezado del sistema. Dos condiciones a la vez: 3:1 de separación y familias cromáticas distintas. Consecuencia: **la banda celeste no admite ningún botón**; y el coral sólo va sobre neutro, blanco o verde. Verificado automáticamente en las 57 pantallas. | VIGENTE |
| DEC-016 | Editor | Rechazado: se editaba por panel de propiedades. «Yo pongo el cursor en el texto y edito directo. Eso de la caja es muy complejo.» | Edición directa sobre el lienzo. Barra flotante pegada a la selección con lo frecuente; el mapa de caja queda detrás de «Avanzado». | VIGENTE |
| DEC-017 | Reglas del lienzo | No existían. | Regla horizontal y vertical que miden la pieza, no la pantalla, con paso adaptativo y la extensión de la selección marcada sobre la propia regla. Lectura de x, y, ancho y alto en píxeles reales, y cotas de distancia entre elementos. | VIGENTE |
| DEC-018 | Móvil | Rechazado: scroll horizontal, botón encima del titular, tarjetas cortadas. | Una sola columna, tablas convertidas en fichas, filas de botones que se envuelven, barra inferior de cuatro destinos y editor reducido a revisión. Comprobado con medición automática: cero desbordes en las 57 pantallas. | VIGENTE |

