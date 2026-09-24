import { useEffect, useState, useCallback } from 'react'

/**
 * Hook useScrollToTop
 * 
 * Gestiona la visibilidad y acción de retorno suave al inicio de la página.
 * Escucha el evento 'scroll' de window de forma pasiva y optimizada.
 * 
 * @param umbral - Cantidad de píxeles desplazados requeridos para mostrar el botón (por defecto 300).
 * @returns Un objeto con:
 *   - `mostrar`: boolean que indica si se superó el umbral de scroll.
 *   - `subir`: función para ejecutar el desplazamiento suave hacia arriba.
 */
export function useScrollToTop(umbral = 300) {
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollActual = window.scrollY || document.documentElement.scrollTop
          setMostrar(scrollActual > umbral)
          ticking = false
        })
        ticking = true
      }
    }

    // Evaluación inicial
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [umbral])

  /**
   * Realiza el desplazamiento suave hacia el tope de la pantalla.
   */
  const subir = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  return { mostrar, subir }
}
