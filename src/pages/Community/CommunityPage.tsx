import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCommunity } from '../../api/communities';
import { getPostsByCommunity } from '../../api/posts';
import CommunityHeader from '../../components/communities/CommunityHeader';
import PostCard from '../../components/posts/PostCard';
import Tabs from '../../components/ui/Tabs';
import SkeletonPost from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Card from '../../components/ui/Card';
import { Users, Calendar, Shield } from 'lucide-react';
import { formatDate, formatNumber } from '../../utils/format';

const tabs = [
  { id: 'posts', label: 'Posts' },
  { id: 'popular', label: 'Popular' },
  { id: 'new', label: 'New' },
  { id: 'media', label: 'Media' },
  { id: 'about', label: 'About' },
];

export default function CommunityPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('posts');

  const { data: community, isLoading: loadingCommunity, error: communityError } = useQuery({
    queryKey: ['community', slug],
    queryFn: () => getCommunity(slug!),
    enabled: !!slug,
  });

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', 'community', slug, activeTab],
    queryFn: () => getPostsByCommunity(community?.id ?? '', {
      sort: activeTab === 'new' ? 'new' : activeTab === 'popular' ? 'top' : 'hot',
      perPage: 15,
    }),
    enabled: !!community,
  });

  if (loadingCommunity) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-surface-200 dark:bg-surface-700 rounded-xl animate-pulse" />
        <SkeletonPost />
        <SkeletonPost />
      </div>
    );
  }

  if (communityError || !community) {
    return <ErrorState title="Community not found" message="This community doesn't exist or has been removed." />;
  }

  return (
    <div className="space-y-4">
      <CommunityHeader community={community} />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'about' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-2">About Community</h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">{community.description}</p>
            </Card>
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">Rules</h3>
              <div className="space-y-3">
                {community.rules.map((rule, index) => (
                  <div key={rule.id} className="flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{rule.title}</p>
                      <p className="text-sm text-surface-500">{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">Community Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                  <Calendar className="w-4 h-4" />
                  Created {formatDate(community.createdAt)}
                </div>
                <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                  <Users className="w-4 h-4" />
                  {formatNumber(community.membersCount)} members
                </div>
              </div>
            </Card>
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">Moderators</h3>
              <div className="space-y-2">
                {community.moderators.map((modId) => (
                  <div key={modId} className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-brand-600" />
                    <span className="text-surface-700 dark:text-surface-300">Moderator {modId}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : loadingPosts ? (
        <div className="space-y-4">
          <SkeletonPost />
          <SkeletonPost />
        </div>
      ) : posts?.data.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Be the first to create a post in this community!"
        />
      ) : (
        <div className="space-y-4">
          {posts?.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
