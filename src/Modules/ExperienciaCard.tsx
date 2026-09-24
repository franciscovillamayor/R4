import React from 'react'

export interface ExperienciaCardProps {
  titulo: string
  lugar: string
  duracion: string
  descripcion: string
}

/**
 * Componente ExperienciaCard
 * 
 * Tarjeta de trayectoria profesional estructurada como timeline visual.
 * Incluye un punto indicador animado, barra vertical conectora e información del puesto.
 */
const ExperienciaCard: React.FC<ExperienciaCardProps> = ({
  titulo,
  lugar,
  duracion,
  descripcion,
}) => {
  return (
    <article
      className="card-custom card-hover-line experiencia-card"
      tabIndex={0}
      aria-label={`Experiencia: ${titulo} en ${lugar}`}
    >
      <div className="d-flex align-items-start mb-4" style={{ gap: '1.25rem' }}>
        <div className="experience-marker flex-shrink-0" aria-hidden="true">
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
