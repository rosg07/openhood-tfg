import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const navigate = useNavigate();
  
  // Comprobamos si hay un token guardado para saber si estamos logueados
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    // Borramos el token y redirigimos al login
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('token');
    localStorage.removeItem('matriculaActiva');
    setIsLoggedIn(false);
    navigate('/login'); 
  };

  return (
    // Aplicamos fondo blanco translúcido con desenfoque (Glassmorphism) y un borde sutil
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          
          {/* LOGO Y MARCA */}
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition group">
            <img 
              src={logo} 
              alt="Icono OpenHood" 
              className="h-11 object-contain transition-transform group-hover:scale-105" 
            />
            <span className="text-2xl font-bold tracking-tight text-[#1A365D]">
              Open<span className="text-[#00B4D8]">Hood</span>
            </span>
          </Link>

          {/* MENÚ DERECHO: ENLACES Y BOTONES */}
          <div className="flex items-center gap-2 sm:gap-6">
            
            {/* Solo mostramos los enlaces si está logueado */}
            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-6 mr-4">
                <Link to="/vehiculos" className="text-[#1A365D] hover:text-[#00B4D8] font-semibold transition-colors text-sm">
                  Mis Vehículos
                </Link>
                <Link to="/marketplace" className="text-[#1A365D] hover:text-[#00B4D8] font-semibold transition-colors text-sm">
                  Marketplace
                </Link>
                <Link to="/foro" className="text-[#1A365D] hover:text-[#00B4D8] font-semibold transition-colors text-sm">
                  Foro
                </Link>
                <Link to="/talleres" className="text-[#1A365D] hover:text-[#00B4D8] font-semibold transition-colors text-sm">
                  Talleres
                </Link>
                <Link to="/perfil" className="text-[#1A365D] hover:text-[#00B4D8] font-semibold transition-colors text-sm">
                  Mi Perfil
                </Link>
              </div>
            )}

            {/* BOTONES DE AUTENTICACIÓN */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Cerrar sesión
              </button>
            ) : (
              <Link 
                to="/login"
                className="bg-[#00B4D8] hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Iniciar sesión
              </Link>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;