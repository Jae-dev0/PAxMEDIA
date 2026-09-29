import type { Notification, PaginatedResponse } from '../types';
import { mockNotifications } from './mockData';

/**
 * Notifications API - Mock implementation.
 */

export async function getNotifications(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Notification>> {
  await new Promise((r) => setTimeout(r, 200));
  const start = (page - 1) * perPage;
  const data = mockNotifications.slice(start, start + perPage);
  return {
    data,
    total: mockNotifications.length,
    page,
    perPage,
    hasMore: start + perPage < mockNotifications.length,
  };
}

export async function getUnreadCount(): Promise<number> {
  await new Promise((r) => setTimeout(r, 100));
  return mockNotifications.filter((n) => !n.isRead).length;
}

export async function markAsRead(notificationId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 100));
  const notification = mockNotifications.find((n) => n.id === notificationId);
  if (notification) notification.isRead = true;
}

export async function markAllAsRead(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  mockNotifications.forEach((n) => (n.isRead = true));
}
