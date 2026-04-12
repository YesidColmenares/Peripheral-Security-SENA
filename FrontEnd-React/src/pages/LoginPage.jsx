import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import logo from '../assets/img/Logo.png'
import '../assets/css/estilos_login.css'
import '../assets/css/estilos_iniciar_sesion.css'

export default function LoginPage() {
  const [correo, setCorreo]         = useState('')
  const [contrasena, setContrasena] = useState('')
  const [verPass, setVerPass]       = useState(false)
  const [error, setError]           = useState('')
  const [cargando, setCargando]     = useState(false)
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  async function handleLogin() {
    if (!correo || !contrasena) {
      setError('Por favor completa todos los campos.')
      return
    }
    setCargando(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { correo, contrasena })
      iniciarSesion(res.data.token, res.data.usuario)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Credenciales incorrectas.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="container">
        <div className="bg-fixed"></div>

        {/* NAV-BAR */}
        <div className="nav-var">
          <h1 className="brand-title">Peripheral <br /> Security</h1>
          <nav className="menu">
            <a href="#" className="active">Iniciar sesión</a>
            <a href="#" onClick={() => navigate('/registro')}>Crear cuenta</a>
          </nav>
        </div>

        {/* PANEL DERECHO */}
        <div className="right-panel">
          <div className="right-panel-header">
            <h2 className="right-panel-title">Iniciar sesión</h2>
            <img src={logo} alt="Logo" className="right-panel-logo" />
          </div>
          <div className="right-panel-form">
            {/* Campo correo */}
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Usuario" value={correo}
                onChange={e => setCorreo(e.target.value)} />
            </div>
            {/* Campo contraseña */}
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type={verPass ? 'text' : 'password'} placeholder="Contraseña"
                value={contrasena} onChange={e => setContrasena(e.target.value)} />
              <i className={`fas ${verPass ? 'fa-eye-slash' : 'fa-eye'} eye-password`}
                onClick={() => setVerPass(!verPass)} style={{ cursor: 'pointer' }}></i>
            </div>
            {/* Recordar */}
            <div className="options">
              <label><input type="checkbox" /> Recordar</label>
              <a href="#">¿Olvidó la contraseña?</a>
            </div>
            {/* Error */}
            {error && <p style={{ color: '#e74c3c', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
            {/* Botones */}
            <button type="button" className="btn-primary" onClick={handleLogin} disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Entrar'}
            </button>
            <div className="divider"><span>OR</span></div>
            <button type="button" className="btn-secondary" onClick={() => navigate('/registro')}>
              Crear cuenta
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <h2 className="welcome">¡Qué gusto verte de nuevo!</h2>
        </div>
      </div>
    </div>
  )
}
