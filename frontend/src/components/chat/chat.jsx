import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ usuarioId, matricula }) => {
  const [input, setInput] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);

  // 1. Cargar el historial al montar el componente
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/chat/history/${usuarioId}`);
        setMensajes(res.data);
      } catch (error) {
        console.error("Error al cargar el historial", error);
      }
    };
    cargarHistorial();
  }, [usuarioId]);

  // 2. Enviar nuevo mensaje
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const nuevoMensajeUsuario = { contenido: input, rol: 'user' };
    setMensajes([...mensajes, nuevoMensajeUsuario]);
    setInput('');
    setCargando(true);

    try {
      const res = await axios.post('http://localhost:3000/api/chat', {
        contenido: input,
        usuarioId: usuarioId,
        vehiculoMatricula: matricula
      });
      
      // Añadimos la respuesta de la IA al chat
      setMensajes((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error al enviar mensaje", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {mensajes.map((msg, index) => (
          <div key={index} className={`mensaje ${msg.rol}`}>
            <p>{msg.contenido}</p>
          </div>
        ))}
        {cargando && <p className="typing">El mecánico está pensando...</p>}
      </div>
      
      <form onSubmit={enviarMensaje}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregúntale algo a tu mecánico..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;