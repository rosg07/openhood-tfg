import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tiempoRelativo } from '../utils/DateUtils';
import api from '../services/api';

const TemaDetalle = () => {
  const { id } = useParams(); // Sacamos el ID de la URL
  const [tema, setTema] = useState(null);
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');
  const [loading, setLoading] = useState(true);

  const cargarTema = async () => {
    try {
      const response = await api.get(`/foro/temas/${id}`);
      setTema(response.data);
    } catch (error) {
      console.error("Error al cargar el tema:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTema();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaRespuesta.trim()) return;

    try {
      // Igual que antes, sacamos el ID del usuario logueado
      const usuarioActivoId = localStorage.getItem('usuarioId') || 1; 

      await api.post(`/foro/temas/${id}/respuestas`, {
        contenido: nuevaRespuesta,
        usuarioId: usuarioActivoId
      });
      
      setNuevaRespuesta('');
      cargarTema(); // Recargamos para ver nuestro nuevo comentario
    } catch (error) {
      console.error("Error al responder:", error);
      alert("Error al publicar la respuesta");
    }
  };

  // Función para crear un avatar con la primera letra del nombre
  const Avatar = ({ nombre }) => {
    const inicial = nombre ? nombre.charAt(0).toUpperCase() : '?';
    return (
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
        {inicial}
      </div>
    );
  };

  if (loading) return <div className="text-center mt-20 animate-pulse">Cargando hilo...</div>;
  if (!tema) return <div className="text-center mt-20">Tema no encontrado.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      
      {/* Botón Volver */}
      <Link to="/foro" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver al foro
      </Link>

      {/* POST PRINCIPAL */}
      <div className="bg-white p-4 md:p-10 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide bg-blue-100 text-blue-700 mb-4 inline-block">
          {tema.categoria}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-montserrat mb-6">{tema.titulo}</h1>
        
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
          <Avatar nombre={tema.usuario?.nombre} />
          <div>
            <p className="font-semibold text-gray-800">{tema.usuario?.nombre || 'Usuario'}</p>
            <p className="text-sm text-gray-500">{tiempoRelativo(tema.fecha_creacion)}</p>
          </div>
        </div>
        
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{tema.contenido}</p>
      </div>

      {/* RESPUESTAS */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">
          Respuestas ({tema.respuestas?.length || 0})
        </h3>
        
        <div className="space-y-4">
          {tema.respuestas?.map((resp) => (
            <div key={resp.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex gap-4">
              <Avatar nombre={resp.usuario?.nombre} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800">{resp.usuario?.nombre}</span>
                  <span className="text-sm text-gray-400">• {tiempoRelativo(resp.fecha_creacion)}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{resp.contenido}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAJA DE NUEVA RESPUESTA */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">Escribe tu respuesta</h4>
        <form onSubmit={handleSubmit}>
          <textarea 
            rows="4" 
            required
            value={nuevaRespuesta}
            onChange={(e) => setNuevaRespuesta(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none bg-white mb-3"
            placeholder="Aporta tu experiencia o soluciona la duda..."
          ></textarea>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm">
              Publicar respuesta
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default TemaDetalle;