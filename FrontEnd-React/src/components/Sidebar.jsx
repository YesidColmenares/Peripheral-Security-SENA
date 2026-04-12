import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../assets/css/estilos_general.css'

export default function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { cerrarSesion } = useAuth()

  const links = [
    { ruta: '/dashboard',      icono: '/src/assets/icons/ico_inicio.png' },
    { ruta: '/notificaciones', icono: '/src/assets/icons/ico_panel_notificaciones.png' },
    { ruta: '/historial',      icono: '/src/assets/icons/ico_historiall_actividad.png' },
    { ruta: '/gestion-remota', icono: '/src/assets/icons/ico_panel_gestion_remota.png' },
    { ruta: '/configuracion',  icono: '/src/assets/icons/ico_configuracion.png' },
  ]

  return (
    <div className="sidebar">
      <nav className="sidebar-menu">
        {links.map(link => (
          <a
            key={link.ruta}
            href="#"
            className={location.pathname === link.ruta ? 'active' : ''}
            onClick={() => navigate(link.ruta)}
          >
            <img src={link.icono} className="icon-custom" alt="" />
          </a>
        ))}

        {/* Logout */}
        <a href="#" onClick={cerrarSesion}>
          <img src="/src/assets/icons/ico_logout.svg" className="icon-custom" alt="Logout" />
        </a>
      </nav>
      <div className="sidebar-vertical-line"></div>
    </div>
  )
}