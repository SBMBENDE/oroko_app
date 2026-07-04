import { apiClient } from './client';

export const messagesApi = {
  getConversations: () =>
    apiClient.get('/messages/conversations'),

  getThread: (userId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/messages/conversations/${userId}`, { params }),

  send: (userId: string, content: string) =>
    apiClient.post(`/messages/${userId}`, { content }),

  markRead: (userId: string) =>
    apiClient.patch(`/messages/${userId}/read`),

  delete: (messageId: string) =>
    apiClient.delete(`/messages/${messageId}`),
};

export const notificationsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/notifications', { params }),

  markOneRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`),

  markAllRead: () =>
    apiClient.patch('/notifications/read-all'),

  delete: (id: string) =>
    apiClient.delete(`/notifications/${id}`),
};
