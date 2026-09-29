import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReports, getBans, getReportStats, resolveReport, banUser } from '../api/moderation';

export function useReports(status?: string, page: number = 1, perPage: number = 20) {
  return useQuery({
    queryKey: ['reports', status, page, perPage],
    queryFn: () => getReports(status, page, perPage),
  });
}

export function useBans(page: number = 1, perPage: number = 20) {
  return useQuery({
    queryKey: ['bans', page, perPage],
    queryFn: () => getBans(page, perPage),
  });
}

export function useReportStats() {
  return useQuery({
    queryKey: ['reportStats'],
    queryFn: getReportStats,
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, action }: { reportId: string; action: 'approve' | 'remove' | 'dismiss' }) =>
      resolveReport(reportId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reportStats'] });
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      userId: string;
      reason: string;
      communityId?: string;
      isPermanent: boolean;
      expiresAt?: string;
    }) => banUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bans'] });
    },
  });
}
