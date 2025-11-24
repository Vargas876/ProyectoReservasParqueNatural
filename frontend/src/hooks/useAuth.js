import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

/**
 * Hook para acceder al contexto de autenticación
 * @returns {Object} Contexto de autenticación con user, login, logout, etc.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }

    return context;
};
