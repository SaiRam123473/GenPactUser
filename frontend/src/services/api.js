import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const usersApi = {
  getAll: async () => (await api.get('/users')).data,
  getById: async (id) => (await api.get(`/users/${id}`)).data,
  create: async (user) => (await api.post('/users', user)).data,
  update: async (id, user) => (await api.put(`/users/${id}`, user)).data,
  remove: async (id) => api.delete(`/users/${id}`),
};

export function getErrorMessage(error) {
  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).flat().join(' ');
  }
  if (error.response?.status === 404) return 'The requested user was not found.';
  if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (!error.response) return 'Could not connect to the API. Check that the backend is running.';
  return error.response.data?.title || 'Something went wrong. Please try again.';
}
