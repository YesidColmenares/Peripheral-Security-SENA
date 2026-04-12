import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import PageTitle from '../components/PageTitle'
import EventCard from '../components/EventCard'
import api from '../services/api'
import '../assets/css/estilos_general.css'
import '../assets/css/estilos_panel_notificaciones_historial.css'

export default function HistorialPage() {
  const [registros, setRegistros] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const usuario = sessionStorage.getItem('usuario')
    if (!usuario) { navigate('/login'); return }
    cargarHistorial()
  }, [])

  async function cargarHistorial() {
    try {
      const res = await api.get('/registros/historial')
      setRegistros(res.data.map(r => {
        const fechaHora = new Date(r.fecha_hora)
        return {
          id_registro:     r.id_registro,
          numero_maquina:  r.numero_maquina,
          tipo_periferico: r.tipo_periferico,
          fecha:           fechaHora.toLocaleDateString('es-CO'),
          hora:            fechaHora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          verificado:      r.verificado == 1
        }
      }))
    } catch (err) {
      console.error('Error al cargar historial:', err)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <div className="dashboard-panel">
          <PageTitle titulo="Historial de actividad" />

          <div className="boxes-horizontal-container">
            {registros.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>
                No hay historial de actividad.
              </p>
            ) : (
              registros.map((r) => (
                <EventCard
                  key={r.id_registro}
                  evento={r}
                  mostrarFecha={true}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
