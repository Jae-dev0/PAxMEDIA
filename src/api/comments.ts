import { api } from './client';
import type { Comment, CommentQuery, PaginatedResponse } from '../types';

export async function getComments(query: CommentQuery): Promise<PaginatedResponse<Comment>> {
  return api.get<PaginatedResponse<Comment>>(`/posts/${query.postId}/comments`, {
    sort: query.sort,
    page: query.page,
    per_page: query.perPage,
  });
}

export async function getCommentReplies(commentId: string): Promise<Comment[]> {
  const response = await api.get<{ data: Comment[] }>(`/comments/${commentId}/replies`);
  return response.data;
}

export async function createComment(data: {
  postId: string;
  parentId?: string;
  body: string;
}): Promise<Comment> {
  return api.post<Comment>(`/posts/${data.postId}/comments`, {
    body: data.body,
    parent_id: data.parentId,
  });
}

export async function voteComment(commentId: string, direction: 1 | -1 | 0): Promise<{ score: number; user_vote: 1 | -1 | 0 }> {
  return api.post<{ score: number; user_vote: 1 | -1 | 0 }>(`/comments/${commentId}/vote`, { vote: direction });
}

export async function deleteComment(commentId: string): Promise<void> {
  return api.delete<void>(`/comments/${commentId}`);
}
