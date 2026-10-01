import React, { useState } from 'react'

export interface ProyectoCardProps {
  icono: string
  titulo: string
  descripcion: string
  tags?: string[]
  enlace?: string
  onEditar?: () => void
  onEliminar?: () => void
}

/**
 * Componente ProyectoCard
 *
 * Tarjeta minimalista para proyectos destacados. Cover discreto con etiqueta
 * de categoría (sin símbolos/emojis), grilla opcional, tags y botones de acción.
 */
const ProyectoCard: React.FC<ProyectoCardProps> = ({
  icono,
  titulo,
  descripcion,
  tags = [],
  enlace,
  onEditar,
  onEliminar,
}) => {
  const [hover, setHover] = useState(false)

  const clasesCover = ['proyecto-cover', hover ? 'proyecto-cover-active' : ''].filter(Boolean).join(' ')

  return (
    <article
      className="card-custom d-flex flex-column card-with-actions"
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={`Proyecto: ${titulo}`}
    >
      {(onEditar || onEliminar) && (
        <div className="card-actions card-actions-cover" role="group" aria-label="Acciones del proyecto">
          {onEditar && (
            <button
              type="button"
              className="card-action-btn"
              onClick={(e) => {
                e.stopPropagation()
                onEditar()
              }}
              aria-label={`Editar proyecto ${titulo}`}
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
              aria-label={`Eliminar proyecto ${titulo}`}
              title="Eliminar"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className={clasesCover} aria-hidden="true">
        <div className="proyecto-cover-grid" />
        <div className="proyecto-cover-symbol">
          <span className="proyecto-label">{icono}</span>
        </div>
      </div>
      <h3 className="h5 mb-2 mt-1" style={{ fontWeight: 600 }}>
        {titulo}
      </h3>
      <p style={{ marginBottom: tags.length ? '1rem' : '1rem', lineHeight: 1.65 }}>
        {descripcion}
      </p>
      {tags.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          {tags.map((t) => (
            <span key={t} className="badge-custom">
              {t}
            </span>
          ))}
        </div>
      )}
      {enlace && (
        <a
          href={enlace}
          target="_blank"
          rel="noreferrer"
          className="btn-outline-custom text-center text-decoration-none mt-auto align-self-start"
          aria-label={`${titulo} — abrir enlace del proyecto`}
        >
          Ver proyecto ↗
        </a>
      )}
    </article>
  )
}

export default ProyectoCard
