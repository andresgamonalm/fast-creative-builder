/**
 * Personas. Solo la ve el administrador, pero eso no es lo que la protege:
 * cada endpoint que usa comprueba el rol en el servidor.
 */

import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ErrorApi, borrar, enviar, obtener } from '../api.js';
import { Aviso, Boton, Campo, Cargando, Pastilla } from '../componentes/ui.js';

interface Persona {
  readonly id: string;
  readonly correo: string;
  readonly nombre: string;
  readonly rol: 'administrador' | 'usuario';
  readonly estado: 'activo' | 'bloqueado';
  readonly ultimoAcceso: string | null;
  readonly pendienteDeEntrar: boolean;
  readonly invitacionPendiente: boolean;
}

function fecha(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function Usuarios() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [maximo, setMaximo] = useState(15);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'usuario' | 'administrador'>('usuario');
  const [invitando, setInvitando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const r = await obtener<{ usuarios: Persona[]; maximo: number }>('/api/usuarios');
      setPersonas(r.usuarios);
      setMaximo(r.maximo);
      setError(null);
    } catch (fallo) {
      setError(fallo instanceof ErrorApi ? fallo.message : 'No se pudo cargar la lista.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function invitar(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    setAviso(null);
    setInvitando(true);
    try {
      const r = await enviar<{ enviado: boolean; enlace?: string }>('/api/usuarios', {
        correo,
        nombre,
        rol,
      });
      // Sin servicio de correo configurado, el servidor devuelve el enlace en
      // vez de fallar en silencio: se muestra para poder pasarlo a mano.
      setAviso(
        r.enviado
          ? `Invitación enviada a ${correo}.`
          : `Cuenta creada. No hay correo configurado, así que pásale este enlace: ${r.enlace}`,
      );
      setCorreo('');
      setNombre('');
      setRol('usuario');
      await cargar();
    } catch (fallo) {
      setError(fallo instanceof ErrorApi ? fallo.message : 'No se pudo invitar.');
    } finally {
      setInvitando(false);
    }
  }

  async function accion(fn: () => Promise<unknown>, mensaje: string) {
    setError(null);
    setAviso(null);
    try {
      await fn();
      setAviso(mensaje);
      await cargar();
    } catch (fallo) {
      setError(fallo instanceof ErrorApi ? fallo.message : 'No se pudo completar la acción.');
    }
  }

  if (cargando) return <Cargando texto="Cargando personas…" />;

  return (
    <>
      <header className="pagina__cabecera">
        <h1 className="pagina__titulo">Personas</h1>
        <p className="pagina__bajada">
          Invita a alguien por correo y elige su contraseña ella misma. Cada persona ve solo
          sus proyectos y sus materiales; tú los ves todos. Van {personas.length} de {maximo}.
        </p>
      </header>

      {error ? <Aviso tipo="error">{error}</Aviso> : null}
      {aviso ? <Aviso tipo="acierto">{aviso}</Aviso> : null}

      <form className="formulario-fila" onSubmit={invitar} style={{ marginTop: 'var(--e4)' }}>
        <Campo
          etiqueta="Correo"
          type="email"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <Campo
          etiqueta="Nombre"
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <div className="campo">
          <label className="campo__etiqueta" htmlFor="rol-nuevo">
            Permiso
          </label>
          <select
            id="rol-nuevo"
            className="selector"
            value={rol}
            onChange={(e) => setRol(e.target.value === 'administrador' ? 'administrador' : 'usuario')}
          >
            <option value="usuario">Usuario</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        <Boton type="submit" variante="primario" disabled={invitando}>
          {invitando ? 'Invitando…' : 'Invitar'}
        </Boton>
      </form>

      <div className="tabla-envoltorio">
        <table className="tabla">
          <caption className="solo-lectores">Personas con acceso al aplicativo</caption>
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Permiso</th>
              <th scope="col">Estado</th>
              <th scope="col">Último acceso</th>
              <th scope="col">
                <span className="solo-lectores">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {personas.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.correo}</td>
                <td>{p.rol === 'administrador' ? 'Administrador' : 'Usuario'}</td>
                <td>
                  {p.estado === 'bloqueado' ? (
                    <Pastilla variante="bloqueada">Bloqueada</Pastilla>
                  ) : p.pendienteDeEntrar ? (
                    <Pastilla variante="pendiente">Sin entrar</Pastilla>
                  ) : (
                    <Pastilla variante="activa">Activa</Pastilla>
                  )}
                </td>
                <td>{fecha(p.ultimoAcceso)}</td>
                <td>
                  <div className="tabla__acciones">
                    {p.pendienteDeEntrar ? (
                      <Boton
                        pequeno
                        onClick={() =>
                          void accion(
                            () => enviar(`/api/usuarios/${p.id}/reinvitar`),
                            `Invitación reenviada a ${p.correo}.`,
                          )
                        }
                      >
                        Reenviar
                      </Boton>
                    ) : null}
                    <Boton
                      pequeno
                      onClick={() =>
                        void accion(
                          () =>
                            enviar(`/api/usuarios/${p.id}/estado`, {
                              estado: p.estado === 'activo' ? 'bloqueado' : 'activo',
                            }),
                          p.estado === 'activo'
                            ? `${p.nombre} ya no tiene acceso.`
                            : `${p.nombre} vuelve a tener acceso.`,
                        )
                      }
                    >
                      {p.estado === 'activo' ? 'Bloquear' : 'Activar'}
                    </Boton>
                    <Boton
                      pequeno
                      variante="peligro"
                      onClick={() => {
                        if (!confirm(`¿Eliminar la cuenta de ${p.nombre}? No se puede deshacer.`))
                          return;
                        void accion(
                          () => borrar(`/api/usuarios/${p.id}`),
                          `Cuenta de ${p.nombre} eliminada.`,
                        );
                      }}
                    >
                      Eliminar
                    </Boton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
