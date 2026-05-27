const express = require('express');
const router = express.Router();
// Importamos el controlador completo
const chatController = require('../controllers/chat.controller');

// Ahora chatController es un objeto que contiene todas las funciones
router.post('/', chatController.handleChat);
router.get('/history/:usuarioId', chatController.getChatHistory);
router.get('/vehicles/:usuarioId', chatController.getUserVehicles);

module.exports = router;