import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Esta es la URL de tu backend
});

// El interceptor actúa como un "middleware" en el frontend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
