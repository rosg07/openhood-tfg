import { useState } from 'react';
import api from '../api/axios';

const ModalDespublicar = ({ isOpen, onClose, vehiculos, onSuccess }) => {
  const [matricula, setMatricula] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Reutilizamos la ruta de marketplace, enviando enVenta: false
      await api.put(`/vehiculos/marketplace/${matricula}`, { 
        enVenta: false,
        precio: null 
      });
      
      onSuccess();
      onClose();
      setMatricula('');
    } catch (err) {
      // Usamos el estado en lugar del alert() feo del navegador
      setError(err.response?.data?.mensaje || err.message || "Error al retirar el anuncio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Filtramos los que están en venta para no hacer el cálculo en medio del JSX
  const vehiculosEnVenta = vehiculos.filter(v => v.enVenta);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Tarjeta del modal */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 relative">
        
        {/* Botón de cierre (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1A365D] transition-colors"
        >
          ✕
        </button>

        {/* Cabecera del modal */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛑</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A365D]">Retirar Anuncio</h2>
          <p className="text-sm text-gray-500 mt-2">
            El vehículo dejará de estar visible en el Marketplace.
          </p>
        </div>

        {/* Mensaje de error integrado */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {/* Si no hay coches en venta, mostramos un mensaje bonito en lugar del select */}
        {vehiculosEnVenta.length === 0 ? (
          <div className="text-center text-gray-500 mb-6 p-4 bg-gray-50 rounded-xl">
            No tienes ningún vehículo publicado en el Marketplace en este momento.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Selecciona el vehículo
              </label>
              {/* Select con el anillo de foco usando el color corporativo o rojo suave */}
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/30 focus:border-red-500 outline-none transition-all cursor-pointer text-gray-700" 
                required
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              >
                <option value="" disabled>Selecciona un coche...</option>
                {vehiculosEnVenta.map(v => (
                  <option key={v.matricula} value={v.matricula}>
                    {v.marca} {v.modelo} ({v.matricula})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              {/* Botón de acción destructiva en rojo con sombra y animación */}
              <button 
                type="submit" 
                disabled={!matricula || isSubmitting}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Retirando...' : 'Retirar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalDespublicar;