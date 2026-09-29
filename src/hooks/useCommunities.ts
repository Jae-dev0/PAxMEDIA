import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommunities, getCommunity, joinCommunity, followCommunity } from '../api/communities';

export function useCommunities(page: number = 1, perPage: number = 10) {
  return useQuery({
    queryKey: ['communities', page, perPage],
    queryFn: () => getCommunities(page, perPage),
  });
}

export function useCommunity(slug: string) {
  return useQuery({
    queryKey: ['community', slug],
    queryFn: () => getCommunity(slug),
    enabled: !!slug,
  });
}

export function useJoinCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (communityId: string) => joinCommunity(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['community'] });
    },
  });
}

export function useFollowCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (communityId: string) => followCommunity(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['community'] });
    },
  });
}
