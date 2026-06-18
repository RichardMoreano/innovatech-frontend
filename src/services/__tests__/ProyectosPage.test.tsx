import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProyectosPage from '@/app/dashboard/proyectos/page';

vi.mock('@/components/proyectos/GestionProyectos', () => ({
  default: () => <div data-testid="mock-gestion-proyectos">Ecosistema de Gestión Activo</div>,
}));

describe('ProyectosPage - Layout de Estructura Core', () => {
  it('Debería renderizar los encabezados corporativos y el componente operativo de proyectos', () => {
    render(<ProyectosPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Proyectos' })).toBeInTheDocument();
    expect(screen.getByText('Control de ciclo de vida de los servicios del core de negocio.')).toBeInTheDocument();
    expect(screen.getByTestId('mock-gestion-proyectos')).toBeInTheDocument();
  });
});