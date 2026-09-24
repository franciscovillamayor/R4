import { useEffect } from 'react'

/**
 * Hook useKeyPress
 * 
 * Escucha eventos de teclado en `window` para una tecla específica y ejecuta una acción.
 * Útil para accesibilidad y atajos como cerrar menús modales con 'Escape'.
 * 
 * @param teclaObjetivo - Nombre de la tecla según KeyboardEvent.key (ej: 'Escape', 'Enter').
 * @param accion - Función a ejecutar cuando la tecla es presionada.
 * @param habilitado - Bandera booleana para activar o desactivar el listener (por defecto true).
 */
export function useKeyPress(
  teclaObjetivo: string,
  accion: (evento: KeyboardEvent) => void,
  habilitado: boolean = true
): void {
  useEffect(() => {
    if (!habilitado) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === teclaObjetivo) {
        accion(e)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [teclaObjetivo, accion, habilitado])
}
