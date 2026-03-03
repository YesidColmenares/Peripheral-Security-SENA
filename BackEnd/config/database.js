// config/database.js
// Módulo de conexión a la base de datos MySQL
// Equivalente a JDBC en Java — gestiona el pool de conexiones

const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Pool de conexiones MySQL
 * Permite reutilizar conexiones sin abrir/cerrar en cada consulta
 */
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'tecsomac_db',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

/**
 * Verifica que la conexión a la BD sea exitosa al iniciar el servidor
 */
async function verificarConexion() {
  try {
    const conexion = await pool.getConnection();
    console.log('Conexión a MySQL establecida correctamente');
    conexion.release();
  } catch (error) {
    console.error('Error al conectar con MySQL:', error.message);
    process.exit(1);
  }
}

module.exports = { pool, verificarConexion };
