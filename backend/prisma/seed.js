// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el seeding...');

  // Limpiar datos existentes para evitar duplicados al re-ejecutar
  await prisma.taller.deleteMany();

  const talleres = [
    {
      nombre: "Talleres Castellana",
      direccion: "Paseo de la Castellana, 100, Madrid",
      latitud: 40.4411,
      longitud: -3.6914,
      telefono: "910000001",
      email: "info@castellana.com",
      descripcion: "Mecánica general y revisiones oficiales."
    },
    {
      nombre: "AutoBox Retiro",
      direccion: "Calle de Alcalá, 150, Madrid",
      latitud: 40.4233,
      longitud: -3.6765,
      telefono: "910000002",
      email: "contacto@autobox.com",
      descripcion: "Especialistas en neumáticos y frenos."
    },
    {
      nombre: "Mecánica Facun Pro",
      direccion: "Plaza Mayor, 1, Madrid",
      latitud: 40.4154,
      longitud: -3.7074,
      telefono: "910000003",
      email: "facun@tfg.com",
      descripcion: "Tu taller de confianza para el TFG."
    }
  ];

  for (const taller of talleres) {
    const created = await prisma.taller.create({
      data: taller,
    });
    console.log(`Taller creado: ${created.nombre}`);
  }

  console.log('Seeding finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });