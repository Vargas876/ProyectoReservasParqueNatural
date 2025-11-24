import { Button, Card, Input } from '@/components/common';
import { useAuth } from '@/hooks';
import { ROLES } from '@/utils/constants';
import { Lock, LogIn, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            const userData = await login(formData);

            toast.success(`¡Bienvenido, ${userData.nombre}!`);

            // Redirigir según el rol
            switch (userData.rol) {
                case ROLES.ADMIN:
                    navigate('/admin/dashboard');
                    break;
                case ROLES.GUIA:
                    navigate('/guia/agenda');
                    break;
                case ROLES.VISITANTE:
                    navigate(from);
                    break;
                default:
                    navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-md w-full">
                {/* Logo/Título */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Iniciar Sesión
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Accede a tu cuenta para gestionar tus reservas
                    </p>
                </div>

                {/* Formulario */}
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            icon={Mail}
                            placeholder="tu@email.com"
                            required
                            autoFocus
                        />

                        <Input
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            icon={Lock}
                            placeholder="••••••••"
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            loading={loading}
                            icon={LogIn}
                        >
                            Iniciar Sesión
                        </Button>
                    </form>

                    {/* Links adicionales */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            ¿No tienes una cuenta?{' '}
                            <Link
                                to="/register"
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Credenciales de prueba */}
                <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Credenciales de Prueba
                    </h3>
                    <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <p><strong>Admin:</strong> admin2@parquenatural.com / password</p>
                        <p><strong>Guía:</strong> pedro.rodriguez@parquenatural.com / Guia123</p>
                        <p><strong>Visitante:</strong> Crea tu cuenta</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
