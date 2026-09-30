import { api } from './client';
import type { Notification, PaginatedResponse } from '../types';

export async function getNotifications(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Notification>> {
  return api.get<PaginatedResponse<Notification>>('/notifications', { page, per_page: perPage });
}

export async function getUnreadCount(): Promise<number> {
  const response = await api.get<{ count: number }>('/notifications/unread-count');
  return response.count;
}

export async function markAsRead(notificationId: string): Promise<void> {
  return api.post<void>(`/notifications/${notificationId}/read`);
}

export async function markAllAsRead(): Promise<void> {
  return api.post<void>('/notifications/read-all');
}
