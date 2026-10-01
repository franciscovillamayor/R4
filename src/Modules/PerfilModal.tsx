import React, { useEffect, useState } from 'react'
import type { PerfilPortfolio } from '@scripts/usePortfolioData'

interface PerfilModalProps {
  abierto: boolean
  perfil: PerfilPortfolio
  onCancelar: () => void
  onGuardar: (perfil: Partial<PerfilPortfolio>) => void | Promise<void>
}

const PerfilModal: React.FC<PerfilModalProps> = ({ abierto, perfil, onCancelar, onGuardar }) => {
  const [form, setForm] = useState(perfil)
  const [errorEmail, setErrorEmail] = useState('')

  useEffect(() => {
    if (abierto) setForm(perfil)
  }, [abierto, perfil])

  useEffect(() => {
    if (!abierto) return
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancelar()
    }
    window.addEventListener('keydown', cerrarConEscape)
    return () => window.removeEventListener('keydown', cerrarConEscape)
  }, [abierto, onCancelar])

  if (!abierto) return null

  const actualizar = (campo: keyof PerfilPortfolio, valor: string) =>
    setForm((actual) => ({ ...actual, [campo]: valor }))

  const guardar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorEmail('')
    void onGuardar({ ...form, emailContacto: form.emailContacto.trim() })
  }

  return (
    <div className="modal-overlay" onClick={onCancelar} role="dialog" aria-modal="true" aria-labelledby="perfil-dialog-title">
      <div className="modal-content-wrapper" onClick={(event) => event.stopPropagation()}>
        <form className="modal-card" onSubmit={guardar}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 id="perfil-dialog-title" className="h5 mb-0" style={{ fontWeight: 600 }}>Editar perfil</h3>
            <button type="button" className="modal-close-btn" onClick={onCancelar} aria-label="Cerrar formulario">×</button>
          </div>
          <div className="form-stack">
            <Campo label="Nombre completo" value={form.nombre} onChange={(value) => actualizar('nombre', value)} />
            <Campo label="Profesión o rol" value={form.profesion} onChange={(value) => actualizar('profesion', value)} />
            <Campo label="Edad" value={form.edad} onChange={(value) => actualizar('edad', value)} />
            <Campo label="Educación" value={form.educacion} onChange={(value) => actualizar('educacion', value)} />
            <Campo
              label="Email de contacto"
              type="email"
              value={form.emailContacto}
              error={errorEmail}
              onInvalid={() => setErrorEmail('Escribe una dirección de email válida.')}
              onChange={(value) => {
                actualizar('emailContacto', value)
                setErrorEmail('')
              }}
            />
            <label className="form-label-custom">
              Presentación
              <textarea className="form-control-custom w-100" rows={3} value={form.descripcion} onChange={(event) => actualizar('descripcion', event.target.value)} required />
            </label>
          </div>
          <div className="d-flex gap-2 justify-content-end mt-4" style={{ flexWrap: 'wrap' }}>
            <button type="button" className="btn-outline-custom" onClick={onCancelar}>Cancelar</button>
            <button type="submit" className="btn-primary-custom">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface CampoProps {
  label: string
  type?: string
  value: string
  error?: string
  onInvalid?: () => void
  onChange: (value: string) => void
}

const Campo: React.FC<CampoProps> = ({ label, type = 'text', value, error, onInvalid, onChange }) => (
  <label className="form-label-custom">
    {label}
    <input
      className="form-control-custom w-100"
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onInvalid={(event) => {
        event.preventDefault()
        onInvalid?.()
      }}
      required
    />
    {error && <span className="error-text" role="alert">{error}</span>}
  </label>
)

export default PerfilModal
