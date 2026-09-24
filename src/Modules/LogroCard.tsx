import React from 'react'

export interface LogroCardProps {
  titulo: string
  descripcion: string
  fecha?: string
}

/**
 * Componente LogroCard
 * 
 * Tarjeta para hitos y logros profesionales alcanzados en producción.
 * Presenta un indicador sutil superior y una etiqueta opcional de estado o plataforma.
 */
const LogroCard: React.FC<LogroCardProps> = ({ titulo, descripcion, fecha }) => {
  return (
    <article
      className="card-custom card-hover-line"
      tabIndex={0}
      aria-label={`Logro: ${titulo}`}
    >
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
