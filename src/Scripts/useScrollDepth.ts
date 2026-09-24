import { useEffect, useState } from 'react'

/**
 * Hook useScrollDepth
 * 
 * Escucha los eventos 'scroll' y 'resize' en window mediante requestAnimationFrame.
 * Calcula la profundidad relativa del scroll y un flag para saber si el usuario comenzó a desplazarse.
 * 
 * @returns Objeto con:
 *   - `profundidad`: número entre 0 y 1 representativo del avance vertical en la página.
 *   - `scrolleado`: booleano `true` si el scroll supera el umbral inicial de 8px (usado para estilizar la navbar).
 */
export function useScrollDepth() {
  const [profundidad, setProfundidad] = useState(0)
  const [scrolleado, setScrolleado] = useState(false)

  useEffect(() => {
    let ticking = false

    /**
     * Calcula métricas de desplazamiento y actualiza el estado local.
     */
    const actualizar = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const altura = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const valor = altura > 0 ? Math.min(1, Math.max(0, scrollTop / altura)) : 0
      setProfundidad(valor)
      setScrolleado(scrollTop > 8)
      ticking = false
    }

    /**
     * Manejador de eventos optimizado mediante requestAnimationFrame.
     */
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(actualizar)
        ticking = true
      }
    }

    // Inicialización al montar
    actualizar()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { profundidad, scrolleado }
}
