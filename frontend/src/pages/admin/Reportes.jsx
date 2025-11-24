import { estadisticasService, reservaService, senderoService } from '@/api';
import { ReservasChart, StatsCard } from '@/components/admin';
import { Button, Card, Select } from '@/components/common';
import { Calendar, Download, Map, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Reportes = () => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [reservas, setReservas] = useState([]);
    const [senderos, setSenderos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState('mes'); // dia, semana, mes, año

    useEffect(() => {
        fetchDatos();
    }, [periodo]);

    const fetchDatos = async () => {
        try {
            setLoading(true);
            const [stats, reservasData, senderosData] = await Promise.all([
                estadisticasService.getEstadisticasGenerales(),
                reservaService.getAll(),
                senderoService.getAll()
            ]);

            setEstadisticas(stats);
            setReservas(reservasData);
            setSenderos(senderosData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            toast.error('Error al cargar los reportes');
        } finally {
            setLoading(false);
        }
    };

    const handleExportarPDF = () => {
        toast.info('Funcionalidad de exportación próximamente');
    };

    const handleExportarExcel = () => {
        toast.info('Funcionalidad de exportación próximamente');
    };

    const periodoOptions = [
        { value: 'dia', label: 'Hoy' },
        { value: 'semana', label: 'Esta Semana' },
        { value: 'mes', label: 'Este Mes' },
        { value: 'año', label: 'Este Año' }
    ];

    if (loading) {
        return (
            <div className="container-custom py-12">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Cargando reportes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Reportes y Estadísticas
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Analiza el rendimiento del sistema
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" icon={Download} onClick={handleExportarPDF}>
                            Exportar PDF
                        </Button>
                        <Button variant="outline" icon={Download} onClick={handleExportarExcel}>
                            Exportar Excel
                        </Button>
                    </div>
                </div>

                {/* Filtro de período */}
                <div className="mb-8 max-w-xs">
                    <Select
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                        options={periodoOptions}
                    />
                </div>

                {/* KPIs principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Reservas"
                        value={estadisticas?.totalReservas || 0}
                        icon={Calendar}
                        variant="primary"
                    />
                    <StatsCard
                        title="Reservas Hoy"
                        value={estadisticas?.reservasHoy || 0}
                        icon={TrendingUp}
                        variant="success"
                    />
                    <StatsCard
                        title="Visitantes Activos"
                        value={estadisticas?.visitantesActivos || 0}
                        icon={Users}
                        variant="info"
                    />
                    <StatsCard
                        title="Senderos Activos"
                        value={estadisticas?.senderosActivos || 0}
                        icon={Map}
                        variant="warning"
                    />
                </div>

                {/* Gráficas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <ReservasChart reservas={reservas} tipo="bar" />
                    <ReservasChart reservas={reservas} tipo="line" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <ReservasChart reservas={reservas} tipo="pie" />

                    {/* Resumen por sendero */}
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Reservas por Sendero
                        </h3>
                        <div className="space-y-3">
                            {senderos.slice(0, 5).map((sendero) => {
                                const reservasSendero = reservas.filter(
                                    r => r.sendero?.idSendero === sendero.idSendero
                                );
                                return (
                                    <div
                                        key={sendero.idSendero}
                                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                                    >
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {sendero.nombre}
                                        </span>
                                        <span className="text-primary-600 dark:text-primary-400 font-bold">
                                            {reservasSendero.length}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Tabla de estados */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Distribución por Estado
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Estado
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Cantidad
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Porcentaje
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(estadisticas?.reservasPorEstado || {}).map(([estado, cantidad]) => (
                                    <tr key={estado} className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="py-3 px-4 text-gray-900 dark:text-white capitalize">
                                            {estado}
                                        </td>
                                        <td className="py-3 px-4 text-center font-medium text-gray-900 dark:text-white">
                                            {cantidad}
                                        </td>
                                        <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                                            {estadisticas?.totalReservas > 0
                                                ? ((cantidad / estadisticas.totalReservas) * 100).toFixed(1)
                                                : 0}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Reportes;
