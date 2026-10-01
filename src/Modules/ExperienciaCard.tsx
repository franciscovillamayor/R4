import React from 'react'

export interface ExperienciaCardProps {
  titulo: string
  lugar: string
  duracion: string
  descripcion: string
  isLast?: boolean
  onEditar?: () => void
  onEliminar?: () => void
}

/**
 * Componente ExperienciaCard
 *
 * Tarjeta de trayectoria profesional integrada en un timeline vertical continuo.
 * La barra vertical se extiende hasta conectar con el siguiente item.
 * El último item del listado recorta la barra en la parte inferior.
 */
const ExperienciaCard: React.FC<ExperienciaCardProps> = ({
  titulo,
  lugar,
  duracion,
  descripcion,
  isLast = true,
  onEditar,
  onEliminar,
}) => {
  return (
    <article
      className="card-custom card-hover-line experiencia-card card-with-actions experiencia-timeline-item"
      tabIndex={0}
      aria-label={`Experiencia: ${titulo} en ${lugar}`}
    >
      {(onEditar || onEliminar) && (
        <div className="card-actions" role="group" aria-label="Acciones de la experiencia">
          {onEditar && (
            <button
              type="button"
              className="card-action-btn"
              onClick={(e) => {
                e.stopPropagation()
                onEditar()
              }}
              aria-label={`Editar experiencia ${titulo}`}
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
              aria-label={`Eliminar experiencia ${titulo}`}
              title="Eliminar"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="d-flex align-items-start mb-3" style={{ gap: '1.25rem' }}>
        <div className={`experience-marker flex-shrink-0 ${isLast ? 'experience-marker-last' : ''}`} aria-hidden="true">
          <span className="experience-dot" />
          <span className="experience-bar" />
        </div>
        <div className="flex-grow-1">
          <h3 className="h5 mb-1" style={{ fontWeight: 600 }}>
            {titulo}
          </h3>
          <div
            className="d-flex flex-wrap gap-2 align-items-center mb-2"
            style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.92rem' }}
          >
            {lugar}
          </div>
          <span className="badge-custom badge-subtle" style={{ marginBottom: 0 }}>
            {duracion}
          </span>
        </div>
      </div>
      <p style={{ marginBottom: 0, lineHeight: 1.65, paddingLeft: '3.25rem' }}>
        {descripcion}
      </p>
    </article>
  )
}

export default ExperienciaCard
