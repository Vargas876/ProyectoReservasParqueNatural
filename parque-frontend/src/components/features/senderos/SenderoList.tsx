import React from 'react';
import type { Sendero } from '../../../types/sendero.types';
import { Loading } from '../../common/Loading';
import { SenderoCard } from './SenderoCard';

interface SenderoListProps {
  senderos: Sendero[];
  isLoading?: boolean;
  onReservar?: (sendero: Sendero) => void;
}

export const SenderoList: React.FC<SenderoListProps> = ({
  senderos,
  isLoading,
  onReservar,
}) => {
  if (isLoading) {
    return <Loading message="Cargando senderos..." />;
  }

  if (senderos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No hay senderos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {senderos.map((sendero) => (
        <SenderoCard key={sendero.idSendero} sendero={sendero} onReservar={onReservar} />
      ))}
    </div>
  );
};
