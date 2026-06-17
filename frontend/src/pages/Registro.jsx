import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NotebookPen } from 'lucide-react'
import toast from 'react-hot-toast'

import { API_URL } from '../config'

const Registro = () => {

  const [nombre, setNombre]     = useState('')
  const [correo, setCorreo]     = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()

  const manejarSubmit = async (e) => {
    e.preventDefault()

    if (!nombre || !correo || !password) {
      toast.error('Completa todos los campos')
      return
    }

    setCargando(true)

    try {
      const res = await fetch(`${API_URL}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre, correo, password })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'No se pudo crear la cuenta')
        return
      }

      toast.success('Cuenta creada, ya puedes iniciar sesión')
      navigate('/') // mandas de regreso al login

    } catch (error) {
      toast.error('No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <NotebookPen size={42} strokeWidth={1.75} className="text-amber-600" />
          <h1 className="text-2xl font-bold text-neutral-800">Note App</h1>
        </div>

        {/* Tarjeta */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-center text-xl font-semibold text-neutral-800">
            Crear cuenta
          </h2>

          <form onSubmit={manejarSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-600">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-neutral-800 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"/>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-600">Correo</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-neutral-800 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"/>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-600">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-neutral-800 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"/>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="mt-2 rounded-lg bg-amber-600 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-60">
              {cargando ? 'Creando cuenta...' : 'Registrarme'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/" className="font-semibold text-amber-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Registro