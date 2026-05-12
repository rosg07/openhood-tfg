// Ayudante para fechas del foro

export const tiempoRelativo = (fechaISO) => {
  const ahora = new Date();
  const tiempo = new Date(fechaISO);
  const diferenciaMs = ahora - tiempo;

  const segundos = Math.floor(diferenciaMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (segundos < 60) return 'Hace unos segundos';
  if (minutos < 60) return `Hace ${minutos} min`;
  if (horas < 24) return `Hace ${horas} h`;
  if (dias === 1) return 'Ayer';
  if (dias < 7) return `Hace ${dias} días`;

  return tiempo.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};
