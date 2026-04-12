// Componente reutilizable de tarjeta de evento
// Usado en: Notificaciones, Historial
// Props: evento (obj), mostrarFecha (bool), onVerificar (fn)
import StatusBadge from './StatusBadge'

export default function EventCard({ evento, mostrarFecha = false, onVerificar }) {
  return (
    <div className={`box-horizontal ${mostrarFecha ? '' : evento.verificado ? 'green' : 'red'}`}>
      <span className="box-col box-title">{evento.numero_maquina}</span>
      <span className="box-col box-desc">Desconexión {evento.tipo_periferico}</span>
      <span className="box-col box-time">
        {mostrarFecha ? `${evento.fecha} ` : ''}{evento.hora}
      </span>
      <StatusBadge
        verificado={evento.verificado}
        clickeable={!mostrarFecha}
        onClick={() => onVerificar?.(evento.id_registro)}
      />
    </div>
  )
}
