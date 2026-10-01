import React from 'react'

export interface LogroCardProps {
  titulo: string
  descripcion: string
  fecha?: string
  onEditar?: () => void
  onEliminar?: () => void
}

/**
 * Componente LogroCard
 *
 * Tarjeta para hitos y logros profesionales alcanzados en producción.
 * Presenta un indicador sutil superior, etiqueta opcional y botones de acción (editar/eliminar).
 */
const LogroCard: React.FC<LogroCardProps> = ({
  titulo,
  descripcion,
  fecha,
  onEditar,
  onEliminar,
}) => {
  return (
    <article
      className="card-custom card-hover-line card-with-actions"
      tabIndex={0}
      aria-label={`Logro: ${titulo}`}
    >
      {(onEditar || onEliminar) && (
        <div className="card-actions" role="group" aria-label="Acciones del logro">
          {onEditar && (
            <button
              type="button"
              className="card-action-btn"
              onClick={(e) => {
                e.stopPropagation()
                onEditar()
              }}
              aria-label={`Editar logro ${titulo}`}
              title="Editar"
            >
              ✎
            </button>
          )}
          {onEliminar && (
            <button
              type="button"
              className="card-action-btn card-action-danger"
              onClick={(e) => {
                e.stopPropagation()
                onEliminar()
              }}
              aria-label={`Eliminar logro ${titulo}`}
              title="Eliminar"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div
        className="d-flex align-items-start justify-content-between mb-3"
        style={{ gap: '0.75rem' }}
      >
        <div className="card-indicator-sm" />
        {fecha && (
          <span className="badge-custom badge-subtle" style={{ marginRight: 0 }}>
            {fecha}
          </span>
        )}
      </div>
      <h3 className="h5 mb-2" style={{ fontWeight: 600 }}>
        {titulo}
      </h3>
      <p style={{ marginBottom: 0, lineHeight: 1.65 }}>{descripcion}</p>
    </article>
  )
}

export default LogroCard
