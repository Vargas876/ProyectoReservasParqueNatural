import { Alert, Button, Card, Input } from '@/components/common';
import { useAuth } from '@/hooks';
import { CreditCard, Lock, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    const { registerVisitante } = useAuth();

    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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

        if (!formData.cedula.trim()) {
            newErrors.cedula = 'La cédula es requerida';
        } else if (!/^\d{6,10}$/.test(formData.cedula)) {
            newErrors.cedula = 'Cédula inválida (6-10 dígitos)';
        }

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^\d{10}$/.test(formData.telefono)) {
            newErrors.telefono = 'Teléfono inválido (10 dígitos)';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Mínimo 8 caracteres';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(formData.password)) {
            newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            const { confirmPassword, ...userData } = formData;
            await registerVisitante(userData);

            toast.success('¡Cuenta creada exitosamente!');
            navigate('/senderos');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Crear Cuenta
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Regístrate para reservar tus recorridos
                    </p>
                </div>

                {/* Formulario */}
                <Card>
                    <Alert variant="info" className="mb-6">
                        Crea tu cuenta como visitante para acceder al sistema de reservas
                    </Alert>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Información Personal */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Información Personal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Cédula"
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    error={errors.cedula}
                                    icon={CreditCard}
                                    placeholder="1234567890"
                                    required
                                />

                                <Input
                                    label="Teléfono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    error={errors.telefono}
                                    icon={Phone}
                                    placeholder="3001234567"
                                    required
                                />

                                <Input
                                    label="Nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    error={errors.nombre}
                                    icon={User}
                                    placeholder="Juan"
                                    required
                                />

                                <Input
                                    label="Apellido"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    error={errors.apellido}
                                    icon={User}
                                    placeholder="Pérez"
                                    required
                                />
                            </div>
                        </div>

                        {/* Información de Cuenta */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Información de Cuenta
                            </h3>
                            <div className="space-y-4">
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
                                />

                                <Input
                                    label="Contraseña"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    icon={Lock}
                                    placeholder="Ej: MiClave123"
                                    required
                                    help="Mínimo 8 caracteres con mayúsculas, minúsculas y números"
                                />

                                <Input
                                    label="Confirmar Contraseña"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={errors.confirmPassword}
                                    icon={Lock}
                                    placeholder="Confirma tu contraseña"
                                    required
                                />
                            </div>
                        </div>

                        {/* Botón de registro */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            loading={loading}
                        >
                            Crear Cuenta
                        </Button>
                    </form>

                    {/* Link a login */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                to="/login"
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                            >
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;
