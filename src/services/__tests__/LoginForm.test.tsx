import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '@/lib/axios';
import LoginForm from '@/components/auth/LoginForm';


const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

describe('LoginForm - Pruebas de Componente', () => {
  let axiosMock: MockAdapter;

  beforeEach(() => {
    axiosMock = new MockAdapter(api);
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('Debería renderizar los campos del formulario y el botón de submit', () => {
    render(<LoginForm />);
    
    expect(screen.getByPlaceholderText('usuario@innovatech.cl')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('Debería autenticar exitosamente, guardar datos en localStorage y redirigir al home', async () => {
    const mockUserData = {
      token: 'valid-token',
      email: 'admin@innovatech.cl',
      rol: 'ADMIN'
    };

    axiosMock.onPost('/auth/login').reply(200, mockUserData);

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('usuario@innovatech.cl'), { target: { value: 'admin@innovatech.cl' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('valid-token');
      expect(localStorage.getItem('userEmail')).toBe('admin@innovatech.cl');
      expect(localStorage.getItem('userRol')).toBe('ADMIN');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('Debería mostrar un mensaje de error si las credenciales fallan', async () => {
    axiosMock.onPost('/auth/login').reply(401, { message: 'Credenciales inválidas.' });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('usuario@innovatech.cl'), { target: { value: 'error@innovatech.cl' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong-pass' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas.')).toBeInTheDocument();
    });
  });
});