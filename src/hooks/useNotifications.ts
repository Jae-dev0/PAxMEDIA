import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../api/notifications';

export function useNotifications(page: number = 1, perPage: number = 20) {
  return useQuery({
    queryKey: ['notifications', page, perPage],
    queryFn: () => getNotifications(page, perPage),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    },
  });
}
