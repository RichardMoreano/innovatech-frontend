import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { proyectoService } from '@/services/proyectoService';
import { recursoService } from '@/services/recursoService';
import GestionProyectos from '@/components/proyectos/GestionProyectos';

vi.mock('@/services/proyectoService', () => ({
  proyectoService: {
    obtenerTodos: vi.fn(),
    obtenerDetalle: vi.fn(),
    crear: vi.fn(),
    eliminar: vi.fn(),
    actualizarEstado: vi.fn(),
    asignarRecurso: vi.fn(),
    eliminarRecurso: vi.fn(),
  },
}));

vi.mock('@/services/recursoService', () => ({
  recursoService: {
    obtenerTodos: vi.fn(),
  },
}));

const mockProyectos = [
  { id: 101, nombre: 'Sistema Cloud', descripcion: 'Migración Core', estado: 'PLANIFICACION' },
];

const mockRecursos = [
  { id: 1, nombre: 'Ana Ingeniera', rol: 'DevOps', disponibilidad: 'TRUE' },
  { id: 2, nombre: 'Carlos Dev', rol: 'Backend', disponibilidad: 'OCUPADO' },
];

const mockDetalleProyecto = {
  id: 101,
  nombre: 'Sistema Cloud',
  descripcion: 'Migración Core',
  estado: 'PLANIFICADO',
  recursosAsignados: [
    { id: 3, nombre: 'Elena Arquitecta', rol: 'Tech Lead', disponibilidad: 'TRUE' }
  ],
};

describe('GestionProyectos - Pruebas del Ecosistema Operacional', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(proyectoService.obtenerTodos).mockResolvedValue(mockProyectos as any);
    vi.mocked(recursoService.obtenerTodos).mockResolvedValue(mockRecursos as any);
  });

  it('Debería mostrar el spinner de carga inicial y luego renderizar los proyectos con recursos libres', async () => {
    render(<GestionProyectos />);

    expect(document.querySelector('svg.animate-spin')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Sistema Cloud')).toBeInTheDocument();
      expect(screen.getByText('Migración Core')).toBeInTheDocument();
    });
  });

  it('Debería registrar un nuevo proyecto a través del formulario', async () => {
    vi.mocked(proyectoService.crear).mockResolvedValue({ id: 102, nombre: 'API Gateway', descripcion: 'Seguridad', estado: 'PLANIFICACION' } as any);
    
    render(<GestionProyectos />);
    await waitFor(() => expect(screen.getByText('Sistema Cloud')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/Ej. Implementación API Gateway/i), { target: { value: 'API Gateway' } });
    fireEvent.change(screen.getByPlaceholderText(/Defina los alcances/i), { target: { value: 'Seguridad' } });
    
    const botonLanzar = screen.getByRole('button', { name: /Lanzar Proyecto/i });
    fireEvent.click(botonLanzar);

    await waitFor(() => {
      expect(proyectoService.crear).toHaveBeenCalledWith({
        nombre: 'API Gateway',
        descripcion: 'Seguridad',
        estado: 'PLANIFICACION'
      });
    });
  });

  it('Debería abrir el modal detallado al hacer click sobre una tarjeta de proyecto', async () => {
    vi.mocked(proyectoService.obtenerDetalle).mockResolvedValue(mockDetalleProyecto as any);
    
    render(<GestionProyectos />);
    await waitFor(() => expect(screen.getByText('Sistema Cloud')).toBeInTheDocument());

    const tarjeta = screen.getByText('Sistema Cloud').closest('.group')!;
    fireEvent.click(tarjeta);

    await waitFor(() => {
      expect(proyectoService.obtenerDetalle).toHaveBeenCalledWith(101);
      expect(screen.getByText('Detalles de Proyecto')).toBeInTheDocument();
      expect(screen.getByText('Elena Arquitecta')).toBeInTheDocument();
      expect(screen.getByText('Ana Ingeniera')).toBeInTheDocument();
      expect(screen.queryByText('Carlos Dev')).not.toBeInTheDocument();
    });
  });

  it('Debería ejecutar la vinculación de un recurso disponible forzando la actualización de la UI', async () => {
    vi.mocked(proyectoService.obtenerDetalle).mockResolvedValue(mockDetalleProyecto as any);
    vi.mocked(proyectoService.asignarRecurso).mockResolvedValue(undefined as any);

    render(<GestionProyectos />);
    
    const tarjetaProyecto = await screen.findByText('Sistema Cloud');
    const contenedorTarjeta = tarjetaProyecto.closest('.group');
    expect(contenedorTarjeta).toBeTruthy();

    fireEvent.click(contenedorTarjeta!);

    await screen.findByText('Detalles de Proyecto');

    const botonAsignar = await screen.findByRole('button', { name: /^asignar$/i });
    expect(botonAsignar).toBeInTheDocument();
    fireEvent.click(botonAsignar);

    await waitFor(() => {
      expect(proyectoService.asignarRecurso).toHaveBeenCalledWith(101, 1);
      expect(proyectoService.obtenerDetalle).toHaveBeenCalledTimes(2);
      expect(recursoService.obtenerTodos).toHaveBeenCalledTimes(2);
    });
  });

  it('Debería cambiar el estado del proyecto al hacer click en los botones del ciclo de vida', async () => {
    vi.mocked(proyectoService.obtenerDetalle).mockResolvedValue(mockDetalleProyecto as any);
    vi.mocked(proyectoService.actualizarEstado).mockResolvedValue({ estado: 'EN_PROGRESO' } as any);

    render(<GestionProyectos />);
    const tarjeta = (await screen.findByText('Sistema Cloud')).closest('.group')!;
    fireEvent.click(tarjeta);

    const botonProgreso = await screen.findByRole('button', { name: 'EN_PROGRESO' });
    fireEvent.click(botonProgreso);

    await waitFor(() => {
      expect(proyectoService.actualizarEstado).toHaveBeenCalledWith(101, 'EN_PROGRESO');
    });
  });

  it('Debería solicitar confirmación y eliminar el proyecto del ecosistema', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(proyectoService.eliminar).mockResolvedValue({} as any);

    render(<GestionProyectos />);
    
    const textoProyecto = await screen.findByText('Sistema Cloud');
    const tarjeta = textoProyecto.closest('.group')!;
    expect(tarjeta).toBeTruthy();

    const botonEliminar = tarjeta.querySelector('button') || screen.getAllByRole('button')[0];
    fireEvent.click(botonEliminar);

    expect(confirmSpy).toHaveBeenCalled();
    await waitFor(() => {
      expect(proyectoService.eliminar).toHaveBeenCalledWith(101);
      expect(proyectoService.obtenerTodos).toHaveBeenCalled();
    });
  });

  it('Debería capturar el error y activar el alert cuando el pipeline de creación de proyectos falla', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(proyectoService.crear).mockRejectedValue(new Error('Form Error'));

    render(<GestionProyectos />);
    await waitFor(() => expect(screen.getByText('Sistema Cloud')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/Ej. Implementación API Gateway/i), { target: { value: 'API Fails' } });
    fireEvent.change(screen.getByPlaceholderText(/Defina los alcances/i), { target: { value: 'Error Drop' } });
    
    const botonLanzar = screen.getByRole('button', { name: /Lanzar Proyecto/i });
    fireEvent.click(botonLanzar);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error en el pipeline al registrar el proyecto');
    });
    alertSpy.mockRestore();
  });

  it('Debería manejar la excepción de cambio de estado en el ciclo de vida sin romper la UI', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(proyectoService.obtenerDetalle).mockResolvedValue(mockDetalleProyecto as any);
    vi.mocked(proyectoService.actualizarEstado).mockRejectedValue(new Error('State Crash'));

    render(<GestionProyectos />);
    const tarjeta = (await screen.findByText('Sistema Cloud')).closest('.group')!;
    fireEvent.click(tarjeta);

    const botonProgreso = await screen.findByRole('button', { name: 'EN_PROGRESO' });
    fireEvent.click(botonProgreso);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it('Debería manejar excepciones al desvincular un recurso personal ejecutando el bloque finally para refrescar los datos', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(proyectoService.obtenerDetalle).mockResolvedValue(mockDetalleProyecto as any);
    vi.mocked(proyectoService.eliminarRecurso).mockRejectedValue(new Error('Unlink Error'));

    render(<GestionProyectos />);
    
    const tarjeta = (await screen.findByText('Sistema Cloud')).closest('.group')!;
    fireEvent.click(tarjeta);

    await screen.findByText('Detalles de Proyecto');
    const textoRecurso = await screen.findByText('Elena Arquitecta');
    
    const contenedorRecurso = textoRecurso.closest('.flex');
    expect(contenedorRecurso).toBeTruthy();
    const botonDesvincular = contenedorRecurso!.querySelector('button')!;
    expect(botonDesvincular).toBeTruthy();
    
    fireEvent.click(botonDesvincular);

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(proyectoService.obtenerDetalle).toHaveBeenCalledTimes(2);
    });
    
    consoleWarnSpy.mockRestore();
  });

  // --- NUEVOS CASOS PARA COBERTURA COMPLETA DE RAMAS (BRANCH COVERAGE) ---

  it('Debería capturar errores en consola si falla la carga inicial de datos de proyectos o recursos', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(proyectoService.obtenerTodos).mockRejectedValue(new Error('Fail Proyectos'));

    render(<GestionProyectos />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it('Debería capturar errores si falla la consulta de recursos libres específicamente', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(recursoService.obtenerTodos).mockRejectedValue(new Error('Fail Recursos'));

    render(<GestionProyectos />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it('Debería registrar el error en consola si falla la carga del detalle de un proyecto al abrirlo', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(proyectoService.obtenerDetalle).mockRejectedValue(new Error('Fail Detalle'));

    render(<GestionProyectos />);
    await waitFor(() => expect(screen.getByText('Sistema Cloud')).toBeInTheDocument());

    const tarjeta = screen.getByText('Sistema Cloud').closest('.group')!;
    fireEvent.click(tarjeta);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it('Debería cancelar el borrado del proyecto si el usuario hace click en Cancelar en el diálogo confirm', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<GestionProyectos />);
    await waitFor(() => expect(screen.getByText('Sistema Cloud')).toBeInTheDocument());

    const tarjeta = screen.getByText('Sistema Cloud').closest('.group')!;
    const botonEliminar = tarjeta.querySelector('button')!;
    fireEvent.click(botonEliminar);

    expect(confirmSpy).toHaveBeenCalled();
    expect(proyectoService.eliminar).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('Debería lanzar un alert si la llamada de eliminación del proyecto falla en el backend', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(proyectoService.eliminar).mockRejectedValue(new Error('Fail Delete'));

    render(<GestionProyectos />);
    await waitFor(() => expect(screen.getByText('Sistema Cloud')).toBeInTheDocument());

    const tarjeta = screen.getByText('Sistema Cloud').closest('.group')!;
    const botonEliminar = tarjeta.querySelector('button')!;
    fireEvent.click(botonEliminar);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error al procesar la eliminación');
    });
    alertSpy.mockRestore();
    confirmSpy.mockRestore();
  });

  it('Debería renderizar la interfaz de aviso cuando la lista de proyectos inicial viene vacía', async () => {
    vi.mocked(proyectoService.obtenerTodos).mockResolvedValue([] as any);

    render(<GestionProyectos />);

    await waitFor(() => {
      expect(screen.getByText('No se registran proyectos activos devueltos por el sistema.')).toBeInTheDocument();
    });
  });

  it('Debería cerrar el modal de detalles al hacer click en el botón de cerrar de la esquina', async () => {
    vi.mocked(proyectoService.obtenerDetalle).mockResolvedValue(mockDetalleProyecto as any);
    
    render(<GestionProyectos />);
    await waitFor(() => expect(screen.getByText('Sistema Cloud')).toBeInTheDocument());

    const tarjeta = screen.getByText('Sistema Cloud').closest('.group')!;
    fireEvent.click(tarjeta);

    const botonCerrar = await screen.findByText('✕');
    fireEvent.click(botonCerrar);

    await waitFor(() => {
      expect(screen.queryByText('Detalles de Proyecto')).not.toBeInTheDocument();
    });
  });

  it('Debería renderizar un mensaje de aviso en el modal cuando el proyecto no tiene recursos asignados', async () => {
    const mockProyectoSinRecusos = { ...mockDetalleProyecto, recursosAsignados: [] };
    vi.mocked(proyectoService.obtenerDetalle).mockResolvedValue(mockProyectoSinRecusos as any);

    render(<GestionProyectos />);
    await waitFor(() => expect(screen.getByText('Sistema Cloud')).toBeInTheDocument());

    const tarjeta = screen.getByText('Sistema Cloud').closest('.group')!;
    fireEvent.click(tarjeta);

    await waitFor(() => {
      expect(screen.getByText('No hay personal trabajando aquí.')).toBeInTheDocument();
    });
  });

  it('Debería renderizar un mensaje indicando que no hay personal libre cuando la lista de recursos disponibles está vacía', async () => {
    vi.mocked(recursoService.obtenerTodos).mockResolvedValue([] as any);
    vi.mocked(proyectoService.obtenerDetalle).mockResolvedValue(mockDetalleProyecto as any);

    render(<GestionProyectos />);
    await waitFor(() => expect(screen.getByText('Sistema Cloud')).toBeInTheDocument());

    const tarjeta = screen.getByText('Sistema Cloud').closest('.group')!;
    fireEvent.click(tarjeta);

    await waitFor(() => {
      expect(screen.getByText('Todo el personal está ocupado.')).toBeInTheDocument();
    });
  });

  it('Debería validar variantes del formateador de disponibilidad (disponible o variante booleana pura)', async () => {
    const recursosVariados = [
      { id: 10, nombre: 'Luis', rol: 'QA', disponibilidad: 'DISPONIBLE' },
      { id: 11, nombre: 'Maria', rol: 'UX', disponible: true }
    ];
    vi.mocked(recursoService.obtenerTodos).mockResolvedValue(recursosVariados as any);
    vi.mocked(proyectoService.obtenerDetalle).mockResolvedValue(mockDetalleProyecto as any);

    render(<GestionProyectos />);
    await waitFor(() => expect(screen.getByText('Sistema Cloud')).toBeInTheDocument());

    const tarjeta = screen.getByText('Sistema Cloud').closest('.group')!;
    fireEvent.click(tarjeta);

    await waitFor(() => {
      expect(screen.getByText('Luis')).toBeInTheDocument();
      expect(screen.getByText('Maria')).toBeInTheDocument();
    });
  });
});