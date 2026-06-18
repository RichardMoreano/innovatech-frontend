import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { monitoreoService, DashboardAnalitico } from '@/services/monitoreoService';
import DashboardMonitoreo from '@/components/monitoreo/DashboardMonitoreo';

vi.mock('@/services/monitoreoService', () => ({
  monitoreoService: {
    obtenerDashboard: vi.fn(),
  },
}));

const mockDataInicial: DashboardAnalitico = {
  totalEventos: 200,
  totalErrores: 10,
  promedioLatenciaMs: 120.456,
  ultimosEventos: [
    {
      id: 1,
      tipoEvento: 'INFO',
      componente: 'ProyectoService',
      descripcion: 'Fetch exitoso',
      duracionMs: 15,
      usuarioId: 1,
      fechaRegistro: '2026-06-18T12:00:00Z',
    },
  ],
};

const mockDataActualizada: DashboardAnalitico = {
  totalEventos: 205,
  totalErrores: 11,
  promedioLatenciaMs: 115.0,
  ultimosEventos: [
    {
      id: 2,
      tipoEvento: 'ERROR',
      componente: 'AuthService',
      descripcion: 'Fallo de login',
      duracionMs: 45,
      usuarioId: 2,
      fechaRegistro: '2026-06-18T12:05:00Z',
    },
  ],
};

describe('DashboardMonitoreo - Pruebas de Telemetría', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Debería mostrar el estado de carga inicial mientras no hay datos', () => {
    vi.mocked(monitoreoService.obtenerDashboard).mockReturnValue(new Promise(() => {}));
    render(<DashboardMonitoreo />);
    
    expect(screen.getByText('Cargando telemetría...')).toBeInTheDocument();
  });

  it('Debería renderizar las métricas y formatear la latencia al cargar con éxito', async () => {
    vi.mocked(monitoreoService.obtenerDashboard).mockResolvedValue(mockDataInicial);

    render(<DashboardMonitoreo />);

    await waitFor(() => expect(monitoreoService.obtenerDashboard).toHaveBeenCalled());

    await waitFor(() => {
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('120.46 ms')).toBeInTheDocument();
      expect(screen.getByText('[INFO]')).toBeInTheDocument();
    });
  }, 10000);

  it('Debería actualizar los datos cíclicamente cada 5 segundos a través del intervalo', async () => {
    let capturedCallback: any = null;
    const origSetInterval = global.setInterval;
    const origClearInterval = global.clearInterval;

    vi.spyOn(global, 'setInterval').mockImplementation(((cb: TimerHandler, _ms?: number) => {
      capturedCallback = cb as () => any;
      Promise.resolve().then(() => (capturedCallback as any)());
      return 123 as unknown as number;
    }) as unknown as typeof setInterval);

    vi.spyOn(global, 'clearInterval').mockImplementation(((_id?: number | NodeJS.Timeout) => {
      return undefined;
    }) as unknown as typeof clearInterval);

    try {
      vi.mocked(monitoreoService.obtenerDashboard)
        .mockResolvedValueOnce(mockDataInicial)
        .mockResolvedValueOnce(mockDataActualizada);

      render(<DashboardMonitoreo />);

      await waitFor(() => expect(screen.getByText('200')).toBeInTheDocument());

      expect((global.setInterval as unknown as any).mock.calls.length).toBeGreaterThan(0);
      expect((global.setInterval as unknown as any).mock.calls[0][1]).toBe(5000);
      expect(monitoreoService.obtenerDashboard).toHaveBeenCalled();
    } finally {
      try { (global.setInterval as any).mockRestore(); } catch {}
      try { (global.clearInterval as any).mockRestore(); } catch {}
      global.setInterval = origSetInterval;
      global.clearInterval = origClearInterval;
    }
  }, 10000);
});