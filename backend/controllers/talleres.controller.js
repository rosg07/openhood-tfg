const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');


const recomendarTaller = async (req, res) => {
  const { nombre, direccion, telefono, email, descripcion } = req.body;

  try {
    // 1. Geocodificación: Convertimos la dirección que escribe el usuario en coordenadas
    const geoRes = await axios.get(
  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`,
  {
    headers: {
      // Ponemos un nombre que identifique el proyecto
      'User-Agent': 'OpenHood-TFG/1.0 (proyecto-academico)' 
    }
  }
);
    
    if (geoRes.data.length === 0) {
      return res.status(400).json({ error: "No hemos podido ubicar esa dirección en el mapa. Intenta ser más específico." });
    }

    const latitud = parseFloat(geoRes.data[0].lat);
    const longitud = parseFloat(geoRes.data[0].lon);

    // 2. Guardamos el taller en la base de datos
    const nuevoTaller = await prisma.taller.create({
      data: {
        nombre,
        direccion,
        latitud,
        longitud,
        telefono: telefono || null,
        descripcion: descripcion || null,
        email:email || null,
      }
    });

    res.status(201).json(nuevoTaller);
  } catch (error) {
    console.error("Error al recomendar taller:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

const getTalleres = async (req, res) => {
  try {
    const talleres = await prisma.taller.findMany();
    res.json(talleres);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los talleres" });
  }
};

const getTalleresCercanos = async (req, res) => {
  const { lat, lng, radio = 10 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitud y longitud son requeridas" });
  }

  try {
    const todos = await prisma.taller.findMany();
    const cercanos = todos.filter(taller => {
      const R = 6371;
      const dLat = (taller.latitud - lat) * (Math.PI / 180);
      const dLng = (taller.longitud - lng) * (Math.PI / 180);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat * (Math.PI / 180)) * Math.cos(taller.latitud * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distancia = R * c;
      return distancia <= parseFloat(radio);
    });
    res.json(cercanos);
  } catch (error) {
    res.status(500).json({ error: "Error al calcular cercanía" });
  }
};

const createTaller = async (req, res) => {
  const { nombre, direccion, latitud, longitud, telefono, email, descripcion } = req.body;
  try {
    const nuevoTaller = await prisma.taller.create({
      data: {
        nombre,
        direccion,
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        telefono,
        email,
        descripcion
      }
    });
    res.status(201).json(nuevoTaller);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el taller" });
  }
};

// Exportación con CommonJS
module.exports = {
  getTalleres,
  getTalleresCercanos,
  createTaller,
  recomendarTaller
};