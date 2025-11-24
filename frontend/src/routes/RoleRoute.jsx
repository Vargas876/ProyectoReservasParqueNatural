import { Loader } from '@/components/common';
import { useAuth } from '@/hooks';
import { Navigate } from 'react-router-dom';

/**
 * Rutas protegidas por rol
 * Verifica autenticación y permisos específicos por rol
 */
const RoleRoute = ({ children, roles = [], requireAuth = true }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    // Mostrar loader mientras verifica autenticación
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader text="Verificando permisos..." />
            </div>
        );
    }

    // Si requiere autenticación y no está autenticado
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si se especificaron roles y el usuario no tiene el rol correcto
    if (roles.length > 0 && (!user || !roles.includes(user.rol))) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Usuario autorizado
    return children;
};

export default RoleRoute;
