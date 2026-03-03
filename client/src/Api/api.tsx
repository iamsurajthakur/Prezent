import axios from 'axios';
import env from '@/Schemas/env.schema';

export const api = axios.create({
  baseURL: env.VITE_BASE_URL || 'http://localhost:5173',
  withCredentials: true,
});
