import { Link } from 'react-router-dom';
import { Users, TrendingUp } from 'lucide-react';
import type { Community } from '../../types';
import { formatNumber } from '../../utils/format';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Card from '../ui/Card';

export interface CommunityCardProps {
  community: Community;
  onJoin?: (id: string) => void;
}

export default function CommunityCard({ community, onJoin }: CommunityCardProps) {
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start gap-3">
        <Avatar src={community.icon} alt={community.name} size="lg" />
        <div className="flex-1 min-w-0">
          <Link to={`/community/${community.slug}`}>
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 hover:text-brand-600 dark:hover:text-brand-400 truncate">
              {community.name}
            </h3>
          </Link>
          <p className="text-sm text-surface-500 line-clamp-2 mt-1">{community.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3 text-sm text-surface-500">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {formatNumber(community.membersCount)}
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          {formatNumber(community.onlineCount)} online
        </span>
      </div>
      <div className="mt-4">
        <Button
          variant={community.isJoined ? 'secondary' : 'primary'}
          size="sm"
          className="w-full"
          onClick={() => onJoin?.(community.id)}
        >
          {community.isJoined ? 'Joined' : 'Join'}
        </Button>
      </div>
    </Card>
  );
}
