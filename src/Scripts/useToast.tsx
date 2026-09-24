import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export type ToastTipo = 'success' | 'error' | 'info'

/** Estructura de datos individual para cada notificación flotante */
export interface ToastItem {
  id: number
  tipo: ToastTipo
  mensaje: string
}

/** Interfaz del contexto que expone los disparadores de notificaciones */
export interface ToastContextShape {
  showSuccess: (mensaje: string, duracionMs?: number) => number
  showError: (mensaje: string, duracionMs?: number) => number
  showInfo: (mensaje: string, duracionMs?: number) => number
  ocultar: (id: number) => void
}

const ToastContext = createContext<ToastContextShape | undefined>(undefined)

// Generador de identificadores únicos para cada toast
let CONTADOR_ID = 0

/**
 * ToastProvider
 * 
 * Componente proveedor del contexto de notificaciones. Renderiza el contenedor
 * flotante de toasts accesible con soporte para teclado (Enter o Espacio para descartar).
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  /**
   * Elimina un toast por su identificador único.
   */
  const ocultar = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  /**
   * Registra una nueva notificación en el stack y programa su auto-cierre.
   */
  const mostrar = useCallback(
    (tipo: ToastTipo, mensaje: string, duracionMs = 4500) => {
      CONTADOR_ID += 1
      const id = CONTADOR_ID
      setToasts((prev) => [...prev, { id, tipo, mensaje }])
      if (duracionMs > 0) {
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duracionMs)
      }
      return id
    },
    []
  )

  const showSuccess = useCallback(
    (mensaje: string, duracionMs?: number) => mostrar('success', mensaje, duracionMs),
    [mostrar]
  )
  const showError = useCallback(
    (mensaje: string, duracionMs?: number) => mostrar('error', mensaje, duracionMs),
    [mostrar]
  )
  const showInfo = useCallback(
    (mensaje: string, duracionMs?: number) => mostrar('info', mensaje, duracionMs),
    [mostrar]
  )

  // Evita desincronización de hidratación renderizando en el cliente
  const [montado, setMontado] = useState(false)
  useEffect(() => setMontado(true), [])

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, ocultar }}>
      {children}
      {montado && (
        <div className="toast-container" role="status" aria-live="polite" aria-atomic="true">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`toast-item toast-${t.tipo}`}
              onClick={() => ocultar(t.id)}
              role="button"
              tabIndex={0}
              aria-label={`Notificación: ${t.mensaje}. Presiona para cerrar.`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  ocultar(t.id)
                }
              }}
            >
              {t.mensaje}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

/**
 * Hook useToast
 * 
 * Permite a cualquier componente hijo invocar toasts de éxito, error o informativos.
 * 
 * @throws Error si se invoca fuera de un ToastProvider.
 * @returns Funciones auxiliares `showSuccess`, `showError`, `showInfo` y `ocultar`.
 */
export const useToast = (): ToastContextShape => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast debe usarse dentro de ToastProvider')
  }
  return ctx
}
