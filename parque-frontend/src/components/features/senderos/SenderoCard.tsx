import React from 'react';
import type { Sendero } from '../../../types/sendero.types';
import { DIFICULTAD_COLORS, DIFICULTAD_LABELS } from '../../../utils/constants';
import { Card } from '../../common/Card';

interface SenderoCardProps {
  sendero: Sendero;
  onReservar?: (sendero: Sendero) => void;
}

export const SenderoCard: React.FC<SenderoCardProps> = ({ sendero, onReservar }) => {
  return (
    <Card hover>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800">{sendero.nombre}</h3>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              DIFICULTAD_COLORS[sendero.dificultad]
            }`}
          >
            {DIFICULTAD_LABELS[sendero.dificultad]}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
          {sendero.descripcion || 'Sin descripción disponible'}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
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
            <span>{sendero.cupoMaximoDia} personas/día</span>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="mr-2">{sendero.requiereGuia === 'S' ? '🧑‍🏫' : '🚶'}</span>
            <span>{sendero.requiereGuia === 'S' ? 'Con guía' : 'Auto-guiado'}</span>
          </div>
        </div>

        {onReservar && (
          <button
            onClick={() => onReservar(sendero)}
            className="btn-primary w-full mt-auto"
          >
            Reservar Ahora
          </button>
        )}
      </div>
    </Card>
  );
};
