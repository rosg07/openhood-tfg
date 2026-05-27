import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PREGUNTAS_RAPIDAS = [
  "¿Qué mantenimiento me toca?",
  "¿Taller cercano?",
  "¿Qué aceite usa mi motor?",
  "¿Significado de testigos?"
];

const ChatVista = () => {
  const [input, setInput] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [minimizado, setMinimizado] = useState(true);
  const [misVehiculos, setMisVehiculos] = useState([]);
  const [ubicacion, setUbicacion] = useState({ lat: null, lng: null });

  const mensajesEndRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  
  // Posición inicial del chat (abajo a la derecha)
  const [posicion, setPosicion] = useState({ x: 24, y: 24 }); 
  const [arrastrando, setArrastrando] = useState(false);

  const usuarioId = localStorage.getItem('usuarioId');
  const [matriculaActiva, setMatriculaActiva] = useState(localStorage.getItem('matriculaActiva'));

  // 1. Obtener ubicación al cargar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Chat sin ubicación:", err)
      );
    }
  }, []);

  // 2. Auto-scroll al último mensaje
  useEffect(() => {
    if (!minimizado) {
      setTimeout(() => { mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
    }
  }, [mensajes, escribiendo, minimizado]);

  // 3. Cargar vehículos
  useEffect(() => {
    const fetchVehiculos = async () => {
      if (!usuarioId) return;
      try {
        const res = await axios.get(`http://localhost:3000/api/chat/vehicles/${usuarioId}`);
        setMisVehiculos(res.data);
        if (!matriculaActiva && res.data.length > 0) seleccionarCoche(res.data[0].matricula);
      } catch (err) { console.error(err); }
    };
    fetchVehiculos();
  }, [usuarioId, matriculaActiva]);

  const seleccionarCoche = (mat) => {
    localStorage.setItem('matriculaActiva', mat);
    setMatriculaActiva(mat);
    // Mensaje de sistema sutil (no burbuja)
    setMensajes(prev => [...prev, { rol: 'system', contenido: `Vehículo activo: ${mat}` }]);
  };

  const procesarEnvio = async (texto) => {
    setMensajes(prev => [...prev, { contenido: texto, rol: 'user' }]);
    setEscribiendo(true);
    try {
      const res = await axios.post('http://localhost:3000/api/chat', {
        contenido: texto,
        usuarioId: parseInt(usuarioId),
        vehiculoMatricula: matriculaActiva,
        lat: ubicacion.lat,
        lng: ubicacion.lng
      });
      setMensajes(prev => [...prev, res.data]);
    } catch (err) { 
      console.error(err); 
      setMensajes(prev => [...prev, { contenido: "Error de conexión con el perito.", rol: 'assistant' }]);
    } finally { 
      setEscribiendo(false); 
    }
  };

  const manejarEnvioForm = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    procesarEnvio(input.trim());
    setInput('');
  };

  const enviarPreguntaRapida = (pregunta) => {
    if (escribiendo) return;
    procesarEnvio(pregunta);
  };

  // --- LÓGICA ARRASTRE ---
  const iniciarArrastre = (e) => {
    if (e.target.closest('button') || e.target.closest('select')) return;
    setArrastrando(true);
    offset.current = { x: e.clientX + posicion.x, y: window.innerHeight - e.clientY - posicion.y };
  };

  useEffect(() => {
    const mover = (e) => { if (arrastrando) setPosicion({ x: offset.current.x - e.clientX, y: window.innerHeight - e.clientY - offset.current.y }); };
    const parar = () => setArrastrando(false);
    if (arrastrando) { window.addEventListener('mousemove', mover); window.addEventListener('mouseup', parar); }
    return () => { window.removeEventListener('mousemove', mover); window.removeEventListener('mouseup', parar); };
  }, [arrastrando]);

  if (!usuarioId) return null;

  return (
    <div 
      className={`fixed z-100 flex flex-col bg-white shadow-2xl border border-gray-200 overflow-hidden text-sm transition-all duration-300 ease-in-out
        ${minimizado ? 'w-auto h-14 rounded-full' : 'w-90 h-137.5 rounded-2xl'}`}
      style={{ 
        bottom: `${posicion.y}px`, 
        right: `${posicion.x}px`, 
        transition: arrastrando ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
      }}
    >
      {/* CABECERA */}
      <div 
        className={`w-full bg-[#1A365D] text-white flex items-center justify-between cursor-move select-none shrink-0 transition-all ${minimizado ? 'h-full px-5' : 'py-3 px-4'}`}
        onMouseDown={iniciarArrastre}
      >
        <div className="flex items-center gap-3" onClick={() => setMinimizado(!minimizado)}>
          {/* Indicador Online */}
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <h3 className="font-bold text-base whitespace-nowrap">Mecánico AI</h3>
        </div>
        
        <button 
          className="text-white/70 hover:text-white p-1 ml-4 transition-colors" 
          onClick={() => setMinimizado(!minimizado)}
        >
          {minimizado ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
          )}
        </button>
      </div>
      
      {/* CUERPO DEL CHAT */}
      {!minimizado && (
        <div className="flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
          
          {/* Selector de Vehículo (Solo si hay más de 1 coche) */}
          {misVehiculos.length > 0 && (
            <div className="bg-white px-4 py-2.5 border-b border-gray-100 flex justify-between items-center text-xs shrink-0">
              <span className="text-gray-500 font-bold uppercase tracking-wider">Contexto:</span>
              <select 
                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#00B4D8] text-[#1A365D] font-bold cursor-pointer" 
                value={matriculaActiva || ''} 
                onChange={(e) => seleccionarCoche(e.target.value)}
              >
                {misVehiculos.map(v => <option key={v.matricula} value={v.matricula}>{v.marca} ({v.matricula})</option>)}
              </select>
            </div>
          )}

          {/* Historial de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mensajes.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <span className="text-4xl block mb-2">🤖</span>
                <p>¡Hola! Soy tu asistente mecánico personal. ¿En qué te puedo ayudar hoy?</p>
              </div>
            )}
            
            {mensajes.map((m, i) => {
              // Filtrar mensajes de sistema (como el cambio de contexto)
              if (m.rol === 'system' || m.contenido.includes('Contexto:')) {
                return (
                  <div key={i} className="flex justify-center my-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
                      {m.contenido.replace('🚗 Contexto:', 'Vehículo activo:')}
                    </span>
                  </div>
                );
              }

              const isUser = m.rol === 'user';
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 text-sm leading-relaxed ${isUser ? 'bg-[#00B4D8] text-white rounded-2xl rounded-tr-sm shadow-sm' : 'bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm'}`}>
                    {m.contenido}
                  </div>
                </div>
              );
            })}
            
            {/* Animación Escribiendo */}
            {escribiendo && (
              <div className="flex justify-start shrink-0">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#00B4D8] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#00B4D8] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-2 h-2 bg-[#00B4D8] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </div>
            )}
            <div ref={mensajesEndRef} />
          </div>

          {/* Sugerencias (Carrusel Horizontal) */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
            {PREGUNTAS_RAPIDAS.map((pregunta, index) => (
              <button 
                key={index} 
                onClick={() => enviarPreguntaRapida(pregunta)} 
                disabled={escribiendo}
                className="whitespace-nowrap px-4 py-1.5 bg-[#e6f7fa] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors rounded-full text-xs font-bold border border-[#00B4D8]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pregunta}
              </button>
            ))}
          </div>

          {/* Input de Texto */}
          <form className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center shrink-0" onSubmit={manejarEnvioForm}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Escribe tu consulta..." 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/50 focus:bg-white transition-all"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || escribiendo}
              className="bg-[#1A365D] hover:bg-[#00B4D8] text-white w-11 h-11 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 group"
            >
              {/* Icono de enviar moderno */}
              <svg className="w-5 h-5 -translate-x-px group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default ChatVista;