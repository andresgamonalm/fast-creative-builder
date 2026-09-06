-- Fast Creative Builder — esquema inicial (Cloudflare D1 / SQLite)
--
-- wrangler necesita su configuración, que vive en apps/server. Desde la raíz:
--   Local:  npm run bd:local  --workspace=@fcb/servidor
--   Remoto: npm run bd:remoto --workspace=@fcb/servidor

-- ─────────────────────────────────────────────────────────────────────────
-- Personas y acceso
-- ─────────────────────────────────────────────────────────────────────────

-- El rol se comprueba SIEMPRE en el servidor. Nunca en el navegador.
CREATE TABLE IF NOT EXISTS usuarios (
  id             TEXT PRIMARY KEY,
  correo         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  nombre         TEXT NOT NULL,
  rol            TEXT NOT NULL CHECK (rol IN ('administrador', 'usuario')),
  estado         TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'bloqueado')),
  clave_hash     TEXT,              -- NULL hasta que acepta la invitación
  clave_sal      TEXT,
  clave_iteraciones INTEGER,
  creado_en      TEXT NOT NULL,
  ultimo_acceso  TEXT
);

-- Invitaciones y restablecimiento de contraseña comparten tabla: ambos son
-- un token de un solo uso con caducidad corta.
CREATE TABLE IF NOT EXISTS tokens_acceso (
  id           TEXT PRIMARY KEY,
  usuario_id   TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  proposito    TEXT NOT NULL CHECK (proposito IN ('invitacion', 'recuperacion')),
  token_hash   TEXT NOT NULL UNIQUE,
  expira_en    TEXT NOT NULL,
  usado_en     TEXT,
  creado_por   TEXT REFERENCES usuarios(id) ON DELETE SET NULL,
  creado_en    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tokens_usuario ON tokens_acceso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tokens_expira  ON tokens_acceso(expira_en);

-- Un solo enlace vivo por persona y propósito. Antes se podían pedir dos
-- recuperaciones y las dos seguían sirviendo: usar la segunda no anulaba la
-- primera, que quedaba válida media hora en la bandeja de entrada.
CREATE UNIQUE INDEX IF NOT EXISTS idx_tokens_vivo
  ON tokens_acceso(usuario_id, proposito) WHERE usado_en IS NULL;

-- Sesiones en tabla, no en JWT autocontenido: así quitar un acceso surte
-- efecto inmediato en vez de esperar a que caduque la cookie.
CREATE TABLE IF NOT EXISTS sesiones (
  id           TEXT PRIMARY KEY,
  usuario_id   TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash   TEXT NOT NULL UNIQUE,
  expira_en    TEXT NOT NULL,
  creada_en    TEXT NOT NULL,
  ultimo_uso   TEXT,
  agente       TEXT
);

CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones(usuario_id);
-- La limpieza de caducadas corre en cada petición: sin este índice recorría
-- la tabla entera cada vez.
CREATE INDEX IF NOT EXISTS idx_sesiones_expira  ON sesiones(expira_en);

-- Intentos fallidos, para frenar la fuerza bruta. El aplicativo anterior no
-- tenía ningún límite: se podían pedir enlaces e intentar contraseñas sin tope.
CREATE TABLE IF NOT EXISTS intentos_acceso (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  clave     TEXT NOT NULL,   -- correo normalizado, o correo + acción
  ocurrido  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_intentos ON intentos_acceso(clave, ocurrido DESC);

-- ─────────────────────────────────────────────────────────────────────────
-- Marcas
-- ─────────────────────────────────────────────────────────────────────────

-- La marca es un conjunto de tokens, no código. Ningún componente lleva un
-- color escrito a mano: ése fue el error más caro del aplicativo anterior.
CREATE TABLE IF NOT EXISTS marcas (
  id             TEXT PRIMARY KEY,
  nombre         TEXT NOT NULL,
  propietario_id TEXT REFERENCES usuarios(id) ON DELETE SET NULL,  -- NULL = marca del sistema
  tokens         TEXT NOT NULL,
  es_base        INTEGER NOT NULL DEFAULT 0,
  creada_en      TEXT NOT NULL,
  actualizada_en TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_marcas_propietario ON marcas(propietario_id);

-- ─────────────────────────────────────────────────────────────────────────
-- Proyectos
-- ─────────────────────────────────────────────────────────────────────────

-- `arbol` guarda el almacén normalizado de nodos serializado. `esquema_version`
-- permite migrar el formato sin adivinar: el aplicativo anterior no lo tenía y
-- acabó con campos antiguos y nuevos conviviendo, resueltos a base de
-- comprobaciones dispersas por el renderizador.
CREATE TABLE IF NOT EXISTS proyectos (
  id              TEXT PRIMARY KEY,
  nombre          TEXT NOT NULL,
  modo            TEXT NOT NULL CHECK (modo IN ('web', 'email', 'libre')),
  propietario_id  TEXT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  estado          TEXT NOT NULL DEFAULT 'borrador'
                    CHECK (estado IN ('borrador', 'revision', 'aprobado', 'exportado')),
  arbol           TEXT NOT NULL,
  ajustes         TEXT NOT NULL DEFAULT '{}',
  esquema_version INTEGER NOT NULL DEFAULT 1,
  marca_id        TEXT REFERENCES marcas(id) ON DELETE SET NULL,
  creado_en       TEXT NOT NULL,
  actualizado_en  TEXT NOT NULL,
  eliminado_en    TEXT,             -- papelera: NULL = vivo
  aprobado_por    TEXT REFERENCES usuarios(id) ON DELETE SET NULL,
  aprobado_en     TEXT
);

CREATE INDEX IF NOT EXISTS idx_proyectos_propietario ON proyectos(propietario_id, eliminado_en);
CREATE INDEX IF NOT EXISTS idx_proyectos_modo        ON proyectos(modo);
CREATE INDEX IF NOT EXISTS idx_proyectos_estado      ON proyectos(estado);
CREATE INDEX IF NOT EXISTS idx_proyectos_actualizado ON proyectos(actualizado_en DESC);
CREATE INDEX IF NOT EXISTS idx_proyectos_papelera    ON proyectos(eliminado_en) WHERE eliminado_en IS NOT NULL;

-- Versiones con nombre, creadas a mano. El historial de deshacer y rehacer
-- vive en el editor, no aquí: guardar una fila por pulsación de tecla es lo
-- que llenó de ruido el historial del aplicativo anterior.
CREATE TABLE IF NOT EXISTS versiones_proyecto (
  id            TEXT PRIMARY KEY,
  proyecto_id   TEXT NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  nombre        TEXT,
  arbol         TEXT NOT NULL,
  ajustes       TEXT NOT NULL,
  autor_id      TEXT REFERENCES usuarios(id) ON DELETE SET NULL,
  creada_en     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_versiones_proyecto ON versiones_proyecto(proyecto_id, creada_en DESC);

-- ─────────────────────────────────────────────────────────────────────────
-- Biblioteca: logos, imágenes y tipografías
-- ─────────────────────────────────────────────────────────────────────────

-- Sin capa compartida: cada recurso tiene un único dueño. El administrador
-- puede leer todos; nadie más ve nada ajeno.
CREATE TABLE IF NOT EXISTS recursos (
  id             TEXT PRIMARY KEY,
  propietario_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  tipo           TEXT NOT NULL CHECK (tipo IN ('imagen', 'logo', 'tipografia')),
  nombre         TEXT NOT NULL,
  mime           TEXT NOT NULL,
  bytes          INTEGER NOT NULL,
  clave          TEXT NOT NULL,     -- ruta en el almacén de objetos
  metadatos      TEXT NOT NULL DEFAULT '{}',  -- ancho/alto, o familia/grosor/estilo
  creado_en      TEXT NOT NULL,
  eliminado_en   TEXT
);

CREATE INDEX IF NOT EXISTS idx_recursos_propietario ON recursos(propietario_id, tipo, eliminado_en);

-- ─────────────────────────────────────────────────────────────────────────
-- Configuración y diagnóstico
-- ─────────────────────────────────────────────────────────────────────────

-- Lista de dominios permitidos para insertar contenido externo, entre otras.
CREATE TABLE IF NOT EXISTS configuracion (
  clave          TEXT PRIMARY KEY,
  valor          TEXT NOT NULL,
  actualizada_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS registro_errores (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ocurrido_en TEXT NOT NULL,
  origen      TEXT NOT NULL,
  nivel       TEXT NOT NULL,
  mensaje     TEXT NOT NULL,
  traza       TEXT,
  url         TEXT,
  usuario_id  TEXT REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_errores_fecha ON registro_errores(ocurrido_en DESC);

-- ─────────────────────────────────────────────────────────────────────────
-- Migraciones
-- ─────────────────────────────────────────────────────────────────────────

-- Todo este archivo es IF NOT EXISTS, así que reaplicarlo es inofensivo pero
-- tampoco cambia nada de lo ya creado. Cualquier modificación posterior va en
-- un archivo nuevo, 0002_*.sql, y se anota aquí para saber qué se aplicó.
CREATE TABLE IF NOT EXISTS migraciones (
  nombre     TEXT PRIMARY KEY,
  aplicada_en TEXT NOT NULL
);

INSERT OR IGNORE INTO migraciones (nombre, aplicada_en)
VALUES ('0001_inicial', datetime('now'));
