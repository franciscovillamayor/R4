import React, { useEffect, useState } from 'react'
import HomePage from './HomePage'
import ConfirmDialog from '@modules/ConfirmDialog'
import { cerrarSesionAdmin, consultarSesionAdmin, iniciarSesionAdmin } from '@scripts/apiService'
import { useToast } from '@scripts/useToast'

const AdminPage: React.FC = () => {
  const [autenticado, setAutenticado] = useState(false)
  const [comprobando, setComprobando] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [confirmacionCerrar, setConfirmacionCerrar] = useState(false)
  const { showError } = useToast()

  useEffect(() => {
    let activo = true
    consultarSesionAdmin()
      .then((sesion) => { if (activo) setAutenticado(sesion.authenticated) })
      .catch(() => undefined)
      .finally(() => { if (activo) setComprobando(false) })
    return () => { activo = false }
  }, [])

  const iniciarSesion = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await iniciarSesionAdmin(email, password)
      setPassword('')
      setAutenticado(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setEnviando(false)
    }
  }

  const cerrarSesion = async () => {
    try {
      await cerrarSesionAdmin()
      window.location.replace('/')
    } catch (err) {
      setConfirmacionCerrar(false)
      showError(err instanceof Error ? err.message : 'No se pudo cerrar la sesión.')
    }
  }

  if (comprobando) {
    return <main className="admin-login-screen" aria-live="polite">Verificando sesión...</main>
  }

  if (autenticado) {
    return (
      <>
        <HomePage adminMode onLogout={() => setConfirmacionCerrar(true)} />
        <ConfirmDialog
          abierto={confirmacionCerrar}
          titulo="Cerrar sesión"
          mensaje="¿Estás seguro de que quieres cerrar tu sesión de administrador?"
          textoConfirmar="Cerrar sesión"
          onConfirmar={cerrarSesion}
          onCancelar={() => setConfirmacionCerrar(false)}
        />
      </>
    )
  }

  return (
    <main className="admin-login-screen">
      <form className="admin-login-panel" onSubmit={iniciarSesion}>
        <a className="admin-back-link" href="/">Volver al portfolio</a>
        <span className="admin-kicker">Área privada</span>
        <h1 className="h3 mb-2">Administración</h1>
        <p className="mb-4">Acceso exclusivo para gestionar el portfolio.</p>
        <label className="form-label-custom">
          Email
          <input className="form-control-custom w-100" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="form-label-custom mt-3">
          Contraseña
          <input className="form-control-custom w-100" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <p className="admin-login-error" role="alert">{error}</p>}
        <button className="btn-primary-custom w-100 mt-4" type="submit" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  )
}

export default AdminPage
