import React, { useState } from 'react';
import { reservasApi } from '../api/reservasApi';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MainLayout } from '../components/layout/MainLayout';
import { useToast } from '../contexts/ToastContext';
import type { Reserva } from '../types/reserva.types';
import { ESTADO_COLORS, ESTADO_LABELS } from '../utils/constants';

const MisReservas: React.FC = () => {
  const [cedula, setCedula] = useState('');
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleBuscar = async () => {
    if (!cedula.trim()) {
      showToast('Ingresa tu cédula', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await reservasApi.findByVisitanteCedula(cedula);
      setReservas(data);
      
      if (data.length === 0) {
        showToast('No se encontraron reservas con esa cédula', 'info');
      }
    } catch (error) {
      console.error('Error al buscar reservas:', error);
      showToast('Error al buscar reservas', 'error');
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Mis Reservas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Consulta tus reservas ingresando tu cédula
          </p>
        </div>

        {/* Buscador */}
        <Card className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ingresa tu número de cédula"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
            />
            <Button onClick={handleBuscar} isLoading={loading}>
              Buscar
            </Button>
          </div>
        </Card>

        {/* Resultados */}
        {reservas.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Reservas Encontradas ({reservas.length})
            </h2>

            {reservas.map((reserva) => (
              <Card key={reserva.idReserva} hover>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {reserva.sendero.nombre}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ESTADO_COLORS[reserva.estado]}`}>
                          {ESTADO_LABELS[reserva.estado]}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400 mt-4">
                        <div>
                          <span className="font-medium">Código:</span>{' '}
                          <span className="text-primary-600 dark:text-primary-400 font-mono">
                            {reserva.codigoConfirmacion || 'Pendiente'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Fecha de visita:</span> {formatDate(reserva.fechaVisita)}
                        </div>
                        <div>
                          <span className="font-medium">Hora:</span> {reserva.horaInicio}
                        </div>
                        <div>
                          <span className="font-medium">Personas:</span> {reserva.numeroPersonas}
                        </div>
                        <div>
                          <span className="font-medium">Dificultad:</span> {reserva.sendero.dificultad}
                        </div>
                        <div>
                          <span className="font-medium">Duración:</span> {reserva.sendero.duracionHoras}h
                        </div>
                      </div>

                      {/* Información del guía si existe */}
                      {reserva.asignacionesGuia && reserva.asignacionesGuia.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                            🧑‍🏫 Guía Asignado
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {reserva.asignacionesGuia[0].guia.nombre} {reserva.asignacionesGuia[0].guia.apellido}
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            📞 {reserva.asignacionesGuia[0].guia.telefono}
                          </p>
                        </div>
                      )}

                      {reserva.observaciones && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Observaciones:</span> {reserva.observaciones}
                          </p>
                        </div>
                      )}
                    </div>
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

export default MisReservas;
