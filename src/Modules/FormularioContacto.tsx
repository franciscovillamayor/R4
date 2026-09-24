import React, { useState } from 'react'

const EMAIL_CONTACTO = 'franciscoxx458@gmail.com'

/**
 * FormularioContacto simplificado.
 *
 * Tiene 3 funciones claras y faciles de explicar:
 * 1. informar que el portfolio está disponible para proyectos,
 * 2. copiar el email al portapapeles,
 * 3. abrir un correo con mailto para contacto directo.
 *
 * Se elimina la lógica compleja de validación y envío para dejar
 * una experiencia más fácil de entender y mantener.
 */
const FormularioContacto: React.FC = () => {
  const [emailCopiado, setEmailCopiado] = useState(false)

  const copiarEmail = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(EMAIL_CONTACTO)
      } else {
        const inputTemporal = document.createElement('input')
        inputTemporal.value = EMAIL_CONTACTO
        document.body.appendChild(inputTemporal)
        inputTemporal.select()
        document.execCommand('copy')
        document.body.removeChild(inputTemporal)
      }

      setEmailCopiado(true)
      window.setTimeout(() => setEmailCopiado(false), 1800)
    } catch (_error) {
      window.alert('No se pudo copiar el email. Puedes escribirlo manualmente: ' + EMAIL_CONTACTO)
    }
  }

  return (
    <div className="row g-4 align-items-stretch justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="card-custom text-center">
          <span className="status-badge-live mb-3 d-inline-flex align-items-center">
            <span className="status-dot-pulse" aria-hidden="true" />
            Disponible para proyectos
          </span>

          <h3 className="h4 mb-3" style={{ fontWeight: 600 }}>
            Contacto
          </h3>

          <p className="mx-auto mb-4" style={{ maxWidth: '540px', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Si querés hablar de un proyecto, una propuesta o una colaboración, podés copiar mi correo y escribirme directamente.
          </p>

          <div className="d-flex justify-content-center mb-3">
            <button type="button" className="btn-primary-custom" onClick={copiarEmail}>
              {emailCopiado ? '✓ Email copiado' : 'Copiar email'}
            </button>
          </div>

          <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 500 }}>
            {EMAIL_CONTACTO}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormularioContacto
