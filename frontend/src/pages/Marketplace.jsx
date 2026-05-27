import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const res = await api.get('/vehiculos/marketplace');
        setVehiculos(res.data);
      } catch (error) {
        console.error("Error al cargar marketplace:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  // Estado de carga coherente con el resto de la app
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-[#00B4D8] rounded-full animate-bounce mb-4"></div>
          <p className="text-[#1A365D] font-bold">Cargando catálogo de vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] p-4 sm:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#00B4D8] mb-8">
          <h1 className="text-3xl font-bold text-[#1A365D]">Marketplace</h1>
          <p className="text-gray-500 mt-1">Encuentra el vehículo perfecto o piezas de segunda mano en tu comunidad.</p>
        </div>
        
        {vehiculos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehiculos.map((v) => (
              <div 
                key={v.matricula} 
                onClick={() => navigate(`/historial/${v.matricula}`)} // Asegúrate de que la ruta coincida con tu App.jsx
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-[#00B4D8]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* CONTENEDOR DE IMAGEN */}
                <div className="h-52 bg-gray-50 overflow-hidden relative border-b border-gray-100">
                  {v.fotoUrl ? (
                    <img 
                      src={`http://localhost:3000${v.fotoUrl}`} 
                      alt={v.marca} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-sm font-medium">Sin foto</span>
                    </div>
                  )}
                  {/* Badge flotante para indicar que está en venta */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1A365D] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    En venta
                  </div>
                </div>
                
                {/* CONTENIDO DE LA TARJETA */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-[#1A365D] group-hover:text-[#00B4D8] transition-colors line-clamp-1">
                    {v.marca} {v.modelo}
                  </h2>
                  <p className="text-2xl font-black text-[#00B4D8] my-2">
                    {v.precio ? `${v.precio.toLocaleString()} €` : 'Consultar'}
                  </p>
                  
                  {/* Badges de características */}
                  <div className="flex gap-2 mb-4 mt-1">
                    <span className="bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono">
                      {v.anio}
                    </span>
                    <span className="bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono">
                      {v.kilometraje.toLocaleString()} km
                    </span>
                  </div>
                  
                  {/* SECCIÓN DEL VENDEDOR Y BOTÓN */}
                  <div className="mt-auto border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Vendedor:</p>
                      <p className="font-semibold text-gray-700 text-sm truncate ml-2">{v.usuario.nombre}</p>
                    </div>
                    
                    {/* Botón de WhatsApp */}
                    <a 
                      href={`https://wa.me/${v.usuario.telefono?.replace(/\s+/g, '')}?text=${encodeURIComponent(`Hola, me interesa el ${v.marca} ${v.modelo} que he visto en OpenHood.`)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 px-3 rounded-xl hover:bg-[#20bd5a] transition-all text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.591 5.52 0 10.002-4.48 10.002-10.003 0-5.523-4.482-10.003-10.002-10.003-5.522 0-10.002 4.48-10.002 10.003 0 2.054.599 4.015 1.724 5.736l-1.127 4.116 4.159-1.091zm11.187-7.464c-.08-.135-.292-.211-.513-.323-.223-.112-1.32-.652-1.524-.726-.205-.074-.354-.112-.503.112-.149.224-.577.726-.707.876-.129.15-.259.168-.482.056-.224-.112-.947-.349-1.803-1.114-.666-.594-1.116-1.327-1.247-1.551-.132-.224-.014-.346.098-.458.101-.1.224-.261.336-.392.112-.131.149-.224.224-.374.075-.149.037-.281-.018-.392-.056-.112-.503-1.213-.69-1.662-.182-.437-.367-.377-.503-.384-.13-.007-.279-.009-.429-.009-.15 0-.393.056-.599.28-.206.224-.784.766-.784 1.868s.801 2.172.912 2.321c.112.149 1.572 2.401 3.804 3.369.531.229.946.366 1.27.469.534.17 1.02.146 1.403.089.428-.064 1.32-.54 1.506-1.062.185-.522.185-.968.13-1.062-.056-.094-.206-.15-.486-.285z"/>
                      </svg>
                      Contactar por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-dashed border-gray-200 text-center flex flex-col items-center max-w-2xl mx-auto mt-10">
            <span className="text-5xl mb-4">🛒</span>
            <h3 className="text-xl font-bold text-[#1A365D] mb-2">No hay vehículos en venta</h3>
            <p className="text-gray-500">Actualmente no hay ningún vehículo publicado en el Marketplace. Vuelve más tarde o pon el tuyo a la venta desde la sección de "Mis Vehículos".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;