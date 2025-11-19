import type { Sendero } from '../types/sendero.types';
import axiosInstance from './axios';

export const senderosApi = {
  // Obtener todos los senderos
  getAll: async (): Promise<Sendero[]> => {
    const response = await axiosInstance.get('/sendero/findAll');
    return response.data;
  },

  // Obtener senderos activos
  getActivos: async (): Promise<Sendero[]> => {
    const response = await axiosInstance.get('/sendero/findAllActivos');
    return response.data;
  },

  // Obtener sendero por ID
  getById: async (id: number): Promise<Sendero> => {
    const response = await axiosInstance.get(`/sendero/findById/${id}`);
    return response.data;
  },

  // Crear sendero
  create: async (sendero: Partial<Sendero>): Promise<Sendero> => {
    const response = await axiosInstance.post('/sendero/save', sendero);
    return response.data;
  },

  // Actualizar sendero
  update: async (id: number, sendero: Partial<Sendero>): Promise<Sendero> => {
    const response = await axiosInstance.put(`/sendero/update/${id}`, sendero);
    return response.data;
  },

  // Eliminar sendero
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/sendero/delete/${id}`);
  },
};
