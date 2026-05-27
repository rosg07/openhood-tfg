import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import FormularioReparacion from '../components/FormularioReparacion';
import FormularioPresupuesto from '../components/FormularioPresupuesto';

const HistorialVehiculo = () => {
  const { matricula } = useParams();
  const [historial, setHistorial] = useState([]);
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de Modales
  const [modalCrearReparacionOpen, setModalCrearReparacionOpen] = useState(false);
  const [modalActualizarReparacion, setModalActualizarReparacion] = useState(null);
  const [modalPresupuestoOpen, setModalPresupuestoOpen] = useState(false);
  const [modalActualizarPresupuesto, setModalActualizarPresupuesto] = useState(null);
  const [reparacionIdActiva, setReparacionIdActiva] = useState(null);
  
  // Estados de Borrado
  const [reparacionABorrar, setReparacionABorrar] = useState(null);
  const [presupuestoABorrar, setPresupuestoABorrar] = useState(null);
  
  // Estados de IA y Errores
  const [analizandoId, setAnalizandoId] = useState(null);
  const [modalIA, setModalIA] = useState({ isOpen: false, contenido: '' });
  const [modalError, setModalError] = useState({ isOpen: false, mensaje: '' });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resReparaciones = await api.get(`/reparaciones/vehiculo/${matricula}`);
        setHistorial(resReparaciones.data);

        const resVehiculo = await api.get(`/vehiculos/${matricula}`);
        setVehiculo(resVehiculo.data);

      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la información del vehículo.');
      } finally {
        setLoading(false);
      }
    };

    if (matricula) cargarDatos();
  }, [matricula]);

  const analizarPresupuesto = async (presupuestoId) => {
    setAnalizandoId(presupuestoId);
    try {
      const response = await api.get(`/comparador/${presupuestoId}/analizar`);
      setModalIA({ isOpen: true, contenido: response.data.veredicto_ia });
    } catch (error) {
      console.error("Error al analizar. Contacta con soporte técnico", error);
      setModalError({ 
        isOpen: true, 
        mensaje: "El perito está descansando ahora mismo. Por favor, inténtalo de nuevo en unos minutos." 
      });
    } finally {
      setAnalizandoId(null);
    }
  };

  const confirmarBorrado = async () => {
    if (!reparacionABorrar) return;
    try {
      await api.delete(`/reparaciones/${reparacionABorrar}`);
      setHistorial(historial.filter(reparacion => reparacion.id !== reparacionABorrar));
      setReparacionABorrar(null);
    } catch (error) {
      console.error("Error al borrar:", error);
      setModalError({ isOpen: true, mensaje: "Hubo un error al intentar borrar la reparación." });
    }
  };

  const confirmarBorradoPresupuesto = async () => {
    if (!presupuestoABorrar) return;
    try {
      await api.delete(`/presupuestos/${presupuestoABorrar}`);
      setHistorial(historial.map(rep => {
          if (rep.presupuesto?.id === presupuestoABorrar) {
              return { ...rep, presupuesto: null };
          }
          return rep;
      }));
      setPresupuestoABorrar(null);
    } catch (error) {
      console.error("Error al borrar presupuesto:", error);
      setModalError({ isOpen: true, mensaje: "Hubo un error al intentar borrar el presupuesto." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-[#00B4D8] rounded-full animate-bounce mb-4"></div>
          <p className="text-[#1A365D] font-bold">Cargando el historial de tu vehículo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] p-4 sm:p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <Link 
          to="/vehiculos" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#00B4D8] mb-6 transition-colors font-bold text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver a mis vehículos
        </Link>
        
        {/* CABECERA */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#00B4D8] mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A365D]">Historial del Vehículo</h1>
            {vehiculo && (
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="font-bold text-gray-700">{vehiculo.marca} {vehiculo.modelo}</span>
                <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded text-sm font-mono border border-gray-200">{matricula}</span>
                <span className="text-gray-500 text-sm">{vehiculo.kilometraje.toLocaleString()} Km</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => {
                setModalActualizarReparacion(null);
                setModalCrearReparacionOpen(true); 
            }}
            className="w-full sm:w-auto bg-[#00B4D8] text-white px-5 py-3 rounded-xl font-bold hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
            </svg>
            Nueva Reparación
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium">{error}</div>}

        {/* LISTA DE REPARACIONES */}
        {historial.length > 0 ? (
          <div className="space-y-6">
            {historial.map((reparacion) => (
              <div key={reparacion.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#00B4D8]/30 transition-colors group">
                
                {/* INFO REPARACIÓN */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 border-b border-gray-50 pb-6">
                  <div>
                    <span className="text-xs font-bold text-[#1A365D] bg-[#e6f7fa] border border-[#00B4D8]/20 px-3 py-1.5 rounded-lg inline-block mb-3">
                      📅 {new Date(reparacion.fecha).toLocaleDateString()}
                    </span>
                    <h3 className="text-xl font-bold text-[#1A365D] group-hover:text-[#00B4D8] transition-colors">{reparacion.descripcion}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">📍 {reparacion.taller_nombre}</span>
                      <span>•</span>
                      <span>🛣️ {reparacion.kilometraje_momento.toLocaleString()} km</span>
                    </div>
                  </div>

                  {/* BOTONES REPARACIÓN */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                          setModalActualizarReparacion(reparacion); 
                          setModalCrearReparacionOpen(true);
                      }} 
                      className="p-2.5 text-gray-400 hover:text-[#00B4D8] hover:bg-[#e6f7fa] rounded-xl transition-all"  
                      title="Editar Reparación"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => setReparacionABorrar(reparacion.id)} 
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" 
                      title="Borrar Reparación"
                    >
                      <svg className="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/>
                        <path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* CAJA DE PRESUPUESTO */}
                <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {reparacion.presupuesto ? (
                        <>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Coste Total</p>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-3xl font-black text-[#1A365D]">
                                    {reparacion.presupuesto.importe_total.toLocaleString()}€
                                  </span>
                                  <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">IVA incl.</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                <button onClick={() => {
                                    setReparacionIdActiva(reparacion.id);
                                    setModalActualizarPresupuesto(reparacion.presupuesto);
                                    setModalPresupuestoOpen(true);
                                }} className="p-2 text-gray-400 hover:text-[#00B4D8] hover:bg-[#e6f7fa] rounded-lg transition-colors border border-transparent hover:border-[#00B4D8]/20" title="Editar Presupuesto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button 
                                  onClick={() => setPresupuestoABorrar(reparacion.presupuesto.id)} 
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                                  title="Borrar Presupuesto"
                                >
                                  <svg className="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3,6 5,6 21,6"/>
                                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                      <path d="M10 11v6"/>
                                      <path d="M14 11v6"/>
                                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                  </svg>
                                </button>
                                <button 
                                    onClick={() => analizarPresupuesto(reparacion.presupuesto.id)}
                                    disabled={analizandoId === reparacion.presupuesto.id}
                                    className={`flex items-center justify-center gap-2 text-sm px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex-1 sm:flex-none ml-0 sm:ml-2
                                        ${analizandoId === reparacion.presupuesto.id 
                                          ? 'bg-gray-200 text-gray-500 cursor-wait' 
                                          : 'bg-linear-to-r from-[#1A365D] to-[#00B4D8] text-white hover:opacity-90 hover:shadow-md hover:-translate-y-0.5'}`}
                                >
                                    {analizandoId === reparacion.presupuesto.id ? (
                                      <> <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div> Analizando... </>
                                    ) : (
                                      <> ⚖️ Peritación IA </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                            <span className="text-gray-500 text-sm">Aún no has añadido detalles financieros a esta reparación.</span>
                            <button 
                                onClick={() => {
                                    setReparacionIdActiva(reparacion.id);
                                    setModalActualizarPresupuesto(null);
                                    setModalPresupuestoOpen(true);
                                }}
                                className="w-full sm:w-auto bg-white border-2 border-dashed border-gray-300 text-gray-600 px-5 py-2 rounded-xl hover:border-[#00B4D8] hover:text-[#00B4D8] transition-colors font-bold text-sm"
                            >
                                + Adjuntar Presupuesto
                            </button>
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-dashed border-gray-200 text-center flex flex-col items-center">
            <span className="text-5xl mb-4">🔧</span>
            <h3 className="text-xl font-bold text-[#1A365D] mb-2">Historial inmaculado</h3>
            <p className="text-gray-500 mb-6">Aún no has registrado ninguna reparación para este vehículo. ¡Mantén un buen registro para cuidar su valor!</p>
            <button 
              onClick={() => {
                  setModalActualizarReparacion(null);
                  setModalCrearReparacionOpen(true); 
              }}
              className="text-[#00B4D8] font-bold hover:text-[#1A365D] transition-colors"
            >
              + Añadir primera reparación
            </button>
          </div>
        )}
      </div>

      {/* --- MODALES --- */}

      {/* MODAL DE PERITACIÓN IA*/}
      {modalIA.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100">
                <div className="bg-linear-to-r from-[#1A365D] to-[#00B4D8] p-5 flex justify-between items-center text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <span>⚖️</span> Veredicto del Perito IA
                    </h3>
                    <button onClick={() => setModalIA({ isOpen: false, contenido: '' })} className="text-white hover:text-gray-200 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                    {modalIA.contenido}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
                    <button 
                      onClick={() => setModalIA({ isOpen: false, contenido: '' })}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      Cerrar informe
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* FORMULARIOS (Se asume que ya devuelven un diseño modal correcto internamente) */}
      <FormularioReparacion 
        isOpen={modalCrearReparacionOpen} 
        onClose={() => setModalCrearReparacionOpen(false)} 
        matricula={matricula}
        reparacionAEditar={modalActualizarReparacion} 
        onSuccess={() => window.location.reload()}
      />

      <FormularioPresupuesto 
        isOpen={modalPresupuestoOpen} 
        onClose={() => setModalPresupuestoOpen(false)} 
        reparacionId={reparacionIdActiva}
        presupuestoAEditar={modalActualizarPresupuesto} 
        onSuccess={() => window.location.reload()}
      />

      {/* MODAL DE CONFIRMACIÓN DE BORRADO DE REPARACIÓN */}
      {reparacionABorrar && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden text-center p-6 border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#1A365D] mb-2">¿Eliminar reparación?</h3>
            <p className="text-gray-500 mb-6 text-sm px-2">
              Esta acción no se puede deshacer. Se eliminarán permanentemente los datos de la avería.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setReparacionABorrar(null)}
                className="px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-bold w-full"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarBorrado}
                className="px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all font-bold w-full shadow-sm hover:-translate-y-0.5"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE BORRADO DE PRESUPUESTO */}
      {presupuestoABorrar && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden text-center p-6 border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#1A365D] mb-2">¿Eliminar presupuesto?</h3>
            <p className="text-gray-500 mb-6 text-sm px-2">
              Esta acción no se puede deshacer. Se eliminarán los datos financieros asociados a esta reparación.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setPresupuestoABorrar(null)}
                className="px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-bold w-full"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarBorradoPresupuesto}
                className="px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all font-bold w-full shadow-sm hover:-translate-y-0.5"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ERROR */}
      {modalError.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden text-center p-6 border border-gray-100">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-red-100">
              <span className="text-3xl">❌</span>
            </div>
            <h3 className="text-2xl font-bold text-[#1A365D] mb-2">Error</h3>
            <p className="text-gray-600 mb-6">{modalError.mensaje}</p>
            <button 
              onClick={() => setModalError({ isOpen: false, mensaje: '' })}
              className="w-full py-3 bg-[#1A365D] text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-sm hover:-translate-y-0.5"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default HistorialVehiculo;