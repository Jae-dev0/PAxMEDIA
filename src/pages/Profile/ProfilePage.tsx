import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../../api/users';
import { getPostsByUser } from '../../api/posts';
import UserProfile from '../../components/users/UserProfile';
import PostCard from '../../components/posts/PostCard';
import Tabs from '../../components/ui/Tabs';
import SkeletonPost from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { MessageSquare, Image, Users } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'posts', label: 'Posts' },
  { id: 'comments', label: 'Comments' },
  { id: 'media', label: 'Media' },
  { id: 'communities', label: 'Communities' },
];

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username!),
    enabled: !!username,
  });

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', 'user', user?.id],
    queryFn: () => getPostsByUser(user?.id ?? '', { perPage: 10 }),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-40 bg-surface-200 dark:bg-surface-700 rounded-xl animate-pulse" />
        <SkeletonPost />
      </div>
    );
  }

  if (error || !user) {
    return <ErrorState title="User not found" message="This user doesn't exist or has been removed." />;
  }

  return (
    <div className="space-y-4">
      <UserProfile user={user} isOwnProfile={user.username === 'alexchen'} />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="space-y-4">
          {loadingPosts ? (
            <>
              <SkeletonPost />
              <SkeletonPost />
            </>
          ) : posts?.data.length === 0 ? (
            <EmptyState title="No posts yet" description="This user hasn't posted anything yet." />
          ) : (
            posts?.data.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="space-y-4">
          {loadingPosts ? (
            <>
              <SkeletonPost />
              <SkeletonPost />
            </>
          ) : posts?.data.length === 0 ? (
            <EmptyState title="No posts yet" description="This user hasn't posted anything yet." />
          ) : (
            posts?.data.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <EmptyState
          icon={<MessageSquare className="w-12 h-12" />}
          title="No comments yet"
          description="This user hasn't commented on anything yet."
        />
      )}

      {activeTab === 'media' && (
        <EmptyState
          icon={<Image className="w-12 h-12" />}
          title="No media yet"
          description="This user hasn't shared any media yet."
        />
      )}

      {activeTab === 'communities' && (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="No communities yet"
          description="This user hasn't joined any communities yet."
        />
      )}
    </div>
  );
}
