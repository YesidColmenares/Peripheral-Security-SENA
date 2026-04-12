import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import PageTitle from '../components/PageTitle'
import UserRoleCard from '../components/UserRoleCard'
import api from '../services/api'
import '../assets/css/estilos_general.css'
import '../assets/css/estilos_configuracion.css'

export default function ConfigPage() {
  const [usuarios, setUsuarios] = useState([])
  const [accesoDenegado, setAccesoDenegado] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const usuarioStr = sessionStorage.getItem('usuario')
    if (!usuarioStr) { navigate('/login'); return }
    cargarUsuarios()
  }, [])

  async function cargarUsuarios() {
    try {
      const res = await api.get('/usuarios')
      const datos = Array.isArray(res.data) ? res.data : res.data.usuarios || []
      setUsuarios(datos)
    } catch (err) {
      if (err.response?.status === 403) {
        setAccesoDenegado(true)
      } else {
        console.error('Error al cargar usuarios:', err)
      }
    }
  }

  async function actualizarRol(idUsuario, idRol) {
    try {
      await api.put(`/usuarios/${idUsuario}/rol`, { idRol: parseInt(idRol) })
      setUsuarios(prev =>
        prev.map(u => u.id_usuario === idUsuario ? { ...u, _guardado: true } : u)
      )
      setTimeout(() => {
        setUsuarios(prev =>
          prev.map(u => u.id_usuario === idUsuario ? { ...u, _guardado: false } : u)
        )
      }, 1500)
    } catch (err) {
      console.error('Error al actualizar rol:', err)
      if (err.response?.data?.mensaje) alert(err.response.data.mensaje)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <div className="dashboard-panel">
          <PageTitle titulo="Configuración" subtitulo="Asignar o cambiar rol" />

          <div className="boxes-horizontal-container">
            {accesoDenegado ? (
              <p style={{ color: '#e74c3c', textAlign: 'center', padding: '20px' }}>
                ⛔ No tienes permisos para ver esta sección.
              </p>
            ) : (
              usuarios.map((u) => (
                <UserRoleCard
                  key={u.id_usuario}
                  usuario={u}
                  onActualizarRol={actualizarRol}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
