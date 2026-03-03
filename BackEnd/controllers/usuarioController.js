// controllers/usuarioController.js
// Controlador de usuarios
// Gestiona: consulta, actualización de rol y eliminación de usuarios

const { pool } = require('../config/database');

/**
 * obtenerUsuarios
 * GET /api/usuarios
 * Retorna la lista de todos los usuarios registrados con su rol
 */
async function obtenerUsuarios(req, res) {
  try {
    const [usuarios] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.correo, r.nombre_rol AS rol
       FROM usuario_sistema u
       INNER JOIN rol r ON u.id_rol = r.id_rol
       ORDER BY u.id_usuario ASC`
    );
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error en obtenerUsuarios:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener usuarios.' });
  }
}

/**
 * obtenerUsuarioPorId
 * GET /api/usuarios/:id
 * Retorna un usuario específico por su ID
 */
async function obtenerUsuarioPorId(req, res) {
  const { id } = req.params;
  try {
    const [usuarios] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.correo, r.nombre_rol AS rol
       FROM usuario_sistema u
       INNER JOIN rol r ON u.id_rol = r.id_rol
       WHERE u.id_usuario = ?`,
      [id]
    );
    if (usuarios.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }
    res.status(200).json(usuarios[0]);
  } catch (error) {
    console.error('Error en obtenerUsuarioPorId:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener el usuario.' });
  }
}

/**
 * actualizarRolUsuario
 * PUT /api/usuarios/:id/rol
 * Actualiza el rol de un usuario (solo Administrador puede hacerlo)
 */
async function actualizarRolUsuario(req, res) {
  const { id }    = req.params;
  const { idRol } = req.body;

  if (!idRol) {
    return res.status(400).json({ mensaje: 'El campo idRol es obligatorio.' });
  }

  try {
    const [resultado] = await pool.query(
      'UPDATE usuario_sistema SET id_rol = ? WHERE id_usuario = ?',
      [idRol, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    res.status(200).json({ mensaje: 'Rol actualizado correctamente.' });
  } catch (error) {
    console.error('Error en actualizarRolUsuario:', error.message);
    res.status(500).json({ mensaje: 'Error al actualizar el rol.' });
  }
}

/**
 * eliminarUsuario
 * DELETE /api/usuarios/:id
 * Elimina un usuario del sistema por su ID
 */
async function eliminarUsuario(req, res) {
  const { id } = req.params;
  try {
    const [resultado] = await pool.query(
      'DELETE FROM usuario_sistema WHERE id_usuario = ?',
      [id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }
    res.status(200).json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error en eliminarUsuario:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar el usuario.' });
  }
}

module.exports = { obtenerUsuarios, obtenerUsuarioPorId, actualizarRolUsuario, eliminarUsuario };
