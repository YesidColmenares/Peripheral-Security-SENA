// controllers/maquinaController.js
// Controlador de máquinas
// Gestiona: CRUD de máquinas y envío de comandos remotos via Socket.IO

const { pool } = require('../config/database');

/**
 * obtenerMaquinas
 * GET /api/maquinas
 * Retorna todas las máquinas registradas en el sistema
 */
async function obtenerMaquinas(req, res) {
  try {
    const [maquinas] = await pool.query(
      `SELECT id_maquina, numero_maquina, mac_address, licencia_activa
       FROM maquina
       ORDER BY numero_maquina ASC`
    );
    res.status(200).json(maquinas);
  } catch (error) {
    console.error('Error en obtenerMaquinas:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener máquinas.' });
  }
}

/**
 * crearMaquina
 * POST /api/maquinas
 * Registra una nueva máquina en la base de datos
 */
async function crearMaquina(req, res) {
  const { numeroMaquina, macAddress } = req.body;

  if (!numeroMaquina || !macAddress) {
    return res.status(400).json({ mensaje: 'numeroMaquina y macAddress son obligatorios.' });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO maquina (numero_maquina, mac_address, licencia_activa)
       VALUES (?, ?, 1)`,
      [numeroMaquina, macAddress]
    );
    res.status(201).json({
      mensaje: 'Máquina registrada correctamente.',
      idMaquina: resultado.insertId,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensaje: 'Ya existe una máquina con esa MAC address.' });
    }
    console.error('Error en crearMaquina:', error.message);
    res.status(500).json({ mensaje: 'Error al registrar la máquina.' });
  }
}

/**
 * actualizarMaquina
 * PUT /api/maquinas/:id
 * Actualiza los datos de una máquina existente
 */
async function actualizarMaquina(req, res) {
  const { id } = req.params;
  const { numeroMaquina, licenciaActiva } = req.body;

  try {
    const [resultado] = await pool.query(
      `UPDATE maquina
       SET numero_maquina = COALESCE(?, numero_maquina),
           licencia_activa = COALESCE(?, licencia_activa)
       WHERE id_maquina = ?`,
      [numeroMaquina, licenciaActiva, id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Máquina no encontrada.' });
    }
    res.status(200).json({ mensaje: 'Máquina actualizada correctamente.' });
  } catch (error) {
    console.error('Error en actualizarMaquina:', error.message);
    res.status(500).json({ mensaje: 'Error al actualizar la máquina.' });
  }
}

/**
 * eliminarMaquina
 * DELETE /api/maquinas/:id
 * Elimina una máquina del sistema
 */
async function eliminarMaquina(req, res) {
  const { id } = req.params;
  try {
    const [resultado] = await pool.query(
      'DELETE FROM maquina WHERE id_maquina = ?', [id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Máquina no encontrada.' });
    }
    res.status(200).json({ mensaje: 'Máquina eliminada correctamente.' });
  } catch (error) {
    console.error('Error en eliminarMaquina:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar la máquina.' });
  }
}

/**
 * apagarMaquina
 * POST /api/maquinas/:id/apagar
 * Envía el comando de apagado a la PC cliente via Socket.IO
 */
async function apagarMaquina(req, res) {
  const { id } = req.params;
  const io = req.app.get('io'); // Instancia de Socket.IO

  try {
    const [maquinas] = await pool.query(
      'SELECT numero_maquina FROM maquina WHERE id_maquina = ?', [id]
    );
    if (maquinas.length === 0) {
      return res.status(404).json({ mensaje: 'Máquina no encontrada.' });
    }

    // Emitir evento de apagado a la sala de esa máquina
    io.to(`maquina_${id}`).emit('comando_apagar', {
      idMaquina: id,
      numeroMaquina: maquinas[0].numero_maquina,
    });

    res.status(200).json({ mensaje: `Comando de apagado enviado a ${maquinas[0].numero_maquina}.` });
  } catch (error) {
    console.error('Error en apagarMaquina:', error.message);
    res.status(500).json({ mensaje: 'Error al enviar el comando.' });
  }
}

/**
 * ejecutarAplicacion
 * POST /api/maquinas/:id/ejecutar
 * Envía la ruta de un ejecutable para lanzarlo en la PC cliente
 */
async function ejecutarAplicacion(req, res) {
  const { id }         = req.params;
  const { rutaEjecutable } = req.body;
  const io = req.app.get('io');

  if (!rutaEjecutable) {
    return res.status(400).json({ mensaje: 'La rutaEjecutable es obligatoria.' });
  }

  try {
    const [maquinas] = await pool.query(
      'SELECT numero_maquina FROM maquina WHERE id_maquina = ?', [id]
    );
    if (maquinas.length === 0) {
      return res.status(404).json({ mensaje: 'Máquina no encontrada.' });
    }

    io.to(`maquina_${id}`).emit('comando_ejecutar', {
      idMaquina:       id,
      rutaEjecutable,
    });

    res.status(200).json({ mensaje: `Comando de ejecución enviado a ${maquinas[0].numero_maquina}.` });
  } catch (error) {
    console.error('Error en ejecutarAplicacion:', error.message);
    res.status(500).json({ mensaje: 'Error al enviar el comando.' });
  }
}

module.exports = {
  obtenerMaquinas, crearMaquina, actualizarMaquina,
  eliminarMaquina, apagarMaquina, ejecutarAplicacion,
};
