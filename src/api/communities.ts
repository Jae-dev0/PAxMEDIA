import { api } from './client';
import type { Community, PaginatedResponse } from '../types';

export async function getCommunities(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Community>> {
  return api.get<PaginatedResponse<Community>>('/communities', { page, per_page: perPage });
}

export async function getCommunity(slug: string): Promise<Community> {
  return api.get<Community>(`/communities/${slug}`);
}

export async function getTrendingCommunities(limit: number = 5): Promise<Community[]> {
  const response = await api.get<PaginatedResponse<Community>>('/communities', { per_page: limit });
  return response.data;
}

export async function getRecommendedCommunities(limit: number = 5): Promise<Community[]> {
  const response = await api.get<PaginatedResponse<Community>>('/communities', { per_page: limit });
  return response.data;
}

export async function joinCommunity(communityId: string): Promise<{ is_joined: boolean; members_count: number }> {
  return api.post<{ is_joined: boolean; members_count: number }>(`/communities/${communityId}/join`);
}

export async function followCommunity(communityId: string): Promise<{ is_following: boolean }> {
  return api.post<{ is_following: boolean }>(`/communities/${communityId}/follow`);
}
