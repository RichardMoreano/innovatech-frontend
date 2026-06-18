import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '@/lib/axios'; 
import { proyectoService, Proyecto } from '../proyectoService';

describe('proyectoService - Pruebas Unitarias', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  it('obtenerTodos debería retornar un listado de proyectos cuando la API responde 200', async () => {
    const mockProyectos: Proyecto[] = [
      { id: 1, nombre: 'Proyecto Alfa', descripcion: 'Desc 1', estado: 'ACTIVO' },
      { id: 2, nombre: 'Proyecto Beta', descripcion: 'Desc 2', estado: 'PLANIFICADO' }
    ];

    // Endpoint con prefijo /bff
    mock.onGet('/bff/proyectos').reply(200, mockProyectos);

    const resultado = await proyectoService.obtenerTodos();

    expect(resultado).toEqual(mockProyectos);
    expect(resultado).toHaveLength(2);
  });

  it('crear debería enviar un POST con el payload correcto y retornar el nuevo proyecto', async () => {
    // Payload tipado correctamente cumpliendo con la interfaz Proyecto
    const nuevoProyectoRequest: Proyecto = { nombre: 'Proyecto Gamma', descripcion: 'Nuevo', estado: 'NUEVO' };
    const mockResponse: Proyecto = { id: 3, ...nuevoProyectoRequest };

    mock.onPost('/bff/proyectos').reply(201, mockResponse);

    const resultado = await proyectoService.crear(nuevoProyectoRequest);

    expect(resultado).toEqual(mockResponse);
  });

  it('obtenerDetalle debería retornar el proyecto estructurado con sus recursos asignados', async () => {
    const mockDetalle = {
      id: 1,
      nombre: 'Proyecto Alfa',
      descripcion: 'Desc 1',
      estado: 'ACTIVO',
      recursosAsignados: [{ id: 99, nombre: 'Juan Pérez', rol: 'DEV', disponibilidad: 'DISPONIBLE' }]
    };

    mock.onGet('/bff/proyectos/1/detalles').reply(200, mockDetalle);

    const resultado = await proyectoService.obtenerDetalle(1);

    expect(resultado).toEqual(mockDetalle);
    expect(resultado.recursosAsignados).toHaveLength(1);
  });

  it('eliminar debería lanzar una excepción si la API responde con error de servidor', async () => {
    mock.onDelete('/bff/proyectos/1').reply(500);

    await expect(proyectoService.eliminar(1)).rejects.toThrow();
  });
});