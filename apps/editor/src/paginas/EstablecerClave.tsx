/**
 * Pantalla de "elige tu contraseña". Sirve para dos casos que son el mismo
 * flujo: aceptar una invitación y recuperar el acceso. El propósito lo dice
 * el servidor al validar el token, no la URL.
 */

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorApi, enviar, obtener } from '../api.js';
import { Aviso, Boton, Campo, Cargando } from '../componentes/ui.js';
import { Marca } from '../componentes/Marca.js';
import { useSesion } from '../sesion.js';
import './acceso.css';

interface TokenValido {
  readonly proposito: 'invitacion' | 'recuperacion';
  readonly correo: string;
  readonly nombre: string;
}

export function EstablecerClave() {
  const { token = '' } = useParams();
  const navegar = useNavigate();
  const { refrescar } = useSesion();

  const [datos, setDatos] = useState<TokenValido | null>(null);
  const [comprobando, setComprobando] = useState(true);
  const [tokenInvalido, setTokenInvalido] = useState<string | null>(null);

  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [repetida, setRepetida] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const control = new AbortController();
    obtener<TokenValido>(`/api/acceso/token/${encodeURIComponent(token)}`, control.signal)
      .then((r) => {
        setDatos(r);
        setNombre(r.nombre);
      })
      .catch((fallo: unknown) => {
        if (control.signal.aborted) return;
        setTokenInvalido(
          fallo instanceof ErrorApi ? fallo.message : 'Este enlace ya no es válido.',
        );
      })
      .finally(() => {
        if (!control.signal.aborted) setComprobando(false);
      });
    return () => control.abort();
  }, [token]);

  async function alEnviar(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    if (clave !== repetida) {
      setError('Las dos contraseñas no coinciden.');
      return;
    }

    setEnviando(true);
    try {
      await enviar('/api/acceso/establecer', { token, clave, nombre });
      await refrescar();
      navegar('/', { replace: true });
    } catch (fallo) {
      setError(fallo instanceof ErrorApi ? fallo.message : 'No se pudo guardar la contraseña.');
      setEnviando(false);
    }
  }

  if (comprobando) return <Cargando texto="Comprobando el enlace…" />;

  if (tokenInvalido) {
    return (
      <main className="acceso">
        <div className="acceso__caja">
          <Marca />
          <div className="acceso__panel">
            <h1 className="acceso__titulo">Este enlace ya no sirve</h1>
            <p className="acceso__intro">{tokenInvalido}</p>
            <Aviso tipo="informacion">
              Los enlaces caducan y solo se pueden usar una vez. Pide uno nuevo desde
              «¿Olvidaste tu contraseña?», o avisa al administrador si era una invitación.
            </Aviso>
            <p className="acceso__pie">
              <Link to="/entrar">Volver a entrar</Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  const esInvitacion = datos?.proposito === 'invitacion';

  return (
    <main className="acceso">
      <div className="acceso__caja">
        <Marca />
        <div className="acceso__panel">
          <h1 className="acceso__titulo">
            {esInvitacion ? 'Te damos la bienvenida' : 'Elige una contraseña nueva'}
          </h1>
          <p className="acceso__intro">
            {esInvitacion
              ? `Estás creando la cuenta de ${datos?.correo}. Elige una contraseña y ya puedes empezar.`
              : `Estás cambiando la contraseña de ${datos?.correo}.`}
          </p>

          <form onSubmit={alEnviar} className="acceso__campos" noValidate>
            {error ? <Aviso tipo="error">{error}</Aviso> : null}

            {esInvitacion ? (
              <Campo
                etiqueta="Tu nombre"
                type="text"
                autoComplete="name"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            ) : null}

            <Campo
              etiqueta="Contraseña"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              ayuda="Diez caracteres como mínimo, con alguna letra y algún número."
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
            <Campo
              etiqueta="Repite la contraseña"
              type="password"
              autoComplete="new-password"
              required
              value={repetida}
              onChange={(e) => setRepetida(e.target.value)}
            />

            <Boton type="submit" variante="primario" ancho disabled={enviando}>
              {enviando ? 'Guardando…' : 'Guardar y entrar'}
            </Boton>
          </form>
        </div>
      </div>
    </main>
  );
}
