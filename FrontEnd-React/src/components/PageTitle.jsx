// Componente reutilizable de título para páginas internas
// Usado en: Notificaciones, Historial, Gestión Remota, Configuración
export default function PageTitle({ titulo, subtitulo }) {
  return (
    <div>
      <h2 className="panel-title">{titulo}</h2>
      {subtitulo && <h4 className="sub-panel-title">{subtitulo}</h4>}
    </div>
  )
}
