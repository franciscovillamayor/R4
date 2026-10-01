import React from 'react'
import type { Habilidad } from '@scripts/usePortfolioData'

export interface HabilidadItemProps {
  nombre: string
  onEditar?: () => void
  onEliminar?: () => void
}

/**
 * Componente HabilidadItem
 *
 * Fila individual de una habilidad en la lista principal. Incluye botones de
 * acción inline que aparecen en hover/focus.
 */
const HabilidadItem: React.FC<HabilidadItemProps> = ({ nombre, onEditar, onEliminar }) => {
  return (
    <div className="habilidad-item-wrapper">
      <span className="habilidad-item-dot" aria-hidden="true" />
      <span className="habilidad-item-nombre">{nombre}</span>
      <div className="habilidad-item-actions" role="group" aria-label={`Acciones para ${nombre}`}>
        {onEditar && (
          <button
            type="button"
            className="habilidad-item-btn"
            onClick={(e) => {
              e.stopPropagation()
              onEditar()
            }}
            aria-label={`Editar habilidad ${nombre}`}
            title="Editar"
          >
            ✎
          </button>
        )}
        {onEliminar && (
          <button
            type="button"
            className="habilidad-item-btn habilidad-item-btn-danger"
            onClick={(e) => {
              e.stopPropagation()
              onEliminar()
            }}
            aria-label={`Eliminar habilidad ${nombre}`}
            title="Eliminar"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export interface HabilidadCardProps {
  items: (Habilidad & { onEditar?: () => void; onEliminar?: () => void })[]
}

/**
 * Componente HabilidadCard
 *
 * Tarjeta única con la lista plana completa de habilidades, ordenada y simple.
 * Sin sub-agrupaciones por categoría para simplificar la edición.
 */
const HabilidadCard: React.FC<HabilidadCardProps> = ({ items }) => {
  return (
    <article
      className="card-custom card-hover-line habilidades-lista-card"
      tabIndex={0}
      aria-label="Lista de habilidades"
    >
      <div className="card-indicator mb-3" />
      <h3 className="h5 mb-3" style={{ fontWeight: 600 }}>
        Habilidades y herramientas
      </h3>
      {items.length > 0 ? (
        <div className="habilidad-list" aria-label="Habilidades del portfolio">
          {items.map((h) => (
            <HabilidadItem
              key={h.id}
              nombre={h.nombre}
              onEditar={h.onEditar}
              onEliminar={h.onEliminar}
            />
          ))}
        </div>
      ) : (
        <div className="empty-hint">
          No hay habilidades cargadas. Usa el botón Agregar para crear la primera.
        </div>
      )}
    </article>
  )
}

export default HabilidadCard
