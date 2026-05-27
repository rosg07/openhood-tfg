/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('usuarioId', res.data.usuario.id); // Guardamos el ID del usuario para el chat
   if (res.data.usuario.matriculaActiva) {
        localStorage.setItem('matriculaActiva', res.data.usuario.matriculaActiva);
    } else {
        localStorage.removeItem('matriculaActiva'); 
    }
    setUser(res.data.usuario);
    return res.data;
  };

  const register = async (nombre, email, telefono, password) => {
    const res = await api.post('/auth/register', { nombre, email, telefono, password });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('matriculaActiva');
    setUser(null);
  };

  // Aquí añadimos 'setUser' al value para poder actualizar el usuario desde Perfil.jsx
  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};