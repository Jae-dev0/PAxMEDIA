import type { User, PaginatedResponse } from '../types';
import { mockUsers } from './mockData';

/**
 * Users API - Mock implementation.
 */

export async function getUser(username: string): Promise<User | null> {
  await new Promise((r) => setTimeout(r, 200));
  return mockUsers.find((u) => u.username === username) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  await new Promise((r) => setTimeout(r, 200));
  return mockUsers.find((u) => u.id === id) ?? null;
}

export async function getUsers(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<User>> {
  await new Promise((r) => setTimeout(r, 200));
  const start = (page - 1) * perPage;
  const data = mockUsers.slice(start, start + perPage);
  return {
    data,
    total: mockUsers.length,
    page,
    perPage,
    hasMore: start + perPage < mockUsers.length,
  };
}

export async function getRisingCreators(limit: number = 5): Promise<User[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...mockUsers]
    .sort((a, b) => b.karma - a.karma)
    .slice(0, limit);
}

export async function followUser(userId: string): Promise<{ isFollowing: boolean }> {
  await new Promise((r) => setTimeout(r, 200));
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');
  return { isFollowing: true };
}

export async function getCurrentUser(): Promise<User> {
  await new Promise((r) => setTimeout(r, 100));
  return mockUsers[0]; // alexchen
}
