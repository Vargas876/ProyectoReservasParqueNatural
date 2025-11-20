import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { guiasApi } from '../api/guiasApi';
import { reservasApi } from '../api/reservasApi';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { MainLayout } from '../components/layout/MainLayout';
import type { Guia } from '../types/guia.types';
import type { Reserva } from '../types/reserva.types';
import { ESTADO_COLORS, ESTADO_LABELS } from '../utils/constants';

const ReservasGuia: React.FC = () => {
  const { idGuia } = useParams<{ idGuia: string }>();
  const [guia, setGuia] = useState<Guia | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idGuia) {
      fetchData();
    }
  }, [idGuia]);

  const fetchData = async () => {
    try {
      const [guiaData, reservasData] = await Promise.all([
        guiasApi.getById(Number(idGuia)),
        reservasApi.findByGuia(Number(idGuia))
      ]);
      setGuia(guiaData);
      setReservas(reservasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <Loading message="Cargando reservas..." />
      </MainLayout>
    );
  }

  if (!guia) {
    return (
      <MainLayout>
        <Card>
          <p className="text-center text-gray-600 dark:text-gray-400">Guía no encontrado</p>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Información del Guía */}
        <Card className="mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {guia.nombre.charAt(0)}{guia.apellido.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {guia.nombre} {guia.apellido}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{guia.especialidades || 'Guía turístico'}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>📧 {guia.email}</span>
                <span>📞 {guia.telefono}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Lista de Reservas */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reservas Asignadas ({reservas.length})
          </h2>
        </div>

        {reservas.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 dark:text-gray-400 py-12">
              No hay reservas asignadas a este guía
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservas.map((reserva) => (
              <Card key={reserva.idReserva} hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {reserva.sendero.nombre}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ESTADO_COLORS[reserva.estado]}`}>
                        {ESTADO_LABELS[reserva.estado]}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Visitante:</span>{' '}
                        {reserva.visitante.nombre} {reserva.visitante.apellido}
                      </div>
                      <div>
                        <span className="font-medium">Fecha:</span> {formatDate(reserva.fechaVisita)}
                      </div>
                      <div>
                        <span className="font-medium">Hora:</span> {reserva.horaInicio}
                      </div>
                      <div>
                        <span className="font-medium">Personas:</span> {reserva.numeroPersonas}
                      </div>
                      <div>
                        <span className="font-medium">Código:</span> {reserva.codigoConfirmacion || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Contacto:</span> {reserva.visitante.telefono || 'N/A'}
                      </div>
                    </div>

                    {/* Detalles del sendero */}
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="grid grid-cols-3 gap-2 text-sm text-blue-800 dark:text-blue-200">
                        <div>📏 {reserva.sendero.distanciaKm} km</div>
                        <div>⏱️ {reserva.sendero.duracionHoras}h</div>
                        <div>🎯 {reserva.sendero.dificultad}</div>
                      </div>
                    </div>

                    {reserva.observaciones && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Observaciones:</span> {reserva.observaciones}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ReservasGuia;
