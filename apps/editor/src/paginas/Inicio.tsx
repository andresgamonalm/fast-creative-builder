import { Link } from 'react-router-dom';
import { useSesion } from '../sesion.js';

interface Acceso {
  readonly a: string;
  readonly titulo: string;
  readonly texto: string;
  readonly soloAdministrador?: boolean;
}

const ACCESOS: readonly Acceso[] = [
  {
    a: '/crear',
    titulo: 'Crear',
    texto: 'Empieza una pieza web, un email o una composición libre.',
  },
  {
    a: '/proyectos',
    titulo: 'Proyectos',
    texto: 'Todo lo que has hecho, con su estado y sus versiones.',
  },
  {
    a: '/biblioteca/imagenes',
    titulo: 'Biblioteca',
    texto: 'Tus logos, tus imágenes y tus tipografías.',
  },
  {
    a: '/configuracion/usuarios',
    titulo: 'Personas',
    texto: 'Invita a alguien, revisa accesos y bloquea cuentas.',
    soloAdministrador: true,
  },
];

export function Inicio() {
  const { usuario } = useSesion();
  const esAdministrador = usuario?.rol === 'administrador';
  const visibles = ACCESOS.filter((a) => !a.soloAdministrador || esAdministrador);

  return (
    <>
      <header className="pagina__cabecera">
        <h1 className="pagina__titulo">Hola, {usuario?.nombre.split(' ')[0]}</h1>
        <p className="pagina__bajada">
          Aquí construyes key visuals, gráficas, landing pages y piezas de email. Todo se
          revisa en escritorio, tableta y móvil, y todo sale en HTML, JPG y PNG.
        </p>
      </header>

      <section className="accesos" aria-label="Accesos directos">
        {visibles.map((acceso) => (
          <Link key={acceso.a} to={acceso.a} className="acceso-tarjeta">
            <span className="acceso-tarjeta__titulo">{acceso.titulo}</span>
            <span className="acceso-tarjeta__texto">{acceso.texto}</span>
          </Link>
        ))}
      </section>
    </>
  );
}
