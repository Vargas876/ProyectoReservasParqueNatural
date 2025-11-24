import { AsignarGuiaModal } from '@/components/asignaciones';
import {
    Button,
    Card,
    EmptyState,
    EstadoBadge, Input, Select
} from '@/components/common';
import { ESTADOS_RESERVA } from '@/utils/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar,
    CheckCircle,
    Eye,
    Filter,
    MapPin,
    Search,
    User,
    X
} from 'lucide-react';
import { useState } from 'react';

const ReservasTable = ({
    reservas = [],
    onConfirmar,
    onCancelar,
    onVerDetalle,
    onRefresh,
    loading = false
}) => {
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [showAsignarModal, setShowAsignarModal] = useState(false);
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

    // Opciones de filtro por estado
    const estadoOptions = [
        { value: '', label: 'Todos los estados' },
        ...Object.values(ESTADOS_RESERVA).map(estado => ({
            value: estado,
            label: estado.charAt(0) + estado.slice(1).toLowerCase()
        }))
    ];

    // Filtrar reservas
    const reservasFiltradas = reservas.filter(reserva => {
        const cumpleBusqueda = busqueda === '' ||
            reserva.sendero?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            reserva.visitante?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            reserva.visitante?.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
            reserva.idReserva.toString().includes(busqueda);

        const cumpleEstado = filtroEstado === '' || reserva.estado === filtroEstado;

        return cumpleBusqueda && cumpleEstado;
    });

    const handleAsignarGuia = (reserva) => {
        setReservaSeleccionada(reserva);
        setShowAsignarModal(true);
    };

    if (loading) {
        return (
            <Card>
                <div className="text-center py-12">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Cargando reservas...</p>
                </div>
            </Card>
        );
    }

    if (reservas.length === 0) {
        return (
            <Card>
                <EmptyState
                    icon={Calendar}
                    title="No hay reservas"
                    description="Aún no se han creado reservas en el sistema."
                />
            </Card>
        );
    }

    return (
        <>
            <Card>
                {/* Header con filtros */}
                <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Reservas ({reservasFiltradas.length})
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                placeholder="Buscar por sendero, visitante o ID..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                icon={Search}
                            />
                        </div>
                        <Select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            options={estadoOptions}
                            icon={Filter}
                        />
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    ID
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Sendero
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Visitante
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Fecha
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Personas
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Estado
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Guía
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasFiltradas.map((reserva) => {
                                const fechaFormateada = format(
                                    new Date(reserva.fechaVisita),
                                    'd MMM yyyy',
                                    { locale: es }
                                );

                                const puedeConfirmar = reserva.estado === ESTADOS_RESERVA.PENDIENTE;
                                const puedeCancelar = [
                                    ESTADOS_RESERVA.PENDIENTE,
                                    ESTADOS_RESERVA.CONFIRMADA
                                ].includes(reserva.estado);

                                return (
                                    <tr
                                        key={reserva.idReserva}
                                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {/* ID */}
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-mono text-gray-900 dark:text-white">
                                                #{reserva.idReserva}
                                            </span>
                                        </td>

                                        {/* Sendero */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                                <span className="text-sm text-gray-900 dark:text-white">
                                                    {reserva.sendero?.nombre}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Visitante */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {reserva.visitante?.nombre} {reserva.visitante?.apellido}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {reserva.visitante?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Fecha */}
                                        <td className="py-3 px-4 text-center">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {fechaFormateada}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                {reserva.horaInicio ? (() => {
                                                    try {
                                                        const date = new Date(reserva.horaInicio);
                                                        return isNaN(date.getTime()) ? 'N/A' : format(date, 'HH:mm');
                                                    } catch (error) {
                                                        return 'N/A';
                                                    }
                                                })() : 'N/A'}
                                            </div>
                                        </td>

                                        {/* Personas */}
                                        <td className="py-3 px-4 text-center">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {reserva.numeroPersonas}
                                            </span>
                                        </td>

                                        {/* Estado */}
                                        <td className="py-3 px-4 text-center">
                                            <EstadoBadge estado={reserva.estado} />
                                        </td>

                                        {/* Guía */}
                                        <td className="py-3 px-4 text-center">
                                            {reserva.guiaAsignado ? (
                                                <div className="text-sm">
                                                    <p className="text-gray-900 dark:text-white font-medium">
                                                        {reserva.guiaAsignado.nombre} {reserva.guiaAsignado.apellido}
                                                    </p>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="small"
                                                    onClick={() => handleAsignarGuia(reserva)}
                                                    disabled={reserva.estado !== ESTADOS_RESERVA.CONFIRMADA}
                                                >
                                                    Asignar
                                                </Button>
                                            )}
                                        </td>

                                        {/* Acciones */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                {onVerDetalle && (
                                                    <button
                                                        onClick={() => onVerDetalle(reserva)}
                                                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400"
                                                        title="Ver detalle"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {puedeConfirmar && onConfirmar && (
                                                    <button
                                                        onClick={() => onConfirmar(reserva)}
                                                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-green-600 dark:text-green-400"
                                                        title="Confirmar"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {puedeCancelar && onCancelar && (
                                                    <button
                                                        onClick={() => onCancelar(reserva)}
                                                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                                                        title="Cancelar"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Sin resultados */}
                {reservasFiltradas.length === 0 && (busqueda || filtroEstado) && (
                    <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400">
                            No se encontraron reservas con los filtros aplicados
                        </p>
                    </div>
                )}
            </Card>

            {/* Modal asignar guía */}
            {reservaSeleccionada && (
                <AsignarGuiaModal
                    isOpen={showAsignarModal}
                    onClose={() => {
                        setShowAsignarModal(false);
                        setReservaSeleccionada(null);
                    }}
                    reserva={reservaSeleccionada}
                    onSuccess={() => {
                        // Recargar datos
                        if (onRefresh) {
                            onRefresh();
                        }
                        setShowAsignarModal(false);
                        setReservaSeleccionada(null);
                    }}
                />
            )}
        </>
    );
};

export default ReservasTable;
