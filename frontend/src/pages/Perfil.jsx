import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Perfil = () => {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' });
  const [modal, setModal] = useState({ isOpen: false, titulo: '', mensaje: '', esExito: true });
  const [loading, setLoading] = useState(true);

  // 1. Cargar datos desde el backend
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get('/auth/me'); 
        setFormData(res.data);
      } catch (err) {
        console.error("Error al cargar perfil", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  // 2. Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/me', formData);
      // Actualizamos el contexto para que toda la app vea el nuevo nombre
      setUser(res.data.usuario); 
      setModal({ isOpen: true, titulo: '¡Éxito!', mensaje: 'Datos actualizados correctamente.', esExito: true });
    } catch {
      setModal({ isOpen: true, titulo: 'Error', mensaje: 'No se pudo actualizar la información.', esExito: false });
    }
  };

  // Estado de carga unificado
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-[#00B4D8] rounded-full animate-bounce mb-4"></div>
          <p className="text-[#1A365D] font-bold">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] p-4 sm:p-8 flex justify-center items-start pt-10 sm:pt-20 animate-fade-in">
      
      {/* TARJETA DE PERFIL */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md relative overflow-hidden"
      >
        {/* Elemento decorativo de fondo */}
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-[#1A365D]/5 to-transparent"></div>

        {/* Cabecera con Avatar */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-24 h-24 bg-[#e6f7fa] text-[#00B4D8] rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-white shadow-sm">
            👤
          </div>
          <h2 className="text-2xl font-bold text-[#1A365D]">Mi Perfil</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona tu información personal</p>
        </div>
        
        {/* Formulario */}
        <div className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre completo</label>
            <input 
              type="text" 
              placeholder="Ej: Facun" 
              value={formData.nombre} 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono de contacto</label>
            <input 
              type="tel" 
              placeholder="Ej: +34 600 000 000" 
              value={formData.telefono || ''} 
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Correo electrónico</label>
            <input 
              type="email" 
              disabled 
              value={formData.email} 
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-2 ml-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              El correo está vinculado a tu cuenta y no se puede modificar.
            </p>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full mt-8 py-3 bg-[#00B4D8] text-white rounded-xl font-bold hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          Guardar Cambios
        </button>
      </form>

      {/* MODAL UNIFICADO */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-gray-100">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${modal.esExito ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className="text-3xl">{modal.esExito ? '✅' : '❌'}</span>
            </div>
            <h3 className="text-2xl font-bold text-[#1A365D] mb-2">{modal.titulo}</h3>
            <p className="text-gray-600 mb-6">{modal.mensaje}</p>
            <button 
              onClick={() => setModal({ ...modal, isOpen: false })} 
              className="w-full py-3 bg-[#00B4D8] text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;