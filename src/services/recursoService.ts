import api from '@/lib/axios';

export interface Recurso {
  id: number;
  nombre: string;
  apellido?: string;
  email?: string;
  rol: string;
  disponibilidad: boolean; // Requerido para el filtro .filter(r => r.disponibilidad)
  horasSemana?: number;
}

export const recursoService = {
  // GET /api/v2/bff/recursos
  obtenerTodos: async (): Promise<Recurso[]> => {
    const response = await api.get<Recurso[]>('/bff/recursos');
    return response.data;
  },

  // POST /api/v2/bff/recursos
  crear: async (recurso: Omit<Recurso, 'id'>): Promise<Recurso> => {
    const response = await api.post<Recurso>('/bff/recursos', recurso);
    return response.data;
  },

  // DELETE /api/v2/bff/recursos/{id}
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/bff/recursos/${id}`);
  }
};