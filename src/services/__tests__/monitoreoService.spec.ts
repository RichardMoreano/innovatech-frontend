import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '@/lib/axios';
import { monitoreoService, DashboardAnalitico } from '../monitoreoService';

describe('monitoreoService - Pruebas Unitarias', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  it('obtenerDashboard debería retornar las métricas estructuradas del sistema', async () => {
    const mockDashboard: DashboardAnalitico = {
      totalEventos: 150,
      totalErrores: 5,
      promedioLatenciaMs: 45.2,
      ultimosEventos: [
        {
          id: 1,
          tipoEvento: 'CLICK',
          componente: 'BffProyectoController',
          descripcion: 'Guardar',
          duracionMs: 12,
          usuarioId: 99,
          fechaRegistro: '2026-06-18T12:00:00Z'
        }
      ]
    };

    mock.onGet('/bff/monitoreo/dashboard').reply(200, mockDashboard);

    const resultado = await monitoreoService.obtenerDashboard();

    expect(resultado).toEqual(mockDashboard);
    expect(resultado.ultimosEventos).toHaveLength(1);
    expect(resultado.totalEventos).toBe(150);
  });
});