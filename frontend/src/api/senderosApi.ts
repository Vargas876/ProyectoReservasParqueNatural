import { api } from './config';

export const senderosApi = {
  findAll: async () => {
    const response = await api.get('/sendero/findAll');
    return response.data;
  },

  findActivos: async () => {
    const response = await api.get('/sendero/findAllActivos');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/sendero/findById/${id}`);
    return response.data;
  },
};