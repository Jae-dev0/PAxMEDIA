import { api } from './client';
import type { Post, PostQuery, PaginatedResponse, PostType } from '../types';

export async function getPosts(query: PostQuery = {}): Promise<PaginatedResponse<Post>> {
  return api.get<PaginatedResponse<Post>>('/posts', {
    page: query.page,
    per_page: query.perPage,
    sort: query.sort,
    community_id: query.communityId,
    user_id: query.userId,
    type: query.type,
  });
}

export async function getPost(id: string): Promise<Post> {
  return api.get<Post>(`/posts/${id}`);
}

export async function getTrendingPosts(limit: number = 5): Promise<Post[]> {
  const response = await api.get<PaginatedResponse<Post>>('/posts', { sort: 'top', per_page: limit });
  return response.data;
}

export async function getPostsByUser(userId: string, query: PostQuery = {}): Promise<PaginatedResponse<Post>> {
  return api.get<PaginatedResponse<Post>>(`/users/${userId}/posts`, {
    page: query.page,
    per_page: query.perPage,
  });
}

export async function getPostsByCommunity(communityId: string, query: PostQuery = {}): Promise<PaginatedResponse<Post>> {
  return api.get<PaginatedResponse<Post>>(`/communities/${communityId}/posts`, {
    page: query.page,
    per_page: query.perPage,
    sort: query.sort,
  });
}

export async function votePost(postId: string, direction: 1 | -1 | 0): Promise<{ score: number; user_vote: 1 | -1 | 0 }> {
  return api.post<{ score: number; user_vote: 1 | -1 | 0 }>(`/posts/${postId}/vote`, { vote: direction });
}

export async function savePost(postId: string): Promise<{ is_saved: boolean }> {
  return api.post<{ is_saved: boolean }>(`/posts/${postId}/save`);
}

export async function hidePost(postId: string): Promise<{ is_hidden: boolean }> {
  return api.post<{ is_hidden: boolean }>(`/posts/${postId}/hide`);
}

export async function repostPost(postId: string): Promise<{ is_reposted: boolean; reposts_count: number }> {
  return api.post<{ is_reposted: boolean; reposts_count: number }>(`/posts/${postId}/repost`);
}

export async function createPost(data: {
  communityId: string;
  title: string;
  body: string;
  type: PostType;
  flair?: string;
  isSpoiler?: boolean;
  isNSFW?: boolean;
}): Promise<Post> {
  return api.post<Post>('/posts', {
    community_id: data.communityId,
    title: data.title,
    body: data.body,
    type: data.type,
    flair: data.flair,
    is_spoiler: data.isSpoiler,
    is_nsfw: data.isNSFW,
  });
}
