/**
 * Servidor Backend Express para el Portfolio
 * 
 * Gestiona endpoints de persistencia de contactos y verificación de estado.
 * Almacenamiento desacoplado en memoria con arquitectura lista para migración a base de datos relacional (MySQL).
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Configuración de CORS para solicitudes seguras desde el frontend
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json({ limit: '1mb' }))

/**
 * Almacén en memoria para registros de contacto.
 * Interfaz desacoplada: reemplazable por conexión mysql2 con prepared statements.
 */
const contactoStore = {
  data: [],
  nextId: 1,

  /**
   * Registra un nuevo mensaje de contacto.
   * @param {Object} datos - Objeto con nombre, email, asunto y mensaje.
   * @returns {Promise<Object>} Registro persistido con id y marca temporal.
   */
  async guardarContacto(datos) {
    const registro = {
      id: this.nextId++,
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      asunto: datos.asunto.trim(),
      mensaje: datos.mensaje.trim(),
      fecha_envio: new Date().toISOString(),
      leido: false,
    }
    this.data.unshift(registro)
    return registro
  },

  /**
   * Obtiene todos los contactos registrados.
   * @returns {Promise<Array>} Lista de registros en memoria.
   */
  async listarContactos() {
    return [...this.data]
  },
}

/**
 * Reglas de validación defensiva en backend (espejo de frontend)
 */
const validarNombre = (v) => {
  if (!v || typeof v !== 'string') return 'nombre requerido'
  const s = v.trim()
  if (s.length < 3) return 'nombre debe tener al menos 3 caracteres'
  if (/[0-9]/.test(s)) return 'nombre no puede contener números'
  return ''
}

const validarEmail = (v) => {
  if (!v || typeof v !== 'string') return 'email requerido'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(v.trim()) ? '' : 'formato de email inválido'
}

const validarAsunto = (v) => {
  if (!v || typeof v !== 'string') return 'asunto requerido'
  return v.trim().length >= 3 ? '' : 'asunto debe tener al menos 3 caracteres'
}

const validarMensaje = (v) => {
  if (!v || typeof v !== 'string') return 'mensaje requerido'
  return v.trim().length >= 10 ? '' : 'mensaje debe tener al menos 10 caracteres'
}

/**
 * POST /api/contacto
 * Valida los datos recibidos y persiste el mensaje en el almacén.
 */
app.post('/api/contacto', async (req, res) => {
  try {
    const body = req.body || {}
    const errores = {
      nombre: validarNombre(body.nombre),
      email: validarEmail(body.email),
      asunto: validarAsunto(body.asunto),
      mensaje: validarMensaje(body.mensaje),
    }
    const hayErrores = Object.values(errores).some((e) => e.length > 0)
    if (hayErrores) {
      return res.status(400).json({
        success: false,
        message: 'validación fallida',
        errores,
      })
    }
    const registro = await contactoStore.guardarContacto(body)
    return res.status(201).json({
      success: true,
      id: registro.id,
      message: 'contacto guardado en memoria',
      data: registro,
    })
  } catch (err) {
    console.error('error al guardar contacto:', err)
    return res.status(500).json({
      success: false,
      message: 'error interno del servidor',
    })
  }
})

/**
 * GET /api/contactos
 * Retorna la lista de mensajes registrados.
 */
app.get('/api/contactos', async (_req, res) => {
  try {
    const lista = await contactoStore.listarContactos()
    return res.status(200).json({
      success: true,
      data: lista,
    })
  } catch (err) {
    console.error('error al listar contactos:', err)
    return res.status(500).json({
      success: false,
      message: 'error interno del servidor',
    })
  }
})

/**
 * GET /api/health
 * Endpoint de comprobación de salud y disponibilidad del servicio.
 */
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`servidor backend corriendo en http://localhost:${PORT}`)
})

export default app
