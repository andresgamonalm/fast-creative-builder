/**
 * Tema claro y oscuro.
 *
 * Tres estados: claro, oscuro y «como el sistema», que es el valor inicial.
 * La preferencia se guarda en el navegador; no es un dato de la cuenta.
 */

export type Tema = 'claro' | 'oscuro' | 'sistema';

const CLAVE = 'fcb.tema';

function prefiereOscuro(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function temaGuardado(): Tema {
  try {
    const valor = localStorage.getItem(CLAVE);
    if (valor === 'claro' || valor === 'oscuro' || valor === 'sistema') return valor;
  } catch {
    // Navegación privada o almacenamiento bloqueado: se usa el del sistema.
  }
  return 'sistema';
}

export function aplicarTema(tema: Tema): void {
  const oscuro = tema === 'oscuro' || (tema === 'sistema' && prefiereOscuro());
  document.documentElement.dataset['tema'] = oscuro ? 'oscuro' : 'claro';
  try {
    localStorage.setItem(CLAVE, tema);
  } catch {
    // Si no se puede guardar, el tema sigue aplicado en esta sesión.
  }
}

/** Se llama una vez al arrancar y deja el sistema vigilado por si cambia. */
export function iniciarTema(): void {
  aplicarTema(temaGuardado());
  window
    .matchMedia?.('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (temaGuardado() === 'sistema') aplicarTema('sistema');
    });
}
