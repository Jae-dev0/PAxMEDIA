import type { SearchQuery, SearchResult, PaginatedResponse } from '../types';
import { mockPosts, mockCommunities, mockUsers, mockComments } from './mockData';

/**
 * Search API - Mock implementation.
 */

export async function search(query: SearchQuery): Promise<PaginatedResponse<SearchResult>> {
  await new Promise((r) => setTimeout(r, 400));
  const q = query.q.toLowerCase();
  let results: SearchResult[] = [];

  // Search posts
  if (!query.type || query.type === 'post') {
    const postResults = mockPosts
      .filter((p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q))
      .map((p) => ({
        id: p.id,
        type: 'post' as const,
        title: p.title,
        subtitle: p.body.substring(0, 100) + '...',
        avatar: p.communityIcon,
        communityName: p.communityName,
        score: p.score,
        createdAt: p.createdAt,
      }));
    results = results.concat(postResults);
  }

  // Search communities
  if (!query.type || query.type === 'community') {
    const communityResults = mockCommunities
      .filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .map((c) => ({
        id: c.id,
        type: 'community' as const,
        title: c.name,
        subtitle: c.description.substring(0, 100) + '...',
        avatar: c.icon,
        score: c.membersCount,
        createdAt: c.createdAt,
      }));
    results = results.concat(communityResults);
  }

  // Search users
  if (!query.type || query.type === 'user') {
    const userResults = mockUsers
      .filter((u) => u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q))
      .map((u) => ({
        id: u.id,
        type: 'user' as const,
        title: u.displayName,
        subtitle: `@${u.username} · ${u.karma.toLocaleString()} karma`,
        avatar: u.avatar,
        score: u.karma,
        createdAt: u.joinedAt,
      }));
    results = results.concat(userResults);
  }

  // Search comments
  if (!query.type || query.type === 'comment') {
    const commentResults = mockComments
      .filter((c) => c.body.toLowerCase().includes(q))
      .map((c) => ({
        id: c.id,
        type: 'comment' as const,
        title: c.body.substring(0, 80) + '...',
        subtitle: `by ${c.authorName}`,
        avatar: c.authorAvatar,
        score: c.score,
        createdAt: c.createdAt,
      }));
    results = results.concat(commentResults);
  }

  // Sort
  switch (query.sort) {
    case 'newest':
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'popular':
      results.sort((a, b) => b.score - a.score);
      break;
    case 'relevance':
    default:
      // Simple relevance: title matches score higher
      results.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q) ? 1 : 0;
        const bTitle = b.title.toLowerCase().includes(q) ? 1 : 0;
        return bTitle - aTitle || b.score - a.score;
      });
      break;
  }

  const page = query.page ?? 1;
  const perPage = query.perPage ?? 20;
  const start = (page - 1) * perPage;
  const data = results.slice(start, start + perPage);

  return {
    data,
    total: results.length,
    page,
    perPage,
    hasMore: start + perPage < results.length,
  };
}
