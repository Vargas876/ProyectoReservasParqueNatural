import { Badge, Card } from '@/components/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar,
    Compass,
    TrendingUp,
    Users
} from 'lucide-react';
import { useMemo } from 'react';
import ReservasChart from './ReservasChart';
import StatsCard from './StatsCard';

const Dashboard = ({
    reservas = [],
    visitantes = [],
    guias = [],
    senderos = []
}) => {
    // Calcular estadísticas
    const stats = useMemo(() => {
        const hoy = new Date().toISOString().split('T')[0];

        const reservasHoy = reservas.filter(r => r.fechaVisita === hoy).length;
        const reservasPendientes = reservas.filter(r => r.estado === 'PENDIENTE').length;
        const reservasConfirmadas = reservas.filter(r => r.estado === 'CONFIRMADA').length;
        const visitantesActivos = visitantes.filter(v => v.estado === 'ACTIVO').length;
        const guiasActivos = guias.filter(g => g.estado === 'ACTIVO').length;
        const senderosActivos = senderos.filter(s => s.estado === 'ACTIVO').length;

        return {
            totalReservas: reservas.length,
            reservasHoy,
            reservasPendientes,
            reservasConfirmadas,
            visitantesActivos,
            guiasActivos,
            senderosActivos
        };
    }, [reservas, visitantes, guias, senderos]);

    // Reservas recientes
    const reservasRecientes = useMemo(() => {
        return [...reservas]
            .sort((a, b) => new Date(b.fechaReserva) - new Date(a.fechaReserva))
            .slice(0, 5);
    }, [reservas]);

    // Senderos más populares
    const senderosPopulares = useMemo(() => {
        const conteo = {};
        reservas.forEach(r => {
            const id = r.sendero?.idSendero;
            if (id) {
                conteo[id] = (conteo[id] || 0) + 1;
            }
        });

        return senderos
            .map(s => ({
                ...s,
                reservas: conteo[s.idSendero] || 0
            }))
            .sort((a, b) => b.reservas - a.reservas)
            .slice(0, 5);
    }, [reservas, senderos]);

    return (
        <div className="space-y-6">
            {/* KPIs principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Reservas de Hoy"
                    value={stats.reservasHoy}
                    icon={Calendar}
                    variant="primary"
                    subtitle="Programadas para hoy"
                />

                <StatsCard
                    title="Pendientes"
                    value={stats.reservasPendientes}
                    icon={TrendingUp}
                    variant="warning"
                    subtitle="Requieren confirmación"
                />

                <StatsCard
                    title="Visitantes Activos"
                    value={stats.visitantesActivos}
                    icon={Users}
                    variant="success"
                    subtitle={`de ${visitantes.length} totales`}
                />

                <StatsCard
                    title="Guías Activos"
                    value={stats.guiasActivos}
                    icon={Compass}
                    variant="info"
                    subtitle={`de ${guias.length} totales`}
                />
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReservasChart reservas={reservas} tipo="bar" />
                <ReservasChart reservas={reservas} tipo="pie" />
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reservas recientes */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Reservas Recientes
                    </h3>
                    <div className="space-y-3">
                        {reservasRecientes.length === 0 ? (
                            <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                                No hay reservas recientes
                            </p>
                        ) : (
                            reservasRecientes.map((reserva) => (
                                <div
                                    key={reserva.idReserva}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                            {reserva.sendero?.nombre}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {reserva.visitante?.nombre} • {' '}
                                            {format(new Date(reserva.fechaVisita), 'd MMM', { locale: es })}
                                        </p>
                                    </div>
                                    <Badge variant={
                                        reserva.estado === 'CONFIRMADA' ? 'success' :
                                            reserva.estado === 'PENDIENTE' ? 'warning' : 'gray'
                                    }>
                                        {reserva.estado}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Senderos populares */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Senderos Más Populares
                    </h3>
                    <div className="space-y-3">
                        {senderosPopulares.length === 0 ? (
                            <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                                No hay datos de senderos
                            </p>
                        ) : (
                            senderosPopulares.map((sendero, index) => (
                                <div
                                    key={sendero.idSendero}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                {sendero.nombre}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {sendero.duracionHoras}h • {sendero.distanciaKm}km
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                            {sendero.reservas}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            reservas
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
