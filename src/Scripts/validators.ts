/**
 * Módulo de Validadores para Contacto
 * Funciones puras de validación de campos. Devuelven una cadena vacía si el valor es válido,
 * o el mensaje de error correspondiente si incumple las restricciones.
 */

/**
 * Valida el nombre ingresado.
 * Requiere texto no vacío de al menos 3 caracteres, sin números ni caracteres extraños.
 */
export const validarNombre = (valor: unknown): string => {
  if (typeof valor !== 'string') return 'nombre requerido'
  const s = valor.trim()
  if (!s) return 'nombre requerido'
  if (s.length < 3) return 'nombre debe tener al menos 3 caracteres'
  if (/[0-9]/.test(s)) return 'nombre no puede contener números'
  if (/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]/.test(s)) return 'nombre contiene caracteres inválidos'
  return ''
}

/**
 * Valida el correo electrónico ingresado con formato RFC estándar.
 */
export const validarEmail = (valor: unknown): string => {
  if (typeof valor !== 'string') return 'email requerido'
  const s = valor.trim()
  if (!s) return 'email requerido'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(s) ? '' : 'formato de email inválido'
}

/**
 * Valida el asunto del mensaje.
 * Requiere un mínimo de 3 caracteres.
 */
export const validarAsunto = (valor: unknown): string => {
  if (typeof valor !== 'string') return 'asunto requerido'
  const s = valor.trim()
  if (!s) return 'asunto requerido'
  return s.length >= 3 ? '' : 'asunto debe tener al menos 3 caracteres'
}

/**
 * Valida el cuerpo del mensaje.
 * Requiere un mínimo de 10 caracteres explicativos.
 */
export const validarMensaje = (valor: unknown): string => {
  if (typeof valor !== 'string') return 'mensaje requerido'
  const s = valor.trim()
  if (!s) return 'mensaje requerido'
  return s.length >= 10 ? '' : 'mensaje debe tener al menos 10 caracteres'
}

/**
 * Estructura de datos requerida para el envío del formulario de contacto.
 */
export interface ContactoPayload {
  nombre: string
  email: string
  asunto: string
  mensaje: string
}

/**
 * Valida de forma integral todos los campos de contacto y retorna un diccionario con los errores encontrados.
 * 
 * @param payload - Objeto con los valores del formulario.
 * @returns Mapa de campo -> mensaje de error (vacío si es válido).
 */
export const validarContacto = (payload: ContactoPayload): Record<keyof ContactoPayload, string> => {
  return {
    nombre: validarNombre(payload.nombre),
    email: validarEmail(payload.email),
    asunto: validarAsunto(payload.asunto),
    mensaje: validarMensaje(payload.mensaje),
  }
}
