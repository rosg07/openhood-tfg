import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // Fondo blanco y borde sutil para que respire, con el texto en un gris suave
    <footer className="bg-white py-8 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Zona Izquierda: Marca y Copyright */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {/* Replicamos la estética de la Navbar para el nombre de la marca */}
          <span className="font-bold text-base tracking-tight text-[#1A365D]">
            Open<span className="text-[#00B4D8]">Hood</span>
          </span>
          <span>&copy; {new Date().getFullYear()}. Todos los derechos reservados.</span>
        </div>

        {/* Zona Derecha: Enlaces Legales */}
        <div className="flex gap-6 text-sm font-medium">
          {/* Cambiamos el hover genérico por el Turquesa de tu marca */}
          <Link to="/politica-privacidad" className="text-gray-500 hover:text-[#00B4D8] transition-colors">
            Política de Privacidad
          </Link>
          <Link to="/terminos-uso" className="text-gray-500 hover:text-[#00B4D8] transition-colors">
            Términos de Uso
          </Link>
          <Link to="/aviso-legal" className="text-gray-500 hover:text-[#00B4D8] transition-colors">
            Aviso Legal
          </Link>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;