import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import NotificationsPage from './pages/NotificationsPage'
import HistorialPage from './pages/HistorialPage'
import RemoteManagementPage from './pages/RemoteManagementPage'
import ConfigPage from './pages/ConfigPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/notificaciones" element={<NotificationsPage />} />
      <Route path="/historial" element={<HistorialPage />} />
      <Route path="/gestion-remota" element={<RemoteManagementPage />} />
      <Route path="/configuracion" element={<ConfigPage />} />
    </Routes>
  )
}

export default App