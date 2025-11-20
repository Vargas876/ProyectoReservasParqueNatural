import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para requests (opcional - para agregar tokens, etc)
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar headers adicionales, tokens, etc.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses (opcional - para manejo global de errores)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo global de errores
    if (error.response?.status === 401) {
      // Redirigir a login si es necesario
      console.error('No autorizado');
    } else if (error.response?.status === 500) {
      console.error('Error del servidor:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;