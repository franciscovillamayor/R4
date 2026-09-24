import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@styles/global.css'

/**
 * Punto de entrada principal de la aplicación.
 * Inicializa el tema predeterminado en el elemento raíz para evitar destellos (FOUC)
 * y monta la jerarquía de React en modo estricto.
 */
document.documentElement.setAttribute('data-bs-theme', 'light')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
