import { useAuth } from '@/hooks';
import { ROLES } from '@/utils/constants';
import { Navigate } from 'react-router-dom';

/**
 * Rutas públicas - Redirige a usuarios autenticados a su dashboard correspondiente
 */
const PublicRoute = ({ children }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    // Si está autenticado, redirigir según su rol
    if (isAuthenticated && user) {
        switch (user.rol) {
            case ROLES.ADMIN:
                return <Navigate to="/admin/dashboard" replace />;
            case ROLES.GUIA:
                return <Navigate to="/guia/agenda" replace />;
            case ROLES.VISITANTE:
                return <Navigate to="/mis-reservas" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    // Si no está autenticado, mostrar la página pública
    return children;
};

export default PublicRoute;
