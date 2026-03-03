// config/socket.js
// Gestión de eventos Socket.IO en tiempo real
// Puente de comunicación entre la página web y los clientes C#

const { pool } = require('./database');

/**
 * inicializarSocket
 * Configura todos los eventos de Socket.IO
 * @param {import('socket.io').Server} io
 */
function inicializarSocket(io) {

  io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);

    // ── El cliente C# se identifica al conectarse ──────────────────────
    socket.on('identificar_maquina', (datos) => {
      const { idMaquina, numeroMaquina } = datos;
      // Unirse a una sala única por máquina
      socket.join(`maquina_${idMaquina}`);
      socket.idMaquina     = idMaquina;
      socket.numeroMaquina = numeroMaquina;

      console.log(`🖥️  Máquina conectada: ${numeroMaquina} (ID: ${idMaquina})`);

      // Notificar a la web que esta PC está en línea
      io.emit('estado_pc', {
        idMaquina,
        numeroMaquina,
        estado: 'conectado',
      });
    });

    // ── Cliente C# reporta desconexión de periférico ───────────────────
    socket.on('periferico_desconectado', async (datos) => {
      const { idMaquina, idPeriferico, nombreCliente, tipoEvento } = datos;

      try {
        // Guardar en base de datos
        const [resultado] = await pool.query(
          `INSERT INTO registro_actividad
             (id_maquina, id_periferico, nombre_cliente, tipo_evento, verificado)
           VALUES (?, ?, ?, ?, 0)`,
          [idMaquina, idPeriferico, nombreCliente, tipoEvento]
        );

        // Construir el objeto del evento para la web
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
           WHERE r.id_registro = ?`,
          [resultado.insertId]
        );

        // Emitir a todos los administradores conectados en la web
        io.emit('nueva_notificacion', registros[0]);

        // Actualizar estado de la PC a alerta (rojo)
        io.emit('estado_pc', {
          idMaquina,
          numeroMaquina: registros[0].numero_maquina,
          estado: 'alerta',
        });

        console.log(`Desconexión: ${registros[0].numero_maquina} — ${tipoEvento}`);
      } catch (error) {
        console.error('Error al procesar periferico_desconectado:', error.message);
      }
    });

    // ── La web solicita el estado actual de todas las PCs ──────────────
    socket.on('solicitar_estado_pcs', () => {
      // Re-emitir el estado de todas las salas activas
      const salas = [...io.sockets.adapter.rooms.keys()]
        .filter(sala => sala.startsWith('maquina_'));

      salas.forEach(sala => {
        const idMaquina = sala.replace('maquina_', '');
        socket.emit('estado_pc', { idMaquina, estado: 'conectado' });
      });
    });

    // ── Desconexión ────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      if (socket.idMaquina) {
        console.log(`Máquina desconectada: ${socket.numeroMaquina}`);
        io.emit('estado_pc', {
          idMaquina:     socket.idMaquina,
          numeroMaquina: socket.numeroMaquina,
          estado:        'desconectado',
        });
      }
    });
  });
}

module.exports = { inicializarSocket };
