import { authService, reservaService, visitanteService } from '@/api';
import { Button, Card, Input } from '@/components/common';
import { ReservaTimeline } from '@/components/reservas';
import { useAuth } from '@/hooks';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CreditCard, Mail, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const MiPerfil = () => {
    const { user, updateUser } = useAuth();

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reservas, setReservas] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        totalReservas: 0,
        completadas: 0,
        proximasVisitas: 0
    });

    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        telefono: user?.telefono || '',
        passwordActual: '',
        passwordNueva: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDatosUsuario();
    }, []);

    const fetchDatosUsuario = async () => {
        try {
            // Verificar que user existe y tiene id antes de hacer requests
            if (!user?.id) {
                console.warn('Usuario no tiene ID, saltando fetch de datos');
                return;
            }

            // Cargar reservas para el historial
            if (user.rol === 'VISITANTE') {
                const reservasData = await reservaService.getByVisitante(user.id);
                setReservas(reservasData);

                // Calcular estadísticas
                const hoy = new Date().toISOString().split('T')[0];
                setEstadisticas({
                    totalReservas: reservasData.length,
                    completadas: reservasData.filter(r => r.estado === 'COMPLETADA').length,
                    proximasVisitas: reservasData.filter(r =>
                        r.fechaVisita >= hoy &&
                        ['CONFIRMADA', 'PENDIENTE'].includes(r.estado)
                    ).length
                });
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    };

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

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        }

        // Validar cambio de contraseña si se ingresó
        if (formData.passwordNueva) {
            if (!formData.passwordActual) {
                newErrors.passwordActual = 'Ingresa tu contraseña actual';
            }
            if (formData.passwordNueva.length < 8) {
                newErrors.passwordNueva = 'Mínimo 8 caracteres';
            }
            if (formData.passwordNueva !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            // Actualizar información básica
            await visitanteService.update(user.id, {
                nombre: formData.nombre,
                apellido: formData.apellido,
                telefono: formData.telefono
            });

            // Cambiar contraseña si se ingresó
            if (formData.passwordNueva) {
                await authService.cambiarPassword(
                    user.id,
                    formData.passwordActual,
                    formData.passwordNueva
                );
            }

            // Actualizar contexto
            updateUser({
                nombre: formData.nombre,
                apellido: formData.apellido,
                telefono: formData.telefono
            });

            toast.success('Perfil actualizado exitosamente');
            setEditMode(false);

            // Limpiar campos de contraseña
            setFormData(prev => ({
                ...prev,
                passwordActual: '',
                passwordNueva: '',
                confirmPassword: ''
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Mi Perfil
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Gestiona tu información personal y revisa tu historial
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna izquierda - Información personal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información básica */}
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Información Personal
                                </h2>
                                {!editMode && (
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={() => setEditMode(true)}
                                    >
                                        Editar
                                    </Button>
                                )}
                            </div>

                            {editMode ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            error={errors.nombre}
                                            icon={User}
                                            required
                                        />

                                        <Input
                                            label="Apellido"
                                            name="apellido"
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            error={errors.apellido}
                                            icon={User}
                                            required
                                        />
                                    </div>

                                    <Input
                                        label="Teléfono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        error={errors.telefono}
                                        icon={Phone}
                                        required
                                    />

                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                            Cambiar Contraseña (opcional)
                                        </h3>

                                        <div className="space-y-4">
                                            <Input
                                                label="Contraseña Actual"
                                                name="passwordActual"
                                                type="password"
                                                value={formData.passwordActual}
                                                onChange={handleChange}
                                                error={errors.passwordActual}
                                                placeholder="••••••••"
                                            />

                                            <Input
                                                label="Nueva Contraseña"
                                                name="passwordNueva"
                                                type="password"
                                                value={formData.passwordNueva}
                                                onChange={handleChange}
                                                error={errors.passwordNueva}
                                                placeholder="Mínimo 8 caracteres"
                                            />

                                            <Input
                                                label="Confirmar Nueva Contraseña"
                                                name="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                error={errors.confirmPassword}
                                                placeholder="Confirma tu nueva contraseña"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            loading={loading}
                                        >
                                            Guardar Cambios
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setEditMode(false);
                                                setFormData({
                                                    nombre: user?.nombre || '',
                                                    apellido: user?.apellido || '',
                                                    telefono: user?.telefono || '',
                                                    passwordActual: '',
                                                    passwordNueva: '',
                                                    confirmPassword: ''
                                                });
                                                setErrors({});
                                            }}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Nombre Completo</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {user?.nombre} {user?.apellido}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{user?.telefono}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Cédula</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{user?.cedula}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Miembro desde</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {user?.fechaRegistro ?
                                                    format(new Date(user.fechaRegistro), "d 'de' MMMM, yyyy", { locale: es }) :
                                                    'N/A'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Historial de reservas */}
                        {user?.rol === 'VISITANTE' && (
                            <ReservaTimeline reservas={reservas} />
                        )}
                    </div>

                    {/* Columna derecha - Estadísticas */}
                    {user?.rol === 'VISITANTE' && (
                        <div className="space-y-6">
                            <Card>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Estadísticas
                                </h2>

                                <div className="space-y-4">
                                    <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                            {estadisticas.totalReservas}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Total de Reservas
                                        </p>
                                    </div>

                                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {estadisticas.completadas}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Recorridos Completados
                                        </p>
                                    </div>

                                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                            {estadisticas.proximasVisitas}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Próximas Visitas
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MiPerfil;
