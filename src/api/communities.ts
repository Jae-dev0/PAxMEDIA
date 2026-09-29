import type { Community, PaginatedResponse } from '../types';
import { mockCommunities } from './mockData';

/**
 * Communities API - Mock implementation.
 */

export async function getCommunities(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Community>> {
  await new Promise((r) => setTimeout(r, 200));
  const start = (page - 1) * perPage;
  const data = mockCommunities.slice(start, start + perPage);
  return {
    data,
    total: mockCommunities.length,
    page,
    perPage,
    hasMore: start + perPage < mockCommunities.length,
  };
}

export async function getCommunity(slug: string): Promise<Community | null> {
  await new Promise((r) => setTimeout(r, 200));
  return mockCommunities.find((c) => c.slug === slug) ?? null;
}

export async function getTrendingCommunities(limit: number = 5): Promise<Community[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...mockCommunities]
    .sort((a, b) => b.membersCount - a.membersCount)
    .slice(0, limit);
}

export async function getRecommendedCommunities(limit: number = 5): Promise<Community[]> {
  await new Promise((r) => setTimeout(r, 200));
  return mockCommunities.filter((c) => !c.isJoined).slice(0, limit);
}

export async function joinCommunity(communityId: string): Promise<{ isJoined: boolean }> {
  await new Promise((r) => setTimeout(r, 200));
  const community = mockCommunities.find((c) => c.id === communityId);
  if (!community) throw new Error('Community not found');
  community.isJoined = !community.isJoined;
  return { isJoined: community.isJoined };
}

export async function followCommunity(communityId: string): Promise<{ isFollowing: boolean }> {
  await new Promise((r) => setTimeout(r, 200));
  const community = mockCommunities.find((c) => c.id === communityId);
  if (!community) throw new Error('Community not found');
  community.isFollowing = !community.isFollowing;
  return { isFollowing: community.isFollowing };
}
