import React from 'react'

export interface HabilidadCardProps {
  titulo: string
  descripcion: string
  items?: string[]
}

/**
 * Componente HabilidadCard
 * 
 * Tarjeta de competencias técnicas y blandas con micro-interacción de línea indicadora en hover/foco.
 * Despliega un listado de badges temáticas para cada tecnología o habilidad.
 */
const HabilidadCard: React.FC<HabilidadCardProps> = ({ titulo, descripcion, items = [] }) => {
  return (
    <article
      className="card-custom card-hover-line"
      tabIndex={0}
      aria-label={`Habilidad: ${titulo}`}
    >
      <div className="card-indicator mb-3" />
      <h3 className="h5 mb-2" style={{ fontWeight: 600 }}>
        {titulo}
      </h3>
      <p style={{ marginBottom: items.length ? '1.25rem' : 0, lineHeight: 1.65 }}>
        {descripcion}
      </p>
      {items.length > 0 && (
        <div aria-label="Tecnologías y herramientas">
          {items.map((i) => (
            <span key={i} className="badge-custom">
              {i}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export default HabilidadCard
