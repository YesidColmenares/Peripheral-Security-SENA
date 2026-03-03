// middlewares/autenticacion.js
// Middleware de verificación de token JWT
// Protege las rutas que requieren sesión activa

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * verificarToken
 * Valida el JWT enviado en el header Authorization
 * Si es válido, adjunta el payload del usuario a req.usuario
 */
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
  }
}

/**
 * soloAdministrador
 * Restringe el acceso a usuarios con rol Administrador
 * Debe usarse después de verificarToken
 */
function soloAdministrador(req, res, next) {
  if (req.usuario.rol !== 'Administrador') {
    return res.status(403).json({ mensaje: 'Acceso restringido a administradores.' });
  }
  next();
}

module.exports = { verificarToken, soloAdministrador };
