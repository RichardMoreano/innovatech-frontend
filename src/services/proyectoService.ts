import api from '@/lib/axios';

export interface Proyecto {
  id?: number; 
  nombre: string;
  descripcion: string;
  estado: string;
}

export interface Recurso {
  id: number;
  nombre: string;
  rol: string;
  disponibilidad: string | boolean;
}

export interface DetalleProyecto extends Proyecto {
  recursosAsignados: Recurso[];
}

export const proyectoService = {
  obtenerTodos: async (): Promise<Proyecto[]> => {
    const response = await api.get<Proyecto[]>('/bff/proyectos');
    return response.data;
  },

  crear: async (proyecto: Proyecto): Promise<Proyecto> => {
    const response = await api.post<Proyecto>('/bff/proyectos', proyecto);
    return response.data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/bff/proyectos/${id}`);
  },

  obtenerDetalle: async (id: number): Promise<DetalleProyecto> => {
    const response = await api.get<DetalleProyecto>(`/bff/proyectos/${id}/detalles`);
    return response.data;
  },

  actualizarEstado: async (id: number, estado: string): Promise<Proyecto> => {
    const response = await api.put<Proyecto>(`/bff/proyectos/${id}/estado`, { estado });
    return response.data;
  },

  asignarRecurso: async (proyectoId: number, recursoId: number): Promise<void> => {
    await api.post(`/bff/proyectos/${proyectoId}/recursos`, { recursoId });
  },

  eliminarRecurso: async (proyectoId: number, recursoId: number): Promise<void> => {
    await api.delete(`/bff/proyectos/${proyectoId}/recursos/${recursoId}`);
  }
};