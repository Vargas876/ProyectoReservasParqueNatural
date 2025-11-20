import React, { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { MainLayout } from '../components/layout/MainLayout';
import { ESTADO_COLORS, ESTADO_LABELS } from '../utils/constants';
import { formatDate } from '../utils/formatters';

interface Visitante {
  idVisitante: number;
  nombre: string;
  apellido: string;
  email: string;
}

interface Sendero {
  idSendero: number;
  nombre: string;
  dificultad: string;
  estado: string;
}

interface Reserva {
  idReserva: number;
  estado: string;
  fechaVisita: string;
  fechaReserva?: string;
  fechaCreacion?: string;
  horaInicio: string;
  numeroPersonas: number;
  visitante: Visitante;
  sendero: Sendero;
}

const Dashboard: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [senderos, setSenderos] = useState<Sendero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch reservas
      const reservasResponse = await fetch('http://localhost:8081/api/reserva/findAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!reservasResponse.ok) {
        throw new Error(`Error al cargar reservas: ${reservasResponse.status}`);
      }
      
      const reservasData = await reservasResponse.json();
      setReservas(Array.isArray(reservasData) ? reservasData : []);

      
    const senderosResponse = await fetch('http://localhost:8081/api/sendero/findAllActivos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!senderosResponse.ok) {
      throw new Error(`Error al cargar senderos: ${senderosResponse.status}`);
    }
    
    const senderosData = await senderosResponse.json();
    setSenderos(Array.isArray(senderosData) ? senderosData : []);
    
  } catch (error: any) {
    console.error('Error detallado al cargar datos:', error);
    setError(error.message || 'Error al cargar datos del dashboard');
    setReservas([]);
    setSenderos([]);
  } finally {
    setLoading(false);
  }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loading message="Cargando estadísticas..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4 text-lg font-semibold">⚠️ {error}</p>
              <p className="text-gray-600 mb-6 text-sm">
                Verifica que el backend esté corriendo en http://localhost:8081
              </p>
              <button
                onClick={fetchData}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const totalReservas = reservas.length;
  const reservasConfirmadas = reservas.filter((r) => r.estado === 'CONFIRMADA').length;
  const reservasPendientes = reservas.filter((r) => r.estado === 'PENDIENTE').length;
  const totalSenderos = senderos.length;
  const senderosActivos = senderos.filter((s) => s.estado === 'ACTIVO').length;

  // Ordenar por fecha de creación descendente y tomar las 5 más recientes
  const reservasRecientes = [...reservas]
    .sort((a, b) => {
      const dateA = new Date(a.fechaReserva || a.fechaCreacion || a.fechaVisita || 0).getTime();
      const dateB = new Date(b.fechaReserva || b.fechaCreacion || b.fechaVisita || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard Administrativo
          </h1>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Actualizar</span>
          </button>
        </div>

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
                    <tr key={`reserva-${reserva.idReserva}`} className="hover:bg-gray-50">
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