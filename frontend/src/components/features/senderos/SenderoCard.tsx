import React from 'react';
import type { Sendero } from '../../../types/sendero.types';
import { DIFICULTAD_COLORS, DIFICULTAD_LABELS } from '../../../utils/constants';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';

interface SenderoCardProps {
  sendero: Sendero;
  onReservar?: (sendero: Sendero) => void;
}

export const SenderoCard: React.FC<SenderoCardProps> = ({ sendero, onReservar }) => {
  return (
    <Card hover className="group h-full flex flex-col animate-scale-in">
      <div className="flex flex-col h-full">
        {/* Header con badge */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white pr-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {sendero.nombre}
          </h3>
          <span
            className={`badge ${DIFICULTAD_COLORS[sendero.dificultad]} flex-shrink-0`}
            aria-label={`Dificultad: ${DIFICULTAD_LABELS[sendero.dificultad]}`}
          >
            {DIFICULTAD_LABELS[sendero.dificultad]}
          </span>
        </div>

        {/* Descripción */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
          {sendero.descripcion || 'Sin descripción disponible'}
        </p>

        {/* Información del sendero */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <div className="font-medium">{sendero.distanciaKm} km</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Distancia</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-accent-50 dark:bg-accent-900/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium">{sendero.duracionHoras} hrs</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Duración</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium">{sendero.cupoMaximoDia}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Cupo/día</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              sendero.requiereGuia === 'S' 
                ? 'bg-secondary-50 dark:bg-secondary-900/20' 
                : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              {sendero.requiereGuia === 'S' ? (
                <svg className="w-4 h-4 text-secondary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </div>
            <div>
              <div className="font-medium">{sendero.requiereGuia === 'S' ? 'Con guía' : 'Auto-guiado'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Tipo</div>
            </div>
          </div>
        </div>

        {/* Botón de reserva */}
        {onReservar && (
          <Button
            fullWidth
            onClick={() => onReservar(sendero)}
            className="mt-auto"
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          >
            Reservar Ahora
          </Button>
        )}
      </div>
    </Card>
  );
};
