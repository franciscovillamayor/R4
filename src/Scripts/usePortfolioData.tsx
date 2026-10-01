import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cargarPortfolio, guardarPortfolio } from './apiService'

export interface PerfilPortfolio {
  nombre: string
  profesion: string
  edad: string
  educacion: string
  descripcion: string
  emailContacto: string
}

export interface Habilidad {
  id: string
  nombre: string
}

export interface Logro {
  id: string
  titulo: string
  descripcion: string
  fecha?: string
}

export interface Experiencia {
  id: string
  titulo: string
  lugar: string
  duracion: string
  descripcion: string
}

export interface Proyecto {
  id: string
  icono: string
  simbolo: string
  titulo: string
  descripcion: string
  tags: string[]
  enlace?: string
}

export type SeccionKey = 'habilidades' | 'logros' | 'experiencia' | 'proyectos'

export interface PortfolioDataShape {
  perfil: PerfilPortfolio
  habilidades: Habilidad[]
  logros: Logro[]
  experiencia: Experiencia[]
  proyectos: Proyecto[]
}

export interface PortfolioContextShape {
  data: PortfolioDataShape
  agregar: <K extends SeccionKey>(seccion: K, item: PortfolioDataShape[K][number]) => Promise<void>
  editar: <K extends SeccionKey>(seccion: K, id: string, cambios: Partial<PortfolioDataShape[K][number]>) => Promise<void>
  eliminar: <K extends SeccionKey>(seccion: K, id: string) => Promise<void>
  actualizarPerfil: (cambios: Partial<PerfilPortfolio>) => Promise<void>
  reiniciar: () => Promise<void>
}

const generarId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`

const DATOS_INICIALES: PortfolioDataShape = {
  perfil: {
    nombre: 'Villamayor Francisco',
    profesion: 'Desarrollador Front-end',
    edad: '18 años',
    educacion: 'Estudiante de la Escuela Técnica N° 5',
    descripcion: 'Creación de interfaces limpias, modernas y funcionales.',
    emailContacto: 'franciscoxx458@gmail.com',
  },
  habilidades: [
    { id: generarId(), nombre: 'HTML5' },
    { id: generarId(), nombre: 'CSS3' },
    { id: generarId(), nombre: 'JavaScript' },
    { id: generarId(), nombre: 'TypeScript' },
    { id: generarId(), nombre: 'React' },
    { id: generarId(), nombre: 'Bootstrap' },
    { id: generarId(), nombre: 'Vite' },
    { id: generarId(), nombre: 'Node.js' },
    { id: generarId(), nombre: 'Express' },
    { id: generarId(), nombre: 'MySQL' },
    { id: generarId(), nombre: 'Word' },
    { id: generarId(), nombre: 'Excel' },
    { id: generarId(), nombre: 'PowerPoint' },
    { id: generarId(), nombre: 'Excel avanzado' },
    { id: generarId(), nombre: 'Google Workspace' },
  ],
  logros: [
    {
      id: generarId(),
      titulo: 'Sitio web - Empresa Pesquera',
      descripcion:
        'Desarrollo y publicación de un sitio web profesional para una empresa pesquera de Mar del Plata, incluyendo diseño responsive y optimización.',
      fecha: 'Publicado',
    },
    {
      id: generarId(),
      titulo: 'Gestión de Dominio y Hosting',
      descripcion:
        'Administración y publicación de sitios web mediante la plataforma Hostinger: dominio, hosting, DNS y despliegues en producción.',
      fecha: 'Hostinger',
    },
  ],
  experiencia: [
    {
      id: generarId(),
      titulo: 'Pasantía - Desarrollo Web',
      lugar: 'Escuela Malharro',
      duracion: 'Pasantía escolar',
      descripcion:
        'Participación en el desarrollo y mantenimiento de la página web institucional de la escuela, aplicando buenas prácticas de Front-end y accesibilidad.',
    },
  ],
  proyectos: [
    {
      id: generarId(),
      icono: 'Sitio Productivo',
      simbolo: '⚓',
      titulo: 'Sitio Web - Empresa Pesquera',
      descripcion:
        'Plataforma web para empresa pesquera de Mar del Plata, con catálogo, servicios, historia y formulario de contacto. Diseño moderno y optimización SEO.',
      tags: ['Bootstrap', 'Hostinger', 'Producción'],
      enlace: '',
    },
    {
      id: generarId(),
      icono: 'Sitio Institucional',
      simbolo: '⌂',
      titulo: 'Página Web - Escuela Malharro',
      descripcion:
        'Sitio institucional de la escuela, desarrollado durante mi pasantía. Incluye novedades, información académica, contacto y galería.',
      tags: ['HTML5', 'CSS3', 'JS', 'Pasantía'],
      enlace: '',
    },
  ],
}

const PortfolioContext = createContext<PortfolioContextShape | undefined>(undefined)

/**
 * PortfolioProvider
 *
 * Proveedor centralizado del portfolio. MySQL es la fuente persistente de datos;
 * los valores iniciales se mantienen como respaldo si la API no está disponible.
 */
export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<PortfolioDataShape>(DATOS_INICIALES)
  const dataRef = useRef(data)

  useEffect(() => {
    let activo = true
    cargarPortfolio()
      .then((respuesta) => {
        if (!activo || !respuesta.data) return
        dataRef.current = respuesta.data
        setData(respuesta.data)
      })
      .catch(() => undefined)
    return () => {
      activo = false
    }
  }, [])

  const persistirCambio = useCallback(async (
    transformar: (actual: PortfolioDataShape) => PortfolioDataShape
  ) => {
    const anterior = dataRef.current
    const siguiente = transformar(anterior)
    dataRef.current = siguiente
    setData(siguiente)
    try {
      await guardarPortfolio(siguiente)
    } catch (error) {
      dataRef.current = anterior
      setData(anterior)
      throw error
    }
  }, [])

  const agregar = useCallback(<K extends SeccionKey>(
    seccion: K,
    item: PortfolioDataShape[K][number]
  ) => persistirCambio((prev) => {
      const base = item as unknown as Record<string, unknown>
      const conId: Record<string, unknown> = { ...base, id: generarId() }
      const lista = prev[seccion] as unknown as Record<string, unknown>[]
      return {
        ...prev,
        [seccion]: [...lista, conId],
      } as unknown as PortfolioDataShape
    }), [persistirCambio])

  const editar = useCallback(<K extends SeccionKey>(
    seccion: K,
    id: string,
    cambios: Partial<PortfolioDataShape[K][number]>
  ) => persistirCambio((prev) => {
      const delta = cambios as unknown as Record<string, unknown>
      const lista = prev[seccion] as unknown as Record<string, unknown>[]
      const actualizada = lista.map((it) =>
        it.id === id ? { ...it, ...delta } : it
      )
      return {
        ...prev,
        [seccion]: actualizada,
      } as unknown as PortfolioDataShape
    }), [persistirCambio])

  const eliminar = useCallback(<K extends SeccionKey>(seccion: K, id: string) =>
    persistirCambio((prev) => {
      const lista = prev[seccion] as unknown as Record<string, unknown>[]
      const filtrada = lista.filter((it) => it.id !== id)
      return {
        ...prev,
        [seccion]: filtrada,
      } as unknown as PortfolioDataShape
    }), [persistirCambio])

  const actualizarPerfil = useCallback((cambios: Partial<PerfilPortfolio>) =>
    persistirCambio((prev) => ({ ...prev, perfil: { ...prev.perfil, ...cambios } })),
  [persistirCambio])

  const reiniciar = useCallback(() => persistirCambio(() => DATOS_INICIALES), [persistirCambio])

  return (
    <PortfolioContext.Provider value={{ data, agregar, editar, eliminar, actualizarPerfil, reiniciar }}>
      {children}
    </PortfolioContext.Provider>
  )
}

/**
 * Hook usePortfolioData
 *
 * Accede al estado CRUD del portfolio. Debe usarse dentro de PortfolioProvider.
 */
export const usePortfolioData = (): PortfolioContextShape => {
  const ctx = useContext(PortfolioContext)
  if (!ctx) {
    throw new Error('usePortfolioData debe usarse dentro de PortfolioProvider')
  }
  return ctx
}
