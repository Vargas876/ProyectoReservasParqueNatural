import { reservaService } from '@/api';
import { Alert, Button, Modal } from '@/components/common';
import { MisReservas as MisReservasComponent, ReservaForm } from '@/components/reservas';
import { useAuth } from '@/hooks';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MisReservasPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [reservaEditar, setReservaEditar] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => {
        fetchReservas();
    }, []);

    const fetchReservas = async () => {
        try {
            setLoading(true);
            const data = await reservaService.getByVisitante(user.id);
            setReservas(data);
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            toast.error('Error al cargar las reservas');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (reserva) => {
        setReservaEditar(reserva);
        setShowEditModal(true);
    };

    const handleUpdateReserva = async (data) => {
        try {
            setLoadingAction(true);
            await reservaService.update(reservaEditar.idReserva, data);
            toast.success('Reserva actualizada exitosamente');
            setShowEditModal(false);
            setReservaEditar(null);
            fetchReservas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al actualizar la reserva');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleCancel = async (reserva) => {
        const confirmado = window.confirm(
            '¿Estás seguro de que deseas cancelar esta reserva?'
        );

        if (!confirmado) return;

        const motivo = prompt('Motivo de cancelación (opcional):');

        try {
            setLoadingAction(true);
            await reservaService.cancelar(reserva.idReserva, motivo || 'Cancelada por el usuario');
            toast.success('Reserva cancelada exitosamente');
            fetchReservas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al cancelar la reserva');
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Mis Reservas
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona tus reservas activas y consulta tu historial
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() => navigate('/senderos')}
                    >
                        Nueva Reserva
                    </Button>
                </div>

                {/* Componente de reservas con tabs */}
                <MisReservasComponent
                    reservas={reservas}
                    loading={loading}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                />

                {/* Modal de edición */}
                <Modal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setReservaEditar(null);
                    }}
                    title="Editar Reserva"
                    size="large"
                >
                    <Alert variant="warning" className="mb-4">
                        Solo puedes modificar reservas que estén en estado PENDIENTE
                    </Alert>
                    {reservaEditar && (
                        <ReservaForm
                            reserva={reservaEditar}
                            onSubmit={handleUpdateReserva}
                            onCancel={() => {
                                setShowEditModal(false);
                                setReservaEditar(null);
                            }}
                            loading={loadingAction}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default MisReservasPage;
