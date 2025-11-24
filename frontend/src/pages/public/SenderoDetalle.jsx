import { senderoService } from '@/api';
import { Alert, Button, Loader } from '@/components/common';
import { SenderoDetail } from '@/components/senderos';
import { useAuth } from '@/hooks';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const SenderoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [sendero, setSendero] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSendero();
    }, [id]);

    const fetchSendero = async () => {
        try {
            setLoading(true);
            const data = await senderoService.getById(id);
            setSendero(data);
        } catch (error) {
            console.error('Error al cargar sendero:', error);
            setError('No se pudo cargar el sendero');
        } finally {
            setLoading(false);
        }
    };

    const handleReservar = () => {
        if (isAuthenticated) {
            navigate(`/reserva/crear?senderoId=${id}`);
        } else {
            navigate('/login', {
                state: { from: { pathname: `/senderos/${id}` } }
            });
        }
    };

    if (loading) {
        return (
            <div className="container-custom py-12">
                <Loader text="Cargando sendero..." />
            </div>
        );
    }

    if (error || !sendero) {
        return (
            <div className="container-custom py-12">
                <Alert variant="error" title="Error">
                    {error || 'Sendero no encontrado'}
                </Alert>
                <div className="mt-6">
                    <Link to="/senderos">
                        <Button variant="outline" icon={ArrowLeft}>
                            Volver a Senderos
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                {/* Botón volver */}
                <div className="mb-6">
                    <Button
                        variant="outline"
                        icon={ArrowLeft}
                        onClick={() => navigate('/senderos')}
                    >
                        Volver a Senderos
                    </Button>
                </div>

                {/* Detalle del sendero */}
                <SenderoDetail sendero={sendero} />

                {/* CTA Reservar */}
                {sendero.estado === 'ACTIVO' && (
                    <div className="mt-8">
                        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-8 text-white text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                ¿Listo para esta aventura?
                            </h2>
                            <p className="text-xl text-primary-50 mb-6">
                                Reserva ahora tu lugar y prepárate para una experiencia inolvidable
                            </p>
                            <Button
                                variant="primary"
                                size="large"
                                onClick={handleReservar}
                                icon={Calendar}
                                className="bg-white text-primary-600 hover:bg-primary-50"
                            >
                                {isAuthenticated ? 'Reservar Ahora' : 'Iniciar Sesión para Reservar'}
                            </Button>
                        </div>
                    </div>
                )}

                {sendero.estado !== 'ACTIVO' && (
                    <Alert variant="warning" className="mt-8">
                        Este sendero no está disponible actualmente para reservas.
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default SenderoDetalle;
