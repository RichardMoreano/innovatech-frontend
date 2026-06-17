import api from '@/lib/axios';

export interface Recurso {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  disponibilidad: boolean;
  horasSemana: number;
}

export const recursoService = {
  obtenerTodos: async (): Promise<Recurso[]> => {
    const response = await api.get<Recurso[]>('/bff/recursos');
    return response.data;
  },

  crear: async (recurso: Recurso): Promise<Recurso> => {
    const response = await api.post<Recurso>('/bff/recursos', recurso);
    return response.data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/bff/recursos/${id}`);
  }
};