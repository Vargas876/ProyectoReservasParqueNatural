import { Card } from '@/components/common';
import { ESTADO_RESERVA_LABELS } from '@/utils/constants';
import { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';

const ReservasChart = ({ reservas = [], tipo = 'bar' }) => {
    // Helper function para colores
    const getColorForEstado = (estado) => {
        const colores = {
            PENDIENTE: '#f59e0b',
            CONFIRMADA: '#3b82f6',
            COMPLETADA: '#10b981',
            CANCELADA: '#ef4444',
            NO_ASISTIO: '#6b7280'
        };
        return colores[estado] || '#9ca3af';
    };

    // Procesar datos para el gráfico de barras por mes
    const datosPorMes = useMemo(() => {
        const meses = {};

        reservas.forEach(reserva => {
            const fecha = new Date(reserva.fechaVisita);
            const mes = fecha.toLocaleString('es', { month: 'short', year: 'numeric' });

            if (!meses[mes]) {
                meses[mes] = { mes, total: 0, confirmadas: 0, pendientes: 0, canceladas: 0 };
            }

            meses[mes].total++;
            if (reserva.estado === 'CONFIRMADA') meses[mes].confirmadas++;
            if (reserva.estado === 'PENDIENTE') meses[mes].pendientes++;
            if (reserva.estado === 'CANCELADA') meses[mes].canceladas++;
        });

        return Object.values(meses).slice(-6); // Últimos 6 meses
    }, [reservas]);

    // Procesar datos por estado para gráfico de torta
    const datosPorEstado = useMemo(() => {
        const estados = {};

        reservas.forEach(reserva => {
            const estado = reserva.estado;
            estados[estado] = (estados[estado] || 0) + 1;
        });

        return Object.entries(estados).map(([estado, cantidad]) => ({
            name: ESTADO_RESERVA_LABELS[estado]?.text || estado,
            value: cantidad,
            color: getColorForEstado(estado)
        }));
    }, [reservas]);

    // Colores para las barras
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    if (tipo === 'bar') {
        return (
            <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Reservas por Mes
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datosPorMes}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                        <XAxis
                            dataKey="mes"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="confirmadas" fill="#3b82f6" name="Confirmadas" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="pendientes" fill="#f59e0b" name="Pendientes" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="canceladas" fill="#ef4444" name="Canceladas" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        );
    }

    if (tipo === 'line') {
        return (
            <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Tendencia de Reservas
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={datosPorMes}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                        <XAxis
                            dataKey="mes"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Total"
                            dot={{ fill: '#3b82f6', r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="confirmadas"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Confirmadas"
                            dot={{ fill: '#10b981', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        );
    }

    if (tipo === 'pie') {
        return (
            <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Reservas por Estado
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={datosPorEstado}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {datosPorEstado.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        );
    }

    return null;
};

export default ReservasChart;
