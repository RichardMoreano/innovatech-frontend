import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Sidebar from '@/components/layout/Sidebar';

// Mock de Next.js Navigation (Router y Pathname)
const mockPush = vi.fn();
let mockPathname = '/dashboard';

vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
  usePathname() {
    return mockPathname;
  }
}));

describe('Sidebar - Pruebas de Componente y Seguridad', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockPathname = '/dashboard';
  });

  it('Debería renderizar solo los enlaces accesibles para el rol USER', () => {
    render(<Sidebar userEmail="user@innovatech.cl" userRol="USER" />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
    
    // No deben renderizarse por restricciones de rol
    expect(screen.queryByText('Recursos')).not.toBeInTheDocument();
    expect(screen.queryByText('Analítica')).not.toBeInTheDocument();
  });

  it('Debería renderizar todos los enlaces para el rol ADMIN', () => {
    render(<Sidebar userEmail="admin@innovatech.cl" userRol="ADMIN" />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
    expect(screen.getByText('Recursos')).toBeInTheDocument();
    expect(screen.getByText('Analítica')).toBeInTheDocument();
  });

  it('Debería resaltar visualmente la ruta activa (isActive)', () => {
    mockPathname = '/dashboard/proyectos';
    render(<Sidebar userEmail="user@innovatech.cl" userRol="USER" />);

    const linkProyectos = screen.getByText('Proyectos');
    
    // Valida que contenga las clases de estilo activo configuradas en producción
    expect(linkProyectos).toHaveClass('text-indigo-400');
  });

  it('Debería limpiar el almacenamiento y redirigir al login al pulsar Cerrar Sesión', () => {
    localStorage.setItem('token', 'active-session-token');
    render(<Sidebar userEmail="admin@innovatech.cl" userRol="ADMIN" />);

    const botonLogout = screen.getByRole('button', { name: /cerrar sesión/i });
    fireEvent.click(botonLogout);

    expect(localStorage.getItem('token')).toBeNull();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});