import { useState, useEffect } from 'react';
import api from '../api/axios';

const FormularioVehiculo = ({ isOpen, onClose, vehiculoAEditar, onSuccess }) => {
  const [formData, setFormData] = useState({
    matricula: '', marca: '', modelo: '', año: '', kilometraje: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (vehiculoAEditar) {
      setFormData({
        matricula: vehiculoAEditar.matricula,
        marca: vehiculoAEditar.marca,
        modelo: vehiculoAEditar.modelo,
        año: vehiculoAEditar.anio, 
        kilometraje: vehiculoAEditar.kilometraje
      });
    } else {
      setFormData({ matricula: '', marca: '', modelo: '', año: '', kilometraje: '' });
      setFile(null);
    }
    setError(null);
  }, [vehiculoAEditar, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (vehiculoAEditar) {
        // Solo actualizamos los datos básicos
        await api.put(`/vehiculos/${vehiculoAEditar.matricula}`, formData);
        
        // Subir foto si hay una nueva
        if (file) {
          const formDataImg = new FormData();
          formDataImg.append('imagen', file);
          await api.post(`/vehiculos/upload-image/${vehiculoAEditar.matricula}`, formDataImg, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Creación del vehículo
        await api.post('/vehiculos', formData);
        
        // Si al crearlo también ha adjuntado una foto
        if (file) {
          const formDataImg = new FormData();
          formDataImg.append('imagen', file);
          await api.post(`/vehiculos/upload-image/${formData.matricula}`, formDataImg, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error al guardar: " + (err.response?.data?.mensaje || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 p-6 sm:p-8 max-h-[90vh] overflow-y-auto scrollbar-hide relative">
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1A365D] transition-colors"
        >
          ✕
        </button>

        {/* CABECERA */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1A365D]">
            {vehiculoAEditar ? 'Editar Vehículo' : 'Añadir Vehículo'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {vehiculoAEditar ? 'Modifica los datos o sube una nueva foto.' : 'Registra un nuevo vehículo en tu garaje.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* MENSAJE DE ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm font-bold text-center">
                {error}
            </div>
          )}

          {/* MATRÍCULA */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Matrícula</label>
            <input 
              required disabled={!!vehiculoAEditar}
              placeholder="Ej: 1234ABC" 
              value={formData.matricula} 
              onChange={e => setFormData({...formData, matricula: e.target.value})} 
              className={`w-full p-3 border border-gray-200 rounded-xl outline-none transition-all uppercase ${
                vehiculoAEditar 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed font-mono' 
                  : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8]'
              }`}
            />
          </div>

          {/* MARCA Y MODELO */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Marca</label>
              <input 
                required placeholder="Ej: Toyota" 
                value={formData.marca} 
                onChange={e => setFormData({...formData, marca: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Modelo</label>
              <input 
                required placeholder="Ej: Corolla" 
                value={formData.modelo} 
                onChange={e => setFormData({...formData, modelo: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
              />
            </div>
          </div>

          {/* AÑO Y KILOMETRAJE */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Año</label>
              <input 
                required type="number" placeholder="Ej: 2020" 
                value={formData.año} 
                onChange={e => setFormData({...formData, año: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Kilometraje actual</label>
              <input 
                required type="number" placeholder="Ej: 50000" 
                value={formData.kilometraje} 
                onChange={e => setFormData({...formData, kilometraje: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
              />
            </div>
          </div>

          {/* FOTO DEL VEHÍCULO */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-2">Foto del vehículo (Opcional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setFile(e.target.files[0])} 
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-bold
                file:bg-[#e6f7fa] file:text-[#00B4D8]
                hover:file:bg-[#00B4D8] hover:file:text-white hover:file:cursor-pointer transition-all border border-gray-200 rounded-xl p-1 bg-gray-50"
            />
          </div>
          
          {/* BOTONES DE ACCIÓN */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-3 bg-[#00B4D8] text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'Guardar Vehículo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioVehiculo;