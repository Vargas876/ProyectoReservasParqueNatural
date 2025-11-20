import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { guiasApi } from '../api/guiasApi';
import { reservasApi } from '../api/reservasApi';
import { senderosApi } from '../api/senderosApi';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { MainLayout } from '../components/layout/MainLayout';
import { useToast } from '../contexts/ToastContext';
import type { Guia } from '../types/guia.types';
import type { ReservaRequest } from '../types/reserva.types';
import type { Sendero } from '../types/sendero.types';

const NuevaReserva: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Estados del formulario
  const [senderos, setSenderos] = useState<Sendero[]>([]);
  const [guiasDisponibles, setGuiasDisponibles] = useState<Guia[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // NUEVO: Estados para horarios disponibles
  const [horariosDisponibles, setHorariosDisponibles] = useState<Array<{horaInicio: string, horaFin: string}>>([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState<ReservaRequest>({
    cedulaVisitante: '',
    idSendero: Number(searchParams.get('sendero')) || 0,
    fechaVisita: '',
    numeroPersonas: 1,
    horaInicio: '',
    observaciones: '',
    idGuia: undefined,
    nombreVisitante: '',
    apellidoVisitante: '',
    emailVisitante: '',
    telefonoVisitante: '',
  });

  // Estado para selección de guía
  const [modoAsignacion, setModoAsignacion] = useState<'automatico' | 'manual'>('automatico');
  const [senderoSeleccionado, setSenderoSeleccionado] = useState<Sendero | null>(null);

  useEffect(() => {
    fetchSenderos();
  }, []);

  // MODIFICADO: Cargar horarios cuando cambia sendero o fecha
  useEffect(() => {
    if (formData.idSendero && formData.fechaVisita) {
      fetchHorariosDisponibles();
    } else {
      setHorariosDisponibles([]);
      setFormData({ ...formData, horaInicio: '' });
    }
  }, [formData.idSendero, formData.fechaVisita]);

  // MODIFICADO: Cargar guías solo cuando hay hora seleccionada
  useEffect(() => {
    if (formData.idSendero && formData.fechaVisita && formData.horaInicio) {
      fetchGuiasDisponibles();
    }
  }, [formData.idSendero, formData.fechaVisita, formData.horaInicio]);

  const fetchSenderos = async () => {
    try {
      const data = await senderosApi.findActivos();
      setSenderos(data);
      
      if (formData.idSendero) {
        const sendero = data.find(s => s.idSendero === formData.idSendero);
        setSenderoSeleccionado(sendero || null);
      }
    } catch (error) {
      showToast('Error al cargar senderos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // NUEVA FUNCIÓN: Cargar horarios disponibles
  const fetchHorariosDisponibles = async () => {
    setCargandoHorarios(true);
    try {
      const horarios = await reservasApi.getHorariosDisponibles(
        formData.idSendero,
        formData.fechaVisita
      );
      setHorariosDisponibles(horarios);
      
      // Limpiar hora seleccionada si ya no está disponible
      if (formData.horaInicio) {
        const horaValida = horarios.some((h: any) => h.horaInicio === formData.horaInicio);
        if (!horaValida) {
          setFormData({ ...formData, horaInicio: '' });
        }
      }
      
      // Mostrar advertencia si no hay horarios
      if (horarios.length === 0) {
        showToast('No hay horarios disponibles para esta fecha. Selecciona otra fecha.', 'warning');
      }
    } catch (error) {
      console.error('Error al cargar horarios disponibles:', error);
      setHorariosDisponibles([]);
      showToast('Error al cargar horarios disponibles', 'error');
    } finally {
      setCargandoHorarios(false);
    }
  };

  const fetchGuiasDisponibles = async () => {
    try {
      const guias = await guiasApi.getDisponibles(
        formData.idSendero,
        formData.fechaVisita,
        formData.horaInicio
      );
      setGuiasDisponibles(guias);
    } catch (error) {
      console.error('Error al cargar guías disponibles:', error);
      setGuiasDisponibles([]);
    }
  };

  const handleSenderoChange = (idSendero: number) => {
    const sendero = senderos.find(s => s.idSendero === idSendero);
    setSenderoSeleccionado(sendero || null);
    setFormData({ ...formData, idSendero, horaInicio: '' });
    setHorariosDisponibles([]);
  };

  const handleFechaChange = (fecha: string) => {
    setFormData({ ...formData, fechaVisita: fecha, horaInicio: '' });
    setHorariosDisponibles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.cedulaVisitante.trim()) {
      showToast('La cédula es obligatoria', 'error');
      return;
    }
    
    if (!formData.idSendero) {
      showToast('Selecciona un sendero', 'error');
      return;
    }
    
    if (!formData.fechaVisita) {
      showToast('Selecciona una fecha', 'error');
      return;
    }

    // NUEVA VALIDACIÓN: Verificar horarios disponibles
    if (horariosDisponibles.length === 0) {
      showToast('No hay horarios disponibles para la fecha seleccionada. Por favor elige otra fecha.', 'error');
      return;
    }

    if (!formData.horaInicio) {
      showToast('Selecciona una hora de inicio', 'error');
      return;
    }

    // Validar que la hora seleccionada está en los horarios disponibles
    const horaValida = horariosDisponibles.some((h: any) => h.horaInicio === formData.horaInicio);
    if (!horaValida) {
      showToast('La hora seleccionada no está disponible. Por favor elige otra hora.', 'error');
      return;
    }
    const fechaSeleccionada = new Date(formData.fechaVisita);
  const ahora = new Date();
  const diferenciaHoras = (fechaSeleccionada.getTime() - ahora.getTime()) / (1000 * 60 * 60);
  
  if (diferenciaHoras < 24) {
    showToast('La reserva debe hacerse con mínimo 24 horas de anticipación', 'error');
    return;
  }
  
    // Validar guía en modo manual
    if (modoAsignacion === 'manual' && !formData.idGuia) {
      showToast('Selecciona un guía', 'error');
      return;
    }
  
    setEnviando(true);
  
    try {
      let response;
      
      if (modoAsignacion === 'automatico') {
        // Asignación automática
        response = await reservasApi.createConGuiaAutomatico(formData);
        
        if (response.guiaAsignado) {
          showToast(
            `¡Reserva creada! Guía asignado: ${response.guiaAsignado.nombre}`, 
            'success'
          );
        } else {
          showToast('¡Reserva creada! Se asignará un guía próximamente', 'success');
        }
      } else {
        // Asignación manual
        response = await reservasApi.createConGuiaManual(formData);
        showToast('¡Reserva creada con el guía seleccionado!', 'success');
      }
  
      // Redirigir a confirmación
      const codigo = response.codigoConfirmacion || `RES-${response.idReserva}`;
      navigate(`/reservas/confirmacion?codigo=${codigo}`);
      
    } catch (error: any) {
      console.error('Error al crear reserva:', error);
      console.error('Datos del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Intentar obtener el mensaje de error más descriptivo
      let mensaje = 'Error al crear la reserva. Verifica los datos e intenta nuevamente.';
      
      if (error.response?.data) {
        // Priorizar mensaje específico, luego error genérico
        mensaje = error.response.data.message || 
                 error.response.data.error || 
                 mensaje;
      } else if (error.message) {
        mensaje = error.message;
      }
      
      showToast(mensaje, 'error');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loading message="Cargando formulario..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Nueva Reserva
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Completa el formulario para reservar tu visita
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Visitante */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Información del Visitante
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Si el visitante no está registrado, completa todos los campos para crearlo automáticamente.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cédula *
                    </label>
                    <input
                      type="text"
                      value={formData.cedulaVisitante}
                      onChange={(e) => setFormData({ ...formData, cedulaVisitante: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                      placeholder="Ej: 1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.nombreVisitante || ''}
                      onChange={(e) => setFormData({ ...formData, nombreVisitante: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Nombre del visitante"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.apellidoVisitante || ''}
                      onChange={(e) => setFormData({ ...formData, apellidoVisitante: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Apellido del visitante"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.emailVisitante || ''}
                      onChange={(e) => setFormData({ ...formData, emailVisitante: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefonoVisitante || ''}
                      onChange={(e) => setFormData({ ...formData, telefonoVisitante: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Ej: 3001234567"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Selección de Sendero */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Sendero y Fecha
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sendero *
                  </label>
                  <select
                    value={formData.idSendero}
                    onChange={(e) => handleSenderoChange(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Selecciona un sendero</option>
                    {senderos.map((sendero) => (
                      <option key={sendero.idSendero} value={sendero.idSendero}>
                        {sendero.nombre} - {sendero.dificultad} ({sendero.duracionHoras}h)
                      </option>
                    ))}
                  </select>
                </div>

                {senderoSeleccionado && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      Detalles del Sendero
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800 dark:text-blue-200">
                      <div>📏 Distancia: {senderoSeleccionado.distanciaKm} km</div>
                      <div>⏱️ Duración: {senderoSeleccionado.duracionHoras} hrs</div>
                      <div>👥 Cupo: {senderoSeleccionado.cupoMaximoDia} personas/día</div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de Visita *
                    </label>
                    <input
                      type="date"
                      value={formData.fechaVisita}
                      onChange={(e) => handleFechaChange(e.target.value)}
                      min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // +1 día
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  {/* SECCIÓN MODIFICADA: Hora de inicio con validación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hora de Inicio *
                    </label>
                    
                    {!formData.fechaVisita ? (
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <span className="text-gray-500">Selecciona primero una fecha</span>
                      </div>
                    ) : cargandoHorarios ? (
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <span className="text-gray-500">Cargando horarios...</span>
                      </div>
                    ) : horariosDisponibles.length === 0 ? (
                      <div className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                        <span className="text-yellow-800 dark:text-yellow-200">
                          ⚠️ No hay horarios disponibles para esta fecha
                        </span>
                      </div>
                    ) : (
                      <>
                        <select
                          value={formData.horaInicio}
                          onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        >
                          <option value="">Selecciona una hora</option>
                          {horariosDisponibles.map((horario: any, index) => (
                            <option key={index} value={horario.horaInicio}>
                              {horario.horaInicio} - {horario.horaFin}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                          ✓ {horariosDisponibles.length} horario(s) disponible(s)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número de Personas *
                  </label>
                  <input
                    type="number"
                    value={formData.numeroPersonas}
                    onChange={(e) => setFormData({ ...formData, numeroPersonas: Number(e.target.value) })}
                    min="1"
                    max="20"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Selección de Guía */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Asignación de Guía Turístico
              </h2>

              {/* Selector de modo */}
              <div className="mb-6">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setModoAsignacion('automatico');
                      setFormData({ ...formData, idGuia: undefined });
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      modoAsignacion === 'automatico'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                    }`}
                  >
                    <div className="font-semibold mb-1">🤖 Asignación Automática</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      El sistema asignará el mejor guía disponible
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModoAsignacion('manual')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      modoAsignacion === 'manual'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                    }`}
                  >
                    <div className="font-semibold mb-1">👤 Selección Manual</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Elige tú mismo el guía turístico
                    </div>
                  </button>
                </div>
              </div>

              {/* Selección manual de guía */}
              {modoAsignacion === 'manual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selecciona un Guía *
                  </label>

                  {!formData.horaInicio ? (
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        Selecciona primero la fecha y hora para ver guías disponibles.
                      </p>
                    </div>
                  ) : guiasDisponibles.length === 0 ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="text-yellow-800 dark:text-yellow-200">
                        No hay guías disponibles para esta fecha y hora. Prueba con otro horario o usa asignación automática.
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {guiasDisponibles.map((guia) => (
                        <button
                          key={guia.idGuia}
                          type="button"
                          onClick={() => setFormData({ ...formData, idGuia: guia.idGuia })}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            formData.idGuia === guia.idGuia
                              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                {guia.nombre.charAt(0)}{guia.apellido.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {guia.nombre} {guia.apellido}
                              </div>
                              {guia.especialidades && (
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {guia.especialidades}
                                </div>
                              )}
                            </div>
                            {formData.idGuia === guia.idGuia && (
                              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Observaciones */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Observaciones (Opcional)
              </h2>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Alguna solicitud especial o comentario..."
              />
            </Card>

            {/* Botones */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/senderos')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={enviando}
                disabled={enviando || horariosDisponibles.length === 0}
              >
                {enviando ? 'Creando Reserva...' : 'Crear Reserva'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default NuevaReserva;