import React, { useEffect, useCallback } from 'react'
import { useTheme } from '@scripts/useTheme'
import { useScrollDepth } from '@scripts/useScrollDepth'
import { useMediaQuery } from '@scripts/useMediaQuery'
import { useKeyPress } from '@scripts/useKeyPress'

/** Enlaces de navegación con anclaje a las secciones de la página */
const enlaces = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'habilidades', texto: 'Habilidades' },
  { id: 'logros', texto: 'Logros' },
  { id: 'experiencia', texto: 'Experiencia' },
  { id: 'proyectos', texto: 'Proyectos' },
  { id: 'contacto', texto: 'Contacto' },
]

/**
 * Componente Navbar
 * 
 * Barra de navegación superior fija con soporte para:
 * - Scroll suave (smooth scrolling) por identificador de sección.
 * - Sombra dinámica al desplazarse (useScrollDepth).
 * - Menú lateral offcanvas para dispositivos móviles.
 * - Cierre automático al redimensionar a pantalla grande (useMediaQuery).
 * - Cierre accesible con la tecla Escape (useKeyPress).
 * - Botón de alternancia de tema claro/oscuro (useTheme).
 *
 * La marca de la izquierda funciona como ancla principal a la sección de inicio y
 * se mantiene separada del borde para reforzar el equilibrio visual del header.
 */
const Navbar: React.FC<{ nombre: string; esAdmin?: boolean }> = ({ nombre, esAdmin = false }) => {
  const { alternarTema } = useTheme()
  const { scrolleado } = useScrollDepth()
  const esPantallaGrande = useMediaQuery('(min-width: 768px)')

  /**
   * Cierra el menú offcanvas de Bootstrap si está abierto.
   */
  const cerrarCanvasMovil = useCallback(() => {
    const bs = (window as any).bootstrap
    const offcanvas = document.getElementById('menuMovil')
    if (bs && offcanvas) {
      const instancia = bs.Offcanvas.getInstance(offcanvas)
      if (instancia) instancia.hide()
    }
  }, [])

  // Hook useKeyPress: cierra el menú móvil si el usuario presiona Escape
  useKeyPress('Escape', cerrarCanvasMovil)

  // Hook useMediaQuery: cierra el menú móvil si la ventana se agranda a desktop
  useEffect(() => {
    if (esPantallaGrande) {
      cerrarCanvasMovil()
    }
  }, [esPantallaGrande, cerrarCanvasMovil])

  /**
   * Realiza desplazamiento suave al elemento con el id especificado.
   */
  const irA = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const clasesNav = ['navbar-custom', scrolleado ? 'navbar-scrolled' : ''].filter(Boolean).join(' ')

  return (
    <nav className={clasesNav}>
      <div className="navbar-inner d-flex align-items-center justify-content-between w-100">
        <a
          href="#inicio"
          onClick={irA('inicio')}
          className="text-decoration-none navbar-logo"
        >
          {nombre}
        </a>

        {/* Enlaces de escritorio */}
        <div className="d-none d-md-flex align-items-center gap-1">
          {enlaces.map((e) => (
            <a
              key={e.id}
              href={`#${e.id}`}
              onClick={irA(e.id)}
              className="nav-link-custom text-decoration-none"
            >
              {e.texto}
            </a>
          ))}
          {!esAdmin && <a href="/admin" className="nav-link-custom text-decoration-none">Admin</a>}
        </div>

        {/* Acciones: botón hamburguesa (móvil) y selector de tema */}
        <div className="d-flex align-items-center gap-2">
          <div className="d-md-none dropdown-center">
            <button
              className="btn-theme-toggle"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#menuMovil"
              aria-controls="menuMovil"
              aria-label="Abrir menú"
              style={{ fontSize: '1rem', fontWeight: 700 }}
            >
              ≡
            </button>
          </div>
          <button
            id="boton-tema"
            className="btn-theme-toggle"
            onClick={() => alternarTema()}
            aria-label="Alternar tema"
            title="Alternar tema claro / oscuro"
          >
            <span id="icono-tema">◐</span>
          </button>
        </div>
      </div>

      {/* Menú lateral offcanvas móvil */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="menuMovil"
        style={{ backgroundColor: 'var(--bg-light)' }}
        aria-labelledby="menuMovilTitulo"
      >
        <div className="offcanvas-header" style={{ borderBottom: 'var(--border-soft)' }}>
          <h5 className="offcanvas-title" id="menuMovilTitulo" style={{ color: 'var(--text-main)', fontWeight: 600 }}>
            Menú
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar menú"
          />
        </div>
        <div className="offcanvas-body d-flex flex-column gap-1 p-3">
          {enlaces.map((e) => (
            <a
              key={e.id}
              href={`#${e.id}`}
              onClick={(evt) => {
                irA(e.id)(evt)
                cerrarCanvasMovil()
              }}
              className="nav-link-custom text-decoration-none"
              style={{ fontSize: '1rem' }}
            >
              {e.texto}
            </a>
          ))}
          {!esAdmin && <a href="/admin" className="nav-link-custom text-decoration-none" style={{ fontSize: '1rem' }}>Administración</a>}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
