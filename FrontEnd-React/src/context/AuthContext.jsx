import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = sessionStorage.getItem('usuario')
    return guardado ? JSON.parse(guardado) : null
  })
  const navigate = useNavigate()

  function iniciarSesion(token, datosUsuario) {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('usuario', JSON.stringify(datosUsuario))
    setUsuario(datosUsuario)
  }

  function cerrarSesion() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('usuario')
    setUsuario(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}