import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8083/api/v2', // Apunta al API Gateway v2
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token en futuras peticiones protegidas
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;