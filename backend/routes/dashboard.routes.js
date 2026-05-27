const express = require('express');
const router = express.Router();
const { obtenerResumenDashboard } = require('../controllers/dashboard.controller');
const verificarToken = require('../middlewares/auth.middleware'); 

router.get('/resumen', verificarToken, obtenerResumenDashboard);

module.exports = router;