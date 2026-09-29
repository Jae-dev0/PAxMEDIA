import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markAsRead, markAllAsRead } from '../../api/notifications';
import type { Notification } from '../../types';
import { timeAgo, cn } from '../../utils/format';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { Bell, MessageSquare, AtSign, ArrowBigUp, UserPlus, Users, Shield, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const typeIcons = {
  comment_reply: MessageSquare,
  post_reply: MessageSquare,
  mention: AtSign,
  upvote: ArrowBigUp,
  follower: UserPlus,
  community: Users,
  message: MessageSquare,
  moderation: Shield,
};

const typeColors = {
  comment_reply: 'text-blue-500',
  post_reply: 'text-blue-500',
  mention: 'text-purple-500',
  upvote: 'text-brand-600',
  follower: 'text-green-500',
  community: 'text-orange-500',
  message: 'text-blue-500',
  moderation: 'text-red-500',
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-surface-200 dark:bg-surface-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Notifications</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllReadMutation.mutate()}
          isLoading={markAllReadMutation.isPending}
        >
          <Check className="w-4 h-4 mr-1" />
          Mark all as read
        </Button>
      </div>

      {notifications?.data.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-12 h-12" />}
          title="No notifications"
          description="You're all caught up! Check back later."
        />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {notifications?.data.map((notification: Notification) => {
              const Icon = typeIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 p-4 transition-colors',
                    !notification.isRead && 'bg-brand-50/50 dark:bg-brand-900/10',
                  )}
                >
                  <div className={cn('mt-0.5', typeColors[notification.type])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Avatar src={notification.actorAvatar} alt={notification.actorName} size="xs" />
                      <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                        {notification.actorName}
                      </span>
                      <span className="text-xs text-surface-500">{timeAgo(notification.createdAt)}</span>
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                      {notification.message}
                    </p>
                    {notification.postId && (
                      <Link
                        to={`/post/${notification.postId}`}
                        className="text-sm text-brand-600 hover:underline mt-1 inline-block"
                      >
                        View post
                      </Link>
                    )}
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => markReadMutation.mutate(notification.id)}
                      className="p-1 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                      aria-label="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
