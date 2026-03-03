// routes/maquinaRoutes.js
const express = require('express');
const router  = express.Router();
const { verificarToken, soloAdministrador } = require('../middlewares/autenticacion');
const {
  obtenerMaquinas, crearMaquina, actualizarMaquina,
  eliminarMaquina, apagarMaquina, ejecutarAplicacion,
} = require('../controllers/maquinaController');

// GET    /api/maquinas            — Listar máquinas
router.get('/',    verificarToken, obtenerMaquinas);

// POST   /api/maquinas            — Registrar máquina
router.post('/',   verificarToken, soloAdministrador, crearMaquina);

// PUT    /api/maquinas/:id        — Actualizar máquina
router.put('/:id', verificarToken, soloAdministrador, actualizarMaquina);

// DELETE /api/maquinas/:id        — Eliminar máquina
router.delete('/:id', verificarToken, soloAdministrador, eliminarMaquina);

// POST   /api/maquinas/:id/apagar   — Apagar PC remotamente
router.post('/:id/apagar',   verificarToken, soloAdministrador, apagarMaquina);

// POST   /api/maquinas/:id/ejecutar — Ejecutar app en PC remota
router.post('/:id/ejecutar', verificarToken, soloAdministrador, ejecutarAplicacion);

module.exports = router;
