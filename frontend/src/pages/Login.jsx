import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', nombre: '', telefono: '' });
  
  
  // Estado para el Modal
  const [modal, setModal] = useState({ isOpen: false, titulo: '', mensaje: '', esExito: false });

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isRegistering) {
        await register(formData.nombre, formData.email, formData.telefono, formData.password);
        setModal({ isOpen: true, titulo: '¡Registro exitoso!', mensaje: 'Ya puedes iniciar sesión con tu cuenta.', esExito: true });
      } else {
        await login(formData.email, formData.password);
        navigate('/dashboard'); // Redirige al dashboard tras login exitoso
      }
    } catch {
      // Si hay error, mostramos el modal de error
      setModal({ isOpen: true, titulo: 'Error', mensaje: isRegistering ? 'No se pudo crear la cuenta.' : 'Credenciales incorrectas.', esExito: false });
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    // Fondo muy suave para que la tarjeta blanca resalte perfectamente
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
      
      {/* Tarjeta de Login/Registro */}
      <form 
        onSubmit={handleSubmit} 
        className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-sm border border-gray-100 animate-fade-in"
      >
        
        {/* Cabecera dinámica */}
        <div className="mb-8 text-center">
          {isRegistering ? (
            <h2 className="text-3xl font-bold text-[#1A365D]">Crea tu cuenta</h2>
          ) : (
            <h2 className="text-3xl font-bold tracking-tight text-[#1A365D]">
              Open<span className="text-[#00B4D8]">Hood</span>
            </h2>
          )}
          <p className="text-gray-500 mt-2 text-sm">
            {isRegistering ? 'Únete a la comunidad del motor' : 'Bienvenido de nuevo a tu garaje'}
          </p>
        </div>
        
        {/* Contenedor de Inputs */}
        <div className="space-y-4">
          {isRegistering && (
            <>
              <input name="nombre" type="text" placeholder="Nombre completo" required onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"/>
              <input name="telefono" type="tel" placeholder="Teléfono" required onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"/>
            </>
          )}
          <input name="email" type="email" placeholder="Correo electrónico" required onChange={handleChange}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"/>
          <input name="password" type="password" placeholder="Contraseña" required onChange={handleChange}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"/>
        </div>
        
        {/* Botón Principal de Acción */}
        <button className="w-full mt-6 py-3 text-white bg-[#00B4D8] rounded-xl font-bold hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
          {isRegistering ? 'Registrarse' : 'Entrar'}
        </button>

        {/* Toggle Login/Registro */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="text-[#00B4D8] font-bold ml-1 hover:text-[#1A365D] transition-colors"
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate aquí'}
          </button>
        </p>
      </form>

      {/* MODAL ADAPTADO AL DISEÑO */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-fade-in border border-gray-100">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${modal.esExito ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className="text-3xl">{modal.esExito ? '✅' : '❌'}</span>
            </div>
            <h3 className="text-2xl font-bold text-[#1A365D] mb-2">{modal.titulo}</h3>
            <p className="text-gray-600 mb-6">{modal.mensaje}</p>
            <button 
              onClick={() => {
                setModal({ isOpen: false, titulo: '', mensaje: '', esExito: false });
                if (modal.esExito) setIsRegistering(false); 
              }} 
              className="px-4 py-3 bg-[#00B4D8] text-white font-bold rounded-xl w-full hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;