const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const obtenerResumenDashboard = async (req, res) => {
    try {
        const usuarioId = parseInt(req.user.id); 

        // 1. Gastos Totales
        const gastos = await prisma.presupuesto.aggregate({
            _sum: { importe_total: true },
            where: { reparacion: { vehiculo: { usuarioId: usuarioId } } },
        });

        // 2. Reparaciones Totales
        const reparacionesTotales = await prisma.reparacion.count({
            where: { vehiculo: { usuarioId: usuarioId } }
        });

        // --- DEFINIMOS LAS FECHAS UNA SOLA VEZ AQUÍ ---
        const anioActual = new Date().getFullYear();
        const haceUnAnio = new Date();
        haceUnAnio.setFullYear(haceUnAnio.getFullYear() - 1);

        // 3. Reparaciones en el último año
        const reparacionesUltimoAnio = await prisma.reparacion.count({
            where: {
                vehiculo: { usuarioId: usuarioId },
                fecha: { gte: haceUnAnio } 
            }
        });

        // 4. Alertas Inteligentes (Diferenciadas por edad)
        const vehiculosConAlerta = await prisma.vehiculo.findMany({
            where: {
                usuarioId: usuarioId,
                OR: [
                    { 
                        // Coches con 0 reparaciones, pero que ya tienen al menos 1 año
                        reparaciones: { none: {} },
                        anio: { lt: anioActual } 
                    },
                    { 
                        // Coches cuya última reparación fue hace más de un año
                        reparaciones: { 
                            some: {}, 
                            every: { fecha: { lt: haceUnAnio } } 
                        } 
                    }
                ]
            },
            select: { matricula: true, marca: true, modelo: true, anio: true }
        });

        res.json({
            gastosTotales: parseFloat(gastos._sum.importe_total || 0).toFixed(2),
            reparacionesTotales,
            reparacionesUltimoAnio,
            alertas: vehiculosConAlerta
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { obtenerResumenDashboard };