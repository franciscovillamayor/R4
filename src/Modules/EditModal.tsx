import React, { useEffect, useRef, useState } from 'react'
import type { SeccionKey, Habilidad, Logro, Experiencia, Proyecto } from '@scripts/usePortfolioData'

export type EditMode = 'crear' | 'editar'

interface EditModalBaseProps {
  abierto: boolean
  modo: EditMode
  seccion: SeccionKey
  onCancelar: () => void
  onGuardar: (datos: Record<string, unknown>) => void
}

interface EditModalCrear extends EditModalBaseProps {
  modo: 'crear'
  valoresIniciales?: undefined
}

interface EditModalEditar extends EditModalBaseProps {
  modo: 'editar'
  valoresIniciales: Record<string, unknown>
}

export type EditModalProps = EditModalCrear | EditModalEditar

const etiquetas: Record<SeccionKey, { crear: string; editar: string }> = {
  habilidades: { crear: 'Nueva habilidad', editar: 'Editar habilidad' },
  logros: { crear: 'Nuevo logro', editar: 'Editar logro' },
  experiencia: { crear: 'Nueva experiencia', editar: 'Editar experiencia' },
  proyectos: { crear: 'Nuevo proyecto', editar: 'Editar proyecto' },
}

const parsearTags = (raw: string): string[] =>
  raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)

const aString = (v: unknown): string => (typeof v === 'string' ? v : '')
const aArray = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : [])

/**
 * Componente EditModal
 *
 * Formulario de edición/creación simple por sección. Campos mínimos y directos,
 * validación por campo, cierre con Escape o botón.
 */
const EditModal: React.FC<EditModalProps> = ({
  abierto,
  modo,
  seccion,
  onCancelar,
  onGuardar,
  ...rest
}) => {
  const iniciales = (rest as EditModalEditar).valoresIniciales ?? {}

  const [form, setForm] = useState<Record<string, unknown>>({})
  const [errores, setErrores] = useState<Record<string, string>>({})
  const abiertoPrevRef = useRef<boolean>(false)
  const keyRef = useRef<string>('')
  const inicialesRef = useRef<Record<string, unknown>>(iniciales)
  inicialesRef.current = iniciales

  useEffect(() => {
    const seAbrio = !abiertoPrevRef.current && abierto
    const baseKey = `${String(abierto)}-${seccion}-${modo}-${String(inicialesRef.current.id ?? '')}`
    const cambioKey = baseKey !== keyRef.current
    abiertoPrevRef.current = abierto

    if (!abierto) return
    if (!seAbrio && !cambioKey) return

    keyRef.current = baseKey
    const init = inicialesRef.current
    const base: Record<string, unknown> = {}
    if (seccion === 'habilidades') {
      base.nombre = aString(init.nombre)
    } else if (seccion === 'logros') {
      base.titulo = aString(init.titulo)
      base.descripcion = aString(init.descripcion)
      base.fecha = aString(init.fecha)
    } else if (seccion === 'experiencia') {
      base.titulo = aString(init.titulo)
      base.lugar = aString(init.lugar)
      base.duracion = aString(init.duracion)
      base.descripcion = aString(init.descripcion)
    } else if (seccion === 'proyectos') {
      base.icono = aString(init.icono)
      base.titulo = aString(init.titulo)
      base.descripcion = aString(init.descripcion)
      base.tags = aArray(init.tags)
      base.enlace = aString(init.enlace)
    }
    setForm(base)
    setErrores({})
  }, [abierto, seccion, modo])

  useEffect(() => {
    if (!abierto) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelar()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [abierto, onCancelar])

  if (!abierto) return null

  const actualizar = (clave: string, valor: unknown) =>
    setForm((prev) => ({ ...prev, [clave]: valor }))

  const validar = (): boolean => {
    const e: Record<string, string> = {}
    if (seccion === 'habilidades') {
      const hab = form as Partial<Habilidad>
      if (!hab.nombre?.trim()) e.nombre = 'Nombre requerido'
    } else if (seccion === 'logros') {
      const log = form as Partial<Logro>
      if (!log.titulo?.trim()) e.titulo = 'Título requerido'
      if (!log.descripcion?.trim()) e.descripcion = 'Descripción requerida'
    } else if (seccion === 'experiencia') {
      const exp = form as Partial<Experiencia>
      if (!exp.titulo?.trim()) e.titulo = 'Título requerido'
      if (!exp.lugar?.trim()) e.lugar = 'Lugar requerido'
      if (!exp.duracion?.trim()) e.duracion = 'Duración requerida'
      if (!exp.descripcion?.trim()) e.descripcion = 'Descripción requerida'
    } else if (seccion === 'proyectos') {
      const pr = form as Partial<Proyecto>
      if (!pr.titulo?.trim()) e.titulo = 'Título requerido'
      if (!pr.descripcion?.trim()) e.descripcion = 'Descripción requerida'
    }
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validar()) return
    onGuardar(form)
  }

  const etiqueta = etiquetas[seccion][modo]

  return (
    <div
      className="modal-overlay"
      onClick={onCancelar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-dialog-title"
    >
      <div
        className="modal-content-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="modal-card" onSubmit={handleSubmit}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 id="edit-dialog-title" className="h5 mb-0" style={{ fontWeight: 600 }}>
              {etiqueta}
            </h3>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onCancelar}
              aria-label="Cerrar formulario"
            >
              ×
            </button>
          </div>

          <div className="form-stack">
            {seccion === 'habilidades' && (
              <Field label="Nombre de la habilidad" error={errores.nombre}>
                <input
                  type="text"
                  className="form-control-custom w-100"
                  value={aString(form.nombre)}
                  onChange={(e) => actualizar('nombre', e.target.value)}
                  placeholder="Ej: React"
                  autoFocus
                />
              </Field>
            )}

            {seccion === 'logros' && (
              <>
                <Field label="Título" error={errores.titulo}>
                  <input
                    type="text"
                    className="form-control-custom w-100"
                    value={aString(form.titulo)}
                    onChange={(e) => actualizar('titulo', e.target.value)}
                    placeholder="Ej: Publicación de sitio web"
                    autoFocus
                  />
                </Field>
                <Field label="Descripción" error={errores.descripcion}>
                  <textarea
                    className="form-control-custom w-100"
                    rows={4}
                    value={aString(form.descripcion)}
                    onChange={(e) => actualizar('descripcion', e.target.value)}
                    placeholder="Descripción detallada del logro..."
                  />
                </Field>
                <Field label="Fecha / etiqueta (opcional)">
                  <input
                    type="text"
                    className="form-control-custom w-100"
                    value={aString(form.fecha)}
                    onChange={(e) => actualizar('fecha', e.target.value)}
                    placeholder="Ej: 2025, Publicado, Hostinger..."
                  />
                </Field>
              </>
            )}

            {seccion === 'experiencia' && (
              <>
                <Field label="Título / puesto" error={errores.titulo}>
                  <input
                    type="text"
                    className="form-control-custom w-100"
                    value={aString(form.titulo)}
                    onChange={(e) => actualizar('titulo', e.target.value)}
                    placeholder="Ej: Pasantía - Desarrollo Web"
                    autoFocus
                  />
                </Field>
                <Field label="Lugar / empresa" error={errores.lugar}>
                  <input
                    type="text"
                    className="form-control-custom w-100"
                    value={aString(form.lugar)}
                    onChange={(e) => actualizar('lugar', e.target.value)}
                    placeholder="Ej: Escuela Malharro"
                  />
                </Field>
                <Field label="Duración" error={errores.duracion}>
                  <input
                    type="text"
                    className="form-control-custom w-100"
                    value={aString(form.duracion)}
                    onChange={(e) => actualizar('duracion', e.target.value)}
                    placeholder="Ej: Ene 2024 - Jul 2024"
                  />
                </Field>
                <Field label="Descripción" error={errores.descripcion}>
                  <textarea
                    className="form-control-custom w-100"
                    rows={4}
                    value={aString(form.descripcion)}
                    onChange={(e) => actualizar('descripcion', e.target.value)}
                    placeholder="Tareas realizadas y aprendizajes..."
                  />
                </Field>
              </>
            )}

            {seccion === 'proyectos' && (
              <>
                <Field label="Título del proyecto" error={errores.titulo}>
                  <input
                    type="text"
                    className="form-control-custom w-100"
                    value={aString(form.titulo)}
                    onChange={(e) => actualizar('titulo', e.target.value)}
                    placeholder="Ej: Sitio Web - Empresa Pesquera"
                    autoFocus
                  />
                </Field>
                <Field label="Categoría / etiqueta del proyecto">
                  <input
                    type="text"
                    className="form-control-custom w-100"
                    value={aString(form.icono)}
                    onChange={(e) => actualizar('icono', e.target.value)}
                    placeholder="Ej: Sitio Productivo, App Web, Institucional..."
                  />
                </Field>
                <Field label="Descripción" error={errores.descripcion}>
                  <textarea
                    className="form-control-custom w-100"
                    rows={4}
                    value={aString(form.descripcion)}
                    onChange={(e) => actualizar('descripcion', e.target.value)}
                    placeholder="Qué hace el proyecto, qué tecnologías usa..."
                  />
                </Field>
                <Field label="Tags (separados por coma o punto y coma)">
                  <input
                    type="text"
                    className="form-control-custom w-100"
                    value={aArray(form.tags).join(', ')}
                    onChange={(e) => actualizar('tags', parsearTags(e.target.value))}
                    placeholder="Ej: Bootstrap, React, Vite"
                  />
                </Field>
                <Field label="Enlace (opcional)">
                  <input
                    type="url"
                    className="form-control-custom w-100"
                    value={aString(form.enlace)}
                    onChange={(e) => actualizar('enlace', e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
              </>
            )}
          </div>

          <div className="d-flex gap-2 justify-content-end mt-4" style={{ flexWrap: 'wrap' }}>
            <button type="button" className="btn-outline-custom" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary-custom">
              {modo === 'crear' ? 'Agregar' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

const Field: React.FC<FieldProps> = ({ label, error, children }) => (
  <div>
    <label className="form-label-custom">{label}</label>
    {children}
    {error && <div className="error-text">{error}</div>}
  </div>
)

export default EditModal
