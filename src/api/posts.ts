import type { Post, PostQuery, PaginatedResponse, PostType } from '../types';
import { mockPosts } from './mockData';

/**
 * Posts API - Mock implementation.
 * Replace with real Laravel API calls when backend is ready.
 */

function filterPosts(posts: Post[], query: PostQuery): Post[] {
  let filtered = [...posts];

  if (query.communityId) {
    filtered = filtered.filter((p) => p.communityId === query.communityId);
  }
  if (query.userId) {
    filtered = filtered.filter((p) => p.authorId === query.userId);
  }
  if (query.type) {
    filtered = filtered.filter((p) => p.type === query.type);
  }

  // Sort
  switch (query.sort) {
    case 'new':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'top':
      filtered.sort((a, b) => b.score - a.score);
      break;
    case 'rising':
      filtered.sort((a, b) => b.commentsCount - a.commentsCount);
      break;
    case 'hot':
    default:
      // Hot = combination of score and recency
      filtered.sort((a, b) => {
        const scoreA = a.score / Math.pow((Date.now() - new Date(a.createdAt).getTime()) / 3600000 + 2, 1.5);
        const scoreB = b.score / Math.pow((Date.now() - new Date(b.createdAt).getTime()) / 3600000 + 2, 1.5);
        return scoreB - scoreA;
      });
      break;
  }

  return filtered;
}

export async function getPosts(query: PostQuery = {}): Promise<PaginatedResponse<Post>> {
  const page = query.page ?? 1;
  const perPage = query.perPage ?? 10;

  const filtered = filterPosts(mockPosts, query);
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);

  return {
    data,
    total: filtered.length,
    page,
    perPage,
    hasMore: start + perPage < filtered.length,
  };
}

export async function getPost(id: string): Promise<Post | null> {
  await new Promise((r) => setTimeout(r, 200));
  return mockPosts.find((p) => p.id === id) ?? null;
}

export async function getTrendingPosts(limit: number = 5): Promise<Post[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...mockPosts]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function getPostsByUser(userId: string, query: PostQuery = {}): Promise<PaginatedResponse<Post>> {
  return getPosts({ ...query, userId });
}

export async function getPostsByCommunity(communityId: string, query: PostQuery = {}): Promise<PaginatedResponse<Post>> {
  return getPosts({ ...query, communityId });
}

export async function votePost(postId: string, direction: 1 | -1 | 0): Promise<{ score: number; userVote: 1 | -1 | 0 }> {
  await new Promise((r) => setTimeout(r, 150));
  const post = mockPosts.find((p) => p.id === postId);
  if (!post) throw new Error('Post not found');

  const scoreDiff = direction - post.userVote;
  post.score += scoreDiff;
  post.userVote = direction;

  return { score: post.score, userVote: direction };
}

export async function savePost(postId: string): Promise<{ isSaved: boolean }> {
  await new Promise((r) => setTimeout(r, 150));
  const post = mockPosts.find((p) => p.id === postId);
  if (!post) throw new Error('Post not found');
  post.isSaved = !post.isSaved;
  return { isSaved: post.isSaved };
}

export async function hidePost(postId: string): Promise<{ isHidden: boolean }> {
  await new Promise((r) => setTimeout(r, 150));
  const post = mockPosts.find((p) => p.id === postId);
  if (!post) throw new Error('Post not found');
  post.isHidden = true;
  return { isHidden: true };
}

export async function repostPost(postId: string): Promise<{ isReposted: boolean; repostsCount: number }> {
  await new Promise((r) => setTimeout(r, 200));
  const post = mockPosts.find((p) => p.id === postId);
  if (!post) throw new Error('Post not found');
  post.isReposted = !post.isReposted;
  post.repostsCount += post.isReposted ? 1 : -1;
  return { isReposted: post.isReposted, repostsCount: post.repostsCount };
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
  await new Promise((r) => setTimeout(r, 500));
  const newPost: Post = {
    id: `p${Date.now()}`,
    communityId: data.communityId,
    communityName: 'Technology',
    communitySlug: 'technology',
    communityIcon: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech',
    authorId: 'u1',
    authorName: 'alexchen',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    title: data.title,
    body: data.body,
    type: data.type,
    media: [],
    flair: data.flair,
    score: 1,
    userVote: 1,
    commentsCount: 0,
    repostsCount: 0,
    isReposted: false,
    createdAt: new Date().toISOString(),
    isSaved: false,
    isHidden: false,
    isSpoiler: data.isSpoiler ?? false,
    isNSFW: data.isNSFW ?? false,
    isPinned: false,
    isLocked: false,
  };
  mockPosts.unshift(newPost);
  return newPost;
}
