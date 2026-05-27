const express = require('express');
const cors = require('cors');
require('dotenv').config();

// IMPORTACIONES con require (estilo antiguo)
const chatRoutes = require('./routes/chat.routes');
const reparacionesRoutes = require('./routes/reparaciones.routes');
const presupuestosRoutes = require('./routes/presupuestos.routes');
const comparadorIARoutes = require('./routes/comparadorIA.routes');
const authRoutes = require('./routes/auth.routes');
const vehiculoRoutes = require('./routes/vehiculo.routes');
const foroRoutes = require('./routes/foro.routes');
const tallerRoutes = require('./routes/talleres.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// RUTAS
app.get('/', (req, res) => res.send('¡API de OpenHood funcionando en modo CommonJS!'));

app.use('/api/reparaciones', reparacionesRoutes);
app.use('/api/presupuestos', presupuestosRoutes);
app.use('/api/comparador', comparadorIARoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/foro', foroRoutes);
app.use('/api/talleres', tallerRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});