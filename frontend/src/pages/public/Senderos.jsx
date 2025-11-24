import { senderoService } from '@/api';
import { EmptyState, Loader } from '@/components/common';
import { SenderoFilter, SenderoList } from '@/components/senderos';
import { Map } from 'lucide-react';
import { useEffect, useState } from 'react';

const Senderos = () => {
    const [senderos, setSenderos] = useState([]);
    const [senderosFiltrados, setSenderosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSenderos();
    }, []);

    const fetchSenderos = async () => {
        try {
            setLoading(true);
            const data = await senderoService.getActivos();
            setSenderos(data);
            setSenderosFiltrados(data);
        } catch (error) {
            console.error('Error al cargar senderos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (filters) => {
        let filtrados = [...senderos];

        // Filtrar por búsqueda
        if (filters.busqueda) {
            const termino = filters.busqueda.toLowerCase();
            filtrados = filtrados.filter(s =>
                s.nombre.toLowerCase().includes(termino) ||
                s.descripcion.toLowerCase().includes(termino)
            );
        }

        // Filtrar por dificultad
        if (filters.dificultad) {
            filtrados = filtrados.filter(s => s.dificultad === filters.dificultad);
        }

        // Filtrar por duración máxima
        if (filters.duracionMax) {
            filtrados = filtrados.filter(s => s.duracionHoras <= parseFloat(filters.duracionMax));
        }

        // Filtrar por distancia máxima
        if (filters.distanciaMax) {
            filtrados = filtrados.filter(s => s.distanciaKm <= parseFloat(filters.distanciaMax));
        }

        setSenderosFiltrados(filtrados);
    };

    const handleReset = () => {
        setSenderosFiltrados(senderos);
    };

    if (loading) {
        return (
            <div className="container-custom py-12">
                <Loader text="Cargando senderos..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Nuestros Senderos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Explora todos los senderos disponibles y encuentra tu próxima aventura
                    </p>
                </div>

                {/* Filtros */}
                <div className="mb-8">
                    <SenderoFilter
                        onFilter={handleFilter}
                        onReset={handleReset}
                    />
                </div>

                {/* Resultados */}
                {senderosFiltrados.length === 0 ? (
                    <EmptyState
                        icon={Map}
                        title="No se encontraron senderos"
                        description="Intenta ajustar los filtros de búsqueda"
                    />
                ) : (
                    <>
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Mostrando {senderosFiltrados.length} {senderosFiltrados.length === 1 ? 'sendero' : 'senderos'}
                        </div>
                        <SenderoList senderos={senderosFiltrados} />
                    </>
                )}
            </div>
        </div>
    );
};

export default Senderos;
