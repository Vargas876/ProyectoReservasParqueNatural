import { ESTADOS_RESERVA } from '@/utils/constants';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import ReservaCard from './ReservaCard';

const MisReservas = ({
    reservas = [],
    loading = false,
    onEdit,
    onCancel
}) => {
    const [filtroActivo, setFiltroActivo] = useState('todas');

    // Filtrar reservas según el tab activo
    const reservasFiltradas = reservas.filter(reserva => {
        switch (filtroActivo) {
            case 'activas':
                return [ESTADOS_RESERVA.PENDIENTE, ESTADOS_RESERVA.CONFIRMADA].includes(reserva.estado);
            case 'pendientes':
                return reserva.estado === ESTADOS_RESERVA.PENDIENTE;
            case 'confirmadas':
                return reserva.estado === ESTADOS_RESERVA.CONFIRMADA;
            case 'completadas':
                return reserva.estado === ESTADOS_RESERVA.COMPLETADA;
            case 'canceladas':
                return reserva.estado === ESTADOS_RESERVA.CANCELADA;
            default:
                return true;
        }
    });

    // Contar reservas por estado
    const contadores = {
        todas: reservas.length,
        activas: reservas.filter(r =>
            [ESTADOS_RESERVA.PENDIENTE, ESTADOS_RESERVA.CONFIRMADA].includes(r.estado)
        ).length,
        pendientes: reservas.filter(r => r.estado === ESTADOS_RESERVA.PENDIENTE).length,
        confirmadas: reservas.filter(r => r.estado === ESTADOS_RESERVA.CONFIRMADA).length,
        completadas: reservas.filter(r => r.estado === ESTADOS_RESERVA.COMPLETADA).length,
        canceladas: reservas.filter(r => r.estado === ESTADOS_RESERVA.CANCELADA).length
    };

    const tabs = [
        { id: 'todas', label: 'Todas', count: contadores.todas },
        { id: 'activas', label: 'Activas', count: contadores.activas },
        { id: 'pendientes', label: 'Pendientes', count: contadores.pendientes },
        { id: 'confirmadas', label: 'Confirmadas', count: contadores.confirmadas },
        { id: 'completadas', label: 'Completadas', count: contadores.completadas },
        { id: 'canceladas', label: 'Canceladas', count: contadores.canceladas }
    ];

    return (
        <div className="space-y-6">
            {/* Tabs de filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFiltroActivo(tab.id)}
                                className={`
                  px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors
                  border-b-2 flex items-center gap-2
                  ${filtroActivo === tab.id
                                        ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }
                `}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`
                    px-2 py-0.5 rounded-full text-xs font-semibold
                    ${filtroActivo === tab.id
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }
                  `}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lista de reservas */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Cargando reservas...</p>
                </div>
            ) : reservasFiltradas.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No hay reservas {filtroActivo !== 'todas' ? filtroActivo : ''}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {filtroActivo === 'todas'
                            ? 'Aún no has creado ninguna reserva.'
                            : `No tienes reservas ${filtroActivo}.`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reservasFiltradas.map((reserva) => (
                        <ReservaCard
                            key={reserva.idReserva}
                            reserva={reserva}
                            onEdit={onEdit}
                            onCancel={onCancel}
                            showGuia={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisReservas;
