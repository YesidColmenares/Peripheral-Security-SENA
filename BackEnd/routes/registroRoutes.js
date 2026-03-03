// routes/registroRoutes.js
const express = require('express');
const router  = express.Router();
const { verificarToken } = require('../middlewares/autenticacion');
const {
  crearRegistro, obtenerNotificaciones,
  obtenerHistorial, verificarRegistro,
  obtenerEstadisticasDashboard,
} = require('../controllers/registroController');

// GET  /api/registros/dashboard       — Estadísticas para el home
router.get('/dashboard',      verificarToken, obtenerEstadisticasDashboard);

// GET  /api/registros/notificaciones  — Eventos del día (en vivo)
router.get('/notificaciones',  verificarToken, obtenerNotificaciones);

// GET  /api/registros/historial       — Historial de días anteriores
router.get('/historial',       verificarToken, obtenerHistorial);

// POST /api/registros                 — Insertar evento (desde cliente C#)
router.post('/', crearRegistro);

// PUT  /api/registros/:id/verificar   — Marcar como verificado
router.put('/:id/verificar', verificarToken, verificarRegistro);

module.exports = router;
