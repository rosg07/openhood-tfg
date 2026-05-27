const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, obtenerPerfil , actualizarPerfil } = require('../controllers/auth.controller');
const verificarToken = require('../middlewares/auth.middleware'); // Importamos el guardián

// Rutas públicas
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

// Ruta protegida
router.get('/me', verificarToken, obtenerPerfil);
router.put('/me', verificarToken, actualizarPerfil);
module.exports = router;
