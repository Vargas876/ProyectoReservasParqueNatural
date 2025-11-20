import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← AGREGAR ESTE IMPORT
import { guiasApi } from '../api/guiasApi';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { MainLayout } from '../components/layout/MainLayout';
import { useToast } from '../contexts/ToastContext';
import type { Guia } from '../types/guia.types';

const Guias: React.FC = () => {
  const navigate = useNavigate(); // ← AGREGAR ESTO
  const [guias, setGuias] = useState<Guia[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [guiaSeleccionado, setGuiaSeleccionado] = useState<Guia | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchGuias();
  }, []);

  const fetchGuias = async () => {
    setLoading(true);
    try {
      const data = await guiasApi.findActivos();
      setGuias(data);
    } catch (error) {
      console.error('Error al cargar guías:', error);
      showToast('Error al cargar la lista de guías', 'error');
    } finally {
      setLoading(false);
    }
  };

  const guiasFiltrados = guias.filter((guia) => {
    const textoBusqueda = busqueda.toLowerCase();
    return (
      guia.nombre.toLowerCase().includes(textoBusqueda) ||
      guia.apellido.toLowerCase().includes(textoBusqueda) ||
      guia.especialidades?.toLowerCase().includes(textoBusqueda) ||
      guia.cedula.includes(textoBusqueda)
    );
  });

  const verDetalles = (guia: Guia) => {
    setGuiaSeleccionado(guia);
    setMostrarModal(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <Loading message="Cargando guías..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Nuestros Guías</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Conoce a nuestro equipo de guías profesionales
          </p>
        </div>

        {/* Barra de búsqueda */}
        <Card className="mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, especialidad o cédula..."
              className="flex-1 px-3 py-2 border-0 focus:outline-none focus:ring-0"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            )}
          </div>
        </Card>

        {/* Contador de resultados */}
        {busqueda && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Mostrando {guiasFiltrados.length} de {guias.length} guías
          </div>
        )}

        {/* Lista de guías */}
        {guiasFiltrados.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {busqueda ? 'No se encontraron guías con ese criterio' : 'No hay guías disponibles'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guiasFiltrados.map((guia) => (
              <Card key={guia.idGuia} hover className="group">
                <div className="flex flex-col h-full">
                  {/* Avatar y nombre */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {guia.nombre.charAt(0)}{guia.apellido.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {guia.nombre} {guia.apellido}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {guia.idGuia}
                      </p>
                    </div>
                  </div>

                  {/* Especialidades */}
                  {guia.especialidades && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                        Especialidades
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {guia.especialidades}
                      </p>
                    </div>
                  )}

                  {/* Información */}
                  <div className="space-y-2 mb-4 flex-grow">
                    {guia.maxPersonasGrupo && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Hasta {guia.maxPersonasGrupo} personas/grupo</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{guia.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{guia.telefono}</span>
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        guia.estado === 'ACTIVO' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {guia.estado}
                      </span>
                      <button
                        onClick={() => verDetalles(guia)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                      >
                        Ver detalles →
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de detalles */}
        {mostrarModal && guiaSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {guiaSeleccionado.nombre} {guiaSeleccionado.apellido}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">ID: {guiaSeleccionado.idGuia}</p>
                </div>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Información personal */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Información Personal
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cédula</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {guiaSeleccionado.cedula}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {guiaSeleccionado.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {guiaSeleccionado.telefono}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        guiaSeleccionado.estado === 'ACTIVO' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {guiaSeleccionado.estado}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Especialidades */}
                {guiaSeleccionado.especialidades && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Especialidades
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {guiaSeleccionado.especialidades}
                    </p>
                  </div>
                )}

                {/* Capacidad */}
                {guiaSeleccionado.maxPersonasGrupo && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Capacidad de Grupo
                    </h3>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>
                        Puede guiar grupos de hasta <strong>{guiaSeleccionado.maxPersonasGrupo}</strong> personas
                      </span>
                    </div>
                  </div>
                )}

                {/* Fecha de ingreso */}
                {guiaSeleccionado.fechaIngreso && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Fecha de Ingreso
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {new Date(guiaSeleccionado.fechaIngreso).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Botones del modal - CORREGIDO */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-3">
                  {/* Botón Ver Reservas */}
                  <button
                    onClick={() => {
                      setMostrarModal(false);
                      navigate(`/guias/${guiaSeleccionado.idGuia}/reservas`);
                    }}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ver Reservas Asignadas
                  </button>

                  {/* Botón Cerrar */}
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Guias;
