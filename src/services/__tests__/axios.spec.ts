import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '@/lib/axios';

describe('Axios Interceptor - Pruebas Unitarias', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('Debería inyectar el header Authorization si el token existe en localStorage', async () => {
    localStorage.setItem('token', 'fake-jwt-token');
    mock.onGet('/test-route').reply((config) => {
      // Retorna los headers recibidos para evaluarlos en la respuesta
      return [200, { headers: config.headers }];
    });

    const response = await api.get('/test-route');
    
    expect(response.data.headers['Authorization']).toBe('Bearer fake-jwt-token');
  });

  it('No debería inyectar el header Authorization si localStorage está vacío', async () => {
    mock.onGet('/test-route').reply((config) => {
      return [200, { headers: config.headers }];
    });

    const response = await api.get('/test-route');
    
    expect(response.data.headers['Authorization']).toBeUndefined();
  });
});