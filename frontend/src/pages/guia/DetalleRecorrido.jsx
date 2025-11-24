import { asignacionService } from '@/api';
import { RecorridoActions } from '@/components/asignaciones';
import { Alert, Badge, Button, Card, Loader } from '@/components/common';
import { SenderoDetail } from '@/components/senderos';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const DetalleRecorrido = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [asignacion, setAsignacion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAsignacion();
    }, [id]);

    const fetchAsignacion = async () => {
        try {
            setLoading(true);
            const data = await asignacionService.getById(id);
            setAsignacion(data);
        } catch (error) {
            console.error('Error al cargar asignación:', error);
            toast.error('Error al cargar el recorrido');
            navigate('/guia/agenda');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        fetchAsignacion();
    };

    if (loading) {
        return (
            <div className="container-custom py-12">
                <Loader text="Cargando recorrido..." />
            </div>
        );
    }

    if (!asignacion) {
        return (
            <div className="container-custom py-12">
                <Alert variant="error" title="Error">
                    No se pudo cargar el recorrido
                </Alert>
            </div>
        );
    }

    const { reserva, horaInicioReal, horaFinReal, observacionesGuia, incidencias } = asignacion;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom max-w-6xl">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="outline"
                        icon={ArrowLeft}
                        onClick={() => navigate('/guia/agenda')}
                    >
                        Volver a Agenda
                    </Button>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Detalle del Recorrido #{asignacion.idAsignacion}
                    </h1>
                    <div className="flex items-center gap-3">
                        {!horaInicioReal && !horaFinReal && (
                            <Badge variant="warning">Pendiente de Iniciar</Badge>
                        )}
                        {horaInicioReal && !horaFinReal && (
                            <Badge variant="info">En Curso</Badge>
                        )}
                        {horaFinReal && (
                            <Badge variant="success">Completado</Badge>
                        )}
                        {incidencias && (
                            <Badge variant="danger">Con Incidencias</Badge>
                        )}
                    </div>
                </div>

                {/* Acciones principales */}
                <div className="mb-8">
                    <RecorridoActions asignacion={asignacion} onSuccess={handleSuccess} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información del Sendero */}
                        <Card>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Información del Sendero
                            </h2>
                            {reserva?.sendero && (
                                <SenderoDetail sendero={reserva.sendero} />
                            )}
                        </Card>

                        {/* Observaciones y reportes */}
                        {(observacionesGuia || incidencias) && (
                            <Card>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Reportes del Recorrido
                                </h2>

                                {observacionesGuia && (
                                    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                                            Observaciones
                                        </h3>
                                        <p className="text-green-700 dark:text-green-300">
                                            {observacionesGuia}
                                        </p>
                                    </div>
                                )}

                                {incidencias && asignacion.descripcionIncidencias && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                                            Incidencias Reportadas
                                        </h3>
                                        <p className="text-red-700 dark:text-red-300">
                                            {asignacion.descripcionIncidencias}
                                        </p>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>

                    {/* Sidebar - Información de la reserva */}
                    <div className="space-y-6">
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Detalles de la Reserva
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-primary-600" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Fecha</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {reserva?.fechaVisita ?
                                                format(new Date(reserva.fechaVisita), "d 'de' MMMM, yyyy", { locale: es }) :
                                                'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-primary-600" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Hora Programada</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {(() => {
                                                if (!reserva?.horaInicio) return 'N/A';
                                                try {
                                                    // horaInicio puede venir como "HH:mm:ss" o con fecha completa
                                                    const dateStr = reserva.horaInicio.includes('T')
                                                        ? reserva.horaInicio
                                                        : `2000-01-01T${reserva.horaInicio}`;
                                                    const date = new Date(dateStr);
                                                    return isNaN(date.getTime()) ? 'N/A' : format(date, 'HH:mm');
                                                } catch {
                                                    return 'N/A';
                                                }
                                            })()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-primary-600" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Personas</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {reserva?.numeroPersonas}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Información del visitante */}
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Información del Visitante
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {reserva?.visitante?.nombre} {reserva?.visitante?.apellido}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {reserva?.visitante?.telefono}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm break-all">
                                        {reserva?.visitante?.email}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Horarios reales */}
                        {(horaInicioReal || horaFinReal) && (
                            <Card className="bg-blue-50 dark:bg-blue-900/20">
                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                                    Horarios Reales
                                </h3>

                                <div className="space-y-3">
                                    {horaInicioReal && (
                                        <div>
                                            <p className="text-sm text-blue-600 dark:text-blue-400">Inicio</p>
                                            <p className="font-medium text-blue-900 dark:text-blue-100">
                                                {format(new Date(horaInicioReal), "HH:mm 'hrs'", { locale: es })}
                                            </p>
                                        </div>
                                    )}

                                    {horaFinReal && (
                                        <div>
                                            <p className="text-sm text-blue-600 dark:text-blue-400">Finalización</p>
                                            <p className="font-medium text-blue-900 dark:text-blue-100">
                                                {format(new Date(horaFinReal), "HH:mm 'hrs'", { locale: es })}
                                            </p>
                                        </div>
                                    )}

                                    {horaInicioReal && horaFinReal && (
                                        <div>
                                            <p className="text-sm text-blue-600 dark:text-blue-400">Duración</p>
                                            <p className="font-medium text-blue-900 dark:text-blue-100">
                                                {Math.round((new Date(horaFinReal) - new Date(horaInicioReal)) / 1000 / 60)} minutos
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleRecorrido;
