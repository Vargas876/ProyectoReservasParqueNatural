import type { Visitante } from '../types/visitante.types';
import axiosInstance from './axios';

export const visitantesApi = {
  getAll: async (): Promise<Visitante[]> => {
    const response = await axiosInstance.get('/visitante/findAll');
    return response.data;
  },

  getById: async (id: number): Promise<Visitante> => {
    const response = await axiosInstance.get(`/visitante/findById/${id}`);
    return response.data;
  },

  getByCedula: async (cedula: string): Promise<Visitante> => {
    const response = await axiosInstance.get(`/visitante/findByCedula/${cedula}`);
    return response.data;
  },

  getByEmail: async (email: string): Promise<Visitante> => {
    const response = await axiosInstance.get(`/visitante/findByEmail?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  create: async (visitante: Partial<Visitante>): Promise<Visitante> => {
    const response = await axiosInstance.post('/visitante/save', visitante);
    return response.data;
  },

  update: async (id: number, visitante: Partial<Visitante>): Promise<Visitante> => {
    const response = await axiosInstance.put(`/visitante/update/${id}`, visitante);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/visitante/delete/${id}`);
  },
};
