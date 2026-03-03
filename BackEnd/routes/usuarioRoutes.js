// routes/usuarioRoutes.js
const express = require('express');
const router  = express.Router();
const { verificarToken, soloAdministrador } = require('../middlewares/autenticacion');
const {
  obtenerUsuarios, obtenerUsuarioPorId,
  actualizarRolUsuario, eliminarUsuario
} = require('../controllers/usuarioController');

// GET  /api/usuarios         — Listar todos los usuarios
router.get('/',     verificarToken, soloAdministrador, obtenerUsuarios);

// GET  /api/usuarios/:id     — Obtener usuario por ID
router.get('/:id',  verificarToken, soloAdministrador, obtenerUsuarioPorId);

// PUT  /api/usuarios/:id/rol — Cambiar rol de usuario
router.put('/:id/rol', verificarToken, soloAdministrador, actualizarRolUsuario);

// DELETE /api/usuarios/:id  — Eliminar usuario
router.delete('/:id', verificarToken, soloAdministrador, eliminarUsuario);

module.exports = router;
