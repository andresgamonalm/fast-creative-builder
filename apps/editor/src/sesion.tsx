/**
 * Estado de sesión del editor.
 *
 * El rol que hay aquí sirve para decidir qué se enseña, nunca para autorizar.
 * Toda comprobación real ocurre en el servidor: ocultar un botón no es un
 * permiso. En el aplicativo anterior la lista de administradores estaba en el
 * HTML del navegador y ningún endpoint la verificaba.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ErrorApi, enviar, obtener } from './api.js';

export interface Usuario {
  readonly id: string;
  readonly correo: string;
  readonly nombre: string;
  readonly rol: 'administrador' | 'usuario';
}

interface EstadoSesion {
  readonly usuario: Usuario | null;
  readonly cargando: boolean;
  readonly entrar: (correo: string, clave: string) => Promise<void>;
  readonly salir: () => Promise<void>;
  readonly refrescar: () => Promise<void>;
}

const Contexto = createContext<EstadoSesion | null>(null);

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    try {
      const r = await obtener<{ usuario: Usuario }>('/api/acceso/yo');
      setUsuario(r.usuario);
    } catch (fallo) {
      if (fallo instanceof ErrorApi && fallo.esNoAutenticado) setUsuario(null);
      else setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  const entrar = useCallback(async (correo: string, clave: string) => {
    const r = await enviar<{ usuario: Usuario }>('/api/acceso/entrar', { correo, clave });
    setUsuario(r.usuario);
  }, []);

  const salir = useCallback(async () => {
    try {
      await enviar('/api/acceso/salir');
    } finally {
      setUsuario(null);
    }
  }, []);

  const valor = useMemo<EstadoSesion>(
    () => ({ usuario, cargando, entrar, salir, refrescar }),
    [usuario, cargando, entrar, salir, refrescar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSesion(): EstadoSesion {
  const valor = useContext(Contexto);
  if (!valor) throw new Error('useSesion tiene que usarse dentro de ProveedorSesion.');
  return valor;
}
