import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatVista from '../components/Chat/ChatVista'; // 1. IMPORTANTE: Importar el componente

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 1. La barra de navegación fija arriba */}
      <Navbar />

      {/* 2. El contenido de la página ocupa el espacio restante */}
      <main className="grow">
        <Outlet />
      </main>

      {/* 3. El Chat - Lo envolvemos en un div con posición fija para que no empuje al Footer */}
      <div className="fixed bottom-5 right-5 z-50">
         <ChatVista usuarioId={1} />
      </div>

      {/* 4. El pie de página pegado abajo */}
      <Footer />
    </div>
  );
};

export default Layout;