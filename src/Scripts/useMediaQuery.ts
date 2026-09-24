import { useEffect, useState } from 'react'

/**
 * Hook useMediaQuery
 * 
 * Evalúa una media query de CSS (ej: '(max-width: 768px)') de manera reactiva.
 * Escucha cambios en el viewport y actualiza el estado booleano.
 * 
 * @param query - Regla media query a evaluar.
 * @returns boolean - `true` si la consulta coincide con el estado actual del viewport, `false` en caso contrario.
 */
export function useMediaQuery(query: string): boolean {
  const [cumple, setCumple] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined
    }

    const media = window.matchMedia(query)
    
    /**
     * Sincroniza el estado local con la coincidencia de la media query.
     */
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setCumple('matches' in e ? e.matches : false)
    }

    // Inicialización inmediata
    onChange(media)

    // Listener para navegadores modernos
    if (media.addEventListener) {
      media.addEventListener('change', onChange as (e: MediaQueryListEvent) => void)
      return () => media.removeEventListener('change', onChange as (e: MediaQueryListEvent) => void)
    }

    // Compatibilidad para navegadores legacy
    media.addListener(onChange as (e: MediaQueryListEvent) => void)
    return () => media.removeListener(onChange as (e: MediaQueryListEvent) => void)
  }, [query])

  return cumple
}
