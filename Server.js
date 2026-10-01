/**
 * Servidor Backend Express para el Portfolio
 * 
 * Gestiona endpoints de persistencia de contactos y verificación de estado.
 * Almacenamiento desacoplado en memoria con arquitectura lista para migración a base de datos relacional (MySQL).
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import crypto from 'node:crypto'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex')
const SESSION_COOKIE = 'portfolio_admin'
const SESSION_DURATION = 8 * 60 * 60 * 1000

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
}
const db = dbConfig.host && dbConfig.user && dbConfig.database
  ? mysql.createPool(dbConfig)
  : null

// Configuración de CORS para solicitudes seguras desde el frontend
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json({ limit: '1mb' }))

const crearFirma = (valor) =>
  crypto.createHmac('sha256', SESSION_SECRET).update(valor).digest('base64url')

const crearToken = (email) => {
  const payload = Buffer.from(JSON.stringify({
    email,
    exp: Date.now() + SESSION_DURATION,
  })).toString('base64url')
  return `${payload}.${crearFirma(payload)}`
}

const leerCookie = (req, nombre) => {
  const cookies = (req.headers.cookie || '').split(';')
  const cookie = cookies.find((parte) => parte.trim().startsWith(`${nombre}=`))
  return cookie ? decodeURIComponent(cookie.trim().slice(nombre.length + 1)) : ''
}

const verificarToken = (token) => {
  const [payload, firma] = token.split('.')
  if (!payload || !firma) return false
  const firmaEsperada = crearFirma(payload)
  const firmaBuffer = Buffer.from(firma)
  const esperadaBuffer = Buffer.from(firmaEsperada)
  if (firmaBuffer.length !== esperadaBuffer.length || !crypto.timingSafeEqual(firmaBuffer, esperadaBuffer)) {
    return false
  }
  try {
    const datos = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return datos.email === ADMIN_EMAIL && datos.exp > Date.now()
  } catch {
    return false
  }
}

const requiereAdmin = (req, res, next) => {
  if (verificarToken(leerCookie(req, SESSION_COOKIE))) return next()
  return res.status(401).json({ success: false, message: 'Debes iniciar sesión como administrador.' })
}

const opcionesCookie = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}

const requerirBaseDatos = (req, res, next) => {
  if (db) return next()
  return res.status(503).json({
    success: false,
    message: 'La base de datos no está configurada. Completa las variables DB_* del servidor.',
  })
}

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

app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(503).json({
      success: false,
      message: 'Configura ADMIN_EMAIL y ADMIN_PASSWORD en el servidor.',
    })
  }
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  const emailCorrecto = email === ADMIN_EMAIL
  const passwordBuffer = Buffer.from(password)
  const passwordEsperada = Buffer.from(ADMIN_PASSWORD)
  const passwordCorrecta = passwordBuffer.length === passwordEsperada.length
    && crypto.timingSafeEqual(passwordBuffer, passwordEsperada)

  if (!emailCorrecto || !passwordCorrecta) {
    return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos.' })
  }

  res.cookie(SESSION_COOKIE, crearToken(ADMIN_EMAIL), {
    ...opcionesCookie,
    maxAge: SESSION_DURATION,
  })
  return res.json({ success: true, email: ADMIN_EMAIL })
})

app.get('/api/admin/session', (req, res) => {
  const autenticado = verificarToken(leerCookie(req, SESSION_COOKIE))
  return res.json({ success: true, authenticated: autenticado })
})

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, opcionesCookie)
  return res.json({ success: true })
})

app.get('/api/portfolio', requerirBaseDatos, async (_req, res) => {
  try {
    const [perfiles] = await db.execute(
      'SELECT nombre, profesion, edad, educacion, descripcion, email_contacto AS emailContacto FROM portfolio_profile WHERE id = 1'
    )
    if (!perfiles.length) {
      return res.status(503).json({ success: false, message: 'No hay perfil inicial en la base de datos.' })
    }
    const [filas] = await db.execute(
      'SELECT section_key, item_id, item_data FROM portfolio_items ORDER BY section_key, sort_order, item_id'
    )
    const data = {
      perfil: perfiles[0],
      habilidades: [],
      logros: [],
      experiencia: [],
      proyectos: [],
    }
    for (const fila of filas) {
      const item = typeof fila.item_data === 'string' ? JSON.parse(fila.item_data) : fila.item_data
      data[fila.section_key].push({ ...item, id: fila.item_id })
    }
    return res.json({ success: true, data })
  } catch (err) {
    console.error('error al cargar portfolio:', err)
    return res.status(500).json({ success: false, message: 'No se pudo cargar el portfolio.' })
  }
})

app.put('/api/admin/portfolio', requiereAdmin, requerirBaseDatos, async (req, res) => {
  const data = req.body?.data
  const secciones = ['habilidades', 'logros', 'experiencia', 'proyectos']
  const perfil = data?.perfil
  if (!perfil || secciones.some((seccion) => !Array.isArray(data[seccion]))) {
    return res.status(400).json({ success: false, message: 'La estructura del portfolio no es válida.' })
  }
  const emailContacto = typeof perfil.emailContacto === 'string'
    ? perfil.emailContacto.trim()
    : ''
  if (emailContacto.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailContacto)) {
    return res.status(400).json({ success: false, message: 'El email de contacto no es válido.' })
  }

  let connection
  try {
    connection = await db.getConnection()
    await connection.beginTransaction()
    await connection.execute(
      `UPDATE portfolio_profile
       SET nombre = ?, profesion = ?, edad = ?, educacion = ?, descripcion = ?, email_contacto = ?
       WHERE id = 1`,
      [perfil.nombre, perfil.profesion, perfil.edad, perfil.educacion, perfil.descripcion, emailContacto]
    )
    await connection.execute('DELETE FROM portfolio_items')
    for (const seccion of secciones) {
      for (const [orden, item] of data[seccion].entries()) {
        if (!item || typeof item.id !== 'string') {
          throw new Error(`El item de ${seccion} no tiene un identificador válido.`)
        }
        const { id, ...itemData } = item
        await connection.execute(
          'INSERT INTO portfolio_items (section_key, item_id, item_data, sort_order) VALUES (?, ?, ?, ?)',
          [seccion, id, JSON.stringify(itemData), orden]
        )
      }
    }
    await connection.commit()
    return res.json({ success: true, message: 'Portfolio guardado.' })
  } catch (err) {
    if (connection) await connection.rollback()
    console.error('error al guardar portfolio:', err)
    return res.status(500).json({ success: false, message: 'No se pudo guardar el portfolio.' })
  } finally {
    connection?.release()
  }
})

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
app.get('/api/contactos', requiereAdmin, async (_req, res) => {
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
