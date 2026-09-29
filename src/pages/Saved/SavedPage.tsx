import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../api/posts';
import PostCard from '../../components/posts/PostCard';
import Tabs from '../../components/ui/Tabs';
import SkeletonPost from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Bookmark, MessageSquare, Image } from 'lucide-react';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'posts', label: 'Posts' },
  { id: 'comments', label: 'Comments' },
  { id: 'media', label: 'Media' },
];

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState('all');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['savedPosts'],
    queryFn: () => getPosts({ perPage: 50 }),
  });

  const savedPosts = posts?.data.filter((p) => p.isSaved) ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Saved</h1>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {isLoading ? (
        <div className="space-y-4">
          <SkeletonPost />
          <SkeletonPost />
        </div>
      ) : activeTab === 'posts' || activeTab === 'all' ? (
        savedPosts.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="w-12 h-12" />}
            title="No saved posts"
            description="Save posts to read them later."
          />
        ) : (
          <div className="space-y-4">
            {savedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )
      ) : activeTab === 'comments' ? (
        <EmptyState
          icon={<MessageSquare className="w-12 h-12" />}
          title="No saved comments"
          description="Save comments to read them later."
        />
      ) : (
        <EmptyState
          icon={<Image className="w-12 h-12" />}
          title="No saved media"
          description="Save media to view it later."
        />
      )}
    </div>
  );
}
