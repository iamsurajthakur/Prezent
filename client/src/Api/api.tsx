import axios from 'axios';
import env from '@/Schemas/env.schema';

export const api = axios.create({
  baseURL: env.VITE_BASE_URL || 'http://localhost:5173',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// To refresh the Access Token after expiry
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Call refresh token endpoint
      await api.get('/auth/refreshToken');

      // Retry original request
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);
