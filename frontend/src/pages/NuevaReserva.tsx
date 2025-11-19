import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { useSendero } from '../hooks/useSenderos';
import { useCrearReserva, useDisponibilidad } from '../hooks/useReservas';
import { visitantesApi } from '../api/visitantesApi';
import { formatDate } from '../utils/formatters';
import type { Visitante } from '../types/visitante.types';
import { useToast } from '../contexts/ToastContext';

const reservaSchema = z.object({
  cedula: z.string().min(1, 'La cédula es obligatoria'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  fechaVisita: z.string().min(1, 'La fecha de visita es obligatoria'),
  horaInicio: z.string().min(1, 'La hora de inicio es obligatoria'),
  numeroPersonas: z.coerce.number().min(1, 'Mínimo 1 persona').max(20, 'Máximo 20 personas'),
  observaciones: z.string().optional(),
});

type ReservaFormData = z.infer<typeof reservaSchema>;

const NuevaReserva: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const senderoId = searchParams.get('sendero');
  const idSendero = senderoId ? parseInt(senderoId, 10) : 0;

  const { data: sendero, isLoading: loadingSendero } = useSendero(idSendero);
  const crearReserva = useCrearReserva();
  const [visitanteExistente, setVisitanteExistente] = useState<Visitante | null>(null);
  const [buscandoVisitante, setBuscandoVisitante] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReservaFormData>({
    resolver: zodResolver(reservaSchema),
    defaultValues: {
      numeroPersonas: 1,
    },
  });

  const fechaVisita = watch('fechaVisita');
  const numeroPersonas = watch('numeroPersonas');

  const { data: disponibilidad, isLoading: loadingDisponibilidad } = useDisponibilidad(
    idSendero,
    fechaVisita || ''
  );

  useEffect(() => {
    if (!senderoId || isNaN(idSendero)) {
      navigate('/senderos');
    }
  }, [senderoId, idSendero, navigate]);

  const buscarVisitante = async (cedula: string) => {
    if (!cedula || cedula.length < 5) {
      setVisitanteExistente(null);
      return;
    }

    setBuscandoVisitante(true);
    try {
      const visitante = await visitantesApi.getByCedula(cedula);
      setVisitanteExistente(visitante);
      setValue('nombre', visitante.nombre);
      setValue('apellido', visitante.apellido);
      setValue('email', visitante.email);
      setValue('telefono', visitante.telefono);
    } catch (error) {
      setVisitanteExistente(null);
    } finally {
      setBuscandoVisitante(false);
    }
  };

  const onSubmit = async (data: ReservaFormData) => {
    if (!sendero) return;

    try {
      // Primero, obtener o crear el visitante
      let visitante: Visitante;
      
      if (visitanteExistente) {
        visitante = visitanteExistente;
      } else {
        // Crear nuevo visitante
        try {
          visitante = await visitantesApi.create({
            cedula: data.cedula,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono,
          });
        } catch (error: any) {
          // Si falla, intentar obtener por cédula (puede que ya exista)
          try {
            visitante = await visitantesApi.getByCedula(data.cedula);
            // Actualizar datos si es necesario
            visitante = await visitantesApi.update(visitante.idVisitante, {
              nombre: data.nombre,
              apellido: data.apellido,
              email: data.email,
              telefono: data.telefono,
            });
          } catch (err) {
            throw new Error('Error al crear o actualizar el visitante');
          }
        }
      }

      // Construir el objeto Reserva como lo espera el backend
      const reservaData = {
        visitante: {
          idVisitante: visitante.idVisitante,
        },
        sendero: {
          idSendero: sendero.idSendero,
        },
        fechaVisita: data.fechaVisita,
        horaInicio: data.horaInicio,
        numeroPersonas: data.numeroPersonas,
        observaciones: data.observaciones || null,
      };

      const reserva = await crearReserva.mutateAsync(reservaData);

      showToast('Reserva creada exitosamente', 'success');
      // El backend no devuelve codigoConfirmacion directamente, necesitamos obtenerlo
      navigate(`/reservas/confirmacion?codigo=${reserva.idReserva}`);
    } catch (error: any) {
      console.error('Error al crear reserva:', error);
      let errorMessage = 'Error al crear la reserva';
      
      if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || 'Datos inválidos. Verifica la información ingresada.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    }
  };

  const fechaMinima = new Date();
  fechaMinima.setDate(fechaMinima.getDate() + 1);
  const fechaMinimaStr = fechaMinima.toISOString().split('T')[0];

  if (loadingSendero) {
    return (
      <MainLayout>
        <Loading message="Cargando información del sendero..." />
      </MainLayout>
    );
  }

  if (!sendero) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sendero no encontrado</h2>
              <Button onClick={() => navigate('/senderos')}>Volver a Senderos</Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const cuposDisponibles = disponibilidad?.cuposDisponibles ?? sendero.cupoMaximoDia;
  const hayCupo = numeroPersonas <= cuposDisponibles;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700 mb-4 flex items-center"
          >
            ← Volver
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nueva Reserva</h1>
          <p className="text-gray-600">Completa el formulario para reservar tu sendero</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="font-semibold text-gray-800 mb-2">{sendero.nombre}</h3>
            <p className="text-sm text-gray-600 mb-3">{sendero.descripcion}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-700">
                <span className="mr-2">📏</span>
                <span>{sendero.distanciaKm} km</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-2">⏱️</span>
                <span>{sendero.duracionHoras} hrs</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-2">👥</span>
                <span>Cupo: {sendero.cupoMaximoDia} personas/día</span>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Datos del Visitante</h2>
                
                <div className="mb-4">
                  <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula *
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="cedula"
                      type="text"
                      {...register('cedula')}
                      onBlur={(e) => buscarVisitante(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ingresa tu cédula"
                    />
                    {buscandoVisitante && (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                      </div>
                    )}
                  </div>
                  {errors.cedula && (
                    <p className="mt-1 text-sm text-red-600">{errors.cedula.message}</p>
                  )}
                  {visitanteExistente && (
                    <p className="mt-1 text-sm text-green-600">
                      ✓ Visitante encontrado: {visitanteExistente.nombre} {visitanteExistente.apellido}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      {...register('nombre')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido *
                    </label>
                    <input
                      id="apellido"
                      type="text"
                      {...register('apellido')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.apellido && (
                      <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      id="telefono"
                      type="tel"
                      {...register('telefono')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.telefono && (
                      <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles de la Reserva</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fechaVisita" className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Visita *
                    </label>
                    <input
                      id="fechaVisita"
                      type="date"
                      min={fechaMinimaStr}
                      {...register('fechaVisita')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.fechaVisita && (
                      <p className="mt-1 text-sm text-red-600">{errors.fechaVisita.message}</p>
                    )}
                    {fechaVisita && loadingDisponibilidad && (
                      <p className="mt-1 text-sm text-gray-500">Verificando disponibilidad...</p>
                    )}
                    {fechaVisita && disponibilidad && (
                      <p className={`mt-1 text-sm ${hayCupo ? 'text-green-600' : 'text-red-600'}`}>
                        {hayCupo
                          ? `✓ ${cuposDisponibles} cupos disponibles`
                          : `✗ Solo ${cuposDisponibles} cupos disponibles`}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Inicio *
                    </label>
                    <input
                      id="horaInicio"
                      type="time"
                      {...register('horaInicio')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.horaInicio && (
                      <p className="mt-1 text-sm text-red-600">{errors.horaInicio.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="numeroPersonas" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Personas *
                  </label>
                  <input
                    id="numeroPersonas"
                    type="number"
                    min="1"
                    max="20"
                    {...register('numeroPersonas')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.numeroPersonas && (
                    <p className="mt-1 text-sm text-red-600">{errors.numeroPersonas.message}</p>
                  )}
                  {numeroPersonas > cuposDisponibles && (
                    <p className="mt-1 text-sm text-red-600">
                      El número de personas excede los cupos disponibles
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones (opcional)
                  </label>
                  <textarea
                    id="observaciones"
                    {...register('observaciones')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Alguna observación especial..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={!hayCupo || isSubmitting}
                  fullWidth
                >
                  Confirmar Reserva
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default NuevaReserva;

