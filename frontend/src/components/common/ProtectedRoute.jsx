import { useAuth } from '@/hooks';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    // Mostrar loader mientras verifica autenticación
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader text="Verificando autenticación..." />
            </div>
        );
    }

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si se especificaron roles, verificar que el usuario tenga el rol correcto
    if (roles.length > 0 && !roles.includes(user?.rol)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Usuario autenticado y con rol correcto
    return children;
};

export default ProtectedRoute;
