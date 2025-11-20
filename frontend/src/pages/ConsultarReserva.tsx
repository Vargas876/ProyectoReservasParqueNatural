import React, { useState } from 'react';
import { reservasApi } from '../api/reservasApi';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { MainLayout } from '../components/layout/MainLayout';
import { useToast } from '../contexts/ToastContext';
import type { Reserva } from '../types/reserva.types';
import { ESTADO_COLORS, ESTADO_LABELS } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const ConsultarReserva: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const { showToast } = useToast();

  const handleConsultar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      showToast('Por favor ingresa un código de confirmación', 'warning');
      return;
    }
  
    setLoading(true);
    try {
      // Extraer el número del código (soporta formatos como "RES-16" o solo "16")
      let idReserva: number;
      
      const codigoLimpio = codigo.trim().toUpperCase();
      
      if (codigoLimpio.startsWith('RES-')) {
        // Extraer el número después de "RES-"
        const numeroStr = codigoLimpio.replace('RES-', '');
        idReserva = parseInt(numeroStr, 10);
      } else {
        // Intentar parsear directamente como número
        idReserva = parseInt(codigoLimpio, 10);
      }
      
      if (isNaN(idReserva)) {
        showToast('El código debe tener el formato RES-XX o ser un número válido', 'error');
        setReserva(null);
        return;
      }
  
      const reservaEncontrada = await reservasApi.findById(idReserva);
      
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

  const handleCancelar = async () => {
    if (!reserva) return;

    setCancelando(true);
    try {
      await reservasApi.cancelar(reserva.idReserva, motivoCancelacion);
      showToast('Reserva cancelada exitosamente', 'success');
      
      // Actualizar el estado de la reserva
      setReserva({
        ...reserva,
        estado: 'CANCELADA',
        observaciones: motivoCancelacion,
      });
      
      setMostrarModalCancelar(false);
      setMotivoCancelacion('');
    } catch (error: any) {
      showToast(
        error?.response?.data?.error || error?.response?.data?.message || 'Error al cancelar la reserva',
        'error'
      );
    } finally {
      setCancelando(false);
    }
  };

  const puedeSerCancelada = reserva && 
    reserva.estado !== 'CANCELADA' && 
    reserva.estado !== 'COMPLETADA';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Consultar Reserva
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ingresa el ID de tu reserva para ver los detalles
          </p>
        </div>

        <Card className="mb-8">
          <form onSubmit={handleConsultar} className="flex gap-4">
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ingresa tu código (Ej: RES-16 o 16)"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalles de la Reserva
                </h2>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    ESTADO_COLORS[reserva.estado as keyof typeof ESTADO_COLORS] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {ESTADO_LABELS[reserva.estado as keyof typeof ESTADO_LABELS] || reserva.estado}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ID de Reserva</p>
                <p className="text-xl font-bold text-primary-700 dark:text-primary-400 font-mono">
                  {reserva.idReserva}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Guarda este número para consultar tu reserva
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Información del Visitante */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información del Visitante
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nombre Completo</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {reserva.visitante?.nombre} {reserva.visitante?.apellido}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cédula</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {reserva.visitante?.cedula}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {reserva.visitante?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {reserva.visitante?.telefono}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detalles del Sendero */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Detalles del Sendero
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sendero</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {reserva.sendero?.nombre}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Dificultad</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {reserva.sendero?.dificultad}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Distancia</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {reserva.sendero?.distanciaKm} km
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duración</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {reserva.sendero?.duracionHoras} horas
                    </p>
                  </div>
                </div>
              </div>

              {/* Información de la Reserva */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información de la Reserva
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Visita</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatDate(reserva.fechaVisita)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hora de Inicio</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {reserva.horaInicio}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Número de Personas</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {reserva.numeroPersonas}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Reserva</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatDate(reserva.fechaReserva)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guía Asignado */}
              {reserva.asignacion ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Guía Asignado
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-400">Nombre del Guía</p>
                      <p className="text-green-900 dark:text-green-200 font-medium text-lg">
                        {reserva.asignacion?.guia?.nombre} {reserva.asignacion?.guia?.apellido}
                      </p>
                    </div>
                    {reserva.asignacion?.guia?.telefono && (
                      <div>
                        <p className="text-sm text-green-700 dark:text-green-400">Teléfono</p>
                        <p className="text-green-900 dark:text-green-200 font-medium">
                          {reserva.asignacion.guia.telefono}
                        </p>
                      </div>
                    )}
                    {reserva.asignacion?.guia?.email && (
                      <div>
                        <p className="text-sm text-green-700 dark:text-green-400">Email</p>
                        <p className="text-green-900 dark:text-green-200 font-medium">
                          {reserva.asignacion.guia.email}
                        </p>
                      </div>
                    )}
                    {reserva.asignacion?.guia?.especialidades && (
                      <div>
                        <p className="text-sm text-green-700 dark:text-green-400">Especialidades</p>
                        <p className="text-green-900 dark:text-green-200 font-medium">
                          {reserva.asignacion.guia.especialidades}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Guía Pendiente
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Aún no se ha asignado un guía para esta reserva. Te notificaremos cuando se asigne uno.
                  </p>
                </div>
              )}
            </div>

            {/* Observaciones */}
            {reserva.observaciones && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Observaciones</p>
                <p className="text-gray-900 dark:text-white">{reserva.observaciones}</p>
              </div>
            )}

            {/* Botón de cancelar */}
            {puedeSerCancelada && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="danger"
                  onClick={() => setMostrarModalCancelar(true)}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                >
                  Cancelar Reserva
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Modal de confirmación de cancelación */}
        {mostrarModalCancelar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Cancelar Reserva
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                ¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer.
              </p>
              
              <div className="mb-6">
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motivo de cancelación (opcional)
                </label>
                <textarea
                  id="motivo"
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Escribe el motivo de la cancelación..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMostrarModalCancelar(false);
                    setMotivoCancelacion('');
                  }}
                  disabled={cancelando}
                  fullWidth
                >
                  No, mantener reserva
                </Button>
                <Button
                  variant="danger"
                  onClick={handleCancelar}
                  isLoading={cancelando}
                  disabled={cancelando}
                  fullWidth
                >
                  Sí, cancelar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ConsultarReserva;