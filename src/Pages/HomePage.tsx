import React from 'react'
import Navbar from '@modules/Navbar'
import Hero from '@modules/Hero'
import Footer from '@modules/Footer'
import HabilidadCard from '@modules/HabilidadCard'
import LogroCard from '@modules/LogroCard'
import ExperienciaCard from '@modules/ExperienciaCard'
import ProyectoCard from '@modules/ProyectoCard'
import FormularioContacto from '@modules/FormularioContacto'
import Reveal from '@modules/Reveal'
import { useScrollToTop } from '@scripts/useScrollToTop'

/** Datos de habilidades y conocimientos técnicos */
const habilidades = [
  {
    titulo: 'Desarrollo Front-end',
    descripcion:
      'Creación de interfaces modernas, responsivas y funcionales con HTML5, CSS3 y JavaScript / TypeScript.',
    items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Bootstrap', 'Vite'],
  },
  {
    titulo: 'Ofimática',
    descripcion:
      'Manejo avanzado de herramientas de productividad para organización, presentaciones y gestión de documentos.',
    items: ['Word', 'Excel', 'PowerPoint', 'Excel avanzado', 'Google Workspace'],
  },
]

/** Datos de logros y despliegues concretos */
const logros = [
  {
    titulo: 'Sitio web - Empresa Pesquera',
    descripcion:
      'Desarrollo y publicación de un sitio web profesional para una empresa pesquera de Mar del Plata, incluyendo diseño responsive y optimización.',
    fecha: 'Publicado',
  },
  {
    titulo: 'Gestión de Dominio y Hosting',
    descripcion:
      'Administración y publicación de sitios web mediante la plataforma Hostinger: dominio, hosting, DNS y despliegues en producción.',
    fecha: 'Hostinger',
  },
]

/** Datos de experiencia y pasantías laborales */
const experiencia = [
  {
    titulo: 'Pasantía - Desarrollo Web',
    lugar: 'Escuela Malharro',
    duracion: 'Pasantía escolar',
    descripcion:
      'Participación en el desarrollo y mantenimiento de la página web institucional de la escuela, aplicando buenas prácticas de Front-end y accesibilidad.',
  },
]

/** Proyectos destacados del portfolio */
const proyectos = [
  {
    icono: 'Sitio Productivo',
    simbolo: '⚓',
    titulo: 'Sitio Web - Empresa Pesquera',
    descripcion:
      'Plataforma web para empresa pesquera de Mar del Plata, con catálogo, servicios, historia y formulario de contacto. Diseño moderno y optimización SEO.',
    tags: ['Bootstrap', 'Hostinger', 'Producción'],
  },
  {
    icono: 'Sitio Institucional',
    simbolo: '⌂',
    titulo: 'Página Web - Escuela Malharro',
    descripcion:
      'Sitio institucional de la escuela, desarrollado durante mi pasantía. Incluye novedades, información académica, contacto y galería.',
    tags: ['HTML5', 'CSS3', 'JS', 'Pasantía'],
  },
]

interface SeccionWrapperProps {
  id: string
  titulo: string
  subtitulo: string
  alterna?: boolean
  children: React.ReactNode
}

/**
 * Componente SeccionWrapper
 * 
 * Contenedor estándar para cada sección con animación Reveal en el encabezado
 * y grilla fluida responsive para el contenido hijo.
 */
const SeccionWrapper: React.FC<SeccionWrapperProps> = ({
  id,
  titulo,
  subtitulo,
  alterna,
  children,
}) => (
  <section
    id={id}
    className={`section ${alterna ? 'section-alt' : ''}`}
    aria-labelledby={`${id}-titulo`}
  >
    <div className="container-fluid px-0">
      <Reveal variante="fade">
        <div className="row g-0 justify-content-center">
          <div className="col-12 section-header-wide px-4 px-md-5 px-xl-7">
            <div className="section-separator mx-auto mb-4" aria-hidden="true" />
            <h2 id={`${id}-titulo`} className="section-title">
              {titulo}
            </h2>
            <p className="section-subtitle">{subtitulo}</p>
          </div>
        </div>
      </Reveal>
      <div className="row g-0 justify-content-center px-4 px-md-5 px-xl-7">
        {children}
      </div>
    </div>
  </section>
)

/**
 * Componente HomePage
 * 
 * Página principal del portfolio. Orquesta la estructura global:
 * Navbar fija, Hero, secciones temáticas (Habilidades, Logros, Experiencia, Proyectos, Contacto),
 * Footer y botón flotante de retorno superior con useScrollToTop.
 */
const HomePage: React.FC = () => {
  const { mostrar: mostrarBotonTop, subir } = useScrollToTop(350)

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', width: '100vw' }}>
      <Navbar />
      <Hero />

      {/* Sección Habilidades */}
      <SeccionWrapper
        id="habilidades"
        titulo="Habilidades"
        subtitulo="Herramientas y conocimientos aplicados en cada proyecto para obtener resultados profesionales."
        alterna
      >
        {habilidades.map((h, i) => (
          <div key={h.titulo} className="col-12 col-md-6 col-lg-6 mb-4 px-md-2 px-xl-3">
            <Reveal variante="slide-up" delayMs={i * 120}>
              <HabilidadCard {...h} />
            </Reveal>
          </div>
        ))}
      </SeccionWrapper>

      {/* Sección Logros */}
      <SeccionWrapper
        id="logros"
        titulo="Logros y desarrollos"
        subtitulo="Trabajos y aprendizajes concretos materializados en producción."
      >
        {logros.map((l, i) => (
          <div key={l.titulo} className="col-12 col-md-6 col-lg-6 mb-4 px-md-2 px-xl-3">
            <Reveal variante="slide-up" delayMs={i * 120}>
              <LogroCard {...l} />
            </Reveal>
          </div>
        ))}
      </SeccionWrapper>

      {/* Sección Experiencia */}
      <SeccionWrapper
        id="experiencia"
        titulo="Experiencia"
        subtitulo="Recorrido profesional y oportunidades de crecimiento."
        alterna
      >
        {experiencia.map((e, i) => (
          <div key={e.titulo} className="col-12 col-md-10 col-lg-9 px-md-2 px-xl-3">
            <Reveal variante="slide-up" delayMs={i * 120}>
              <ExperienciaCard {...e} />
            </Reveal>
          </div>
        ))}
      </SeccionWrapper>

      {/* Sección Proyectos */}
      <SeccionWrapper
        id="proyectos"
        titulo="Proyectos destacados"
        subtitulo="Selección de los trabajos más representativos realizados hasta el momento."
      >
        {proyectos.map((p, i) => (
          <div key={p.titulo} className="col-12 col-md-6 col-lg-6 mb-4 px-md-2 px-xl-3">
            <Reveal variante="slide-up" delayMs={i * 120}>
              <ProyectoCard {...p} />
            </Reveal>
          </div>
        ))}
      </SeccionWrapper>

      {/* Sección Contacto */}
      <SeccionWrapper
        id="contacto"
        titulo="Contacto"
        subtitulo="¿Tenés una propuesta, consulta o proyecto en mente? Enviame un mensaje y te responderé a la brevedad."
        alterna
      >
        <div className="col-12 col-lg-11 col-xl-10 px-md-2 px-xl-3">
          <Reveal variante="slide-up">
            <FormularioContacto />
          </Reveal>
        </div>
      </SeccionWrapper>

      <Footer />

      {/* Botón flotante para retorno suave al tope */}
      <button
        type="button"
        className={`btn-scroll-top ${mostrarBotonTop ? 'visible' : ''}`}
        onClick={subir}
        aria-label="Volver arriba de la página"
        title="Volver arriba"
      >
        ↑
      </button>
    </div>
  )
}

export default HomePage
