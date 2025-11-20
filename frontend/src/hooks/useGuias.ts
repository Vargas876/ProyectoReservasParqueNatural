import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

// Interfaces
export interface Guia {
  idGuia: number;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidades?: string;
  estado: string;
  fechaContratacion: string;
  maxPersonasGrupo?: number;
}

// API functions
export const guiasApi = {
  getAll: async (): Promise<Guia[]> => {
    const response = await axiosInstance.get('/guias');
    return response.data;
  },

  getActivos: async (): Promise<Guia[]> => {
    const response = await axiosInstance.get('/guias/activos');
    return response.data;
  },

  getById: async (id: number): Promise<Guia> => {
    const response = await axiosInstance.get(`/guias/${id}`);
    return response.data;
  },
};

// Hooks
export const useGuias = () => {
  return useQuery({
    queryKey: ['guias'],
    queryFn: guiasApi.getAll,
  });
};

export const useGuiasActivos = () => {
  return useQuery({
    queryKey: ['guias', 'activos'],
    queryFn: guiasApi.getActivos,
  });
};

export const useGuia = (id: number) => {
  return useQuery({
    queryKey: ['guias', id],
    queryFn: () => guiasApi.getById(id),
    enabled: !!id,
  });
};
