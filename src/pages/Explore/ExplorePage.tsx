import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Sparkles, UserPlus } from 'lucide-react';
import { getTrendingCommunities, getRecommendedCommunities } from '../../api/communities';
import { getTrendingPosts } from '../../api/posts';
import { getRisingCreators } from '../../api/users';
import CommunityCard from '../../components/communities/CommunityCard';
import PostCard from '../../components/posts/PostCard';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { formatNumber } from '../../utils/format';
import { Link } from 'react-router-dom';

export default function ExplorePage() {
  const { data: trendingCommunities, isLoading: loadingCommunities } = useQuery({
    queryKey: ['trendingCommunities'],
    queryFn: () => getTrendingCommunities(6),
  });

  const { data: recommendedCommunities } = useQuery({
    queryKey: ['recommendedCommunities'],
    queryFn: () => getRecommendedCommunities(4),
  });

  const { data: trendingPosts, isLoading: loadingPosts } = useQuery({
    queryKey: ['trendingPosts'],
    queryFn: () => getTrendingPosts(5),
  });

  const { data: risingCreators } = useQuery({
    queryKey: ['risingCreators'],
    queryFn: () => getRisingCreators(5),
  });

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-400 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Explore PAxMEDIA</h1>
        <p className="text-brand-100 max-w-lg">
          Discover communities, trending discussions, and creators that match your interests.
        </p>
      </div>

      {/* Trending Communities */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-600" />
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">Trending Communities</h2>
        </div>
        {loadingCommunities ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton height={150} />
            <Skeleton height={150} />
            <Skeleton height={150} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingCommunities?.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Posts */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-600" />
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">Trending Posts</h2>
        </div>
        {loadingPosts ? (
          <div className="space-y-4">
            <Skeleton height={120} />
            <Skeleton height={120} />
          </div>
        ) : (
          <div className="space-y-4">
            {trendingPosts?.map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        )}
      </section>

      {/* Rising Creators */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-brand-600" />
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">Rising Creators</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {risingCreators?.map((user) => (
            <Link key={user.id} to={`/user/${user.username}`}>
              <Card hover className="flex items-center gap-3">
                <Avatar src={user.avatar} alt={user.displayName} size="lg" isOnline={user.isOnline} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-surface-900 dark:text-surface-100 truncate">{user.displayName}</p>
                  <p className="text-sm text-surface-500">@{user.username}</p>
                  <p className="text-xs text-surface-400 mt-1">{formatNumber(user.karma)} karma</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Communities */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-brand-600" />
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedCommunities?.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </section>
    </div>
  );
}
