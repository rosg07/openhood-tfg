import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tiempoRelativo } from '../utils/DateUtils';  
import api from '../services/api';

const Foro = () => {
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Estado para saber qué filtro está activo
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  
  const [nuevoTema, setNuevoTema] = useState({
    titulo: '',
    contenido: '',
    categoria: 'General'
  });

  const cargarTemas = async () => {
    try {
      const response = await api.get('/foro/temas');
      setTemas(response.data);
    } catch (error) {
      console.error("Error al cargar el foro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTemas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuarioActivoId = localStorage.getItem('usuarioId'); 
      await api.post('/foro/temas', {
        ...nuevoTema,
        usuarioId: usuarioActivoId
      });
      
      setModalOpen(false);
      setNuevoTema({ titulo: '', contenido: '', categoria: 'General' });
      cargarTemas();
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Hubo un error al publicar el tema.");
    }
  };

  // Colores suavizados y adaptados a la marca para las etiquetas
  const getBadgeColor = (categoria) => {
    switch(categoria) {
      case 'Mecánica': return 'bg-red-50 text-red-600 border border-red-100';
      case 'Presupuestos': return 'bg-green-50 text-green-600 border border-green-100';
      case 'General': return 'bg-[#e6f7fa] text-[#00B4D8] border border-[#00B4D8]/20';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const temasFiltrados = filtroActivo === 'Todos' 
    ? temas 
    : temas.filter(tema => tema.categoria === filtroActivo);

  const categoriasFiltro = ['Todos', 'General', 'Mecánica', 'Presupuestos'];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-[#00B4D8] rounded-full animate-bounce mb-4"></div>
          <p className="text-[#1A365D] font-bold">Cargando la comunidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] p-4 sm:p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        
        {/* CABECERA */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#00B4D8] mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A365D]">Comunidad OpenHood</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Comparte dudas, presupuestos y experiencias con otros conductores.</p>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto bg-[#00B4D8] text-white px-5 py-3 rounded-xl font-bold hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
            </svg>
            Nuevo Tema
          </button>
        </div>

        {/* BARRA DE FILTROS VISUALES */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
          {categoriasFiltro.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltroActivo(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                filtroActivo === cat 
                  ? 'bg-[#1A365D] text-white shadow-md -translate-y-0.5' 
                  : 'bg-white text-gray-500 hover:text-[#1A365D] hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LISTADO DE TEMAS */}
        {temasFiltrados.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-dashed border-gray-200 text-center flex flex-col items-center mt-6">
            <span className="text-5xl mb-4">💬</span>
            <h3 className="text-xl font-bold text-[#1A365D] mb-2">Aún no hay temas aquí</h3>
            <p className="text-gray-500 mb-4">No se han encontrado conversaciones en esta categoría.</p>
            {filtroActivo === 'Todos' && (
              <button onClick={() => setModalOpen(true)} className="text-[#00B4D8] font-bold hover:text-cyan-600 transition-colors">
                ¡Sé el primero en preguntar algo!
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {temasFiltrados.map((tema) => (
              <Link to={`/foro/tema/${tema.id}`} key={tema.id} className="block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#00B4D8]/30 transition-all group cursor-pointer">
                <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider ${getBadgeColor(tema.categoria)}`}>
                      {tema.categoria}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">
                      Publicado por <span className="text-gray-700">{tema.usuario?.nombre || 'Usuario'}</span> • {tiempoRelativo(tema.fecha_creacion)}
                    </span>
                  </div>
                  
                  {/* Contador de respuestas destacado */}
                  <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-[#00B4D8] transition-colors bg-gray-50 group-hover:bg-[#e6f7fa] px-3 py-1.5 rounded-lg border border-gray-100 group-hover:border-[#00B4D8]/20 self-start">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span className="text-sm font-bold">{tema._count?.respuestas || 0}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#1A365D] mt-1 group-hover:text-[#00B4D8] transition-colors">{tema.titulo}</h3>
                <p className="text-gray-500 mt-2 line-clamp-2 text-sm leading-relaxed">{tema.contenido}</p>
              </Link>
            ))}
          </div>
        )}

        {/* MODAL CREAR TEMA */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 p-6 sm:p-8">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#1A365D] m-0">Crear nuevo tema</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Título de tu consulta</label>
                  <input 
                    type="text" required maxLength="100"
                    value={nuevoTema.titulo}
                    onChange={(e) => setNuevoTema({...nuevoTema, titulo: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
                    placeholder="Ej: Ruido extraño al frenar..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                  <select 
                    value={nuevoTema.categoria}
                    onChange={(e) => setNuevoTema({...nuevoTema, categoria: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Mecánica">Mecánica</option>
                    <option value="Presupuestos">Presupuestos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Detalles</label>
                  <textarea 
                    required rows="5"
                    value={nuevoTema.contenido}
                    onChange={(e) => setNuevoTema({...nuevoTema, contenido: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all resize-none"
                    placeholder="Explica tu problema detalladamente para que la comunidad pueda ayudarte..."
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setModalOpen(false)} 
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-[#00B4D8] text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    Publicar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Foro;