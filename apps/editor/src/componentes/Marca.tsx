/**
 * Marca del aplicativo.
 *
 * El isotipo es una Z construida con el lenguaje de formas de Zurich: la
 * diagonal de la Z resuelta con el corte curvo del sistema, en el azul héroe.
 * No es el logotipo de Zurich —ese solo se completa con la marca denominativa
 * y no se puede sustituir— sino la marca de este aplicativo, construida con
 * su mismo lenguaje visual. [Convención] declarada.
 */

export function Isotipo({ tamano = 40, className }: { tamano?: number; className?: string }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Fast Creative Builder"
    >
      <rect width="48" height="48" rx="12" fill="var(--accion)" />
      {/* Trazo superior */}
      <path d="M13 15.5h22v5.2H13z" fill="var(--accion-texto)" />
      {/* Diagonal con el remate curvo del lenguaje de formas */}
      <path
        d="M35 15.5c0 0-1.6 3.4-6.4 8.2L17.6 32.5h-4.6l16-16.9c0 0 2.3.1 6-.1z"
        fill="var(--accion-texto)"
        opacity="0.72"
      />
      {/* Trazo inferior */}
      <path d="M13 27.3h22v5.2H13z" fill="var(--accion-texto)" />
    </svg>
  );
}

export function Marca({ tamano = 40 }: { tamano?: number }) {
  return (
    <div className="acceso__marca">
      <Isotipo tamano={tamano} className="acceso__logo" />
      <div>
        <div className="acceso__nombre">Fast Creative Builder</div>
        <div className="acceso__lema">Web · Email · Estilo libre</div>
      </div>
    </div>
  );
}
