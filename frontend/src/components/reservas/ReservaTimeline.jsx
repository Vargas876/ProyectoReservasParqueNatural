import { Card, EstadoBadge } from '@/components/common';
import { ESTADOS_RESERVA } from '@/utils/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar, CheckCircle,
    Clock,
    User,
    XCircle
} from 'lucide-react';

const ReservaTimeline = ({ reservas = [] }) => {
    // Ordenar por fecha de creación descendente
    const reservasOrdenadas = [...reservas].sort((a, b) =>
        new Date(b.fechaReserva) - new Date(a.fechaReserva)
    );

    const getIconoEstado = (estado) => {
        switch (estado) {
            case ESTADOS_RESERVA.COMPLETADA:
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case ESTADOS_RESERVA.CANCELADA:
                return <XCircle className="w-6 h-6 text-red-600" />;
            case ESTADOS_RESERVA.CONFIRMADA:
                return <CheckCircle className="w-6 h-6 text-blue-600" />;
            case ESTADOS_RESERVA.NO_ASISTIO:
                return <XCircle className="w-6 h-6 text-gray-600" />;
            default:
                return <Clock className="w-6 h-6 text-yellow-600" />;
        }
    };

    if (!reservas || reservas.length === 0) {
        return (
            <Card>
                <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        No hay historial de reservas
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Historial de Reservas
            </h2>

            {/* Timeline */}
            <div className="relative">
                {/* Línea vertical */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                {/* Items */}
                <div className="space-y-6">
                    {reservasOrdenadas.map((reserva, index) => (
                        <div key={reserva.idReserva} className="relative pl-12">
                            {/* Punto en la línea */}
                            <div className="absolute left-2 top-2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                {getIconoEstado(reserva.estado)}
                            </div>

                            {/* Contenido */}
                            <Card className={`
                ${index === 0 ? 'border-l-4 border-l-primary-600' : ''}
              `}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {reserva.sendero?.nombre}
                                        </h3>
                                        <EstadoBadge estado={reserva.estado} />
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        #{reserva.idReserva}
                                    </span>
                                </div>

                                {/* Detalles */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {format(new Date(reserva.fechaVisita), "d 'de' MMMM, yyyy", { locale: es })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <User className="w-4 h-4" />
                                        <span>{reserva.numeroPersonas} personas</span>
                                    </div>

                                    {reserva.observaciones && (
                                        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-gray-700 dark:text-gray-300">
                                            {reserva.observaciones}
                                        </div>
                                    )}

                                    {/* Fecha de creación */}
                                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                                        Reservado el {format(new Date(reserva.fechaReserva), "d 'de' MMMM, yyyy", { locale: es })}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReservaTimeline;
