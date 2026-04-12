import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import fotoUsuario from '../assets/img/foto_usuario.JPG'
import nombreLogo from '../assets/img/nombre_logo.png'
import '../assets/css/estilos_general.css'

export default function TopBar() {
  const { usuario } = useAuth()

  const [hora, setHora] = useState('')
  const [fecha, setFecha] = useState('')

  useEffect(() => {
    const actualizarFechaHora = () => {
      const ahora = new Date()

      // Formato HH:MM (válido para input time)
      const horaFormateada = ahora.toTimeString().slice(0, 5)

      // Formato YYYY-MM-DD (válido para input date)
      const fechaFormateada = ahora.toISOString().split('T')[0]

      setHora(horaFormateada)
      setFecha(fechaFormateada)
    }

    actualizarFechaHora()

    const intervalo = setInterval(actualizarFechaHora, 60000) // cada minuto

    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="top-sidebar">
      <div className="top-left">
        <img src={fotoUsuario} alt="Foto Usuario" className="user-photo" />
        <div className="user-info">
          <span className="user-name">{usuario?.nombre || 'Usuario'}</span>
          <span className="user-role">{usuario?.rol || 'Rol'}</span>
        </div>
        <img src={nombreLogo} className="end-png" alt="Logo" />
      </div>

      <hr className="divider" />

      <div className="period-selector">
        <label>Fecha:</label>
        <input type="date" value={fecha} readOnly />

        <label>Hora:</label>
        <input type="time" value={hora} readOnly />
      </div>
    </div>
  )
}