import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ProveedorSesion, useSesion } from './sesion.js';
import { Cargando } from './componentes/ui.js';
import { Entrar } from './paginas/Entrar.js';
import { EstablecerClave } from './paginas/EstablecerClave.js';
import { Recuperar } from './paginas/Recuperar.js';
import { Marco } from './paginas/Marco.js';
import { Inicio } from './paginas/Inicio.js';
import { Usuarios } from './paginas/Usuarios.js';
import { Pendiente } from './paginas/Pendiente.js';

/** Exige sesión. Es comodidad de navegación, no seguridad: eso vive en el servidor. */
function Protegida({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useSesion();
  const ubicacion = useLocation();

  if (cargando) return <Cargando />;
  if (!usuario) return <Navigate to="/entrar" replace state={{ desde: ubicacion.pathname }} />;
  return <>{children}</>;
}

/** Igual que la anterior, pero además exige ser administrador. */
function SoloAdministrador({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useSesion();
  if (cargando) return <Cargando />;
  if (!usuario) return <Navigate to="/entrar" replace />;
  if (usuario.rol !== 'administrador') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <BrowserRouter>
      <ProveedorSesion>
        <Routes>
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/recuperar" element={<Recuperar />} />
          <Route path="/recuperar/:token" element={<EstablecerClave />} />
          <Route path="/invitacion/:token" element={<EstablecerClave />} />

          <Route
            element={
              <Protegida>
                <Marco />
              </Protegida>
            }
          >
            <Route index element={<Inicio />} />

            <Route
              path="crear"
              element={
                <Pendiente
                  titulo="Crear"
                  fase="fase 4"
                  texto="Aquí eliges entre web, email y estilo libre, y abres el editor."
                />
              }
            />
            <Route
              path="proyectos"
              element={
                <Pendiente
                  titulo="Proyectos"
                  fase="fase 4"
                  texto="Aquí estarán tus proyectos, con búsqueda, estados, versiones y papelera."
                />
              }
            />
            <Route
              path="biblioteca/:tipo"
              element={
                <Pendiente
                  titulo="Biblioteca"
                  fase="fase 2"
                  texto="Aquí subes tus logos, tus imágenes y tus tipografías."
                />
              }
            />

            <Route
              path="configuracion/usuarios"
              element={
                <SoloAdministrador>
                  <Usuarios />
                </SoloAdministrador>
              }
            />
            <Route
              path="configuracion/general"
              element={
                <SoloAdministrador>
                  <Pendiente
                    titulo="Configuración general"
                    fase="fase 2"
                    texto="Marcas, tokens, formatos y dominios permitidos para insertar contenido."
                  />
                </SoloAdministrador>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ProveedorSesion>
    </BrowserRouter>
  );
}
