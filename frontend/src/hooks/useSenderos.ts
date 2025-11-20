import { useQuery } from '@tanstack/react-query';
import { senderosApi } from '../api/senderosApi';

export const useSenderos = () => {
  return useQuery({
    queryKey: ['senderos'],
    queryFn: senderosApi.findAll, 
  });
};

export const useSenderosActivos = () => {
  return useQuery({
    queryKey: ['senderos', 'activos'],
    queryFn: senderosApi.findActivos, 
  });
};

export const useSendero = (id: number) => {
  return useQuery({
    queryKey: ['senderos', id],
    queryFn: () => senderosApi.getById(id),
    enabled: !!id,
  });
};
