const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const chatbotService = require('../services/chatbot.service');

// 1. Obtener lista de vehículos del usuario
exports.getUserVehicles = async (req, res) => {
    const { usuarioId } = req.params;
    const idLimpio = usuarioId.includes(':') ? usuarioId.split(':')[0] : usuarioId;

    try {
        const vehiculos = await prisma.vehiculo.findMany({
            where: { usuarioId: parseInt(idLimpio) }
        });
        res.json(vehiculos);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al obtener vehículos" });
    }
};

// 2. Manejar el flujo de chat (CONEXIÓN CON TALLERES)
exports.handleChat = async (req, res) => {
    // Recibimos lat y lng desde el frontend
    const { contenido, usuarioId, vehiculoMatricula, lat, lng } = req.body;

    try {
        // A. Datos del coche
        let datosCoche = null;
        if (vehiculoMatricula) {
            datosCoche = await prisma.vehiculo.findUnique({
                where: { matricula: vehiculoMatricula }
            });
        }

        // B. Búsqueda de talleres cercanos si tenemos ubicación
        let talleresCercanos = [];
        if (lat && lng) {
            talleresCercanos = await prisma.$queryRaw`
                SELECT id, nombre, direccion, telefono,
                (6371 * acos(cos(radians(${lat})) * cos(radians(latitud)) * cos(radians(longitud) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitud)))) AS distance
                FROM Taller
                HAVING distance < 50
                ORDER BY distance ASC
                LIMIT 3
            `;
        }

        // C. Historial previo
        const historialPrevio = await prisma.mensaje.findMany({
            where: { usuarioId: parseInt(usuarioId) },
            orderBy: { fecha: 'asc' },
            take: 10
        });

        // D. Guardar mensaje del usuario
        await prisma.mensaje.create({
            data: {
                contenido,
                rol: 'user',
                usuarioId: parseInt(usuarioId),
                vehiculoMatricula: vehiculoMatricula
            }
        });

        // E. Llamada al servicio de IA pasando también los TALLERES
        const respuestaIA = await chatbotService.generarRespuestaMecanico(
            historialPrevio, 
            contenido, 
            datosCoche, 
            talleresCercanos
        );

        // F. Guardar respuesta de la IA
        const mensajeAsistente = await prisma.mensaje.create({
            data: {
                contenido: respuestaIA,
                rol: 'assistant',
                usuarioId: parseInt(usuarioId),
                vehiculoMatricula: vehiculoMatricula
            }
        });

        res.status(200).json(mensajeAsistente);
    } catch (error) {
        console.error("Error en chat:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// 3. Obtener historial
exports.getChatHistory = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const historial = await prisma.mensaje.findMany({
            where: { usuarioId: parseInt(usuarioId) },
            orderBy: { fecha: 'asc' }
        });
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: "Error al cargar historial" });
    }
};