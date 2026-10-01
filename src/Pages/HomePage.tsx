import React, { useState } from 'react'
import Navbar from '@modules/Navbar'
import Hero from '@modules/Hero'
import Footer from '@modules/Footer'
import HabilidadCard from '@modules/HabilidadCard'
import LogroCard from '@modules/LogroCard'
import ExperienciaCard from '@modules/ExperienciaCard'
import ProyectoCard from '@modules/ProyectoCard'
import FormularioContacto from '@modules/FormularioContacto'
import Reveal from '@modules/Reveal'
import ConfirmDialog from '@modules/ConfirmDialog'
import EditModal, { EditMode } from '@modules/EditModal'
import PerfilModal from '@modules/PerfilModal'
import { useScrollToTop } from '@scripts/useScrollToTop'
import { usePortfolioData, type SeccionKey, type PortfolioDataShape } from '@scripts/usePortfolioData'
import { useToast } from '@scripts/useToast'

interface SeccionWrapperProps {
  id: string
  titulo: string
  subtitulo: string
  alterna?: boolean
  onAgregar?: () => void
  children: React.ReactNode
}

/**
 * Componente SeccionWrapper
 *
 * Contenedor estándar por sección. Expone un único botón "Agregar" en la
 * cabecera cuando se habilita el control de edición.
 */
const SeccionWrapper: React.FC<SeccionWrapperProps> = ({
  id,
  titulo,
  subtitulo,
  alterna,
  onAgregar,
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
            <div
              className="d-flex align-items-start justify-content-center position-relative"
              style={{ gap: '1rem', flexWrap: 'wrap' }}
            >
              <div className="text-center w-100">
                <h2 id={`${id}-titulo`} className="section-title" style={{ marginBottom: '0.6rem' }}>
                  {titulo}
                </h2>
                <p className="section-subtitle">{subtitulo}</p>
              </div>
              {onAgregar && (
                <button
                  type="button"
                  className="btn-agregar-seccion"
                  onClick={onAgregar}
                  aria-label={`Agregar nuevo item a ${titulo}`}
                >
                  <span aria-hidden="true">+</span>
                  <span className="btn-agregar-label">Agregar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Reveal>
      <div className="row g-0 justify-content-center px-4 px-md-5 px-xl-7">
        {children}
      </div>
    </div>
  </section>
)

interface PendingDelete {
  seccion: SeccionKey
  id: string
  nombre: string
}

interface PendingEdit {
  seccion: SeccionKey
  modo: EditMode
  id?: string
  valoresIniciales?: Record<string, unknown>
}

const msjsExito = {
  habilidades: { agregar: 'Habilidad agregada', editar: 'Habilidad actualizada', eliminar: 'Habilidad eliminada' },
  logros: { agregar: 'Logro agregado', editar: 'Logro actualizado', eliminar: 'Logro eliminado' },
  experiencia: { agregar: 'Experiencia agregada', editar: 'Experiencia actualizada', eliminar: 'Experiencia eliminada' },
  proyectos: { agregar: 'Proyecto agregado', editar: 'Proyecto actualizado', eliminar: 'Proyecto eliminado' },
}

interface HomePageProps {
  adminMode?: boolean
  onLogout?: () => void
}

/**
 * Componente HomePage
 *
 * Página principal. Integra el sistema CRUD: una sola tarjeta de Habilidades,
 * timeline continuo de Experiencia, sin emojis y un único botón Agregar
 * por sección.
 */
const HomePage: React.FC<HomePageProps> = ({ adminMode = false, onLogout }) => {
  const { mostrar: mostrarBotonTop, subir } = useScrollToTop(350)
  const { data, agregar, editar, eliminar, actualizarPerfil } = usePortfolioData()
  const { showSuccess, showError } = useToast()

  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [pendingEdit, setPendingEdit] = useState<PendingEdit | null>(null)
  const [editandoPerfil, setEditandoPerfil] = useState(false)

  const abrirCrear = (seccion: SeccionKey) => {
    setPendingEdit({ seccion, modo: 'crear' })
  }

  const abrirEditar = (seccion: SeccionKey, id: string, valores: Record<string, unknown>) => {
    setPendingEdit({ seccion, modo: 'editar', id, valoresIniciales: valores })
  }

  const pedirEliminar = (seccion: SeccionKey, id: string, nombre: string) => {
    setPendingDelete({ seccion, id, nombre })
  }

  const confirmarEliminar = async () => {
    if (!pendingDelete) return
    try {
      await eliminar(pendingDelete.seccion, pendingDelete.id)
      showSuccess(msjsExito[pendingDelete.seccion].eliminar)
      setPendingDelete(null)
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo guardar el cambio.')
    }
  }

  const guardarEdit = async (datos: Record<string, unknown>) => {
    if (!pendingEdit) return
    try {
      if (pendingEdit.modo === 'crear') {
        const item = datos as unknown as PortfolioDataShape[typeof pendingEdit.seccion][number]
        await agregar(pendingEdit.seccion, item)
        showSuccess(msjsExito[pendingEdit.seccion].agregar)
      } else if (pendingEdit.modo === 'editar' && pendingEdit.id) {
        const cambios = datos as unknown as Partial<PortfolioDataShape[typeof pendingEdit.seccion][number]>
        await editar(pendingEdit.seccion, pendingEdit.id, cambios)
        showSuccess(msjsExito[pendingEdit.seccion].editar)
      }
      setPendingEdit(null)
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo guardar el cambio.')
    }
  }

  const guardarPerfil = async (cambios: Partial<typeof data.perfil>) => {
    try {
      await actualizarPerfil(cambios)
      showSuccess('Perfil actualizado')
      setEditandoPerfil(false)
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo guardar el perfil.')
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', width: '100vw' }}>
      {adminMode && (
        <div className="admin-toolbar">
          <span>Modo administrador</span>
          <div className="d-flex gap-2">
            <button type="button" className="btn-outline-custom" onClick={() => setEditandoPerfil(true)}>Editar perfil</button>
            <button type="button" className="btn-primary-custom" onClick={onLogout}>Cerrar sesión</button>
          </div>
        </div>
      )}
      <Navbar nombre={data.perfil.nombre} esAdmin={adminMode} />
      <Hero perfil={data.perfil} />

      {/* Sección Habilidades: ÚNICA lista plana */}
      <SeccionWrapper
        id="habilidades"
        titulo="Habilidades"
        subtitulo="Herramientas y conocimientos aplicados en cada proyecto para obtener resultados profesionales."
        alterna
        onAgregar={adminMode ? () => abrirCrear('habilidades') : undefined}
      >
        <div className="col-12 mb-4 px-md-2 px-xl-3">
          <Reveal variante="slide-up">
            <HabilidadCard
              items={data.habilidades.map((h) => ({
                ...h,
                onEditar: adminMode ? () =>
                  abrirEditar('habilidades', h.id, { id: h.id, nombre: h.nombre })
                  : undefined,
                onEliminar: adminMode ? () => pedirEliminar('habilidades', h.id, h.nombre) : undefined,
              }))}
            />
          </Reveal>
        </div>
      </SeccionWrapper>

      {/* Sección Logros */}
      <SeccionWrapper
        id="logros"
        titulo="Logros y desarrollos"
        subtitulo="Trabajos y aprendizajes concretos materializados en producción."
        onAgregar={adminMode ? () => abrirCrear('logros') : undefined}
      >
        {data.logros.map((l, i) => (
          <div key={l.id} className="col-12 col-md-6 col-lg-6 mb-4 px-md-2 px-xl-3">
            <Reveal variante="slide-up" delayMs={i * 120}>
              <LogroCard
                titulo={l.titulo}
                descripcion={l.descripcion}
                fecha={l.fecha}
                onEditar={adminMode ? () => abrirEditar('logros', l.id, { ...l }) : undefined}
                onEliminar={adminMode ? () => pedirEliminar('logros', l.id, l.titulo) : undefined}
              />
            </Reveal>
          </div>
        ))}
        {data.logros.length === 0 && (
          <div className="col-12 col-md-8 col-lg-6 mb-4 px-md-2 px-xl-3">
            <div className="empty-state-card">
              No hay logros cargados. Usa el botón <strong>Agregar</strong> para empezar.
            </div>
          </div>
        )}
      </SeccionWrapper>

      {/* Sección Experiencia: timeline continuo (línea vertical conectada) */}
      <SeccionWrapper
        id="experiencia"
        titulo="Experiencia"
        subtitulo="Recorrido profesional y oportunidades de crecimiento."
        alterna
        onAgregar={adminMode ? () => abrirCrear('experiencia') : undefined}
      >
        <div className="col-12 col-md-10 col-lg-9 px-md-2 px-xl-3">
          {data.experiencia.map((e, i) => (
            <div key={e.id} className="mb-4">
              <Reveal variante="slide-up" delayMs={i * 120}>
                <ExperienciaCard
                  titulo={e.titulo}
                  lugar={e.lugar}
                  duracion={e.duracion}
                  descripcion={e.descripcion}
                  isLast={i === data.experiencia.length - 1}
                  onEditar={adminMode ? () => abrirEditar('experiencia', e.id, { ...e }) : undefined}
                  onEliminar={adminMode ? () => pedirEliminar('experiencia', e.id, e.titulo) : undefined}
                />
              </Reveal>
            </div>
          ))}
          {data.experiencia.length === 0 && (
            <div className="mb-4">
              <div className="empty-state-card">
                No hay experiencias registradas. Cargá tu primera experiencia con el botón <strong>Agregar</strong>.
              </div>
            </div>
          )}
        </div>
      </SeccionWrapper>

      {/* Sección Proyectos: sin símbolos/emojis */}
      <SeccionWrapper
        id="proyectos"
        titulo="Proyectos destacados"
        subtitulo="Selección de los trabajos más representativos realizados hasta el momento."
        onAgregar={adminMode ? () => abrirCrear('proyectos') : undefined}
      >
        {data.proyectos.map((p, i) => (
          <div key={p.id} className="col-12 col-md-6 col-lg-6 mb-4 px-md-2 px-xl-3">
            <Reveal variante="slide-up" delayMs={i * 120}>
              <ProyectoCard
                icono={p.icono}
                titulo={p.titulo}
                descripcion={p.descripcion}
                tags={p.tags}
                enlace={p.enlace}
                onEditar={adminMode ? () => abrirEditar('proyectos', p.id, { ...p }) : undefined}
                onEliminar={adminMode ? () => pedirEliminar('proyectos', p.id, p.titulo) : undefined}
              />
            </Reveal>
          </div>
        ))}
        {data.proyectos.length === 0 && (
          <div className="col-12 col-md-8 col-lg-6 mb-4 px-md-2 px-xl-3">
            <div className="empty-state-card">
              Aún no hay proyectos destacados. Sumá tu primer proyecto con <strong>Agregar</strong>.
            </div>
          </div>
        )}
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
            <FormularioContacto email={data.perfil.emailContacto} />
          </Reveal>
        </div>
      </SeccionWrapper>

      <Footer perfil={data.perfil} />

      <button
        type="button"
        className={`btn-scroll-top ${mostrarBotonTop ? 'visible' : ''}`}
        onClick={subir}
        aria-label="Volver arriba de la página"
        title="Volver arriba"
      >
        ↑
      </button>

      <ConfirmDialog
        abierto={!!pendingDelete}
        mensaje={
          pendingDelete
            ? '¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.'
            : ''
        }
        nombreItem={pendingDelete?.nombre}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPendingDelete(null)}
      />

      {pendingEdit && (
        <EditModal
          abierto
          modo={pendingEdit.modo}
          seccion={pendingEdit.seccion}
          valoresIniciales={pendingEdit.valoresIniciales as never}
          onCancelar={() => setPendingEdit(null)}
          onGuardar={guardarEdit}
        />
      )}

      <PerfilModal
        abierto={adminMode && editandoPerfil}
        perfil={data.perfil}
        onCancelar={() => setEditandoPerfil(false)}
        onGuardar={guardarPerfil}
      />
    </div>
  )
}

export default HomePage
