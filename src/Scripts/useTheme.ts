import { useEffect } from 'react'

const STORAGE_KEY = 'p1-tema'

export type Tema = 'light' | 'dark'

/**
 * Aplica el tema seleccionado al elemento raíz del DOM y actualiza el glifo del icono.
 * 
 * @param tema - Tema a aplicar ('light' o 'dark').
 */
export const aplicarTema = (tema: Tema): void => {
  document.documentElement.setAttribute('data-bs-theme', tema)
  const icono = document.getElementById('icono-tema')
  if (icono) {
    icono.textContent = tema === 'dark' ? '◑' : '◐'
  }
}

/**
 * Persiste la elección de tema en el almacenamiento local del navegador.
 * 
 * @param tema - Tema a guardar.
 */
const guardarPreferencia = (tema: Tema): void => {
  try {
    localStorage.setItem(STORAGE_KEY, tema)
  } catch (_err) {
    // Fallback silencioso si localStorage está deshabilitado o restringido
  }
}

/**
 * Recupera la preferencia de tema previamente guardada por el usuario.
 * 
 * @returns El tema almacenado o `null` si no existe.
 */
const leerPreferencia = (): Tema | null => {
  try {
    const valor = localStorage.getItem(STORAGE_KEY)
    if (valor === 'light' || valor === 'dark') return valor
    return null
  } catch (_err) {
    return null
  }
}

/**
 * Hook useTheme
 * 
 * Controla el estado del tema visual (claro / oscuro) del portfolio.
 * Provee la función para alternar entre temas y sincroniza con el DOM.
 * 
 * @returns Objeto con `alternarTema` y `aplicarTema`.
 */
export function useTheme() {
  useEffect(() => {
    // Garantiza consistencia en el primer render
    aplicarTema('light')

    // Escucha eventos del sistema operativo para cambio de tema si no hay preferencia manual
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaDark = window.matchMedia('(prefers-color-scheme: dark)')
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const preferenciaGuardada = leerPreferencia()
        if (!preferenciaGuardada) {
          aplicarTema(e.matches ? 'dark' : 'light')
        }
      }

      if (mediaDark.addEventListener) {
        mediaDark.addEventListener('change', handleSystemThemeChange)
        return () => mediaDark.removeEventListener('change', handleSystemThemeChange)
      }
    }
  }, [])

  /**
   * Alterna entre tema claro y tema oscuro, actualizando DOM y persistencia.
   */
  const alternarTema = (): void => {
    const actual = document.documentElement.getAttribute('data-bs-theme') as Tema | null
    const siguiente: Tema = actual === 'dark' ? 'light' : 'dark'
    aplicarTema(siguiente)
    guardarPreferencia(siguiente)
  }

  return { alternarTema, aplicarTema }
}
