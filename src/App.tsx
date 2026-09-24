import HomePage from '@pages/HomePage'
import { ToastProvider } from '@scripts/useToast'

/**
 * Componente raíz App
 * 
 * Envuelve la página principal dentro del ToastProvider para habilitar el sistema
 * global de notificaciones visuales accesibles.
 */
function App() {
  return (
    <ToastProvider>
      <HomePage />
    </ToastProvider>
  )
}

export default App
