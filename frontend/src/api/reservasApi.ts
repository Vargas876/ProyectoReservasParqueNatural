import type { Reserva, ReservaRequest } from '../types/reserva.types';
import axiosInstance from './axios';

export const reservasApi = {
  // Obtener todas las reservas
  findAll: async (): Promise<Reserva[]> => {
    const response = await axiosInstance.get('/reserva/findAll');
    return response.data;
  },

  // Obtener reserva por ID
  findById: async (id: number): Promise<Reserva> => {
    const response = await axiosInstance.get(`/reserva/findById/${id}`);
    return response.data;
  },

  // Obtener reservas por guía
  findByGuia: async (idGuia: number): Promise<Reserva[]> => {
    const response = await axiosInstance.get(`/reserva/guia/${idGuia}`);
    return response.data;
  },

  // Obtener reservas por visitante (ID)
  findByVisitante: async (idVisitante: number): Promise<Reserva[]> => {
    const response = await axiosInstance.get(`/reserva/findByVisitante/${idVisitante}`);
    return response.data;
  },

  // Obtener reservas por visitante (cédula)
  findByVisitanteCedula: async (cedula: string): Promise<Reserva[]> => {
    const response = await axiosInstance.get(`/reserva/visitante/cedula/${cedula}`);
    return response.data;
  },

  // Obtener reservas por sendero
  findBySendero: async (idSendero: number): Promise<Reserva[]> => {
    const response = await axiosInstance.get(`/reserva/findBySendero/${idSendero}`);
    return response.data;
  },

  // Obtener reservas por estado
  findByEstado: async (estado: string): Promise<Reserva[]> => {
    const response = await axiosInstance.get(`/reserva/findByEstado/${estado}`);
    return response.data;
  },

  // Obtener reservas sin guía
  findSinGuia: async (): Promise<Reserva[]> => {
    const response = await axiosInstance.get('/reserva/sinGuia');
    return response.data;
  },

  // Obtener horarios disponibles
  getHorariosDisponibles: async (senderoId: number, fecha: string): Promise<any[]> => {
    const response = await axiosInstance.get('/reserva/horarios-disponibles', {
      params: { senderoId, fecha }
    });
    return response.data;
  },

  // Crear reserva simple (sin asignación de guía)
  create: async (reserva: ReservaRequest): Promise<Reserva> => {
    const response = await axiosInstance.post('/reserva/save', reserva);
    return response.data;
  },

  // Crear reserva con asignación AUTOMÁTICA de guía
  createConGuiaAutomatico: async (reserva: ReservaRequest): Promise<any> => {
    const response = await axiosInstance.post('/reserva/crear-con-guia', reserva);
    return response.data;
  },

  // Crear reserva con asignación MANUAL de guía
  createConGuiaManual: async (reserva: ReservaRequest): Promise<any> => {
    const response = await axiosInstance.post('/reserva/crear-con-guia-manual', reserva);
    return response.data;
  },

  // Actualizar reserva
  update: async (id: number, reserva: Partial<Reserva>): Promise<Reserva> => {
    const response = await axiosInstance.put(`/reserva/update/${id}`, reserva);
    return response.data;
  },

  // Cancelar reserva
  cancelar: async (id: number, motivo?: string): Promise<any> => {
    const response = await axiosInstance.put(`/reserva/cancelar/${id}`, null, {
      params: motivo ? { motivo } : undefined
    });
    return response.data;
  },

  // Eliminar reserva
  delete: async (id: number): Promise<boolean> => {
    const response = await axiosInstance.delete(`/reserva/delete/${id}`);
    return response.data;
  },
};
