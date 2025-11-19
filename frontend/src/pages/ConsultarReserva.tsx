import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { reservasApi } from '../api/reservasApi';
import { ESTADO_COLORS, ESTADO_LABELS } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import type { Reserva } from '../types/reserva.types';
import { useToast } from '../contexts/ToastContext';

const ConsultarReserva: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleConsultar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      showToast('Por favor ingresa un código de confirmación', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Buscar por ID de reserva
      const idReserva = parseInt(codigo.trim(), 10);
      
      if (isNaN(idReserva)) {
        showToast('El código debe ser un número válido', 'error');
        setReserva(null);
        return;
      }

      const reservaEncontrada = await reservasApi.getById(idReserva);
      
      if (reservaEncontrada) {
        setReserva(reservaEncontrada as any);
        showToast('Reserva encontrada', 'success');
      } else {
        setReserva(null);
        showToast('No se encontró una reserva con ese código', 'error');
      }
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || 'Error al consultar la reserva',
        'error'
      );
      setReserva(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Consultar Reserva</h1>
          <p className="text-gray-600">
            Ingresa el ID de tu reserva para ver los detalles
          </p>
        </div>

        <Card className="mb-8">
          <form onSubmit={handleConsultar} className="flex gap-4">
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ingresa el ID de tu reserva (número)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            />
            <Button type="submit" isLoading={loading} disabled={loading}>
              Consultar
            </Button>
          </form>
        </Card>

        {loading && <Loading message="Buscando reserva..." />}

        {reserva && !loading && (
          <Card>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Detalles de la Reserva</h2>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    ESTADO_COLORS[reserva.estado as keyof typeof ESTADO_COLORS] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {ESTADO_LABELS[reserva.estado as keyof typeof ESTADO_LABELS] || reserva.estado}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">ID de Reserva</p>
                <p className="text-xl font-bold text-primary-700 font-mono">
                  {reserva.idReserva}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Guarda este número para consultar tu reserva
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Visitante</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nombre Completo</p>
                    <p className="text-gray-900 font-medium">
                      {reserva.visitante?.nombre} {reserva.visitante?.apellido}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cédula</p>
                    <p className="text-gray-900 font-medium">{reserva.visitante?.cedula}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900 font-medium">{reserva.visitante?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="text-gray-900 font-medium">{reserva.visitante?.telefono}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Sendero</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Sendero</p>
                    <p className="text-gray-900 font-medium">{reserva.sendero?.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dificultad</p>
                    <p className="text-gray-900 font-medium">{reserva.sendero?.dificultad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Distancia</p>
                    <p className="text-gray-900 font-medium">{reserva.sendero?.distanciaKm} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duración</p>
                    <p className="text-gray-900 font-medium">{reserva.sendero?.duracionHoras} horas</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Reserva</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Visita</p>
                    <p className="text-gray-900 font-medium">{formatDate(reserva.fechaVisita)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hora de Inicio</p>
                    <p className="text-gray-900 font-medium">{reserva.horaInicio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Número de Personas</p>
                    <p className="text-gray-900 font-medium">{reserva.numeroPersonas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Reserva</p>
                    <p className="text-gray-900 font-medium">{formatDate(reserva.fechaReserva)}</p>
                  </div>
                </div>
              </div>

              {reserva.asignacion && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Guía Asignado</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="text-gray-900 font-medium">
                        {reserva.asignacion?.guia?.nombre} {reserva.asignacion?.guia?.apellido}
                      </p>
                    </div>
                    {reserva.asignacion?.guia?.telefono && (
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <p className="text-gray-900 font-medium">{reserva.asignacion.guia.telefono}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {reserva.observaciones && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Observaciones</p>
                <p className="text-gray-900">{reserva.observaciones}</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ConsultarReserva;

