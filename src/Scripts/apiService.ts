/**
 * Servicio API para comunicación HTTP con el backend Express (Server.js)
 */

export interface ContactoPayload {
  nombre: string
  email: string
  asunto: string
  mensaje: string
}

export interface ContactoResponse {
  success: boolean
  id?: number
  message: string
  data?: any
  errores?: Record<string, string>
}

// URL base configurada por entorno o proxy local en Vite (/api)
const BASE_URL = import.meta.env.VITE_API_URL || ''

/**
 * Cliente HTTP genérico basado en fetch nativo.
 * Maneja cabeceras JSON, serialización y captura de errores de servidor.
 */
const request = async <T = any>(
  ruta: string,
  opciones: RequestInit = {}
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${ruta}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
    ...opciones,
  })

  let body: any = null
  try {
    body = await res.json()
  } catch (_err) {
    body = null
  }

  if (!res.ok) {
    const mensaje = body?.message || `Error del servidor (${res.status})`
    const err: any = new Error(mensaje)
    err.status = res.status
    err.body = body
    throw err
  }

  return body as T
}

/**
 * Envía la información de contacto mediante POST /api/contacto.
 * 
 * @param payload - Datos validados del formulario.
 * @returns Promesa con la respuesta del backend.
 */
export const enviarContacto = async (
  payload: ContactoPayload
): Promise<ContactoResponse> => {
  return request<ContactoResponse>('/api/contacto', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Recupera el listado de contactos almacenados mediante GET /api/contactos.
 */
export const listarContactos = async (): Promise<{
  success: boolean
  data: Array<any>
}> => {
  return request('/api/contactos', { method: 'GET' })
}

/**
 * Verifica el estado y conectividad con el servidor backend mediante GET /api/health.
 */
export const healthCheck = async (): Promise<{ success: boolean; status: string }> => {
  return request('/api/health', { method: 'GET' })
}
