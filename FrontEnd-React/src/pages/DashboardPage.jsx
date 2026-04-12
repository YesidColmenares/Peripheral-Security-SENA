import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'
import api from '../services/api'
import icoTotal     from '../assets/icons/ico_desconexiones_totales.png'
import icoDia       from '../assets/icons/ico_desconexiones_dia.png'
import icoActivos   from '../assets/icons/ico_dispositivos_activos.png'
import icoInactivos from '../assets/icons/ico_dispositivos_inactivos.png'
import '../assets/css/estilos_general.css'
import '../assets/css/estilos_inicio.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const usuario = sessionStorage.getItem('usuario')
    if (!usuario) { navigate('/login'); return }
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      const res = await api.get('/registros/dashboard')
      setStats(res.data)
    } catch (err) {
      console.error('Error cargando dashboard:', err)
    }
  }

  // -------------------------------
  // 🔹 DESCONEXIONES POR MES
  // -------------------------------
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const valoresMes = Array(12).fill(0)

  stats?.desconexionesPorMes?.forEach(d => {
    valoresMes[d.mes - 1] = d.total
  })

  // -------------------------------
  // 🔹 DESCONEXIONES POR TIPO (FIX)
  // -------------------------------
  const tiposBase = ['USB', 'JACK', 'HDMI']

  const mapaTipos = {}
  stats?.desconexionesPorTipo?.forEach(d => {
    mapaTipos[d.tipo] = d.total
  })

  const tipoLabels = tiposBase
  const tipoValores = tiposBase.map(tipo => mapaTipos[tipo] || 0)

  // -------------------------------
  // 🔹 OPCIONES GRÁFICO
  // -------------------------------
  const opcionesGrafico = {
  responsive: true,
  maintainAspectRatio: false, // 🔥 ESTO ES LO QUE TE FALTA
  plugins: {
    legend: { labels: { color: '#ccc' } }
  },
  scales: {
    x: {
      ticks: { color: '#ccc' },
      grid: { color: 'rgba(255,255,255,0.05)' }
    },
    y: {
      ticks: { color: '#ccc' },
      grid: { color: 'rgba(255,255,255,0.05)' },
      beginAtZero: true
    }
  }
}

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />

        <div className="dashboard-panel">

          {/* MÉTRICAS */}
          <div className="boxes-container">
            <StatCard icono={icoTotal}     titulo="Desconexiones totales" valor={stats?.desconexionesTotales} />
            <StatCard icono={icoDia}       titulo="Desconexiones del día"  valor={stats?.desconexionesHoy} />
            <StatCard icono={icoActivos}   titulo="Dispositivos activos"   valor={stats?.totalMaquinas} />
            <StatCard icono={icoInactivos} titulo="Dispositivos inactivos" valor={0} />
          </div>

          {/* GRÁFICO — POR MES */}
          <div className="chart-wrapper">
            <Bar
              data={{
                labels: meses,
                datasets: [{
                  label: 'Desconexiones por mes',
                  data: valoresMes,
                  backgroundColor: 'rgba(46,109,164,0.7)',
                  borderColor: '#2E6DA4',
                  borderWidth: 1,
                  borderRadius: 4
                }]
              }}
              options={opcionesGrafico}
            />
          </div>

          {/* GRÁFICO — POR PERIFÉRICO */}
          <div className="chart-wrapper">
            <Bar
              data={{
                labels: tipoLabels,
                datasets: [{
                  label: 'Desconexiones por periférico',
                  data: tipoValores,
                  backgroundColor: [
                    'rgba(231,76,60,0.7)',   // USB
                    'rgba(243,156,18,0.7)',  // JACK
                    'rgba(39,174,96,0.7)'    // HDMI
                  ],
                  borderWidth: 1,
                  borderRadius: 4
                }]
              }}
              options={opcionesGrafico}
            />
          </div>

        </div>
      </div>
    </div>
  )
}