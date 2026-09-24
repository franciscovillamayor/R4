import React, { useState } from 'react'

export interface ProyectoCardProps {
  icono: string
  simbolo: string
  titulo: string
  descripcion: string
  tags?: string[]
  enlace?: string
}

/**
 * Componente ProyectoCard
 * 
 * Tarjeta interactiva para proyectos destacados. Incluye:
 * - Cover minimalista con cuadrícula matemática y símbolo representativo.
 * - Animación reactiva ante eventos de cursor (mouseEnter/mouseLeave) y teclado (focus/blur).
 * - Etiquetas tecnológicas y enlace opcional con rel="noreferrer".
 */
const ProyectoCard: React.FC<ProyectoCardProps> = ({
  icono,
  simbolo,
  titulo,
  descripcion,
  tags = [],
  enlace,
}) => {
  const [hover, setHover] = useState(false)

  const clasesCover = ['proyecto-cover', hover ? 'proyecto-cover-active' : ''].filter(Boolean).join(' ')

  return (
    <article
      className="card-custom d-flex flex-column"
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={`Proyecto: ${titulo}`}
    >
      <div className={clasesCover} aria-hidden="true">
        <div className="proyecto-cover-grid" />
        <div className="proyecto-cover-symbol">
          <span
            className="proyecto-symbol"
            style={{ transform: hover ? 'translateY(-2px) scale(1.04)' : undefined }}
          >
            {simbolo}
          </span>
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
