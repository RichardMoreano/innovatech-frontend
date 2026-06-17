import api from '@/lib/axios';

export interface MetricaResumen {
  id: number;
  tipoEvento: string;
  componente: string;
  descripcion: string;
  duracionMs: number;
  usuarioId: number;
  fechaRegistro: string;
}

export interface DashboardAnalitico {
  totalEventos: number;
  totalErrores: number;
  promedioLatenciaMs: number;
  ultimosEventos: MetricaResumen[];
}

export const monitoreoService = {
  obtenerDashboard: async (): Promise<DashboardAnalitico> => {
    const response = await api.get<DashboardAnalitico>('/bff/monitoreo/dashboard');
    return response.data;
  }
};