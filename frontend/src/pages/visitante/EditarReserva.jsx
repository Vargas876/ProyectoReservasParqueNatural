import { reservaService } from '@/api';
import { Alert, Button, Card, Loader } from '@/components/common';
import { ReservaForm } from '@/components/reservas';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditarReserva = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [reserva, setReserva] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        fetchReserva();
    }, [id]);

    const fetchReserva = async () => {
        try {
            setLoading(true);
            const data = await reservaService.getById(id);

            // Verificar que se puede editar
            if (data.estado !== 'PENDIENTE') {
                toast.error('Solo puedes editar reservas en estado PENDIENTE');
                navigate('/mis-reservas');
                return;
            }

            setReserva(data);
        } catch (error) {
            console.error('Error al cargar reserva:', error);
            toast.error('Error al cargar la reserva');
            navigate('/mis-reservas');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        try {
            setLoadingSubmit(true);
            await reservaService.update(id, data);
            toast.success('Reserva actualizada exitosamente');
            navigate('/mis-reservas');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al actualizar la reserva');
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleCancel = () => {
        navigate('/mis-reservas');
    };

    if (loading) {
        return (
            <div className="container-custom py-12">
                <Loader text="Cargando reserva..." />
            </div>
        );
    }

    if (!reserva) {
        return (
            <div className="container-custom py-12">
                <Alert variant="error" title="Error">
                    No se pudo cargar la reserva
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="outline"
                        icon={ArrowLeft}
                        onClick={() => navigate('/mis-reservas')}
                    >
                        Volver a Mis Reservas
                    </Button>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Editar Reserva #{reserva.idReserva}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Modifica los detalles de tu reserva
                    </p>
                </div>

                {/* Información del sendero */}
                <Card className="mb-6 bg-primary-50 dark:bg-primary-900/20">
                    <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                        Sendero: {reserva.sendero?.nombre}
                    </h3>
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                        {reserva.sendero?.duracionHoras}h • {reserva.sendero?.distanciaKm}km • {reserva.sendero?.dificultad}
                    </p>
                </Card>

                {/* Formulario */}
                <Card>
                    <ReservaForm
                        reserva={reserva}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={loadingSubmit}
                    />
                </Card>
            </div>
        </div>
    );
};

export default EditarReserva;
