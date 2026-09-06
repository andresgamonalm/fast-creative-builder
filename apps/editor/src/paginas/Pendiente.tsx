/**
 * Marcador honesto para lo que todavía no existe.
 *
 * Prefiero una pantalla que diga la verdad a un botón que parece funcionar y
 * no hace nada. En el aplicativo anterior había controles que se guardaban en
 * la base de datos y no se aplicaban nunca, y un botón de historial que jamás
 * llegaba a abrir.
 */

export function Pendiente({ titulo, fase, texto }: { titulo: string; fase: string; texto: string }) {
  return (
    <>
      <header className="pagina__cabecera">
        <h1 className="pagina__titulo">{titulo}</h1>
      </header>
      <div className="vacio">
        <p className="vacio__titulo">Todavía no está construido</p>
        <p className="vacio__texto">
          {texto} Entra en la {fase}.
        </p>
      </div>
    </>
  );
}
