import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { iniciarTema } from './tema.js';
import './estilos/tokens.css';
import './estilos/base.css';

iniciarTema();

const raiz = document.getElementById('raiz');
if (!raiz) throw new Error('Falta el nodo #raiz en index.html.');

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
