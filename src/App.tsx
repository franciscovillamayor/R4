import HomePage from '@pages/HomePage'
import AdminPage from '@pages/AdminPage'
import { ToastProvider } from '@scripts/useToast'
import { PortfolioProvider } from '@scripts/usePortfolioData'

/**
 * Componente raíz App
 *
 * Envuelve la página principal dentro de los providers:
 * - PortfolioProvider: estado CRUD centralizado con persistencia en localStorage.
 * - ToastProvider: sistema global de notificaciones visuales accesibles.
 */
function App() {
  const contenido = window.location.pathname.replace(/\/+$/, '') === '/admin'
    ? <AdminPage />
    : <HomePage />

  return (
    <PortfolioProvider>
      <ToastProvider>
        {contenido}
      </ToastProvider>
    </PortfolioProvider>
  )
}

export default App
