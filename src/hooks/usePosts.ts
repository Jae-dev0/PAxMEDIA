import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, votePost, savePost, repostPost, createPost } from '../api/posts';
import type { PostQuery, PostType } from '../types';

export function usePosts(query: PostQuery = {}) {
  return useQuery({
    queryKey: ['posts', query],
    queryFn: () => getPosts(query),
  });
}

export function useVotePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, direction }: { postId: string; direction: 1 | -1 | 0 }) =>
      votePost(postId, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useSavePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => savePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useRepostPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => repostPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      communityId: string;
      title: string;
      body: string;
      type: PostType;
      flair?: string;
      isSpoiler?: boolean;
      isNSFW?: boolean;
    }) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
