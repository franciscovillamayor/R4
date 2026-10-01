import React from 'react'
import type { PerfilPortfolio } from '@scripts/usePortfolioData'

/**
 * Componente Footer
 * 
 * Pie de página institucional que despliega autoría, rol profesional
 * y el año en curso computado dinámicamente.
 */
const Footer: React.FC<{ perfil: PerfilPortfolio }> = ({ perfil }) => {
  const anio = new Date().getFullYear()
  return (
    <footer className="footer-custom">
      <div className="container-fluid px-0">
        <div className="row g-0 justify-content-center">
          <div className="col-12 col-md-10 col-lg-9 px-4 px-md-5 px-xl-7">
            <div
              style={{
                width: '40px',
                height: '1px',
                backgroundColor: 'var(--accent)',
                opacity: 0.35,
                margin: '0 auto 1.25rem auto',
              }}
              aria-hidden="true"
            />
            <div
              style={{
                color: 'var(--text-main)',
                fontWeight: 500,
                marginBottom: '0.35rem',
                letterSpacing: '-0.01em',
              }}
            >
              {perfil.nombre}
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              {perfil.profesion} · Portfolio profesional
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7, letterSpacing: '0.02em' }}>
              © {anio} Todos los derechos reservados
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
