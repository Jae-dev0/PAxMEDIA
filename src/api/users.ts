import { api } from './client';
import type { User, PaginatedResponse } from '../types';

export async function getUser(username: string): Promise<User> {
  return api.get<User>(`/users/${username}`);
}

export async function getUserById(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`);
}

export async function getUsers(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<User>> {
  return api.get<PaginatedResponse<User>>('/users', { page, per_page: perPage });
}

export async function getRisingCreators(limit: number = 5): Promise<User[]> {
  const response = await api.get<PaginatedResponse<User>>('/users', { per_page: limit });
  return response.data;
}

export async function followUser(userId: string): Promise<{ is_following: boolean; followers_count: number }> {
  return api.post<{ is_following: boolean; followers_count: number }>(`/users/${userId}/follow`);
}

export async function getCurrentUser(): Promise<User> {
  return api.get<User>('/auth/me');
}
