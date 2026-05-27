import { useState } from 'react';
import api from '../api/axios';

const ModalPublicar = ({ isOpen, onClose, vehiculos, onSuccess }) => {
  const [matricula, setMatricula] = useState('');
  const [precio, setPrecio] = useState('');
  
  // Nuevos estados para UX
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limpiamos todos los estados al cerrar
  const handleClose = () => {
    setMatricula('');
    setPrecio('');
    setError('');
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await api.put(`/vehiculos/marketplace/${matricula}`, { 
        precio: parseFloat(precio),
        enVenta: true 
      });
      
      onSuccess();
      handleClose();
    } catch (err) {
      // Reemplazamos el alert() por el estado de error
      setError(err.response?.data?.mensaje || err.message || "Error al publicar el anuncio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Tarjeta del modal */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 relative">
        
        {/* Botón de cierre (X) */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1A365D] transition-colors"
        >
          ✕
        </button>

        {/* Cabecera del modal */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#e6f7fa] rounded-full flex items-center justify-center mx-auto mb-4 text-[#00B4D8] border border-[#00B4D8]/20">
            <span className="text-2xl">🏷️</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A365D]">Publicar Anuncio</h2>
          <p className="text-sm text-gray-500 mt-2">
            Añade tu vehículo al Marketplace y ponle un precio de venta.
          </p>
        </div>

        {/* Mensaje de error integrado */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {/* Empty State: Si el usuario no tiene ningún vehículo registrado */}
        {vehiculos.length === 0 ? (
          <div className="text-center text-gray-500 mb-6 p-4 bg-gray-50 rounded-xl">
            No tienes vehículos en tu garaje para publicar.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Selecciona vehículo</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/30 focus:border-[#00B4D8] outline-none transition-all cursor-pointer text-gray-700" 
                required
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              >
                <option value="" disabled>Selecciona un coche...</option>
                {/* Mostramos todos, pero avisamos si ya está en venta */}
                {vehiculos.map(v => (
                  <option key={v.matricula} value={v.matricula}>
                    {v.marca} {v.modelo} {v.enVenta ? '(Ya publicado)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Precio de venta</label>
              <div className="relative">
                {/* Icono de Euro flotante */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                <input 
                  type="number" 
                  required
                  min="1"
                  step="0.01"
                  placeholder="Ej: 5000" 
                  className="w-full p-3 pl-8 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/30 focus:border-[#00B4D8] outline-none transition-all text-gray-700"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                type="button" 
                onClick={handleClose} 
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={!matricula || !precio || isSubmitting}
                className="flex-1 bg-[#00B4D8] text-white py-3 rounded-xl font-bold hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalPublicar;