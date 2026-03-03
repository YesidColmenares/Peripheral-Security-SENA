// routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const { registrarUsuario, iniciarSesion } = require('../controllers/authController');

// POST /api/auth/registro — Crear nueva cuenta
router.post('/registro', registrarUsuario);

// POST /api/auth/login — Iniciar sesión
router.post('/login', iniciarSesion);

module.exports = router;
