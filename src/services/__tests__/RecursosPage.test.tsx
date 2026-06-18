import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RecursosPage from '@/app/dashboard/recursos/page';

vi.mock('@/components/recursos/GestionRecursos', () => ({
  default: () => <div data-testid="mock-gestion-recursos">Ecosistema de Recursos Activo</div>,
}));

describe('RecursosPage - Layout de Administración', () => {
  it('Debería renderizar los encabezados corporativos y el componente operativo de recursos', () => {
    render(<RecursosPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Gestión de Recursos' })).toBeInTheDocument();
    expect(screen.getByText('Administración de personal y asignaciones del sistema.')).toBeInTheDocument();
    expect(screen.getByTestId('mock-gestion-recursos')).toBeInTheDocument();
  });
});