import {
    guiaService,
    reservaService,
    senderoService,
    visitanteService
} from '@/api';
import { Dashboard as DashboardComponent } from '@/components/admin';
import { Loader } from '@/components/common';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const DashboardPage = () => {
    const [data, setData] = useState({
        reservas: [],
        visitantes: [],
        guias: [],
        senderos: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [reservas, visitantes, guias, senderos] = await Promise.all([
                reservaService.getAll(),
                visitanteService.getAll(),
                guiaService.getAll(),
                senderoService.getAll()
            ]);

            setData({ reservas, visitantes, guias, senderos });
        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
            toast.error('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container-custom py-12">
                <Loader text="Cargando dashboard..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Dashboard Administrativo
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Resumen general del sistema
                    </p>
                </div>

                <DashboardComponent
                    reservas={data.reservas}
                    visitantes={data.visitantes}
                    guias={data.guias}
                    senderos={data.senderos}
                />
            </div>
        </div>
    );
};

export default DashboardPage;
