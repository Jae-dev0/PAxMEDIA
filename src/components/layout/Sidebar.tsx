import { Link } from 'react-router-dom';
import { TrendingUp, Users, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingCommunities } from '../../api/communities';
import { getTrendingPosts } from '../../api/posts';
import { getRisingCreators } from '../../api/users';
import { formatNumber, timeAgo } from '../../utils/format';
import Avatar from '../ui/Avatar';
import Card from '../ui/Card';

export default function Sidebar() {
  const { data: trendingCommunities } = useQuery({
    queryKey: ['trendingCommunities'],
    queryFn: () => getTrendingCommunities(5),
  });

  const { data: trendingPosts } = useQuery({
    queryKey: ['trendingPosts'],
    queryFn: () => getTrendingPosts(3),
  });

  const { data: risingCreators } = useQuery({
    queryKey: ['risingCreators'],
    queryFn: () => getRisingCreators(3),
  });

  return (
    <aside className="hidden xl:block w-80 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-4 pl-4 space-y-4">
      {/* Trending Communities */}
      <Card padding="none">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            Trending Communities
          </h3>
        </div>
        <div className="divide-y divide-surface-100 dark:divide-surface-800">
          {trendingCommunities?.map((community, index) => (
            <Link
              key={community.id}
              to={`/community/${community.slug}`}
              className="flex items-center gap-3 p-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <span className="text-sm font-medium text-surface-400 w-4">{index + 1}</span>
              <Avatar src={community.icon} alt={community.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                  {community.name}
                </p>
                <p className="text-xs text-surface-500">{formatNumber(community.membersCount)} members</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Trending Posts */}
      <Card padding="none">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            Trending Posts
          </h3>
        </div>
        <div className="divide-y divide-surface-100 dark:divide-surface-800">
          {trendingPosts?.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="block p-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100 line-clamp-2">
                {post.title}
              </p>
              <p className="text-xs text-surface-500 mt-1">
                {post.communityName} · {timeAgo(post.createdAt)} · {formatNumber(post.score)} points
              </p>
            </Link>
          ))}
        </div>
      </Card>

      {/* Rising Creators */}
      <Card padding="none">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600" />
            Rising Creators
          </h3>
        </div>
        <div className="divide-y divide-surface-100 dark:divide-surface-800">
          {risingCreators?.map((user) => (
            <Link
              key={user.id}
              to={`/user/${user.username}`}
              className="flex items-center gap-3 p-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <Avatar src={user.avatar} alt={user.displayName} size="sm" isOnline={user.isOnline} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-surface-500">{formatNumber(user.karma)} karma</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </aside>
  );
}
