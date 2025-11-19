import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SenderoList } from '../components/features/senderos/SenderoList';
import { MainLayout } from '../components/layout/MainLayout';
import { useSenderosActivos } from '../hooks/useSenderos';
import { Card } from '../components/common/Card';
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Senderos Disponibles
          </h1>
          <p className="text-gray-600">
            Explora nuestros senderos y reserva tu próxima aventura
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            Error al cargar los senderos. Por favor, intenta de nuevo.
          </div>
        )}

        {/* Filtros */}
        <Card className="mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Senderos
              </label>
              <input
                id="busqueda"
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dificultad" className="block text-sm font-medium text-gray-700 mb-2">
                  Dificultad
                </label>
                <select
                  id="dificultad"
                  value={dificultadFiltro}
                  onChange={(e) => setDificultadFiltro(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="TODAS">Todas las dificultades</option>
                  <option value="FACIL">Fácil</option>
                  <option value="MODERADO">Moderado</option>
                  <option value="DIFICIL">Difícil</option>
                  <option value="EXTREMO">Extremo</option>
                </select>
              </div>

              <div>
                <label htmlFor="guia" className="block text-sm font-medium text-gray-700 mb-2">
                  Requiere Guía
                </label>
                <select
                  id="guia"
                  value={requiereGuiaFiltro}
                  onChange={(e) => setRequiereGuiaFiltro(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="TODAS">Todos</option>
                  <option value="SI">Con guía</option>
                  <option value="NO">Auto-guiado</option>
                </select>
              </div>
            </div>

            {(busqueda || dificultadFiltro !== 'TODAS' || requiereGuiaFiltro !== 'TODAS') && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Mostrando {senderosFiltrados.length} de {senderos?.length || 0} senderos
                </p>
                <button
                  onClick={() => {
                    setBusqueda('');
                    setDificultadFiltro('TODAS');
                    setRequiereGuiaFiltro('TODAS');
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
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
