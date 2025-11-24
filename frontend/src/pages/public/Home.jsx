import { senderoService } from '@/api';
import { Button, Card } from '@/components/common';
import { SenderoCard } from '@/components/senderos';
import { useAuth } from '@/hooks';
import {
    ArrowRight,
    Calendar,
    Map,
    Shield, Star
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const [senderos, setSenderos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSenderos();
    }, []);

    const fetchSenderos = async () => {
        try {
            const data = await senderoService.getActivos();
            setSenderos(data.slice(0, 3)); // Solo mostrar 3
        } catch (error) {
            console.error('Error al cargar senderos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="container-custom relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Descubre la Naturaleza
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-50">
                            Explora senderos increíbles, reserva tu visita guiada y vive experiencias únicas en nuestro parque natural
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/senderos">
                                <Button variant="primary" size="large" className="bg-white text-primary-600 hover:bg-primary-50">
                                    Ver Senderos
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/register">
                                    <Button variant="outline" size="large" className="border-white text-white hover:bg-white/10">
                                        Crear Cuenta
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        ¿Por qué elegirnos?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center">
                            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
                                <Map className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Senderos Variados
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Rutas para todos los niveles, desde principiantes hasta expertos en senderismo
                            </p>
                        </Card>

                        <Card className="text-center">
                            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Guías Certificados
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Personal capacitado y experimentado para garantizar tu seguridad
                            </p>
                        </Card>

                        <Card className="text-center">
                            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Reserva Fácil
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Sistema de reservas online rápido y sencillo, disponible 24/7
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Senderos Destacados */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Senderos Destacados
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Explora nuestros senderos más populares y encuentra la aventura perfecta para ti
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="spinner mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Cargando senderos...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {senderos.map((sendero) => (
                                    <SenderoCard key={sendero.idSendero} sendero={sendero} />
                                ))}
                            </div>

                            <div className="text-center">
                                <Link to="/senderos">
                                    <Button variant="primary">
                                        Ver Todos los Senderos
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Testimonios */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Lo que dicen nuestros visitantes
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                nombre: 'María González',
                                texto: 'Una experiencia inolvidable. Los guías son muy profesionales y el sendero estaba en perfecto estado.',
                                rating: 5
                            },
                            {
                                nombre: 'Carlos Rodríguez',
                                texto: 'Excelente organización y atención. Definitivamente volveré con mi familia.',
                                rating: 5
                            },
                            {
                                nombre: 'Ana Martínez',
                                texto: 'Hermosos paisajes y un recorrido muy bien estructurado. Lo recomiendo 100%.',
                                rating: 5
                            }
                        ].map((testimonio, index) => (
                            <Card key={index}>
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(testimonio.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    "{testimonio.texto}"
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {testimonio.nombre}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        ¿Listo para tu próxima aventura?
                    </h2>
                    <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
                        Únete a miles de visitantes que han disfrutado de nuestros senderos
                    </p>
                    {isAuthenticated ? (
                        <Link to="/senderos">
                            <Button size="large" className="bg-white text-primary-600 hover:bg-primary-50">
                                Reservar Ahora
                                <Calendar className="w-5 h-5" />
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/register">
                            <Button size="large" className="bg-white text-primary-600 hover:bg-primary-50">
                                Crear Cuenta Gratis
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
