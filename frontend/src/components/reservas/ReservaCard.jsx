import { Button, Card, EstadoBadge } from '@/components/common';
import { ESTADOS_RESERVA } from '@/utils/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar,
    CheckCircle,
    Clock,
    Edit2,
    MapPin,
    User,
    Users,
    X
} from 'lucide-react';

const ReservaCard = ({
    reserva,
    onEdit,
    onCancel,
    onConfirmar,
    showActions = true,
    showVisitante = false,
    showGuia = false
}) => {
    const {
        idReserva,
        fechaVisita,
        numeroPersonas,
        horaInicio,
        estado,
        observaciones,
        sendero,
        visitante,
        guia
    } = reserva;

    const puedeEditar = estado === ESTADOS_RESERVA.PENDIENTE;
    const puedeCancelar = [ESTADOS_RESERVA.PENDIENTE, ESTADOS_RESERVA.CONFIRMADA].includes(estado);

    // Formatear fecha
    const fechaFormateada = (() => {
        if (!fechaVisita) return 'Fecha no disponible';
        try {
            const date = new Date(fechaVisita);
            return isNaN(date.getTime()) ?
                'Fecha no disponible' :
                format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
        } catch (error) {
            return 'Fecha no disponible';
        }
    })();

    // Formatear hora de inicio con validación
    const horaInicioFormateada = (() => {
        if (!horaInicio) return 'Hora no disponible';
        try {
            // horaInicio puede venir como "HH:mm:ss" o como timestamp completo
            const timeStr = typeof horaInicio === 'string' && !horaInicio.includes('T')
                ? `2000-01-01T${horaInicio}`
                : horaInicio;
            const date = new Date(timeStr);
            return isNaN(date.getTime())
                ? 'Hora no disponible'
                : format(date, 'HH:mm');
        } catch {
            return 'Hora no disponible';
        }
    })();

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {sendero?.nombre || 'Sendero no disponible'}
                    </h3>
                    <EstadoBadge estado={estado} />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    #{idReserva}
                </span>
            </div>

            {/* Detalles de la reserva */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <span className="capitalize">{fechaFormateada}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <span>{horaInicioFormateada}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <span>{numeroPersonas} {numeroPersonas === 1 ? 'persona' : 'personas'}</span>
                </div>

                {sendero && (
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        <span>{sendero.duracionHoras} hrs • {sendero.distanciaKm} km</span>
                    </div>
                )}

                {/* Mostrar visitante (para admin/guía) */}
                {showVisitante && visitante && (
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <User className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        <span>{visitante.nombre} {visitante.apellido}</span>
                    </div>
                )}

                {/* Mostrar guía asignado */}
                {showGuia && guia && (
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <User className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        <span>Guía: {guia.nombre} {guia.apellido}</span>
                    </div>
                )}
            </div>

            {/* Observaciones */}
            {observaciones && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Observaciones:</span> {observaciones}
                    </p>
                </div>
            )}

            {/* Acciones */}
            {showActions && (
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {onConfirmar && estado === ESTADOS_RESERVA.PENDIENTE && (
                        <Button
                            variant="primary"
                            size="small"
                            icon={CheckCircle}
                            onClick={() => onConfirmar(reserva)}
                            className="flex-1"
                        >
                            Confirmar
                        </Button>
                    )}

                    {onEdit && puedeEditar && (
                        <Button
                            variant="outline"
                            size="small"
                            icon={Edit2}
                            onClick={() => onEdit(reserva)}
                            className="flex-1"
                        >
                            Editar
                        </Button>
                    )}

                    {onCancel && puedeCancelar && (
                        <Button
                            variant="danger"
                            size="small"
                            icon={X}
                            onClick={() => onCancel(reserva)}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                    )}
                </div>
            )}
        </Card>
    );
};

export default ReservaCard;
