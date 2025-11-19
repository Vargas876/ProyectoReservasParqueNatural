import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SenderoList } from '../components/features/senderos/SenderoList';
import { MainLayout } from '../components/layout/MainLayout';
import { useSenderosActivos } from '../hooks/useSenderos';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import type { Sendero } from '../types/sendero.types';

const Senderos: React.FC = () => {
  const navigate = useNavigate();
  const { data: senderos, isLoading, error } = useSenderosActivos();
  const [busqueda, setBusqueda] = useState('');
  const [dificultadFiltro, setDificultadFiltro] = useState<string>('TODAS');
  const [requiereGuiaFiltro, setRequiereGuiaFiltro] = useState<string>('TODAS');

  const handleReservar = (sendero: Sendero) => {
    navigate(`/reservas/nueva?sendero=${sendero.idSendero}`);
  };

  const senderosFiltrados = useMemo(() => {
    if (!senderos) return [];

    return senderos.filter((sendero) => {
      // Filtro por búsqueda
      const coincideBusqueda =
        busqueda === '' ||
        sendero.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        sendero.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

      // Filtro por dificultad
      const coincideDificultad =
        dificultadFiltro === 'TODAS' || sendero.dificultad === dificultadFiltro;

      // Filtro por guía
      const coincideGuia =
        requiereGuiaFiltro === 'TODAS' ||
        (requiereGuiaFiltro === 'SI' && sendero.requiereGuia === 'S') ||
        (requiereGuiaFiltro === 'NO' && sendero.requiereGuia === 'N');

      return coincideBusqueda && coincideDificultad && coincideGuia;
    });
  }, [senderos, busqueda, dificultadFiltro, requiereGuiaFiltro]);

  return (
    <MainLayout>
      <div className="container-custom section">
        <div className="mb-10 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-3">
            Senderos Disponibles
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explora nuestros senderos y reserva tu próxima aventura en la naturaleza
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            Error al cargar los senderos. Por favor, intenta de nuevo.
          </div>
        )}

        {/* Filtros mejorados */}
        <Card className="mb-8 animate-slide-up">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4">
                Buscar y Filtrar
              </h2>
              <Input
                label="Buscar Senderos"
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                leftIcon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dificultad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dificultad
                </label>
                <select
                  id="dificultad"
                  value={dificultadFiltro}
                  onChange={(e) => setDificultadFiltro(e.target.value)}
                  className="input"
                >
                  <option value="TODAS">Todas las dificultades</option>
                  <option value="FACIL">Fácil</option>
                  <option value="MODERADO">Moderado</option>
                  <option value="DIFICIL">Difícil</option>
                  <option value="EXTREMO">Extremo</option>
                </select>
              </div>

              <div>
                <label htmlFor="guia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requiere Guía
                </label>
                <select
                  id="guia"
                  value={requiereGuiaFiltro}
                  onChange={(e) => setRequiereGuiaFiltro(e.target.value)}
                  className="input"
                >
                  <option value="TODAS">Todos</option>
                  <option value="SI">Con guía</option>
                  <option value="NO">Auto-guiado</option>
                </select>
              </div>
            </div>

            {(busqueda || dificultadFiltro !== 'TODAS' || requiereGuiaFiltro !== 'TODAS') && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mostrando <span className="text-primary-600 dark:text-primary-400">{senderosFiltrados.length}</span> de{' '}
                  <span className="text-gray-500 dark:text-gray-400">{senderos?.length || 0}</span> senderos
                </p>
                <button
                  onClick={() => {
                    setBusqueda('');
                    setDificultadFiltro('TODAS');
                    setRequiereGuiaFiltro('TODAS');
                  }}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </Card>

        <SenderoList
          senderos={senderosFiltrados}
          isLoading={isLoading}
          onReservar={handleReservar}
        />
      </div>
    </MainLayout>
  );
};

export default Senderos;
