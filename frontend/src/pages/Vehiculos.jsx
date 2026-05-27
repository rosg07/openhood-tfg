import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import FormularioVehiculo from '../components/FormularioVehiculo';
import ModalPublicar from '../components/ModalPublicar';
import ModalDespublicar from '../components/ModalDespublicar';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [vehiculoAEditar, setVehiculoAEditar] = useState(null);
  const [matriculaABorrar, setMatriculaABorrar] = useState(null);
  const [errorBorrado, setErrorBorrado] = useState('');
  
  const [publicarModalOpen, setPublicarModalOpen] = useState(false);
  const [despublicarModalOpen, setDespublicarModalOpen] = useState(false);

  const fetchVehiculos = async () => {
    try {
      const res = await api.get('/vehiculos');
      setVehiculos(res.data);
    } catch (error) {
      console.error("Error al cargar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehiculos(); }, []);

  const confirmarBorradoVehiculo = async () => {
    if (!matriculaABorrar) return;
    setErrorBorrado('');
    try {
      await api.delete(`/vehiculos/${matriculaABorrar}`);
      fetchVehiculos();
      setMatriculaABorrar(null);
    } catch (err) {
      // Sustituimos el alert() nativo por un estado
      setErrorBorrado(err.response?.data?.mensaje || "No se pudo eliminar el vehículo.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-[#00B4D8] rounded-full animate-bounce mb-4"></div>
          <p className="text-[#1A365D] font-bold">Cargando tu garaje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] p-4 sm:p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        
        {/* CABECERA Y GRUPO DE BOTONES */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#00B4D8] mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1A365D]">Mis Vehículos</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Gestiona tu flota, mantenimientos e historial</p>
          </div>
          
          {/* Contenedor flexible para alinear los 3 botones */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            
            {/* Botón Publicar (Secundario) */}
            <button 
              onClick={() => setPublicarModalOpen(true)} 
              className="w-full sm:w-auto bg-[#e6f7fa] text-[#00B4D8] border border-[#00B4D8]/20 px-4 py-2.5 rounded-xl font-bold hover:bg-[#00B4D8] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>🏷️</span> Publicar Anuncio
            </button>
            
            {/* Botón Retirar (Destructivo suave) */}
            <button 
              onClick={() => setDespublicarModalOpen(true)} 
              className="w-full sm:w-auto bg-red-50 text-red-600 border border-red-100 px-4 py-2.5 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>🛑</span> Retirar Anuncio
            </button>

            {/* Botón Nuevo (Primario - Llamada a la acción) */}
            <button 
              onClick={() => { setVehiculoAEditar(null); setModalOpen(true); }} 
              className="w-full sm:w-auto bg-[#00B4D8] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
              </svg>
              Nuevo Vehículo
            </button>
          </div>
        </div>

        {/* LISTA DE VEHÍCULOS */}
        <div className="grid gap-4">
          {vehiculos.length > 0 ? vehiculos.map((v) => (
            <div key={v.matricula} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between group hover:border-[#00B4D8] hover:shadow-md hover:-translate-y-1 transition-all gap-4">
              
              <Link to={`/historial/${v.matricula}`} className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full text-center sm:text-left">
                {/* FOTO */}
                <div className="w-24 h-24 sm:w-20 sm:h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 group-hover:border-[#00B4D8]/30 transition-colors relative">
                  {v.enVenta && (
                     <span className="absolute top-0 right-0 bg-[#00B4D8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg z-10 shadow-sm">
                       En Venta
                     </span>
                  )}
                  {v.fotoUrl ? (
                    <img 
                      src={`http://localhost:3000${v.fotoUrl}`} 
                      alt={v.marca} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* INFO */}
                <div className="flex flex-col justify-center h-full">
                  <h3 className="font-bold text-xl text-[#1A365D] group-hover:text-[#00B4D8] transition-colors">{v.marca} {v.modelo}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono text-xs mr-2">{v.matricula}</span>
                    {v.kilometraje} km
                  </p>
                </div>
              </Link>
              
              {/* BOTONES */}
              <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end border-t border-gray-50 sm:border-t-0 pt-4 sm:pt-0">
                <button 
                  onClick={() => { setVehiculoAEditar(v); setModalOpen(true); }} 
                  className="p-2.5 text-gray-400 hover:text-[#00B4D8] hover:bg-[#e6f7fa] rounded-xl transition-colors"
                  title="Editar vehículo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => setMatriculaABorrar(v.matricula)} 
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Eliminar vehículo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/>
                    <path d="M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          )) : (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-dashed border-gray-200 text-center flex flex-col items-center">
              <span className="text-4xl mb-3">🚗</span>
              <h3 className="text-lg font-bold text-[#1A365D] mb-1">Tu garaje está vacío</h3>
              <p className="text-gray-500 mb-4">Añade tu primer vehículo para empezar a llevar su registro.</p>
              <button 
                onClick={() => { setVehiculoAEditar(null); setModalOpen(true); }}
                className="text-[#00B4D8] font-bold hover:text-cyan-600 transition-colors"
              >
                + Añadir vehículo
              </button>
            </div>
          )}
        </div>

        {/* MODALES EXTERNOS */}
        <FormularioVehiculo 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          vehiculoAEditar={vehiculoAEditar} 
          onSuccess={fetchVehiculos} 
        />
        <ModalPublicar 
          isOpen={publicarModalOpen} 
          onClose={() => setPublicarModalOpen(false)}
          vehiculos={vehiculos}
          onSuccess={fetchVehiculos} 
        />
        <ModalDespublicar 
          isOpen={despublicarModalOpen} 
          onClose={() => setDespublicarModalOpen(false)}
          vehiculos={vehiculos}
          onSuccess={fetchVehiculos} 
        />

        {/* MODAL DE BORRADO INTEGRADO */}
        {matriculaABorrar && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-gray-100 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1A365D] mb-2">¿Eliminar vehículo?</h3>
              <p className="text-gray-500 mb-6 text-sm">Esta acción es irreversible y borrará todo el historial asociado a este coche.</p>
              
              {/* Nuevo: Integración del error en el modal de borrado */}
              {errorBorrado && (
                 <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm mb-4">
                   {errorBorrado}
                 </div>
              )}
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => { setMatriculaABorrar(null); setErrorBorrado(''); }} 
                  className="px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl w-full hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmarBorradoVehiculo} 
                  className="px-4 py-3 text-white bg-red-600 font-bold rounded-xl w-full hover:bg-red-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehiculos;