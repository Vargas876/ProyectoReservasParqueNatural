import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000 // 15 segundos
});

// Interceptor de request - Agregar token automáticamente
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de response - Manejo de errores global
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si el token expiró o es inválido (401)
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;

            // Solo redirigir si no está ya en login
            if (currentPath !== '/login') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        // Si no tiene permisos (403)
        if (error.response?.status === 403) {
            window.location.href = '/unauthorized';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
