import { useEffect, useRef, useState } from 'react'

export interface OpcionesReveal {
  /** Porcentaje de visibilidad del elemento requerido para disparar la animación (0 a 1). */
  threshold?: number
  /** Margen aplicado al viewport antes de considerar el cruce del elemento. */
  rootMargin?: string
  /** Si es true, la animación se dispara una sola vez y desconecta el observer. */
  unaVez?: boolean
  /** Tiempo de espera en milisegundos antes de aplicar la clase visible. */
  delayMs?: number
}

/**
 * Hook useScrollReveal
 * 
 * Observa un elemento del DOM mediante IntersectionObserver y determina cuándo entra en viewport.
 * Permite orquestar animaciones on-scroll (fade up, zoom in, etc.) sin dependencias pesadas.
 * 
 * @param opciones - Configuración de umbral, margen y delay.
 * @returns Objeto con:
 *   - `ref`: React RefObject para asociar al elemento HTML que se desea observar.
 *   - `visible`: booleano que indica si el elemento ya fue intersectado.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  opciones: OpcionesReveal = {}
) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -40px 0px',
    unaVez = true,
    delayMs = 0,
  } = opciones

  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return undefined

    // Fallback si el navegador no soporta IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    let timer: number | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const aplicar = () => setVisible(true)
            if (delayMs > 0) {
              timer = window.setTimeout(aplicar, delayMs)
            } else {
              aplicar()
            }
            if (unaVez) observer.unobserve(entry.target)
          } else if (!unaVez) {
            setVisible(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(nodo)

    return () => {
      if (timer) window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [threshold, rootMargin, unaVez, delayMs])

  return { ref, visible } as const
}
