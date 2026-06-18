import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { recursoService } from '@/services/recursoService';
import GestionRecursos from '@/components/recursos/GestionRecursos';

vi.mock('@/services/recursoService', () => ({
  recursoService: {
    obtenerTodos: vi.fn(),
    crear: vi.fn(),
    eliminar: vi.fn(),
  },
}));

const mockRecursos = [
  {
    id: 1,
    nombre: 'Linus',
    apellido: 'Torvalds',
    email: 'linus@kernel.org',
    rol: 'Kernel Maintainer',
    disponibilidad: true,
    horasSemana: 45,
  },
];

describe('GestionRecursos - Pruebas de Capital Humano', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(recursoService.obtenerTodos).mockResolvedValue(mockRecursos as any);
  });

  it('Debería cargar y renderizar la lista de colaboradores en la tabla', async () => {
    render(<GestionRecursos />);

    await waitFor(() => {
      expect(screen.getByText('Linus Torvalds')).toBeInTheDocument();
      expect(screen.getByText('linus@kernel.org')).toBeInTheDocument();
      expect(screen.getByText('Kernel Maintainer')).toBeInTheDocument();
      expect(screen.getByText('45 hrs/semana')).toBeInTheDocument();
    });
  });

  it('Debería registrar un nuevo colaborador a través del formulario', async () => {
    vi.mocked(recursoService.crear).mockResolvedValue({} as any);

    render(<GestionRecursos />);
    await waitFor(() => expect(screen.getByText('Linus Torvalds')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Lovelace' } });
    fireEvent.change(screen.getByPlaceholderText('Email corporativo'), { target: { value: 'ada@innovatech.com' } });
    fireEvent.change(screen.getByPlaceholderText('Rol (ej. Senior Developer)'), { target: { value: 'Math Alchemist' } });
    fireEvent.change(screen.getByPlaceholderText('Horas semanales'), { target: { value: '40' } });

    const botonRegistrar = screen.getByRole('button', { name: /registrar/i });
    fireEvent.click(botonRegistrar);

    await waitFor(() => {
      expect(recursoService.crear).toHaveBeenCalledWith({
        nombre: 'Ada',
        apellido: 'Lovelace',
        email: 'ada@innovatech.com',
        rol: 'Math Alchemist',
        disponibilidad: true,
        horasSemana: 40,
      });
      expect(recursoService.obtenerTodos).toHaveBeenCalledTimes(2);
    });
  });

  it('Debería solicitar confirmación y remover al colaborador del ecosistema', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(recursoService.eliminar).mockResolvedValue({} as any);

    render(<GestionRecursos />);
    await waitFor(() => expect(screen.getByText('Linus Torvalds')).toBeInTheDocument());

    const botonEliminar = screen.getByRole('button', { name: '' }); 
    fireEvent.click(botonEliminar);

    expect(confirmSpy).toHaveBeenCalledWith('¿Confirmas la baja de este recurso?');
    
    await waitFor(() => {
      expect(recursoService.eliminar).toHaveBeenCalledWith(1);
      expect(recursoService.obtenerTodos).toHaveBeenCalledTimes(2);
    });
  });

  it('Debería capturar el error en console.error si la carga inicial de recursos falla', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(recursoService.obtenerTodos).mockRejectedValue(new Error('Fetch Failed'));

    render(<GestionRecursos />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error al cargar recursos', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('Debería activar un alert cuando la creación de un colaborador falla en el servidor', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(recursoService.crear).mockRejectedValue(new Error('Post Failed'));

    render(<GestionRecursos />);
    await waitFor(() => expect(screen.getByText('Linus Torvalds')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Lovelace' } });
    fireEvent.change(screen.getByPlaceholderText('Email corporativo'), { target: { value: 'ada@innovatech.com' } });
    fireEvent.change(screen.getByPlaceholderText('Rol (ej. Senior Developer)'), { target: { value: 'Math' } });

    const botonRegistrar = screen.getByRole('button', { name: /registrar/i });
    fireEvent.click(botonRegistrar);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error al crear el recurso');
    });
    alertSpy.mockRestore();
  });

  it('Debería asignar 0 horas semanales si el valor numérico ingresado queda vacío', async () => {
    vi.mocked(recursoService.crear).mockResolvedValue({} as any);
    render(<GestionRecursos />);
    await waitFor(() => expect(screen.getByText('Linus Torvalds')).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Lovelace' } });
    fireEvent.change(screen.getByPlaceholderText('Email corporativo'), { target: { value: 'ada@innovatech.com' } });
    fireEvent.change(screen.getByPlaceholderText('Rol (ej. Senior Developer)'), { target: { value: 'Math' } });
    
    const inputHoras = screen.getByPlaceholderText('Horas semanales');
    fireEvent.change(inputHoras, { target: { value: '' } });
    
    const botonRegistrar = screen.getByRole('button', { name: /registrar/i });
    fireEvent.click(botonRegistrar);

    await waitFor(() => {
      expect(recursoService.crear).toHaveBeenCalledWith(expect.objectContaining({
        horasSemana: 0
      }));
    });
  });

  it('Debería cancelar la baja del recurso si el usuario cancela el diálogo nativo confirm', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<GestionRecursos />);
    await waitFor(() => expect(screen.getByText('Linus Torvalds')).toBeInTheDocument());

    const botonEliminar = screen.getByRole('button', { name: '' }); 
    fireEvent.click(botonEliminar);

    expect(confirmSpy).toHaveBeenCalled();
    expect(recursoService.eliminar).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('Debería activar un alert si el borrado falla en el backend', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(recursoService.eliminar).mockRejectedValue(new Error('Delete Failed'));

    render(<GestionRecursos />);
    await waitFor(() => expect(screen.getByText('Linus Torvalds')).toBeInTheDocument());

    const botonEliminar = screen.getByRole('button', { name: '' }); 
    fireEvent.click(botonEliminar);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error al eliminar');
    });
    alertSpy.mockRestore();
    confirmSpy.mockRestore();
  });
});