import type { Comment, CommentQuery, PaginatedResponse } from '../types';
import { mockComments } from './mockData';

/**
 * Comments API - Mock implementation.
 */

function sortComments(comments: Comment[], sort: string): Comment[] {
  const sorted = [...comments];
  switch (sort) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'controversial':
      sorted.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
      break;
    case 'top':
    case 'best':
    default:
      sorted.sort((a, b) => b.score - a.score);
      break;
  }
  return sorted;
}

export async function getComments(query: CommentQuery): Promise<PaginatedResponse<Comment>> {
  await new Promise((r) => setTimeout(r, 200));
  const postComments = mockComments.filter((c) => c.postId === query.postId && c.parentId === null);
  const sorted = sortComments(postComments, query.sort ?? 'best');
  const page = query.page ?? 1;
  const perPage = query.perPage ?? 20;
  const start = (page - 1) * perPage;
  const data = sorted.slice(start, start + perPage);
  return {
    data,
    total: sorted.length,
    page,
    perPage,
    hasMore: start + perPage < sorted.length,
  };
}

export async function getCommentReplies(commentId: string): Promise<Comment[]> {
  await new Promise((r) => setTimeout(r, 150));
  const parent = mockComments.find((c) => c.id === commentId);
  return parent?.replies ?? [];
}

export async function createComment(data: {
  postId: string;
  parentId?: string;
  body: string;
}): Promise<Comment> {
  await new Promise((r) => setTimeout(r, 300));
  const newComment: Comment = {
    id: `cm${Date.now()}`,
    postId: data.postId,
    parentId: data.parentId ?? null,
    authorId: 'u1',
    authorName: 'alexchen',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    body: data.body,
    score: 1,
    userVote: 1,
    createdAt: new Date().toISOString(),
    isEdited: false,
    isCollapsed: false,
    depth: data.parentId ? 1 : 0,
    replies: [],
  };
  mockComments.push(newComment);
  return newComment;
}

export async function voteComment(commentId: string, direction: 1 | -1 | 0): Promise<{ score: number; userVote: 1 | -1 | 0 }> {
  await new Promise((r) => setTimeout(r, 150));
  const comment = mockComments.find((c) => c.id === commentId);
  if (!comment) throw new Error('Comment not found');
  const scoreDiff = direction - comment.userVote;
  comment.score += scoreDiff;
  comment.userVote = direction;
  return { score: comment.score, userVote: direction };
}

export async function deleteComment(commentId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const index = mockComments.findIndex((c) => c.id === commentId);
  if (index !== -1) mockComments.splice(index, 1);
}
