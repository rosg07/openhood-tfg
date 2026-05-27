import { useState, useEffect } from 'react';
import api from '../services/api';

const FormularioPresupuesto = ({ isOpen, onClose, reparacionId, onSuccess, presupuestoAEditar }) => {
    const [base_imponible, setBase_imponible] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const IVA_FIJO = 21;

    useEffect(() => {
        if (isOpen) {
            if (presupuestoAEditar) {
                setBase_imponible(presupuestoAEditar.base_imponible);
            } else {
                setBase_imponible('');
            }
            setError(null);
        }
    }, [isOpen, presupuestoAEditar]);

    if (!isOpen) return null;

    const importe_total = (parseFloat(base_imponible || 0) * (1 + IVA_FIJO / 100)).toFixed(2);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const datosParaBackend = {
                base_imponible: parseFloat(base_imponible),
                IVA: IVA_FIJO,
                importe_total: parseFloat(importe_total),
                reparacionId: reparacionId
            };

            if (presupuestoAEditar) {
                await api.put(`/presupuestos/${presupuestoAEditar.id}`, datosParaBackend);
            } else {
                await api.post('/presupuestos', datosParaBackend);
            }
            
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(presupuestoAEditar ? 'Error al actualizar el presupuesto. Comprueba tu conexión con el servidor.' : 'Error al crear el presupuesto. Comprueba tu conexión con el servidor.');
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
                        {presupuestoAEditar ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
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
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* INPUTS DE IMPORTES */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Base Imponible (€)</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                step="0.01"
                                value={base_imponible}
                                onChange={(e) => setBase_imponible(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-sm font-bold text-gray-700 mb-2">IVA (%)</label>
                            <input 
                                type="number" 
                                value={IVA_FIJO}
                                disabled
                                className="w-full p-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl cursor-not-allowed outline-none font-medium text-center"
                            />
                        </div>
                    </div>

                    {/* CAJA DE RESULTADO TOTAL */}
                    <div className="bg-[#e6f7fa] border border-[#00B4D8]/20 p-5 rounded-xl flex justify-between items-center mt-2">
                        <span className="block text-sm text-[#1A365D] font-bold uppercase tracking-wider">Importe Total</span>
                        <span className="text-2xl font-black text-[#00B4D8]">{importe_total} €</span>
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
                                presupuestoAEditar ? 'Actualizar' : 'Guardar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioPresupuesto;