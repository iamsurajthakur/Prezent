import { api } from './api';

type registerRequest = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
type loginRequest = {
  email: string;
  password: string;
};

export const registerUser = async (data: registerRequest) => {
  return await api.post('/api/v1/auth/register', data);
};

export const loginUser = async (data: loginRequest) => {
  return await api.post('/api/v1/auth/login', data);
};

export const getMe = async () => {
  return await api.get('/api/v1/auth/getMe');
};

// To refresh the Access Token after expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/refreshToken')
    ) {
      originalRequest._retry = true;

      try {
        await api.post(
          '/api/v1/auth/refreshToken',
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
