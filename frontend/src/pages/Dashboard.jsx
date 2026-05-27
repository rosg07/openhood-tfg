import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [usuario, setUsuario] = useState({ nombre: 'Conductor' });
  const [vehiculos, setVehiculos] = useState([]);
  const [indiceVehiculo, setIndiceVehiculo] = useState(0);
  const [temasRecientes, setTemasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado con las métricas traídas del backend
  const [metricas, setMetricas] = useState({
    gastosTotales: 0,
    reparacionesTotales: 0,
    reparacionesUltimoAnio: 0,
    alertas: []
  });

  useEffect(() => {
    const cargarDatosDelDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const userGuardado = localStorage.getItem('usuario');
        
        if (userGuardado) {
          setUsuario(JSON.parse(userGuardado));
        }

        const [resVehiculos, resForo, resMetricas] = await Promise.all([
          fetch('http://localhost:3000/api/vehiculos', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/api/foro/temas', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/api/dashboard/resumen', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (resVehiculos.ok) {
          const dataVehiculos = await resVehiculos.json();
          setVehiculos(dataVehiculos); 
        }

        if (resForo.ok) {
          const temas = await resForo.json();
          setTemasRecientes(temas.slice(0, 3)); 
        }

        if (resMetricas.ok) {
          const datosResumen = await resMetricas.json();
          setMetricas({
            gastosTotales: datosResumen.gastosTotales,
            reparacionesTotales: datosResumen.reparacionesTotales,
            reparacionesUltimoAnio: datosResumen.reparacionesUltimoAnio,
            alertas: datosResumen.alertas || []
          });
        }

      } catch (error) {
        console.error("Error al cargar los datos del dashboard:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosDelDashboard();
  }, []);

  const vehiculoAnterior = () => setIndiceVehiculo((prev) => (prev === 0 ? vehiculos.length - 1 : prev - 1));
  const siguienteVehiculo = () => setIndiceVehiculo((prev) => (prev === vehiculos.length - 1 ? 0 : prev + 1));

  // Acción rápida para coches de más de 3 años (Check visual)
  const marcarComoRevisado = async (matricula) => {
    try {
      const token = localStorage.getItem('token');
      
      const vehiculoObj = vehiculos.find(v => v.matricula === matricula);
      const kmActual = vehiculoObj ? vehiculoObj.kilometraje : 0;

      await fetch('http://localhost:3000/api/reparaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehiculoMatricula: matricula,
          descripcion: "Revisión visual rutinaria (Check OK)",
          kilometraje_momento: parseInt(kmActual),
          fecha: new Date().toISOString(),
          taller_nombre: "Revisión Propia (Usuario)"
        })
      });

      window.location.reload(); 
    } catch (error) {
      console.error("Error al marcar como revisado", error);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-[#00B4D8] rounded-full animate-bounce mb-4"></div>
          <p className="text-[#1A365D] font-bold">Cargando tu garaje virtual...</p>
        </div>
      </div>
    );
  }

  const vehiculoActual = vehiculos[indiceVehiculo];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] p-4 sm:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A365D]">
            ¡Hola, {usuario.nombre || 'Conductor'}! 👋
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Aquí tienes el resumen de tu flota y actividad reciente.
          </p>
        </div>

        {/* PANEL DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Métrica 1: Gastos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Inversión Total</p>
              <h3 className="text-3xl font-black text-[#1A365D]">{metricas.gastosTotales.toLocaleString()} €</h3>
              <p className="text-xs text-gray-500 mt-1">Registrado en presupuestos</p>
            </div>
            <div className="w-12 h-12 bg-[#e6f7fa] rounded-full flex items-center justify-center text-2xl">
              💶
            </div>
          </div>

          {/* Métrica 2: Actividad de Taller */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Visitas al Taller</p>
                <h3 className="text-3xl font-black text-[#00B4D8]">{metricas.reparacionesTotales}</h3>
              </div>
              <div className="w-12 h-12 bg-[#e6f7fa] border border-[#00B4D8]/20 rounded-full flex items-center justify-center text-2xl">
                🔧
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Media por vehículo</span>
                <span className="text-[#1A365D] font-bold">
                  {vehiculos.length > 0 ? (metricas.reparacionesTotales / vehiculos.length).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                <span className="text-gray-500 font-medium">En el último año</span>
                <span className={`font-bold ${metricas.reparacionesUltimoAnio > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {metricas.reparacionesUltimoAnio} {metricas.reparacionesUltimoAnio === 1 ? 'reparación' : 'reparaciones'}
                </span>
              </div>
            </div>
          </div>

          {/* Métrica 3: Estado de la Flota */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Estado de la Flota</p>
              <h3 className="text-3xl font-black text-[#1A365D]">{vehiculos.length}</h3>
              <p className="text-xs text-gray-500 mt-1">Vehículos en el garaje</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl">
              🚗
            </div>
          </div>

        </div>

        {/* BANNER DE AVISOS INTELIGENTE */}
        {metricas.alertas.length > 0 && (
          <div className="mb-8 space-y-4">
            {metricas.alertas.map(coche => {
              const anioActual = new Date().getFullYear();
              const edadCoche = anioActual - coche.anio;
              const esMenorDe3Anios = edadCoche < 3;

              return (
                <div key={coche.matricula} className={`border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all
                  ${esMenorDe3Anios ? 'bg-linear-to-r from-orange-50 to-orange-100 border-orange-200' : 'bg-linear-to-r from-blue-50 to-blue-100 border-blue-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{esMenorDe3Anios ? '⚠️' : '👀'}</span>
                    <div>
                      <h4 className={`font-bold text-lg ${esMenorDe3Anios ? 'text-orange-800' : 'text-blue-800'}`}>
                        {coche.marca} {coche.modelo} requiere atención
                      </h4>
                      <p className={`text-sm mt-1 ${esMenorDe3Anios ? 'text-orange-700' : 'text-blue-700'}`}>
                        {esMenorDe3Anios 
                          ? "Por su antigüedad (< 3 años), recuerda registrar su mantenimiento anual obligatorio." 
                          : "Lleva un tiempo sin registros en el taller. ¿Has comprobado niveles y presiones recientemente?"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    {esMenorDe3Anios ? (
                      <Link to={`/historial/${coche.matricula}`} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm text-center">
                        Registrar Mantenimiento
                      </Link>
                    ) : (
                      <button 
                        onClick={() => marcarComoRevisado(coche.matricula)}
                        className="w-full sm:w-auto bg-[#00B4D8] hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex justify-center items-center gap-2"
                      >
                        <span>✅</span> Todo en orden
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WIDGETS INFERIORES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* WIDGET: MI GARAJE */}
          <div className="bg-[#1A365D] rounded-2xl p-6 text-white shadow-lg lg:col-span-1 relative overflow-hidden flex flex-col justify-between min-h-75">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#00B4D8] rounded-full opacity-20 blur-2xl"></div>
            
            <div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h2 className="text-xl font-bold mb-1">Mi Garaje</h2>
                  
                  {vehiculos.length > 1 ? (
                    <div className="flex items-center gap-3 mt-1">
                      <button onClick={vehiculoAnterior} className="bg-white/10 hover:bg-[#00B4D8] w-6 h-6 rounded-full flex items-center justify-center transition-colors text-sm font-bold select-none">&lt;</button>
                      <span className="text-[#00B4D8] text-xs font-bold">
                        {indiceVehiculo + 1} / {vehiculos.length}
                      </span>
                      <button onClick={siguienteVehiculo} className="bg-white/10 hover:bg-[#00B4D8] w-6 h-6 rounded-full flex items-center justify-center transition-colors text-sm font-bold select-none">&gt;</button>
                    </div>
                  ) : (
                    <p className="text-[#00B4D8] text-sm">Vehículo principal</p>
                  )}
                </div>
                <span className="text-3xl">🛠️</span>
              </div>
              
              {vehiculos.length > 0 && vehiculoActual ? (
                <div className="bg-white/10 rounded-xl p-4 mb-6 relative z-10 border border-white/20">
                  <p className="text-2xl font-bold mb-1 truncate">{vehiculoActual.marca} {vehiculoActual.modelo}</p>
                  <p className="text-sm text-gray-300">Año: {vehiculoActual.año} | Km: {vehiculoActual.kilometraje.toLocaleString()}</p>
                  <p className="text-xs font-mono bg-white/20 inline-block px-2 py-0.5 rounded mt-2">{vehiculoActual.matricula}</p>
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-6 mb-6 relative z-10 border border-dashed border-white/30 text-center">
                  <p className="text-gray-300 text-sm mb-3">Aún no has registrado ningún vehículo en tu garaje.</p>
                  <Link to="/vehiculos" className="text-[#00B4D8] font-bold text-sm hover:underline">
                    + Añadir mi primer coche
                  </Link>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 relative z-10 mt-auto">
              <Link to="/vehiculos" className="w-full text-center py-2.5 bg-[#00B4D8] text-white rounded-xl font-bold hover:bg-cyan-500 transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5">
                Gestionar Garaje
              </Link>
            </div>
          </div>

          {/* WIDGET: ACTIVIDAD DEL FORO */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2 flex flex-col min-h-75">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-bold text-[#1A365D]">Trending en la Comunidad</h2>
              <Link to="/foro" className="text-[#00B4D8] hover:text-[#1A365D] text-sm font-bold transition-colors">
                Ir al Foro →
              </Link>
            </div>

            <div className="grow flex flex-col gap-4">
              {temasRecientes.length > 0 ? (
                temasRecientes.map(tema => (
                  <Link to={`/foro/tema/${tema.id}`} key={tema.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#00B4D8]/30 hover:bg-white transition-all cursor-pointer group shadow-sm hover:shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 group-hover:text-[#00B4D8] border border-gray-100">
                        💬
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A365D] group-hover:text-[#00B4D8] transition-colors line-clamp-1">{tema.titulo}</h4>
                        <span className="text-xs text-gray-500 font-medium">{tema.categoria}</span>
                      </div>
                    </div>
                    <span className="bg-[#e6f7fa] border border-[#00B4D8]/20 text-[#00B4D8] py-1 px-3 rounded-lg text-xs font-bold whitespace-nowrap ml-4">
                      {tema._count?.respuestas || 0} resp.
                    </span>
                  </Link>
                ))
              ) : (
                 <div className="text-center py-8 text-gray-400 flex flex-col items-center border-2 border-dashed border-gray-100 rounded-xl">
                   <span className="text-3xl mb-2">🪹</span>
                   <p className="text-sm">Todavía no hay temas recientes. ¡Rompe el hielo!</p>
                 </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;