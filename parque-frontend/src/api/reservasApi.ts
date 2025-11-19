import type { Reserva, ReservaCompleta, ReservaRequest } from '../types/reserva.types';
import axiosInstance from './axios';

export const reservasApi = {
  // Obtener todas las reservas
  getAll: async (): Promise<Reserva[]> => {
    const response = await axiosInstance.get('/reserva/findAll');
    return response.data;
  },

  // Obtener reserva por ID
  getById: async (id: number): Promise<Reserva> => {
    const response = await axiosInstance.get(`/reserva/findById/${id}`);
    return response.data;
  },

  // Crear reserva
  create: async (reserva: any): Promise<Reserva> => {
    const response = await axiosInstance.post('/reserva/save', reserva);
    return response.data;
  },

  // Actualizar reserva
  update: async (id: number, reserva: any): Promise<Reserva> => {
    const response = await axiosInstance.put(`/reserva/update/${id}`, reserva);
    return response.data;
  },

  // Cancelar reserva
  cancelar: async (id: number, motivo?: string): Promise<Reserva> => {
    const response = await axiosInstance.put(`/reserva/cancelar/${id}${motivo ? `?motivo=${encodeURIComponent(motivo)}` : ''}`);
    return response.data;
  },

  // Eliminar reserva
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/reserva/delete/${id}`);
  },

  // Verificar disponibilidad
  verificarDisponibilidad: async (
    idSendero: number,
    fecha: string
  ): Promise<{ cuposDisponibles: number; cupoMaximo: number }> => {
    const response = await axiosInstance.get(
      `/sendero/disponibilidad/${idSendero}?fecha=${fecha}`
    );
    return response.data;
  },
};
