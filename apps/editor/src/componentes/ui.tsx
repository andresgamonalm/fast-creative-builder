import { useId } from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import './ui.css';

type VarianteBoton = 'primario' | 'secundario' | 'plano' | 'peligro';

interface PropsBoton extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variante?: VarianteBoton;
  readonly pequeno?: boolean;
  readonly ancho?: boolean;
}

export function Boton({
  variante = 'secundario',
  pequeno = false,
  ancho = false,
  className,
  type = 'button',
  ...resto
}: PropsBoton) {
  const clases = [
    'btn',
    `btn--${variante}`,
    pequeno ? 'btn--pequeno' : '',
    ancho ? 'btn--ancho' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={clases} {...resto} />;
}

interface PropsCampo extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  readonly etiqueta: string;
  readonly ayuda?: string;
  readonly error?: string;
}

export function Campo({ etiqueta, ayuda, error, ...resto }: PropsCampo) {
  const id = useId();
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;

  // El mensaje de error se anuncia con el campo, no solo se pinta en rojo:
  // el color por sí solo no comunica nada a quien no lo distingue.
  const descrito = [ayuda ? idAyuda : null, error ? idError : null].filter(Boolean).join(' ');

  return (
    <div className="campo">
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      <input
        id={id}
        className="campo__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={descrito || undefined}
        {...resto}
      />
      {ayuda ? (
        <span className="campo__ayuda" id={idAyuda}>
          {ayuda}
        </span>
      ) : null}
      {error ? (
        <span className="campo__error" id={idError}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

type TipoAviso = 'error' | 'acierto' | 'informacion';

export function Aviso({ tipo, children }: { tipo: TipoAviso; children: ReactNode }) {
  return (
    <p className={`aviso aviso--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

export function Pastilla({
  variante,
  children,
}: {
  variante?: 'activa' | 'pendiente' | 'bloqueada';
  children: ReactNode;
}) {
  return <span className={`pastilla${variante ? ` pastilla--${variante}` : ''}`}>{children}</span>;
}

export function Cargando({ texto = 'Cargando…' }: { texto?: string }) {
  return (
    <div className="cargando" role="status">
      {texto}
    </div>
  );
}
