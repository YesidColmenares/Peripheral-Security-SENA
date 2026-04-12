import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import logo from '../assets/img/Logo.png'
import '../assets/css/estilos_login.css'
import '../assets/css/estilos_crear_cuenta.css'

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombres: '', apellidos: '', cedula: '',
    dia: '', mes: '', anio: '',
    correo: '', contrasena: '', confirmar: ''
  })
  const [error, setError]       = useState('')
  const [exito, setExito]       = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleRegistro() {
    if (!form.nombres || !form.apellidos || !form.correo || !form.contrasena) {
      setError('Por favor completa todos los campos.')
      return
    }
    if (form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setCargando(true)
    setError('')
    try {
      await api.post('/auth/registro', {
        nombre: `${form.nombres} ${form.apellidos}`,
        correo: form.correo,
        contrasena: form.contrasena,
        idRol: 2
      })
      setExito('¡Cuenta creada exitosamente! Redirigiendo...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear la cuenta.')
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
            <a href="#" onClick={() => navigate('/login')}>Iniciar sesión</a>
            <a href="#" className="active">Crear cuenta</a>
          </nav>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <h2 className="welcome">¡Nos alegra tu llegada!!</h2>
        </div>

        {/* PANEL DERECHO */}
        <div className="right-panel">
          <div className="right-panel-header">
            <h2 className="right-panel-title">Crear cuenta</h2>
            <img src={logo} alt="Logo" className="right-panel-logo" />
          </div>

          <div className="right-panel-form">

            {/* Nombres y Apellidos */}
            <div className="form-row">
              <div className="field">
                <label>Nombres</label>
                <div className="input-group">
                  <input type="text" name="nombres" placeholder="Tu nombre" value={form.nombres} onChange={handleChange} />
                </div>
              </div>
              <div className="field">
                <label>Apellidos</label>
                <div className="input-group">
                  <input type="text" name="apellidos" placeholder="Tu apellido" value={form.apellidos} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Cédula */}
            <div className="field">
              <label>Cedula</label>
              <div className="input-group">
                <input type="text" name="cedula" placeholder="Tu cédula" value={form.cedula} onChange={handleChange} />
              </div>
            </div>

            {/* Fecha de nacimiento */}
            <label>Fecha de nacimiento</label>
            <div className="date-row">
              <div className="date-field">
                <label>Día</label>
                <input type="number" name="dia" placeholder="01" min="1" max="31" value={form.dia} onChange={handleChange} />
              </div>
              <div className="date-field">
                <label>Mes</label>
                <input type="number" name="mes" placeholder="12" min="1" max="12" value={form.mes} onChange={handleChange} />
              </div>
              <div className="date-field">
                <label>Año</label>
                <input type="number" name="anio" placeholder="2001" min="1900" max="2025" value={form.anio} onChange={handleChange} />
              </div>
            </div>

            {/* Correo */}
            <div className="field">
              <label>Dirección de correo</label>
              <div className="input-group">
                <input type="email" name="correo" placeholder="Tu correo electrónico" value={form.correo} onChange={handleChange} />
              </div>
            </div>

            {/* Contraseñas */}
            <div className="form-row">
              <div className="field">
                <label>Contraseña</label>
                <div className="input-group">
                  <input type="password" name="contrasena" placeholder="Tu clave" value={form.contrasena} onChange={handleChange} />
                </div>
              </div>
              <div className="field">
                <label>Confirmar</label>
                <div className="input-group">
                  <input type="password" name="confirmar" placeholder="Confirma tu clave" value={form.confirmar} onChange={handleChange} />
                </div>
              </div>
            </div>

            {error && <p style={{ color: '#e74c3c', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
            {exito && <p style={{ color: '#27ae60', fontSize: '13px', textAlign: 'center' }}>{exito}</p>}

            <button type="button" className="btn-primary" onClick={handleRegistro} disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

            <div className="divider"><span>OR</span></div>

            <button type="button" className="btn-secondary" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
