import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import PageTitle from '../components/PageTitle'
import EventCard from '../components/EventCard'
import api from '../services/api'
import '../assets/css/estilos_general.css'
import '../assets/css/estilos_panel_notificaciones_historial.css'

export default function NotificationsPage() {
  const [notificaciones, setNotificaciones] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const usuario = sessionStorage.getItem('usuario')
    if (!usuario) { navigate('/login'); return }

    cargarNotificaciones()

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000')
    socket.on('nueva_notificacion', (evento) => {
      setNotificaciones(prev => [formatear(evento), ...prev])
    })

    socket.on('notificacion_verificada', ({ id_registro }) => {
    setNotificaciones(prev =>
        prev.map(n => n.id_registro === id_registro
            ? { ...n, verificado: true }
            : n
        )
    )
})

    return () => socket.disconnect()
  }, [])

  function formatear(r) {
    return {
      id_registro:     r.id_registro,
      numero_maquina:  r.numero_maquina,
      tipo_periferico: r.tipo_periferico,
      hora:            new Date(r.fecha_hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      verificado:      r.verificado == 1
    }
  }

  async function cargarNotificaciones() {
    try {
      const res = await api.get('/registros/notificaciones')
      setNotificaciones(res.data.map(formatear))
    } catch (err) {
      console.error('Error al cargar notificaciones:', err)
    }
  }

  async function verificarEvento(idRegistro) {
    try {
      const res = await api.put(`/registros/${idRegistro}/verificar`)
      if (res.status === 200) {
        setNotificaciones(prev =>
          prev.map(n => n.id_registro === idRegistro ? { ...n, verificado: true } : n)
        )
      }
    } catch (err) {
      console.error('Error al verificar evento:', err)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <div className="dashboard-panel">
          <PageTitle titulo="Panel de Notificaciones" />

          <div className="boxes-horizontal-container">
            {notificaciones.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>
                Sin notificaciones hoy.
              </p>
            ) : (
              notificaciones.map((n) => (
                <EventCard
                  key={n.id_registro}
                  evento={n}
                  mostrarFecha={false}
                  onVerificar={verificarEvento}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
