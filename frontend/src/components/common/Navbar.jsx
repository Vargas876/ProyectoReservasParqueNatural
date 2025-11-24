import { useAuth, useTheme } from '@/hooks';
import { ROLES } from '@/utils/constants';
import {
    Calendar,
    Compass,
    Home,
    LayoutDashboard,
    LogOut,
    Map,
    Menu,
    Moon,
    Sun,
    User,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getNavLinks = () => {
        if (!isAuthenticated) {
            return [
                { to: '/', label: 'Inicio', icon: Home },
                { to: '/senderos', label: 'Senderos', icon: Map },
            ];
        }

        switch (user?.rol) {
            case ROLES.ADMIN:
                return [
                    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { to: '/admin/senderos', label: 'Senderos', icon: Map },
                    { to: '/admin/reservas', label: 'Reservas', icon: Calendar },
                    { to: '/admin/guias', label: 'Guías', icon: Compass },
                    { to: '/admin/visitantes', label: 'Visitantes', icon: Users },
                ];

            case ROLES.GUIA:
                return [
                    { to: '/', label: 'Inicio', icon: Home },
                    { to: '/guia/agenda', label: 'Mi Agenda', icon: Calendar },
                    { to: '/guia/asignaciones', label: 'Asignaciones', icon: Map },
                ];

            case ROLES.VISITANTE:
                return [
                    { to: '/', label: 'Inicio', icon: Home },
                    { to: '/senderos', label: 'Senderos', icon: Map },
                    { to: '/mis-reservas', label: 'Mis Reservas', icon: Calendar },
                ];

            default:
                return [{ to: '/', label: 'Inicio', icon: Home }];
        }
    };

    const getPerfilUrl = () => {
        if (!isAuthenticated || !user) return '/login';

        switch (user.rol) {
            case ROLES.ADMIN:
                return '/admin/dashboard'; // Admin no tiene página de perfil específica
            case ROLES.GUIA:
                return '/guia/perfil';
            case ROLES.VISITANTE:
                return '/mi-perfil';
            default:
                return '/';
        }
    };

    const navLinks = getNavLinks();

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <Map className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Parque Natural
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            );
                        })}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-700" />
                            )}
                        </button>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to={getPerfilUrl()}
                                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    <User className="w-5 h-5" />
                                    <span>{user?.nombre}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline flex items-center gap-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login" className="btn btn-outline">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col gap-3">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                );
                            })}

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to={getPerfilUrl()}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <User className="w-5 h-5" />
                                        {user?.nombre}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 px-4">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="btn btn-outline w-full"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="btn btn-primary w-full"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
