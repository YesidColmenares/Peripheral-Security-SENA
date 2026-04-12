// Componente reutilizable de estado
// Usado en: Notificaciones, Historial
// Props: verificado (bool), clickeable (bool), onClick (fn)
export default function StatusBadge({ verificado, clickeable = false, onClick }) {
  return (
    <span
      className="box-col box-status"
      style={{ cursor: clickeable && !verificado ? 'pointer' : 'default' }}
      onClick={() => clickeable && !verificado && onClick?.()}
    >
      {verificado ? 'Verificado' : clickeable ? 'Revisar' : 'Sin verificar'}
    </span>
  )
}
