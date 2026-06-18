import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '@/lib/axios';
import { recursoService, Recurso } from '../recursoService';

describe('recursoService - Pruebas Unitarias', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  it('obtenerTodos debería retornar un listado de recursos cuando la API responde 200', async () => {
    const mockRecursos: Recurso[] = [
      { id: 1, nombre: 'Juan', rol: 'DEVELOPER', disponibilidad: true },
      { id: 2, nombre: 'Ana', rol: 'DESIGNER', disponibilidad: false }
    ];

    mock.onGet('/bff/recursos').reply(200, mockRecursos);

    const resultado = await recursoService.obtenerTodos();

    expect(resultado).toEqual(mockRecursos);
    expect(resultado).toHaveLength(2);
  });

  it('crear debería enviar un POST omitiendo el id y retornar el recurso creado', async () => {
    const nuevoRecurso: Omit<Recurso, 'id'> = {
      nombre: 'Carlos',
      rol: 'QA',
      disponibilidad: true
    };
    const mockResponse: Recurso = { id: 3, ...nuevoRecurso };

    mock.onPost('/bff/recursos').reply(201, mockResponse);

    const resultado = await recursoService.crear(nuevoRecurso);

    expect(resultado).toEqual(mockResponse);
  });

  it('eliminar debería realizar una llamada DELETE exitosa al endpoint correcto', async () => {
    mock.onDelete('/bff/recursos/1').reply(200);

    await expect(recursoService.eliminar(1)).resolves.not.toThrow();
  });

  it('eliminar debería propagar la excepción cuando la API responde con un código de error 500', async () => {
    mock.onDelete('/bff/recursos/999').reply(500, { mensaje: 'Internal Server Error' });

    await expect(recursoService.eliminar(999)).rejects.toThrow();
  });
});