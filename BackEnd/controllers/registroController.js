// controllers/registroController.js
// Controlador de registros de actividad
// Gestiona: inserción de eventos, historial, notificaciones y estadísticas del dashboard

const { pool } = require('../config/database');

/**
 * crearRegistro
 * POST /api/registros
 * Inserta un nuevo evento de desconexión generado por el cliente C#
 */
async function crearRegistro(req, res) {
  const { idMaquina, idPeriferico, nombreCliente, tipoEvento } = req.body;

  if (!idMaquina || !idPeriferico || !nombreCliente || !tipoEvento) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO registro_actividad
         (id_maquina, id_periferico, nombre_cliente, tipo_evento, verificado)
       VALUES (?, ?, ?, ?, 0)`,
      [idMaquina, idPeriferico, nombreCliente, tipoEvento]
    );
    res.status(201).json({
      mensaje: 'Registro de actividad creado.',
      idRegistro: resultado.insertId,
    });
  } catch (error) {
    console.error('Error en crearRegistro:', error.message);
    res.status(500).json({ mensaje: 'Error al crear el registro.' });
  }
}

/**
 * obtenerNotificaciones
 * GET /api/registros/notificaciones
 * Retorna los eventos del día actual (desconexiones en vivo)
 */
async function obtenerNotificaciones(req, res) {
  try {
    const [registros] = await pool.query(
      `SELECT
         r.id_registro,
         m.numero_maquina,
         p.nombre   AS periferico,
         p.tipo     AS tipo_periferico,
         r.nombre_cliente,
         r.fecha_hora,
         r.tipo_evento,
         r.verificado
       FROM registro_actividad r
       INNER JOIN maquina    m ON r.id_maquina    = m.id_maquina
       INNER JOIN periferico p ON r.id_periferico = p.id_periferico
       WHERE DATE(r.fecha_hora) = CURDATE()
       ORDER BY r.fecha_hora DESC`
    );
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error en obtenerNotificaciones:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener notificaciones.' });
  }
}

/**
 * obtenerHistorial
 * GET /api/registros/historial
 * Retorna el historial de actividad de días anteriores
 */
async function obtenerHistorial(req, res) {
  try {
    const [registros] = await pool.query(
      `SELECT
         r.id_registro,
         m.numero_maquina,
         p.nombre   AS periferico,
         p.tipo     AS tipo_periferico,
         r.nombre_cliente,
         r.fecha_hora,
         r.tipo_evento,
         r.verificado
       FROM registro_actividad r
       INNER JOIN maquina    m ON r.id_maquina    = m.id_maquina
       INNER JOIN periferico p ON r.id_periferico = p.id_periferico
       WHERE DATE(r.fecha_hora) < CURDATE()
       ORDER BY r.fecha_hora DESC
       LIMIT 200`
    );
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error en obtenerHistorial:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener el historial.' });
  }
}

/**
 * verificarRegistro
 * PUT /api/registros/:id/verificar
 * Marca una notificación como verificada por el administrador
 */
async function verificarRegistro(req, res) {
  const { id } = req.params;
  try {
    const [resultado] = await pool.query(
      'UPDATE registro_actividad SET verificado = 1 WHERE id_registro = ?',
      [id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Registro no encontrado.' });
    }
    res.status(200).json({ mensaje: 'Registro verificado correctamente.' });
  } catch (error) {
    console.error('Error en verificarRegistro:', error.message);
    res.status(500).json({ mensaje: 'Error al verificar el registro.' });
  }
}

/**
 * obtenerEstadisticasDashboard
 * GET /api/registros/dashboard
 * Retorna las estadísticas generales para el panel principal
 */
async function obtenerEstadisticasDashboard(req, res) {
  try {
    // Desconexiones totales
    const [[{ desconexionesTotales }]] = await pool.query(
      'SELECT COUNT(*) AS desconexionesTotales FROM registro_actividad'
    );

    // Desconexiones del día
    const [[{ desconexionesHoy }]] = await pool.query(
      `SELECT COUNT(*) AS desconexionesHoy
       FROM registro_actividad
       WHERE DATE(fecha_hora) = CURDATE()`
    );

    // Máquinas activas (con socket conectado — se complementa con Socket.IO en el frontend)
    const [[{ totalMaquinas }]] = await pool.query(
      'SELECT COUNT(*) AS totalMaquinas FROM maquina WHERE licencia_activa = 1'
    );

    // Desconexiones por mes (enero–diciembre del año actual)
    const [desconexionesPorMes] = await pool.query(
      `SELECT
         MONTH(fecha_hora) AS mes,
         COUNT(*)          AS total
       FROM registro_actividad
       WHERE YEAR(fecha_hora) = YEAR(CURDATE())
       GROUP BY MONTH(fecha_hora)
       ORDER BY mes ASC`
    );

    // Desconexiones por tipo de periférico
    const [desconexionesPorTipo] = await pool.query(
      `SELECT
         p.tipo,
         COUNT(*) AS total
       FROM registro_actividad r
       INNER JOIN periferico p ON r.id_periferico = p.id_periferico
       GROUP BY p.tipo`
    );

    res.status(200).json({
      desconexionesTotales,
      desconexionesHoy,
      totalMaquinas,
      desconexionesPorMes,
      desconexionesPorTipo,
    });
  } catch (error) {
    console.error('Error en obtenerEstadisticasDashboard:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas.' });
  }
}

module.exports = {
  crearRegistro,
  obtenerNotificaciones,
  obtenerHistorial,
  verificarRegistro,
  obtenerEstadisticasDashboard,
};
