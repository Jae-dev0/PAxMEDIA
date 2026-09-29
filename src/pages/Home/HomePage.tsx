import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../api/posts';
import PostCard from '../../components/posts/PostCard';
import Tabs from '../../components/ui/Tabs';
import SkeletonPost from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { Flame, Clock, TrendingUp, Sparkles } from 'lucide-react';

const tabs = [
  { id: 'hot', label: 'Hot', icon: <Flame className="w-4 h-4" /> },
  { id: 'new', label: 'New', icon: <Clock className="w-4 h-4" /> },
  { id: 'top', label: 'Top', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'rising', label: 'Rising', icon: <Sparkles className="w-4 h-4" /> },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('hot');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', activeTab],
    queryFn: () => getPosts({ sort: activeTab as 'hot' | 'new' | 'top' | 'rising', perPage: 15 }),
  });

  return (
    <div className="space-y-4">
      {/* Feed tabs */}
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl p-1">
        <Tabs
          tabs={tabs.map((t) => ({ ...t, label: t.label }))}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          <SkeletonPost />
          <SkeletonPost />
          <SkeletonPost />
        </div>
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data?.data.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Be the first to create a post in this community!"
        />
      ) : (
        <div className="space-y-4">
          {data?.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
