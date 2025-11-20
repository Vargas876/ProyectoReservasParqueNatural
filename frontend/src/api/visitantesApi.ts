import { api } from './config';

export const visitantesApi = {
  findAll: async () => {
    const response = await api.get('/visitante/findAll');
    return response.data;
  },

  getByCedula: async (cedula: string) => {
    const response = await api.get(`/visitante/findByCedula/${cedula}`);
    return response.data;
  },

  create: async (visitante: any) => {
    const response = await api.post('/visitante/save', visitante);
    return response.data;
  },

  update: async (id: number, visitante: any) => {
    const response = await api.put(`/visitante/update/${id}`, visitante);
    return response.data;
  },
};