import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ErrorApi, enviar } from '../api.js';
import { Aviso, Boton, Campo } from '../componentes/ui.js';
import { Marca } from '../componentes/Marca.js';
import './acceso.css';

export function Recuperar() {
  const [correo, setCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function alEnviar(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await enviar('/api/acceso/recuperar', { correo });
      setEnviado(true);
    } catch (fallo) {
      setError(fallo instanceof ErrorApi ? fallo.message : 'No se pudo enviar el correo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="acceso">
      <div className="acceso__caja">
        <Marca />
        <div className="acceso__panel">
          <h1 className="acceso__titulo">Recuperar acceso</h1>

          {enviado ? (
            <>
              {/* Mensaje idéntico exista o no la cuenta: no revelamos quién tiene una. */}
              <p className="acceso__intro">
                Si hay una cuenta con ese correo, en un momento te llegará un enlace para
                elegir contraseña nueva. Caduca en treinta minutos.
              </p>
              <Aviso tipo="informacion">
                Revisa también la carpeta de correo no deseado.
              </Aviso>
            </>
          ) : (
            <>
              <p className="acceso__intro">
                Escribe tu correo y te enviamos un enlace para elegir una contraseña nueva.
              </p>
              <form onSubmit={alEnviar} className="acceso__campos" noValidate>
                {error ? <Aviso tipo="error">{error}</Aviso> : null}
                <Campo
                  etiqueta="Correo"
                  type="email"
                  autoComplete="username"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <Boton type="submit" variante="primario" ancho disabled={enviando}>
                  {enviando ? 'Enviando…' : 'Enviarme el enlace'}
                </Boton>
              </form>
            </>
          )}

          <p className="acceso__pie">
            <Link to="/entrar">Volver a entrar</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
