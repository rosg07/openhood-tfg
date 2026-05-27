import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/MainLayout';
import Login from './pages/Login';
import Vehiculos from './pages/Vehiculos'; 
import HistorialVehiculo from './pages/HistorialVehiculo'; 
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import TerminosUso from './pages/TerminosUso';
import AvisoLegal from './pages/AvisoLegal';
import Marketplace from './pages/Marketplace';
import HistorialPublico from './components/HistorialPublico'
import Perfil from './pages/Perfil';
import Foro from './pages/Foro';
import TemaDetalle from './pages/TemaDetalle';
import DirectorioTalleres from './pages/DirectorioTalleres';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>  
        <Route element={<Layout />}>
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/historial/:matricula" element={<HistorialVehiculo />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/terminos-uso" element={<TerminosUso />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/vehiculos/historial/:matricula" element={<HistorialPublico />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/foro" element={<Foro />} />
          <Route path="/foro/tema/:id" element={<TemaDetalle />} />
         <Route path="/talleres" element={<DirectorioTalleres />} />
         <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        {/* RUTA FUERA DEL LAYOUT: 
            Si algún día haces pantalla de Login y NO quieres que tenga 
            el Navbar y el Footer, simplemente la pones aquí abajo, fuera del padre. */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;