// Componente círculo individual de PC
// Usado en: RemoteManagementPage
// Props: maquina (obj), onClick (fn)
function getCircleClass(estado) {
  if (estado === 'error' || estado === 'alerta') return 'circle circle-error'
  if (estado === 'activo' || estado === 'encendido' || estado === 'conectado') return 'circle circle-active'
  return 'circle circle-inactive'
}

function soloNumero(numeroMaquina) {
  return numeroMaquina.split('-')[1] || numeroMaquina
}

export default function PCCircle({ maquina, onClick }) {
  return (
    <div
      className={getCircleClass(maquina.estado)}
      onClick={(e) => onClick(e, maquina)}
    >
      {soloNumero(maquina.numero_maquina)}
    </div>
  )
}
