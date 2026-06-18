import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '@/app/login/page';

vi.mock('@/components/auth/LoginForm', () => ({
  default: () => <div data-testid="mock-login-form">Formulario de Autenticación Activo</div>,
}));

describe('LoginPage - Layout de Acceso Seguro', () => {
  it('Debería renderizar la identidad visual de la marca y el formulario de acceso', () => {
    render(<LoginPage />);

    // Verificar identidad visual corporativa
    expect(screen.getByRole('heading', { level: 2, name: 'InnovaTech v2' })).toBeInTheDocument();
    expect(screen.getByText('Ingresa a tu panel de control de proyectos')).toBeInTheDocument();

    // Verificar inyección del componente de login
    expect(screen.getByTestId('mock-login-form')).toBeInTheDocument();
  });
});