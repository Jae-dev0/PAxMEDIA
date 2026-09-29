import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment, voteComment, deleteComment } from '../api/comments';
import type { CommentQuery } from '../types';

export function useComments(query: CommentQuery) {
  return useQuery({
    queryKey: ['comments', query],
    queryFn: () => getComments(query),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { postId: string; parentId?: string; body: string }) =>
      createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
}

export function useVoteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, direction }: { commentId: string; direction: 1 | -1 | 0 }) =>
      voteComment(commentId, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}
