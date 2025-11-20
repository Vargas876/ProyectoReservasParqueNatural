import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reservasApi } from '../api/reservasApi';
import type { ReservaRequest } from '../types/reserva.types';

export const useReservas = () => {
  return useQuery({
    queryKey: ['reservas'],
    queryFn: reservasApi.findAll,
  });
};

export const useCrearReserva = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reserva: ReservaRequest) => reservasApi.create(reserva),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });
};

export const useDisponibilidad = (idSendero: number, fecha: string) => {
  return useQuery({
    queryKey: ['disponibilidad', idSendero, fecha],
    queryFn: () => reservasApi.getHorariosDisponibles(idSendero, fecha),
    enabled: !!(idSendero && fecha),
  });
};
