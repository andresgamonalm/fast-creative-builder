# Fast Creative Builder

Constructor visual para **key visuals, gráficas digitales, landing pages y email marketing**. Interfaz en español, edición visual, resultado inmediato.

**Destino:** `fast-creative-builder.gamonal.app`

---

## Los tres modos

| Modo | Para qué | Qué exporta |
|---|---|---|
| **Web** | Landing pages y páginas de campaña | HTML funcional, JPG, PNG, fragmento para CMS |
| **Email** | Piezas de email marketing | HTML con CSS en línea, JPG, PNG, texto plano |
| **Estilo libre** | Key visuals y gráficas para redes | HTML de composición, JPG, PNG |

Los tres comparten un solo motor de componentes, un solo inspector y un solo sistema de exportación.

---

## Cómo está organizado

```
packages/core/      Núcleo. TypeScript puro, sin framework.
                    Árbol de nodos, registro de componentes,
                    motores de render y exportadores.

apps/editor/        Editor visual. React + Vite.
                    Consume el núcleo, no reimplementa nada.

apps/server/        API y persistencia. Cloudflare Workers + D1 + R2.

docs/               Brief funcional y referencia de campos.
esquema/            Migraciones de base de datos.
```

**La regla que sostiene todo el proyecto:** las funciones de render viven en `packages/core` y son puras — reciben un nodo, devuelven una cadena. Las consumen por igual el editor, el exportador de HTML y el rasterizador. **No existe una segunda implementación en ningún sitio.**

---

## Puesta en marcha

Requiere Node 22 o superior.

```bash
npm install
npm run build
npm run bd:local --workspace=@fcb/servidor
npm run dev
```

`npm run build` compila el núcleo y el editor. Hace falta antes de `npm run dev`
porque el Worker sirve `apps/editor/dist`, que no se versiona: sin ese paso
wrangler aborta diciendo que el directorio no existe.

`bd:local` aplica `esquema/0001_inicial.sql` a la base D1 local. Sin ese paso el
primer acceso devuelve un 500 y no llega a crearse la cuenta de administrador.

`npm run dev` levanta el Worker en `http://127.0.0.1:8787`, que sirve la API y el
editor ya compilado. **Para trabajar en la interfaz**, en otra terminal:

```bash
npm run dev:editor
```

Eso abre Vite en `http://localhost:5173` con recarga en caliente y reenvía `/api`
al Worker, así que el navegador ve un solo origen y la sesión funciona igual que
en producción. El Worker tiene que estar corriendo.

La primera vez, el servidor crea la cuenta de administrador con el correo de
`CORREO_ADMINISTRADOR` (en `apps/server/wrangler.jsonc`) e imprime en la consola
el enlace para definir la contraseña. Si no hay `CLAVE_RESEND` en
`apps/server/.dev.vars`, todos los correos salen por consola en vez de enviarse.

---

## Documentación

- [`docs/00-brief.md`](docs/00-brief.md) — contrato funcional. Es la referencia vinculante.
- [`docs/01-referencia-campos.md`](docs/01-referencia-campos.md) — qué campos necesita cada componente, y qué errores no repetir.
- [`docs/anexo-especificacion-funcional.docx`](docs/anexo-especificacion-funcional.docx) — especificación original, con el catálogo completo de variantes.

---

## Tres reglas innegociables

**1. Cero espaciado automático.** Todo nodo nuevo nace con margen, relleno y separación en cero. Ningún componente, ninguna plantilla y ningún reset introduce espacio que el usuario no pueda ver y editar en el inspector.

**2. La superposición no empuja.** Un elemento colocado sobre otro pertenece a la capa superpuesta de su padre. No crea filas, no desplaza hermanos, no aumenta la altura del contenedor. Sus coordenadas son relativas al padre.

**3. Ningún control decorativo.** Si un campo aparece en la interfaz, funciona, guarda su estado y admite deshacer. Sin excepciones.
