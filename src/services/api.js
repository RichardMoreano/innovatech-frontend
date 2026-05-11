import axios from 'axios';

const BFF_URL = 'http://localhost:8080/api/bff';

const api = axios.create({
  baseURL: BFF_URL,
  timeout: 10000,
});

export const projectService = {
  getAll: () => api.get('/proyectos'),
  getWithResources: () => api.get('/proyectos-con-recursos'),
};

export const resourceService = {
  getAll: () => api.get('/recursos'),
};

export default api;