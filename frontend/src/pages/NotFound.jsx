import { Button } from '@/components/common';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="text-center max-w-lg">
                {/* Ilustración 404 */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/20 mb-6">
                        <Search className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                        404
                    </h1>
                </div>

                {/* Mensaje */}
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
                    Página no encontrada
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                </p>

                {/* Sugerencias */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        ¿Qué puedes hacer?
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-primary-600 mt-1">•</span>
                            <span>Verifica que la URL esté escrita correctamente</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary-600 mt-1">•</span>
                            <span>Vuelve a la página anterior y intenta de nuevo</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary-600 mt-1">•</span>
                            <span>Navega a la página de inicio</span>
                        </li>
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
                    <Link to="/">
                        <Button variant="primary" icon={Home}>
                            Ir al Inicio
                        </Button>
                    </Link>
                </div>

                {/* Enlaces rápidos */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Enlaces útiles:
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/senderos"
                            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                            Ver Senderos
                        </Link>
                        <Link
                            to="/login"
                            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            to="/register"
                            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                            Registrarse
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
