import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import PageTitle from '../components/PageTitle'
import PCCircle from '../components/PCCircle'
import PCMenu from '../components/PCMenu'
import api from '../services/api'
import '../assets/css/estilos_general.css'
import '../assets/css/estilos_panel_gestion_remota.css'

function getStatusClass(estado) {
  if (estado === 'error' || estado === 'alerta') return 'pc-status pc-alert'
  if (estado === 'activo' || estado === 'encendido' || estado === 'conectado') return 'pc-status pc-active'
  return 'pc-status pc-inactive'
}

function getStatusText(estado) {
  if (estado === 'error' || estado === 'alerta') return 'Alerta'
  if (estado === 'activo' || estado === 'encendido' || estado === 'conectado') return 'Encendido'
  return 'Desconectado'
}

export default function RemoteManagementPage() {
  const [maquinas, setMaquinas]             = useState([])
  const [menuPos, setMenuPos]               = useState(null)
  const [submenuAbierto, setSubmenuAbierto] = useState(false)
  const [comandos, setComandos]             = useState({})
  const gridRef  = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const usuario = sessionStorage.getItem('usuario')
    if (!usuario) { navigate('/login'); return }

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000')

    socket.on('estado_pc', ({ idMaquina, numeroMaquina, estado }) => {
  const id = parseInt(idMaquina)
  setMaquinas(prev => {
    const existe = prev.find(m => m.id_maquina === id)
    if (!existe) {
      // PC nueva, recargar todas las máquinas
      cargarMaquinas(socket)
      return prev
    }
    return prev.map(m => m.id_maquina === id ? { ...m, estado } : m)
  })
})

    cargarMaquinas(socket)

    const cerrarMenu = () => { setMenuPos(null); setSubmenuAbierto(false) }
    document.addEventListener('click', cerrarMenu)

    return () => {
      socket.disconnect()
      document.removeEventListener('click', cerrarMenu)
    }
  }, [])

    // Al cargar máquinas, consultar si tiene registros sin verificar
  async function cargarMaquinas(socket) {
      try {
          const [resMaquinas, resAlertas] = await Promise.all([
              api.get('/maquinas'),
              api.get('/registros/notificaciones') // registros de hoy
          ])

          const sinVerificar = new Set(
              resAlertas.data
                  .filter(r => !r.verificado)
                  .map(r => r.numero_maquina)
          )

          const ordenadas = resMaquinas.data
              .sort((a, b) => {
                  const numA = parseInt(a.numero_maquina.replace('PC-', ''))
                  const numB = parseInt(b.numero_maquina.replace('PC-', ''))
                  return numA - numB
              })
              .map(m => ({
                  ...m,
                  estado: sinVerificar.has(m.numero_maquina) ? 'alerta' : m.estado
              }))

          setMaquinas(ordenadas)
          socket.emit('solicitar_estado_pcs')
      } catch (err) {
          console.error('Error al cargar máquinas:', err)
      }
  }

  async function ejecutarApp(idMaquina) {
    const comando = comandos[idMaquina] || ''
    if (!comando.trim()) return
    try {
      await api.post(`/maquinas/${idMaquina}/ejecutar`, { rutaEjecutable: comando })
      setMenuPos(null)
      setSubmenuAbierto(false)
    } catch (err) {
      console.error('Error al ejecutar app:', err)
    }
  }

  async function apagarPC(idMaquina) {
    try {
      await api.post(`/maquinas/${idMaquina}/apagar`)
      setMenuPos(null)
    } catch (err) {
      console.error('Error al apagar PC:', err)
    }
  }

  function abrirMenu(e, maquina) {
    e.stopPropagation()
    const rect      = e.currentTarget.getBoundingClientRect()
    const panelRect = document.querySelector('.dashboard-panel').getBoundingClientRect()

    if (menuPos?.key === maquina.id_maquina) {
      setMenuPos(null)
    } else {
      const esDesktop = window.innerWidth > 600
      if (esDesktop && gridRef.current) {
        const gridRect = gridRef.current.getBoundingClientRect()
        setMenuPos({
          key: maquina.id_maquina,
          top: rect.bottom - gridRect.top + 8,
          left: rect.left - gridRect.left + rect.width / 2,
          maquina,
          esMobile: false
        })
      } else {
        setMenuPos({
          key: maquina.id_maquina,
          top: rect.top - panelRect.top + rect.height,
          left: rect.left - panelRect.left - 180,
          screenTop: rect.bottom,
          screenLeft: rect.left - 180,
          maquina,
          esMobile: true
        })
      }
      setSubmenuAbierto(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <div className="dashboard-panel" style={{ position: 'relative' }}>

          {/* ========== VISTA GRID (desktop) ========== */}
          <div className="grid-view">
            <PageTitle titulo="Panel de gestión remota" />
            <div className="grid" ref={gridRef} style={{ position: 'relative' }}>
              {maquinas.map((m) => (
                <PCCircle
                  key={m.id_maquina}
                  maquina={m}
                  onClick={abrirMenu}
                />
              ))}

              {!menuPos?.esMobile && (
                <PCMenu
                  menuPos={menuPos}
                  submenuAbierto={submenuAbierto}
                  comandos={comandos}
                  onToggleSubmenu={() => setSubmenuAbierto(v => !v)}
                  onComandoChange={(id, val) => setComandos(prev => ({ ...prev, [id]: val }))}
                  onEjecutar={ejecutarApp}
                  onApagar={apagarPC}
                />
              )}
            </div>
          </div>

          {/* ========== VISTA LISTA (móvil) ========== */}
          <div className="list-view">
            <PageTitle titulo="Panel de gestión remota" />
            <div className="list-view-container">
              <div className="list-header">
                <span className="pc-id">PC ID</span>
                <span className="pc-status-title">ESTADO</span>
                <span className="pc-actions-header"></span>
              </div>
              <ul className="list-items">
                {maquinas.map((m) => (
                  <li key={m.id_maquina}>
                    <span className="pc-id">{m.numero_maquina}</span>
                    <span className={getStatusClass(m.estado)}>
                      <span className="status-circle"></span>
                      <span>{getStatusText(m.estado)}</span>
                    </span>
                    <span className="pc-actions" onClick={(e) => abrirMenu(e, m)}>
                      &#8942;
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {menuPos?.esMobile && (
              <PCMenu
                menuPos={menuPos}
                submenuAbierto={submenuAbierto}
                comandos={comandos}
                onToggleSubmenu={() => setSubmenuAbierto(v => !v)}
                onComandoChange={(id, val) => setComandos(prev => ({ ...prev, [id]: val }))}
                onEjecutar={ejecutarApp}
                onApagar={apagarPC}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  )
}