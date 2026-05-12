import axios from 'axios';

const BFF_URL = 'http://localhost:8080/api/bff';

// token
const TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc3ODU1NTM0OSwiZXhwIjoxNzc4NjQxNzQ5fQ._u7a1isl-khXdDnna2uG9PPM1HDeTZ0Fozjt6_HamNo';

const api = axios.create({
  baseURL: BFF_URL,
  timeout: 10000,

  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const projectService = {
  getAll: () => api.get('/proyectos'),
  getWithResources: () => api.get('/proyectos-con-recursos'),
};

export const resourceService = {
  getAll: () => api.get('/recursos'),
};

export default api;