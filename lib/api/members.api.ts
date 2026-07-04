import { apiClient } from './client';

export const membersApi = {
  getDirectory: (params?: Record<string, string>) =>
    apiClient.get('/members', { params }),

  getById: (id: string) =>
    apiClient.get(`/members/${id}`),

  getMe: () =>
    apiClient.get('/members/me'),

  updateProfile: (data: Record<string, unknown>) =>
    apiClient.patch('/members/me/profile', data),

  updateAvatar: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return apiClient.patch('/members/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updatePrivacy: (settings: Record<string, boolean>) =>
    apiClient.patch('/members/me/privacy', settings),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.patch('/members/me/password', { currentPassword, newPassword }),
};

export const executivesApi = {
  getAll: () => apiClient.get('/executives'),
};

export const chaptersApi = {
  getAll: () => apiClient.get('/chapters'),
};
