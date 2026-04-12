// Tarjeta de usuario con selector de rol
// Usado en: ConfigPage
// Props: usuario (obj), onActualizarRol (fn)
export default function UserRoleCard({ usuario, onActualizarRol }) {
  return (
    <div className="box-horizontal config">
      <span className="box-name" style={{ flex: 1 }}>{usuario.nombre}</span>
      <span style={{ color: '#aaa', fontSize: '13px', flex: 1, textAlign: 'center' }}>{usuario.correo}</span>
      <div className="box-role-action" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <select
          defaultValue={usuario.rol === 'Administrador' ? '1' : '2'}
          onChange={(e) => onActualizarRol(usuario.id_usuario, e.target.value)}
          style={{
            background: '#1a1a2e',
            color: '#fff',
            border: `1px solid ${usuario._guardado ? '#27ae60' : '#444'}`,
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'border-color 0.3s'
          }}
        >
          <option value="1">Administrador</option>
          <option value="2">Operario</option>
        </select>
      </div>
    </div>
  )
}
