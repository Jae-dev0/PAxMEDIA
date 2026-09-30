import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, TrendingUp, Bell, BellOff } from 'lucide-react';
import type { Community } from '../../types';
import { joinCommunity, followCommunity } from '../../api/communities';
import { formatNumber } from '../../utils/format';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';

export interface CommunityHeaderProps {
  community: Community;
}

export default function CommunityHeader({ community }: CommunityHeaderProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const joinMutation = useMutation({
    mutationFn: () => joinCommunity(community.id),
    onSuccess: (data) => {
      toast('success', data.is_joined ? `Joined ${community.name}` : `Left ${community.name}`);
      queryClient.invalidateQueries({ queryKey: ['community', community.slug] });
    },
  });

  const followMutation = useMutation({
    mutationFn: () => followCommunity(community.id),
    onSuccess: (data) => {
      toast('success', data.is_following ? `Following ${community.name}` : `Unfollowed ${community.name}`);
      queryClient.invalidateQueries({ queryKey: ['community', community.slug] });
    },
  });

  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-brand-600 to-brand-400 relative">
        {community.banner && (
          <img src={community.banner} alt={community.name} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Info */}
      <div className="px-4 pb-4">
        <div className="flex items-end gap-4 -mt-8">
          <div className="p-1 bg-white dark:bg-surface-900 rounded-full">
            <Avatar src={community.icon} alt={community.name} size="xl" />
          </div>
          <div className="flex-1 pt-8">
            <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">{community.name}</h1>
            <p className="text-sm text-surface-500">r/{community.slug}</p>
          </div>
          <div className="flex gap-2 pt-8">
            <Button
              variant={community.isFollowing ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => followMutation.mutate()}
            >
              {community.isFollowing ? <BellOff className="w-4 h-4 mr-1" /> : <Bell className="w-4 h-4 mr-1" />}
              {community.isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button
              variant={community.isJoined ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => joinMutation.mutate()}
            >
              {community.isJoined ? 'Joined' : 'Join'}
            </Button>
          </div>
        </div>

        <p className="mt-3 text-sm text-surface-600 dark:text-surface-400">{community.description}</p>

        <div className="flex items-center gap-6 mt-4 text-sm">
          <div>
            <p className="font-semibold text-surface-900 dark:text-surface-100">{formatNumber(community.membersCount)}</p>
            <p className="text-surface-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Members
            </p>
          </div>
          <div>
            <p className="font-semibold text-green-600">{formatNumber(community.onlineCount)}</p>
            <p className="text-surface-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
