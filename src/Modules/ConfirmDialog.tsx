import React, { useEffect } from 'react'

export interface ConfirmDialogProps {
  abierto: boolean
  titulo?: string
  mensaje: string
  nombreItem?: string
  textoConfirmar?: string
  textoCancelar?: string
  onConfirmar: () => void
  onCancelar: () => void
}

/**
 * Componente ConfirmDialog
 *
 * Modal de confirmación personalizado (reemplaza al alert nativo).
 * Presenta un título, mensaje descriptivo y dos botones de acción.
 * Cierra con Escape o clic en el overlay.
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  abierto,
  titulo = 'Eliminar elemento',
  mensaje = 'Esta acción no se puede deshacer.',
  nombreItem,
  textoConfirmar = 'Eliminar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}) => {
  useEffect(() => {
    if (!abierto) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelar()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [abierto, onCancelar])

  if (!abierto) return null

  return (
    <div
      className="modal-overlay"
      onClick={onCancelar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="modal-content-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-card">
          <div className="modal-icon-danger" aria-hidden="true">
            !
          </div>
          <h3 id="confirm-dialog-title" className="h5 mb-2" style={{ fontWeight: 600 }}>
            {titulo}
          </h3>
          <p style={{ marginBottom: nombreItem ? '0.5rem' : '1.5rem', lineHeight: 1.6 }}>
            {mensaje}
          </p>
          {nombreItem && (
            <div className="confirm-item-preview mb-4">
              {nombreItem}
            </div>
          )}
          <div className="d-flex gap-2 justify-content-end" style={{ flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-outline-custom"
              onClick={onCancelar}
              autoFocus
            >
              {textoCancelar}
            </button>
            <button
              type="button"
              className="btn-danger-custom"
              onClick={onConfirmar}
            >
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
