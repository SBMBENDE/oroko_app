import { apiClient } from './client';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  chapter?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient.post('/auth/register', data),

  login: (data: LoginPayload) =>
    apiClient.post('/auth/login', data),

  logout: () =>
    apiClient.post('/auth/logout'),

  refresh: () =>
    apiClient.post('/auth/refresh'),

  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
};
