import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnaliticaPage from '@/app/dashboard/analitica/page';

// Mockeamos el componente interno para aislar la prueba de la página y evitar colisiones de temporizadores
vi.mock('@/components/monitoreo/DashboardMonitoreo', () => ({
  default: () => <div data-testid="mock-monitoreo-component">Dashboard Monitoreo Activo</div>,
}));

describe('AnaliticaPage - Layout de Telemetría', () => {
  it('Debería renderizar los encabezados semánticos y el componente de monitoreo integrado', () => {
    render(<AnaliticaPage />);

    // Validar textos estáticos del layout corporativo
    expect(screen.getByRole('heading', { level: 1, name: 'Monitoreo y Analítica' })).toBeInTheDocument();
    expect(screen.getByText('Métricas de rendimiento en tiempo real de los microservicios.')).toBeInTheDocument();

    // Validar la correcta inyección del subcomponente analítico
    expect(screen.getByTestId('mock-monitoreo-component')).toBeInTheDocument();
  });
});