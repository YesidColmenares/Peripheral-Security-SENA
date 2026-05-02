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
    socket.on('identificar_maquina', async (datos) => {
      const { macAddress, numeroMaquina } = datos;

      try {
        // Buscar la máquina en la BD por MAC address
        const [maquinas] = await pool.query(
          'SELECT id_maquina, numero_maquina FROM maquina WHERE mac_address = ?',
          [macAddress]
        );

        let idMaquina, numMaquina;

        if (maquinas.length > 0) {
          // Máquina ya registrada
          idMaquina  = maquinas[0].id_maquina;
          numMaquina = maquinas[0].numero_maquina;
        } else {
          // Registrar nueva máquina automáticamente
          const [resultado] = await pool.query(
            'INSERT INTO maquina (numero_maquina, mac_address, licencia_activa) VALUES (?, ?, 1)',
            [numeroMaquina || macAddress, macAddress]
          );
          idMaquina  = resultado.insertId;
          numMaquina = numeroMaquina || macAddress;
        }

        socket.join(`maquina_${idMaquina}`);
        socket.idMaquina     = idMaquina;
        socket.numeroMaquina = numMaquina;
        socket.macAddress    = macAddress;

        console.log(`🖥️  Máquina conectada: ${numMaquina} (ID: ${idMaquina})`);

        io.emit('estado_pc', {
          idMaquina,
          numeroMaquina: numMaquina,
          estado: 'conectado'
        });

      } catch (error) {
        console.error('Error al identificar maquina:', error.message);
      }
    });

    // ── Cliente C# reporta desconexión de periférico ───────────────────
    socket.on('periferico_desconectado', async (datos) => {
      const { macAddress, tipoPeriferico, nombreCliente } = datos;

      try {
        // Buscar la máquina por MAC
        const [maquinas] = await pool.query(
          'SELECT id_maquina, numero_maquina FROM maquina WHERE mac_address = ?',
          [macAddress]
        );
        if (maquinas.length === 0) return;

        const idMaquina     = maquinas[0].id_maquina;
        const numeroMaquina = maquinas[0].numero_maquina;

        // Buscar el periférico por tipo
        const [perifericos] = await pool.query(
          'SELECT id_periferico FROM periferico WHERE tipo = ?',
          [tipoPeriferico]
        );
        if (perifericos.length === 0) return;

        const idPeriferico = perifericos[0].id_periferico;

        // Guardar en base de datos
        const [resultado] = await pool.query(
          `INSERT INTO registro_actividad
            (id_maquina, id_periferico, nombre_cliente, tipo_evento, verificado)
          VALUES (?, ?, ?, ?, 0)`,
          [idMaquina, idPeriferico, nombreCliente || numeroMaquina, `desconexion_${tipoPeriferico.toLowerCase()}`]
        );

        // Obtener el registro completo
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

        io.emit('nueva_notificacion', registros[0]);
        io.emit('estado_pc', {
          idMaquina,
          numeroMaquina,
          estado: 'alerta'
        });

        console.log(`⚠️  Desconexion: ${numeroMaquina} — ${tipoPeriferico}`);

      } catch (error) {
        console.error('Error al procesar periferico_desconectado:', error.message);
      }
    });

    // ── La web solicita el estado actual de todas las PCs ──────────────
    socket.on('solicitar_estado_pcs', async () => {
        const salas = [...io.sockets.adapter.rooms.keys()]
            .filter(sala => sala.startsWith('maquina_'));

        for (const sala of salas) {
            const idMaquina = parseInt(sala.replace('maquina_', ''));

            // Verificar si tiene alertas pendientes en DB
            const [alertas] = await pool.query(
                `SELECT COUNT(*) AS total FROM registro_actividad
                WHERE id_maquina = ? AND verificado = 0 AND DATE(fecha_hora) = CURDATE()`,
                [idMaquina]
            );

            const estado = alertas[0].total > 0 ? 'alerta' : 'conectado';

            socket.emit('estado_pc', { idMaquina, estado });
        }
    });

    socket.on('periferico_verificado', async (datos) => {
      const { macAddress } = datos;
      console.log(`Verificación recibida de: ${macAddress}`);
      try {
          await pool.query(
              `UPDATE registro_actividad ra
              INNER JOIN maquina m ON ra.id_maquina = m.id_maquina
              SET ra.verificado = 1
              WHERE m.mac_address = ?
                AND ra.verificado = 0
              ORDER BY ra.fecha_hora DESC
              LIMIT 1`,
              [macAddress]
          );

          // Obtener el registro actualizado y la máquina
          const [registros] = await pool.query(
              `SELECT r.id_registro, m.id_maquina, m.numero_maquina,
                      p.tipo AS tipo_periferico, r.fecha_hora, r.verificado
              FROM registro_actividad r
              INNER JOIN maquina m ON r.id_maquina = m.id_maquina
              INNER JOIN periferico p ON r.id_periferico = p.id_periferico
              WHERE m.mac_address = ?
              ORDER BY r.fecha_hora DESC
              LIMIT 1`,
              [macAddress]
          );

          if (registros.length > 0) {
              const reg = registros[0];

              // ✅ Esto actualiza la tarjeta en NotificationsPage sin F5
              io.emit('notificacion_verificada', { id_registro: reg.id_registro });

              // ✅ Ahora sí tiene idMaquina para que RemoteManagementPage lo procese
              io.emit('estado_pc', {
                  idMaquina:     reg.id_maquina,
                  numeroMaquina: reg.numero_maquina,
                  estado:        'conectado'
              });
          }

          console.log(`✅ Verificado: ${macAddress}`);
      } catch (error) {
          console.error('Error al verificar:', error.message);
      }
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
