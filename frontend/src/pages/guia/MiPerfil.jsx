import { asignacionService } from '@/api';
import { Badge, Card } from '@/components/common';
import { useAuth } from '@/hooks';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Award, Calendar, CreditCard, Mail, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const MiPerfilGuia = () => {
    const { user } = useAuth();

    const [estadisticas, setEstadisticas] = useState({
        totalRecorridos: 0,
        completados: 0,
        promedioCalificacion: 0
    });

    useEffect(() => {
        fetchEstadisticas();
    }, []);

    const fetchEstadisticas = async () => {
        try {
            const asignaciones = await asignacionService.getByGuia(user.id);

            const completadas = asignaciones.filter(a => a.horaFinReal);
            const calificaciones = completadas
                .filter(a => a.calificacionVisitante)
                .map(a => a.calificacionVisitante);

            setEstadisticas({
                totalRecorridos: asignaciones.length,
                completados: completadas.length,
                promedioCalificacion: calificaciones.length > 0
                    ? (calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length).toFixed(1)
                    : 0
            });
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Mi Perfil
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Información de tu cuenta como guía
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información personal */}
                    <div className="lg:col-span-2">
                        <Card>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                Información Personal
                            </h2>

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

                                {user?.especialidades && (
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <Award className="w-5 h-5 text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Especialidades</p>
                                            <div className="flex flex-wrap gap-2">
                                                {user.especialidades.split(',').map((esp, index) => (
                                                    <Badge key={index} variant="primary">
                                                        {esp.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Guía desde</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {user?.fechaRegistro ?
                                                format(new Date(user.fechaRegistro), "d 'de' MMMM, yyyy", { locale: es }) :
                                                'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Estadísticas */}
                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Mis Estadísticas
                            </h2>

                            <div className="space-y-4">
                                <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                        {estadisticas.totalRecorridos}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Recorridos
                                    </p>
                                </div>

                                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {estadisticas.completados}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Completados
                                    </p>
                                </div>

                                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                            {estadisticas.promedioCalificacion}
                                        </span>
                                        <span className="text-yellow-500 text-2xl">★</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Calificación Promedio
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiPerfilGuia;
