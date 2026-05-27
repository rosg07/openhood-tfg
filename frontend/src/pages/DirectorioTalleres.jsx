import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para los iconos de Leaflet utilizando importaciones locales
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Motor de movimiento del mapa
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 14);
  }, [coords, map]);
  return null;
};

const DirectorioTalleres = () => {
  // --- ESTADOS ---
  const [talleres, setTalleres] = useState([]);
  const [busquedaTaller, setBusquedaTaller] = useState("");
  const [direccionManual, setDireccionManual] = useState("");
  const [radio, setRadio] = useState(10);
  const [ubicacionReferencia, setUbicacionReferencia] = useState([40.4167, -3.7037]); // Madrid por defecto
  const [centroMapa, setCentroMapa] = useState([40.4167, -3.7037]);
  const [cargandoUbi, setCargandoUbi] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [enviandoTaller, setEnviandoTaller] = useState(false);
  
  const [nuevoTaller, setNuevoTaller] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    descripcion: "",
  });

  // --- FUNCIONES DE CARGA ---
  const cargarTalleres = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/talleres/cercanos?lat=${ubicacionReferencia[0]}&lng=${ubicacionReferencia[1]}&radio=${radio}`
      );
      const data = await res.json();
      setTalleres(data);
    } catch (error) {
      console.error("Error cargando talleres:", error);
    }
  }, [ubicacionReferencia, radio]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUbicacionReferencia(coords);
          setCentroMapa(coords);
        },
        (error) => console.warn("Error de geolocalización:", error)
      );
    }
  }, []);

  useEffect(() => {
    cargarTalleres();
  }, [cargarTalleres]);

  // --- INTERACCIONES ---
  const buscarLugar = async (e) => {
    e.preventDefault();
    if (!direccionManual) return;
    setCargandoUbi(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionManual)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setUbicacionReferencia(coords);
        setCentroMapa(coords);
      } else {
        alert("No se encontró el lugar.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargandoUbi(false);
    }
  };

  const manejarRecomendacion = async (e) => {
    e.preventDefault();
    setEnviandoTaller(true);
    try {
      const res = await fetch("http://localhost:3000/api/talleres/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoTaller),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al guardar el taller");
      }

      alert("¡Gracias! Taller añadido a la comunidad OpenHood.");
      setMostrarModal(false);
      setNuevoTaller({ nombre: "", direccion: "", telefono: "", email: "", descripcion: "" });
      cargarTalleres();
      
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setEnviandoTaller(false);
    }
  };

  const abrirGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${ubicacionReferencia[0]},${ubicacionReferencia[1]}&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const talleresFiltrados = talleres.filter((t) =>
    t.nombre.toLowerCase().includes(busquedaTaller.toLowerCase())
  );

  return (
    // Contenedor principal con fondo suave
    <div className="flex flex-col lg:flex-row p-4 lg:p-6 gap-6 h-[calc(100vh-80px)] bg-[#F8FAFC]">
      
      {/* PANEL IZQUIERDO: BUSCADOR Y LISTA */}
      <div className="w-full lg:w-105 flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
        
        {/* Cambiar Ubicación */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#1A365D] mb-3 flex items-center gap-2">
            📍 Cambiar Ubicación
          </h3>
          <form onSubmit={buscarLugar} className="flex gap-2">
            <input
              type="text"
              placeholder="Ciudad o dirección..."
              value={direccionManual}
              onChange={(e) => setDireccionManual(e.target.value)}
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all text-sm"
            />
            <button 
              type="submit" 
              className="px-5 bg-[#1A365D] hover:bg-blue-900 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              {cargandoUbi ? "..." : "Ir"}
            </button>
          </form>
        </div>

        <hr className="border-gray-100 mb-6" />

        {/* Filtrar Talleres */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#1A365D] mb-3 flex items-center gap-2">
            🔍 Filtrar Talleres
          </h3>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busquedaTaller}
            onChange={(e) => setBusquedaTaller(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all text-sm"
          />

          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-600">Radio de búsqueda:</label>
            <span className="text-sm font-bold text-[#00B4D8] bg-[#e6f7fa] px-2 py-1 rounded-lg">{radio} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={radio}
            onChange={(e) => setRadio(e.target.value)}
            className="w-full mb-6 accent-[#00B4D8]"
          />

          <button
            onClick={() => setMostrarModal(true)}
            className="w-full py-3 bg-[#00B4D8] hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>➕</span> Recomendar un Taller
          </button>
        </div>

        {/* Lista de Resultados */}
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
          {talleresFiltrados.length > 0 ? (
            talleresFiltrados.map((taller) => (
              <div
                key={taller.id}
                onClick={() => setCentroMapa([taller.latitud, taller.longitud])}
                className="p-4 bg-white rounded-xl border border-gray-200 cursor-pointer group hover:border-[#00B4D8] hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <h4 className="m-0 text-lg font-bold text-[#1A365D] group-hover:text-[#00B4D8] transition-colors">
                  {taller.nombre}
                </h4>
                <p className="mt-1 mb-3 text-xs text-gray-500 line-clamp-2">
                  {taller.direccion}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); abrirGoogleMaps(taller.latitud, taller.longitud); }}
                  className="w-full py-2 bg-gray-50 group-hover:bg-[#1A365D] text-gray-700 group-hover:text-white font-semibold text-sm rounded-lg border border-gray-200 group-hover:border-[#1A365D] transition-colors flex justify-center items-center gap-2"
                >
                  🚗 Cómo llegar
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 px-4 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="mb-2 text-2xl">🗺️</p>
              <p className="text-sm">No se encontraron talleres en esta zona. ¡Anímate a recomendar el primero!</p>
            </div>
          )}
        </div>
      </div>

      {/* PANEL DERECHO: MAPA */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
        <MapContainer center={centroMapa} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap coords={centroMapa} />

          {/* Marcador de Búsqueda (Rojo) */}
          <Marker
            position={ubicacionReferencia}
            icon={L.icon({
              iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
              shadowUrl: markerShadow,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              <span className="font-bold text-[#1A365D]">Punto de búsqueda</span>
            </Popup>
          </Marker>

          {/* Marcadores de Talleres (Azules) */}
          {talleresFiltrados.map((taller) => (
            <Marker key={taller.id} position={[taller.latitud, taller.longitud]}>
              <Popup>
                <div className="text-center p-1">
                  <strong className="text-[#1A365D] block mb-1">{taller.nombre}</strong>
                  <span className="text-xs text-gray-600 block mb-2">{taller.telefono}</span>
                  <button
                    onClick={() => abrirGoogleMaps(taller.latitud, taller.longitud)}
                    className="text-xs font-bold text-[#00B4D8] hover:text-[#1A365D] underline transition-colors"
                  >
                    Ruta en Google Maps
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* MODAL DE RECOMENDACIÓN */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1A365D] m-0">Recomendar Taller</h3>
              <button onClick={() => setMostrarModal(false)} className="text-gray-400 hover:text-red-500 transition-colors text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={manejarRecomendacion} className="flex flex-col gap-4">
              <input
                type="text" placeholder="Nombre del taller *" value={nuevoTaller.nombre} required
                onChange={(e) => setNuevoTaller({ ...nuevoTaller, nombre: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
              />
              <input
                type="text" placeholder="Dirección completa *" value={nuevoTaller.direccion} required
                onChange={(e) => setNuevoTaller({ ...nuevoTaller, direccion: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text" placeholder="Teléfono" value={nuevoTaller.telefono}
                  onChange={(e) => setNuevoTaller({ ...nuevoTaller, telefono: e.target.value })}
                  className="w-full flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
                />
                <input
                  type="email" placeholder="Email" value={nuevoTaller.email}
                  onChange={(e) => setNuevoTaller({ ...nuevoTaller, email: e.target.value })}
                  className="w-full flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
                />
              </div>
              <textarea
                placeholder="¿Por qué lo recomiendas? (Especialidad, trato, precio...)"
                value={nuevoTaller.descripcion}
                onChange={(e) => setNuevoTaller({ ...nuevoTaller, descripcion: e.target.value })}
                rows="3" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all resize-none"
              />
              
              <div className="flex gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setMostrarModal(false)} 
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={enviandoTaller} 
                  className="flex-1 py-3 bg-[#00B4D8] hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  {enviandoTaller ? "Guardando..." : "Publicar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorioTalleres;