// controllers/authController.js
// Controlador de autenticación
// Gestiona: registro de usuarios, inicio de sesión

const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { pool } = require('../config/database');
require('dotenv').config();

/**
 * registrarUsuario
 * POST /api/auth/registro
 * Inserta un nuevo usuario en la base de datos con contraseña cifrada
 */
async function registrarUsuario(req, res) {
  const { nombre, correo, contrasena, idRol } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios.' });
  }

  try {
    // Verificar si el correo ya existe
    const [usuariosExistentes] = await pool.query(
      'SELECT id_usuario FROM usuario_sistema WHERE correo = ?',
      [correo]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado.' });
    }

    // Cifrar la contraseña con bcrypt (10 rondas)
    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const rolAsignado = idRol || 2; // Por defecto: Operario

    // Inserción en la base de datos
    const [resultado] = await pool.query(
      `INSERT INTO usuario_sistema (id_rol, nombre, correo, contrasena_hash)
       VALUES (?, ?, ?, ?)`,
      [rolAsignado, nombre, correo, contrasenaHash]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente.',
      idUsuario: resultado.insertId,
    });
  } catch (error) {
    console.error('Error en registrarUsuario:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

/**
 * iniciarSesion
 * POST /api/auth/login
 * Valida las credenciales y retorna un token JWT
 */
async function iniciarSesion(req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios.' });
  }

  try {
    // Consultar usuario con su rol
    const [usuarios] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.correo, u.contrasena_hash, r.nombre_rol AS rol
       FROM usuario_sistema u
       INNER JOIN rol r ON u.id_rol = r.id_rol
       WHERE u.correo = ?`,
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { idUsuario: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.status(200).json({
      mensaje: 'Sesión iniciada correctamente.',
      token,
      usuario: {
        idUsuario: usuario.id_usuario,
        nombre:    usuario.nombre,
        correo:    usuario.correo,
        rol:       usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error en iniciarSesion:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

module.exports = { registrarUsuario, iniciarSesion };
