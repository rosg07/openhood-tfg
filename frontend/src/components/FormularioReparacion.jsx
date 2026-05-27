import { useState, useEffect } from 'react';
import api from '../services/api';

const FormularioReparacion = ({ isOpen, onClose, matricula, onSuccess, reparacionAEditar }) => {
    const [descripcion, setDescripcion] = useState('');
    const [kilometraje, setKilometraje] = useState('');
    const [taller_nombre, setTaller_nombre] = useState('');
    const [fecha, setFecha] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (reparacionAEditar) {
                setDescripcion(reparacionAEditar.descripcion);
                setKilometraje(reparacionAEditar.kilometraje_momento);
                setTaller_nombre(reparacionAEditar.taller_nombre || '');
                const dateObj = new Date(reparacionAEditar.fecha);
                setFecha(dateObj.toISOString().split('T')[0]);
            } else {
                setDescripcion('');
                setKilometraje('');
                setTaller_nombre('');
                setFecha(new Date().toISOString().split('T')[0]);
            }
            setError(null);
        }
    }, [isOpen, reparacionAEditar]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const datosParaBackend = {
                vehiculoMatricula: matricula, 
                descripcion: descripcion,
                kilometraje_momento: parseInt(kilometraje),
                fecha: new Date(fecha).toISOString(),
                taller_nombre: taller_nombre
            };

            if (reparacionAEditar) {
                await api.put(`/reparaciones/${reparacionAEditar.id}`, datosParaBackend);
            } else {
                await api.post('/reparaciones', datosParaBackend);
            }
            
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(reparacionAEditar ? 'Error al actualizar la reparación. Comprueba tu conexión.' : 'Error al crear la reparación. Comprueba tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 p-6 sm:p-8">
                
                {/* CABECERA DEL MODAL */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-[#1A365D] m-0">
                        {reparacionAEditar ? 'Editar Reparación' : 'Nueva Reparación'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* MENSAJE DE ERROR */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Descripción de la avería o revisión</label>
                        <textarea 
                            required
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all resize-none"
                            rows="3"
                            placeholder="Ej: Cambio de aceite y filtros, pastillas de freno..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Taller responsable</label>
                        <input 
                            type="text" 
                            required
                            value={taller_nombre}
                            onChange={(e) => setTaller_nombre(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
                            placeholder="Nombre del taller"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Kilometraje</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                value={kilometraje}
                                onChange={(e) => setKilometraje(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
                                placeholder="Ej: 120000"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Fecha</label>
                            <input 
                                type="date" 
                                required
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="pt-2 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
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
                                reparacionAEditar ? 'Actualizar' : 'Guardar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioReparacion;