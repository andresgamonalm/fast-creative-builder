import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ErrorApi } from '../api.js';
import { Aviso, Boton, Campo } from '../componentes/ui.js';
import { Marca } from '../componentes/Marca.js';
import { useSesion } from '../sesion.js';
import './acceso.css';

export function Entrar() {
  const { usuario, cargando, entrar } = useSesion();
  const navegar = useNavigate();

  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (cargando) return null;
  if (usuario) return <Navigate to="/" replace />;

  async function alEnviar(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await entrar(correo, clave);
      navegar('/', { replace: true });
    } catch (fallo) {
      setError(fallo instanceof ErrorApi ? fallo.message : 'No se pudo entrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="acceso">
      <div className="acceso__caja">
        <Marca />
        <div className="acceso__panel">
          <h1 className="acceso__titulo">Entrar</h1>
          <p className="acceso__intro">Escribe tu correo y tu contraseña.</p>

          <form onSubmit={alEnviar} className="acceso__campos" noValidate>
            {error ? <Aviso tipo="error">{error}</Aviso> : null}

            <Campo
              etiqueta="Correo"
              type="email"
              name="correo"
              autoComplete="username"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <Campo
              etiqueta="Contraseña"
              type="password"
              name="clave"
              autoComplete="current-password"
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />

            <Boton type="submit" variante="primario" ancho disabled={enviando}>
              {enviando ? 'Entrando…' : 'Entrar'}
            </Boton>
          </form>

          <p className="acceso__pie">
            <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
