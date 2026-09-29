import { Calendar, Users, UserPlus, MessageSquare, MoreHorizontal } from 'lucide-react';
import type { User } from '../../types';
import { formatNumber, formatDate } from '../../utils/format';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Dropdown from '../ui/Dropdown';
import { useToast } from '../ui/Toast';

export interface UserProfileProps {
  user: User;
  isOwnProfile?: boolean;
}

export default function UserProfile({ user, isOwnProfile }: UserProfileProps) {
  const { toast } = useToast();

  const menuItems = [
    { label: 'Send Message', icon: <MessageSquare className="w-4 h-4" />, onClick: () => toast('info', 'Opening messages...') },
    { label: '', divider: true },
    { label: 'Block User', icon: <MoreHorizontal className="w-4 h-4" />, onClick: () => toast('info', 'User blocked'), danger: true },
  ];

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-brand-600 to-brand-400 rounded-xl overflow-hidden relative">
        {user.banner && (
          <img src={user.banner} alt={user.displayName} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Profile Info */}
      <Card className="-mt-12 relative z-10 mx-4">
        <div className="flex items-end gap-4">
          <div className="p-1 bg-white dark:bg-surface-900 rounded-full">
            <Avatar src={user.avatar} alt={user.displayName} size="xl" isOnline={user.isOnline} />
          </div>
          <div className="flex-1 pt-12">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">{user.displayName}</h1>
              {user.isVerified && (
                <span className="text-brand-600 text-lg">✓</span>
              )}
            </div>
            <p className="text-sm text-surface-500">@{user.username}</p>
          </div>
          <div className="flex gap-2 pt-12">
            {isOwnProfile ? (
              <Button variant="outline" size="sm">Edit Profile</Button>
            ) : (
              <>
                <Button variant="primary" size="sm">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Follow
                </Button>
                <Dropdown
                  trigger={
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  }
                  items={menuItems}
                />
              </>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm text-surface-600 dark:text-surface-400">{user.bio}</p>

        <div className="flex items-center gap-6 mt-4 text-sm">
          <div>
            <p className="font-semibold text-surface-900 dark:text-surface-100">{formatNumber(user.karma)}</p>
            <p className="text-surface-500">Karma</p>
          </div>
          <div>
            <p className="font-semibold text-surface-900 dark:text-surface-100">{formatNumber(user.followersCount)}</p>
            <p className="text-surface-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Followers
            </p>
          </div>
          <div>
            <p className="font-semibold text-surface-900 dark:text-surface-100">{formatNumber(user.followingCount)}</p>
            <p className="text-surface-500">Following</p>
          </div>
          <div>
            <p className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(user.joinedAt)}
            </p>
            <p className="text-surface-500">Joined</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
