import api from '@/lib/axios';

export interface Proyecto {
  id?: number;
  nombre: string;
  descripcion: string;
  estado: string;
}

export const proyectoService = {
  // Llama al Gateway, el cual redirige al BFF v2
  obtenerTodos: async (): Promise<Proyecto[]> => {
    const response = await api.get<Proyecto[]>('/bff/proyectos');
    return response.data;
  },
};