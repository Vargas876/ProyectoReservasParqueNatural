import { authService } from '@/api';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar si hay sesión guardada al cargar
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsAuthenticated(true);

                // TODO: Verificar token con el backend cuando el endpoint esté implementado
                // El endpoint /auth/verify actualmente devuelve 500
                /* 
                try {
                    const response = await authService.verifyToken();
                    if (response.valid) {
                        setUser(response.user);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.warn('No se pudo verificar el token:', error);
                }
                */
            }
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);

            // Backend response structure: { token, id, nombre, apellido, email, rol, tipo }
            const { token, id, nombre, apellido, email, rol } = response;

            // Guardar token inmediatamente
            localStorage.setItem('token', token);

            // Intentar obtener datos adicionales del perfil (telefono, cedula, fechaRegistro)
            // IMPORTANTE: Mantener siempre los datos del login (id, rol) porque los DTOs del backend no los incluyen
            try {
                let perfilAdicional = null;

                if (rol === 'VISITANTE') {
                    const { default: visitanteService } = await import('../api/visitanteService');
                    perfilAdicional = await visitanteService.getById(id);
                } else if (rol === 'GUIA') {
                    const { default: guiaService } = await import('../api/guiaService');
                    perfilAdicional = await guiaService.getById(id);
                }

                // Construir objeto de usuario: PRIORIZAR datos del login (id, rol), agregar datos del perfil si existen
                const userData = {
                    id,  // Del login response
                    nombre: perfilAdicional?.nombre || nombre,
                    apellido: perfilAdicional?.apellido || apellido,
                    email: perfilAdicional?.email || email,
                    rol,  // Del login response - CRÍTICO
                    telefono: perfilAdicional?.telefono || null,
                    cedula: perfilAdicional?.cedula || null,
                    fechaRegistro: perfilAdicional?.fechaRegistro || null,
                    estado: perfilAdicional?.estado || 'ACTIVO'
                };

                // Guardar en localStorage
                localStorage.setItem('user', JSON.stringify(userData));

                // Actualizar estado
                setUser(userData);
                setIsAuthenticated(true);

                return userData;
            } catch (profileError) {
                console.warn('No se pudo cargar perfil adicional, usando datos del login:', profileError);

                // Fallback: usar SOLO los datos básicos del login (MÁS CONFIABLE)
                const userData = {
                    id,
                    nombre,
                    apellido,
                    email,
                    rol  // CRÍTICO - sin esto el navbar falla
                };

                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);

                return userData;
            }
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const registerVisitante = async (userData) => {
        try {
            const response = await authService.registerVisitante(userData);

            // Backend response structure: { token, id, nombre, apellido, email, rol, tipo }
            const { token, id, nombre, apellido, email, rol } = response;

            // Construir objeto de usuario
            const newUser = {
                id,
                nombre,
                apellido,
                email,
                rol
            };

            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUser));

            // Actualizar estado
            setUser(newUser);
            setIsAuthenticated(true);

            return newUser;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    };

    const logout = () => {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Limpiar estado
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const hasRole = (roles) => {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        return isAuthenticated && user && roles.includes(user.rol);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        registerVisitante,
        logout,
        updateUser,
        hasRole,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
