import React from 'react'
import Reveal from '@modules/Reveal'
import type { PerfilPortfolio } from '@scripts/usePortfolioData'

/**
 * Componente Hero
 * 
 * Sección principal de introducción y presentación personal.
 * Contiene llamadas a la acción (CTAs) que ejecutan scroll suave hacia las secciones relevantes.
 */
const Hero: React.FC<{ perfil: PerfilPortfolio }> = ({ perfil }) => {
  /**
   * Ejecuta scroll suave hacia la sección destino.
   * @param id - Identificador del elemento HTML destino.
   */
  const bajar = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="inicio" className="hero-section" aria-label="Presentación personal">
      <div className="container-fluid px-0">
        <div className="row g-0 justify-content-center align-items-center">
          <div className="col-12 col-md-12 col-lg-11 col-xl-10 text-center px-4 px-md-5 px-xl-7">
            <Reveal variante="fade" delayMs={0}>
              <div className="eyebrow mb-4">
                <span className="eyebrow-line" />
                <span className="eyebrow-text">Portfolio Profesional</span>
                <span className="eyebrow-line" />
              </div>
            </Reveal>

            <Reveal variante="slide-up" delayMs={120}>
              <h1 className="hero-title mb-3">{perfil.nombre}</h1>
            </Reveal>

            <Reveal variante="fade" delayMs={220}>
              <div className="hero-divider mx-auto mb-4" />
            </Reveal>

            <Reveal variante="slide-up" delayMs={280}>
              <p className="hero-subtitle mx-auto">
                {perfil.profesion} · {perfil.edad} · {perfil.educacion}. {perfil.descripcion}
              </p>
            </Reveal>

            <Reveal variante="slide-up" delayMs={380}>
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
                <button
                  type="button"
                  className="btn-primary-custom"
                  onClick={() => bajar('proyectos')}
                >
                  Ver proyectos
                </button>
                <button
                  type="button"
                  className="btn-outline-custom"
                  onClick={() => bajar('habilidades')}
                >
                  Conocer más
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
