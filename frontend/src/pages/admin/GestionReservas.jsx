import { reservaService } from '@/api';
import { ReservasTable } from '@/components/admin';
import { Modal } from '@/components/common';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const GestionReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

    useEffect(() => {
        fetchReservas();
    }, []);

    const fetchReservas = async () => {
        try {
            setLoading(true);
            const data = await reservaService.getAll();
            console.log('=== DEBUG RESERVAS ===');
            console.log('Total reservas:', data.length);
            if (data.length > 0) {
                console.log('Primera reserva:', data[0]);
                console.log('Campo guia:', data[0].guia);
                console.log('Keys de reserva:', Object.keys(data[0]));
            }
            setReservas(data);
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            toast.error('Error al cargar las reservas');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmar = async (reserva) => {
        const confirmado = window.confirm(
            `¿Confirmar la reserva #${reserva.idReserva}?`
        );

        if (!confirmado) return;

        try {
            await reservaService.confirmar(reserva.idReserva);
            toast.success('Reserva confirmada exitosamente');
            fetchReservas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al confirmar la reserva');
        }
    };

    const handleCancelar = async (reserva) => {
        const confirmado = window.confirm(
            `¿Cancelar la reserva #${reserva.idReserva}?`
        );

        if (!confirmado) return;

        const motivo = prompt('Motivo de cancelación:');

        try {
            await reservaService.cancelar(reserva.idReserva, motivo || 'Cancelada por el administrador');
            toast.success('Reserva cancelada exitosamente');
            fetchReservas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al cancelar la reserva');
        }
    };

    const handleVerDetalle = (reserva) => {
        setReservaSeleccionada(reserva);
        setShowDetalleModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Gestión de Reservas
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Administra todas las reservas del sistema
                    </p>
                </div>

                {/* Tabla de reservas */}
                <ReservasTable
                    reservas={reservas}
                    loading={loading}
                    onConfirmar={handleConfirmar}
                    onCancelar={handleCancelar}
                    onVerDetalle={handleVerDetalle}
                    onRefresh={fetchReservas}
                />

                {/* Modal detalle */}
                <Modal
                    isOpen={showDetalleModal}
                    onClose={() => {
                        setShowDetalleModal(false);
                        setReservaSeleccionada(null);
                    }}
                    title={`Detalle de Reserva #${reservaSeleccionada?.idReserva}`}
                    size="large"
                >
                    {reservaSeleccionada && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Sendero</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {reservaSeleccionada.sendero?.nombre}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {reservaSeleccionada.estado}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Visitante</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {reservaSeleccionada.visitante?.nombre} {reservaSeleccionada.visitante?.apellido}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Fecha</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {reservaSeleccionada.fechaVisita}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Personas</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {reservaSeleccionada.numeroPersonas}
                                    </p>
                                </div>
                                {reservaSeleccionada.guia && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Guía</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {reservaSeleccionada.guia.nombre} {reservaSeleccionada.guia.apellido}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {reservaSeleccionada.observaciones && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Observaciones</p>
                                    <p className="text-gray-900 dark:text-white">
                                        {reservaSeleccionada.observaciones}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default GestionReservas;
