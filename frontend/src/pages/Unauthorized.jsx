import { Button } from '@/components/common';
import { useAuth } from '@/hooks';
import { ArrowLeft, Home, LogOut, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRedireccionPorRol = () => {
        if (!isAuthenticated) return '/login';

        switch (user?.rol) {
            case 'ADMIN':
                return '/admin/dashboard';
            case 'GUIA':
                return '/guia/agenda';
            case 'VISITANTE':
                return '/mis-reservas';
            default:
                return '/';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="text-center max-w-lg">
                {/* Icono de alerta */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
                        <ShieldAlert className="w-16 h-16 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-9xl font-bold text-red-600 dark:text-red-400 mb-4">
                        403
                    </h1>
                </div>

                {/* Mensaje */}
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
                    Acceso Denegado
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    No tienes los permisos necesarios para acceder a esta página.
                </p>

                {/* Información del usuario */}
                {isAuthenticated && user && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                                {user.nombre.charAt(0)}{user.apellido?.charAt(0)}
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {user.nombre} {user.apellido}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Rol: {user.rol}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Estás intentando acceder a una sección que no está disponible para tu rol.
                        </p>
                    </div>
                )}

                {/* Sugerencias */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Posibles soluciones:
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        {!isAuthenticated ? (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span>Inicia sesión con una cuenta que tenga los permisos necesarios</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span>Si no tienes una cuenta, regístrate como visitante</span>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span>Verifica que estás intentando acceder a la sección correcta para tu rol</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span>Contacta al administrador si crees que deberías tener acceso</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span>Cierra sesión e inicia con otra cuenta si tienes una</span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="outline"
                        icon={ArrowLeft}
                        onClick={() => navigate(-1)}
                    >
                        Volver Atrás
                    </Button>

                    {isAuthenticated ? (
                        <>
                            <Link to={getRedireccionPorRol()}>
                                <Button variant="primary" icon={Home}>
                                    Ir a Mi Panel
                                </Button>
                            </Link>
                            <Button
                                variant="danger"
                                icon={LogOut}
                                onClick={handleLogout}
                            >
                                Cerrar Sesión
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/">
                                <Button variant="primary" icon={Home}>
                                    Ir al Inicio
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="primary">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Información de contacto */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        ¿Necesitas ayuda?
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Contacta al administrador en{' '}
                        <a
                            href="mailto:admin@parquenatural.com"
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                            admin@parquenatural.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
