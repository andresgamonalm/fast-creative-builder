/** Estructura común de las pantallas con sesión iniciada. */

import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Boton } from '../componentes/ui.js';
import { Isotipo } from '../componentes/Marca.js';
import { useSesion } from '../sesion.js';
import { aplicarTema, temaGuardado } from '../tema.js';
import type { Tema } from '../tema.js';
import './marco.css';

const SIGUIENTE: Record<Tema, Tema> = { sistema: 'claro', claro: 'oscuro', oscuro: 'sistema' };
const ETIQUETA: Record<Tema, string> = {
  sistema: 'Tema: como el sistema',
  claro: 'Tema: claro',
  oscuro: 'Tema: oscuro',
};

export function Marco() {
  const { usuario, salir } = useSesion();
  const [tema, setTema] = useState<Tema>(() => temaGuardado());

  function cambiarTema() {
    const nuevo = SIGUIENTE[tema];
    setTema(nuevo);
    aplicarTema(nuevo);
  }

  return (
    <div className="marco">
      <a className="saltar-al-contenido" href="#contenido">
        Saltar al contenido
      </a>

      <header className="barra">
        <Link to="/" className="barra__marca">
          <Isotipo tamano={26} />
          Fast Creative Builder
        </Link>

        <nav className="barra__nav" aria-label="Principal">
          <NavLink to="/" end className="barra__enlace">
            Inicio
          </NavLink>
          <NavLink to="/proyectos" className="barra__enlace">
            Proyectos
          </NavLink>
          <NavLink to="/biblioteca/imagenes" className="barra__enlace">
            Biblioteca
          </NavLink>
          {usuario?.rol === 'administrador' ? (
            <NavLink to="/configuracion/usuarios" className="barra__enlace">
              Configuración
            </NavLink>
          ) : null}
        </nav>

        <div className="barra__espacio" />

        <div className="barra__persona">
          <Boton pequeno variante="plano" onClick={cambiarTema} title={ETIQUETA[tema]}>
            {tema === 'oscuro' ? 'Oscuro' : tema === 'claro' ? 'Claro' : 'Auto'}
          </Boton>
          <span>
            <span className="barra__nombre">{usuario?.nombre}</span>
            {usuario?.rol === 'administrador' ? ' · Administrador' : null}
          </span>
          <Boton pequeno onClick={() => void salir()}>
            Salir
          </Boton>
        </div>
      </header>

      <main className="contenido" id="contenido">
        <div className="contenido__ancho">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
