import { reservaService, senderoService } from '@/api';
import { Button, Card } from '@/components/common';
import { ReservaForm } from '@/components/reservas';
import { useAuth } from '@/hooks';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CrearReserva = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const [sendero, setSendero] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingSendero, setLoadingSendero] = useState(false);

    const senderoId = searchParams.get('senderoId');

    useEffect(() => {
        if (senderoId) {
            fetchSendero();
        }
    }, [senderoId]);

    const fetchSendero = async () => {
        try {
            setLoadingSendero(true);
            const data = await senderoService.getById(senderoId);
            setSendero(data);
        } catch (error) {
            console.error('Error al cargar sendero:', error);
            toast.error('Error al cargar el sendero');
        } finally {
            setLoadingSendero(false);
        }
    };

    const handleSubmit = async (data) => {
        try {
            setLoading(true);
            await reservaService.create(user.id, data);
            toast.success('¡Reserva creada exitosamente!');
            navigate('/mis-reservas');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al crear la reserva');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (loadingSendero) {
        return (
            <div className="container-custom py-12">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Cargando información...</p>
                </div>
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
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </Button>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Nueva Reserva
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Completa la información para crear tu reserva
                    </p>
                </div>

                {/* Información del sendero seleccionado */}
                {sendero && (
                    <Card className="mb-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-1">
                                    Sendero Seleccionado
                                </h3>
                                <p className="text-primary-700 dark:text-primary-300">
                                    {sendero.nombre}
                                </p>
                                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                                    {sendero.duracionHoras}h • {sendero.distanciaKm}km • {sendero.dificultad}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Formulario */}
                <Card>
                    <ReservaForm
                        senderoId={senderoId ? parseInt(senderoId) : null}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={loading}
                    />
                </Card>
            </div>
        </div>
    );
};

export default CrearReserva;
