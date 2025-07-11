import React from 'react';
import ReactDOM from 'react-dom/client';
import BasicExample from './BasicExample.js';
import "./main.css"
function App() {
  return (
    <div>
      <h1>Ejemplos de Componentes</h1>
      <BasicExample />
    
    </div>
  );
}

// Obtén el elemento 'root'
const rootElement = document.getElementById('root');

// Verifica si el elemento existe antes de renderizar
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Manejo de error si el elemento 'root' no se encuentra
  console.error('No se encontró el elemento con ID "root" en el documento.');
}
