function getStatusText(estado) {
  if (estado === 'error' || estado === 'alerta') return 'Alerta'
  if (estado === 'activo' || estado === 'encendido') return 'Encendido'
  return 'Desconectado'
}

export default function PCMenu({ menuPos, submenuAbierto, comandos, onToggleSubmenu, onComandoChange, onEjecutar, onApagar }) {
  if (!menuPos) return null

  const { top, left, maquina, esMobile, screenTop, screenLeft } = menuPos

  return (
    <div
      className="menu-flotante"
      style={{
        display: 'block',
        position: esMobile ? 'fixed' : 'absolute',
        top: esMobile ? `${screenTop}px` : `${top}px`,
        left: esMobile ? `${screenLeft}px` : `${left}px`,
        zIndex: 999
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>{maquina.numero_maquina}</h3>
      <p className="status">{getStatusText(maquina.estado)}</p>
      <ul>
        <li onClick={(e) => { e.stopPropagation(); onToggleSubmenu() }}>
          Ejecutar app
        </li>
        <li
          className="red"
          onClick={(e) => { e.stopPropagation(); onApagar(maquina.id_maquina) }}
        >
          Apagar
        </li>
      </ul>
      {submenuAbierto && (
        <div className="submenu" style={{ display: 'block' }}>
          <input
            type="text"
            placeholder="notepad.exe"
            value={comandos[maquina.id_maquina] || ''}
            onChange={(e) => onComandoChange(maquina.id_maquina, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={(e) => { e.stopPropagation(); onEjecutar(maquina.id_maquina) }}>
            Ejecutar
          </button>
        </div>
      )}
    </div>
  )
}