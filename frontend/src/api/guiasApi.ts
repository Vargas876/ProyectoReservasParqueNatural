import type { Guia } from '../types/guia.types';
import axiosInstance from './axios';

export const guiasApi = {
  // Obtener todos los guías
  getAll: async (): Promise<Guia[]> => {
    const response = await axiosInstance.get('/guia/findAll');
    return response.data;
  },

  // Obtener solo guías activos
  findActivos: async (): Promise<Guia[]> => {
    const response = await axiosInstance.get('/guia/findAllActivos');
    return response.data;
  },

  // Obtener guía por ID
  getById: async (id: number): Promise<Guia> => {
    const response = await axiosInstance.get(`/guia/findById/${id}`);
    return response.data;
  },

  // Obtener guía por cédula
  getByCedula: async (cedula: string): Promise<Guia> => {
    const response = await axiosInstance.get(`/guia/findByCedula/${cedula}`);
    return response.data;
  },

  // Obtener guías por estado
  getByEstado: async (estado: string): Promise<Guia[]> => {
    const response = await axiosInstance.get(`/guia/findByEstado/${estado}`);
    return response.data;
  },

  // Obtener guías por especialidad
  getByEspecialidad: async (especialidad: string): Promise<Guia[]> => {
    const response = await axiosInstance.get('/guia/findByEspecialidad', {
      params: { especialidad }
    });
    return response.data;
  },

  // Obtener agenda de un guía
  getAgenda: async (id: number, fecha?: string): Promise<any> => {
    const response = await axiosInstance.get(`/guia/agenda/${id}`, {
      params: fecha ? { fecha } : undefined
    });
    return response.data;
  },

  // Obtener guías disponibles
  getDisponibles: async (senderoId: number, fecha: string, horaInicio: string): Promise<Guia[]> => {
    const response = await axiosInstance.get('/guia/disponibles', {
      params: { senderoId, fecha, horaInicio }
    });
    return response.data;
  },

  // Crear guía
  create: async (guia: Partial<Guia>): Promise<Guia> => {
    const response = await axiosInstance.post('/guia/save', guia);
    return response.data;
  },

  // Actualizar guía
  update: async (id: number, guia: Partial<Guia>): Promise<Guia> => {
    const response = await axiosInstance.put(`/guia/update/${id}`, guia);
    return response.data;
  },

  // Eliminar guía
  delete: async (id: number): Promise<boolean> => {
    const response = await axiosInstance.delete(`/guia/delete/${id}`);
    return response.data;
  },
};
