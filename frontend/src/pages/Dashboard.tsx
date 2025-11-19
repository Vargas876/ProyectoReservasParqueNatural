import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { useReservas } from '../hooks/useReservas';
import { useSenderos } from '../hooks/useSenderos';
import { ESTADO_COLORS, ESTADO_LABELS } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const { data: reservas, isLoading: loadingReservas } = useReservas();
  const { data: senderos, isLoading: loadingSenderos } = useSenderos();

  if (loadingReservas || loadingSenderos) {
    return (
      <MainLayout>
        <Loading message="Cargando estadísticas..." />
      </MainLayout>
    );
  }

  const totalReservas = reservas?.length || 0;
  const reservasConfirmadas = reservas?.filter((r) => r.estado === 'CONFIRMADA').length || 0;
  const reservasPendientes = reservas?.filter((r) => r.estado === 'PENDIENTE').length || 0;
  const totalSenderos = senderos?.length || 0;
  const senderosActivos = senderos?.filter((s) => s.estado === 'ACTIVO').length || 0;

  const reservasRecientes = reservas?.slice(0, 5) || [];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Dashboard Administrativo
        </h1>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reservas</p>
                <p className="text-3xl font-bold text-gray-900">{totalReservas}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reservas Confirmadas</p>
                <p className="text-3xl font-bold text-green-600">{reservasConfirmadas}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reservas Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">{reservasPendientes}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Senderos Activos</p>
                <p className="text-3xl font-bold text-primary-600">
                  {senderosActivos}/{totalSenderos}
                </p>
              </div>
              <div className="text-4xl">🥾</div>
            </div>
          </Card>
        </div>

        {/* Reservas Recientes */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reservas Recientes</h2>
          {reservasRecientes.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No hay reservas registradas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sendero
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Visita
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservasRecientes.map((reserva) => (
                    <tr key={reserva.idReserva} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">
                          {reserva.idReserva}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reserva.visitante?.nombre} {reserva.visitante?.apellido}
                        </div>
                        <div className="text-sm text-gray-500">{reserva.visitante?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{reserva.sendero?.nombre}</div>
                        <div className="text-sm text-gray-500">{reserva.sendero?.dificultad}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(reserva.fechaVisita)}</div>
                        <div className="text-sm text-gray-500">{reserva.horaInicio || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reserva.numeroPersonas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            ESTADO_COLORS[reserva.estado as keyof typeof ESTADO_COLORS] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {ESTADO_LABELS[reserva.estado as keyof typeof ESTADO_LABELS] || reserva.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
