import { Badge, Button, Card } from '@/components/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    MapPin,
    Play,
    User, Users
} from 'lucide-react';

const AsignacionCard = ({
    asignacion,
    onIniciar,
    onFinalizar,
    onVerDetalle,
    showActions = true
}) => {
    const {
        idAsignacion,
        fechaAsignacion,
        horaInicioReal,
        horaFinReal,
        observaciones,
        observacionesGuia,
        incidencias,
        descripcionIncidencias,
        calificacionVisitante,
        reserva,
        guia
    } = asignacion;

    // Determinar estado del recorrido
    const getEstadoRecorrido = () => {
        if (horaFinReal) return { text: 'Finalizado', variant: 'success', icon: CheckCircle };
        if (horaInicioReal) return { text: 'En Curso', variant: 'info', icon: Play };
        return { text: 'Pendiente', variant: 'warning', icon: Clock };
    };

    const estadoRecorrido = getEstadoRecorrido();
    const EstadoIcon = estadoRecorrido.icon;

    const puedeIniciar = !horaInicioReal && !horaFinReal;
    const puedeFinalizar = horaInicioReal && !horaFinReal;

    // Formatear fechas con validación
    const fechaFormateada = (() => {
        if (!fechaAsignacion) return 'Fecha no disponible';
        try {
            const date = new Date(fechaAsignacion);
            return isNaN(date.getTime()) ? 'Fecha no disponible' : format(date, "d 'de' MMMM, yyyy", { locale: es });
        } catch {
            return 'Fecha no disponible';
        }
    })();

    const fechaVisita = (() => {
        if (!reserva?.fechaVisita) return 'Fecha No Disponible';
        try {
            // Parsear como fecha local para evitar cambio de zona horaria
            const [year, month, day] = reserva.fechaVisita.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return isNaN(date.getTime()) ? 'Fecha No Disponible' : format(date, "EEEE, d 'de' MMMM", { locale: es });
        } catch {
            return 'Fecha No Disponible';
        }
    })();

    const horaInicio = (() => {
        if (!reserva?.horaInicio) return 'Hora no disponible';
        try {
            // horaInicio puede venir como "HH:mm:ss" string o como DateTime
            const dateStr = reserva.horaInicio.includes('T') ? reserva.horaInicio : `2000-01-01T${reserva.horaInicio}`;
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? 'Hora no disponible' : format(date, 'HH:mm');
        } catch {
            return 'Hora no disponible';
        }
    })();

    return (
        <Card className="hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {reserva?.sendero?.nombre || 'Sendero no disponible'}
                    </h3>
                    <Badge variant={estadoRecorrido.variant}>
                        <EstadoIcon className="w-4 h-4 mr-1" />
                        {estadoRecorrido.text}
                    </Badge>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    #{idAsignacion}
                </span>
            </div>

            {/* Información del guía */}
            <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                    <User className="w-5 h-5" />
                    <div>
                        <p className="text-sm font-medium">Guía Asignado</p>
                        <p className="text-sm">
                            {guia ? `${guia.nombre} ${guia.apellido}` : 'No asignado'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Detalles de la reserva */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="capitalize">{fechaVisita}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span>{horaInicio}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span>{reserva?.numeroPersonas} personas</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span>
                        {reserva?.sendero?.duracionHoras} hrs • {reserva?.sendero?.distanciaKm} km
                    </span>
                </div>
            </div>

            {/* Información del visitante */}
            {reserva?.visitante && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Visitante:</span>{' '}
                        {reserva.visitante.nombre} {reserva.visitante.apellido}
                    </p>
                    {reserva.visitante.telefono && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Teléfono:</span>{' '}
                            {reserva.visitante.telefono}
                        </p>
                    )}
                </div>
            )}

            {/* Horarios reales */}
            {(horaInicioReal || horaFinReal) && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
                    {horaInicioReal && (
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            <span className="font-medium">Iniciado:</span>{' '}
                            {format(new Date(horaInicioReal), 'HH:mm', { locale: es })}
                        </p>
                    )}
                    {horaFinReal && (
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            <span className="font-medium">Finalizado:</span>{' '}
                            {format(new Date(horaFinReal), 'HH:mm', { locale: es })}
                        </p>
                    )}
                </div>
            )}

            {/* Observaciones */}
            {observaciones && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Observaciones:</span> {observaciones}
                    </p>
                </div>
            )}

            {/* Observaciones del guía */}
            {observacionesGuia && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                        <span className="font-medium">Reporte del Guía:</span> {observacionesGuia}
                    </p>
                </div>
            )}

            {/* Incidencias */}
            {incidencias && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                Incidencias Reportadas
                            </p>
                            {descripcionIncidencias && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                    {descripcionIncidencias}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Calificación */}
            {calificacionVisitante && (
                <div className="mb-4 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <span className="text-2xl">⭐</span>
                    <span className="font-semibold">{calificacionVisitante.toFixed(1)}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Calificación del visitante
                    </span>
                </div>
            )}

            {/* Acciones */}
            {showActions && (
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {puedeIniciar && onIniciar && (
                        <Button
                            variant="primary"
                            size="small"
                            icon={Play}
                            onClick={() => onIniciar(asignacion)}
                            className="flex-1"
                        >
                            Iniciar Recorrido
                        </Button>
                    )}

                    {puedeFinalizar && onFinalizar && (
                        <Button
                            variant="primary"
                            size="small"
                            icon={CheckCircle}
                            onClick={() => onFinalizar(asignacion)}
                            className="flex-1"
                        >
                            Finalizar Recorrido
                        </Button>
                    )}

                    {onVerDetalle && (
                        <Button
                            variant="outline"
                            size="small"
                            icon={FileText}
                            onClick={() => onVerDetalle(asignacion)}
                            className={puedeIniciar || puedeFinalizar ? '' : 'flex-1'}
                        >
                            Ver Detalle
                        </Button>
                    )}
                </div>
            )}
        </Card>
    );
};

export default AsignacionCard;
