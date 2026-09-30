import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPost } from '../../api/posts';
import { getCommunity } from '../../api/communities';
import { getUserById } from '../../api/users';
import CommentTree from '../../components/comments/CommentTree';
import ErrorState from '../../components/ui/ErrorState';
import Skeleton from '../../components/ui/Skeleton';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { formatNumber, timeAgo } from '../../utils/format';
import { ArrowLeft, Pin, Lock, Share2, Bookmark, Flag } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { votePost, savePost } from '../../api/posts';
import { useToast } from '../../components/ui/Toast';
import { cn } from '../../utils/format';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: post, isLoading, error, refetch } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id!),
    enabled: !!id,
  });

  const { data: community } = useQuery({
    queryKey: ['community', post?.communitySlug],
    queryFn: () => getCommunity(post?.communitySlug ?? ''),
    enabled: !!post,
  });

  const { data: author } = useQuery({
    queryKey: ['user', post?.authorId],
    queryFn: () => getUserById(post?.authorId ?? ''),
    enabled: !!post,
  });

  const voteMutation = useMutation({
    mutationFn: (direction: 1 | -1 | 0) => votePost(id!, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => savePost(id!),
    onSuccess: (data) => {
      toast('success', data.is_saved ? 'Post saved' : 'Post unsaved');
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton height={200} />
        <Skeleton height={100} />
      </div>
    );
  }

  if (error || !post) {
    return <ErrorState title="Post not found" message="This post doesn't exist or has been removed." onRetry={() => refetch()} />;
  }

  const handleVote = (direction: 1 | -1) => {
    const newVote = post.userVote === direction ? 0 : direction;
    voteMutation.mutate(newVote);
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
        <ArrowLeft className="w-4 h-4" />
        Back to feed
      </Link>

      {/* Post */}
      <article className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 pt-3 text-xs text-surface-500">
          <Link to={`/community/${post.communitySlug}`}>
            <Avatar src={post.communityIcon} alt={post.communityName} size="xs" />
          </Link>
          <Link to={`/community/${post.communitySlug}`} className="font-medium text-surface-700 dark:text-surface-300 hover:underline">
            {post.communityName}
          </Link>
          <span>·</span>
          <span>Posted by</span>
          <Link to={`/user/${post.authorName}`} className="hover:underline">u/{post.authorName}</Link>
          <span>{timeAgo(post.createdAt)}</span>
          {post.isPinned && <Pin className="w-3 h-3 text-green-500" />}
          {post.isLocked && <Lock className="w-3 h-3 text-yellow-500" />}
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">{post.title}</h1>
          {post.flair && (
            <div className="mt-2">
              <Badge variant="primary">{post.flair}</Badge>
            </div>
          )}
          <div className="mt-4 prose dark:prose-invert max-w-none">
            <p className="text-surface-700 dark:text-surface-300 whitespace-pre-wrap">{post.body}</p>
          </div>
        </div>

        {/* Media */}
        {post.media.length > 0 && (
          <div className="px-4 pb-3 space-y-2">
            {post.media.map((media) => (
              <img
                key={media.id}
                src={media.url}
                alt={post.title}
                className="w-full rounded-lg object-cover max-h-[500px]"
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 rounded-full px-3 py-1.5">
            <button
              onClick={() => handleVote(1)}
              className={cn('p-1 rounded hover:bg-brand-50 dark:hover:bg-brand-900/20', post.userVote === 1 && 'text-brand-600')}
              aria-label="Upvote"
            >
              <svg className="w-5 h-5" fill={post.userVote === 1 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <span className={cn('text-sm font-semibold min-w-[3ch] text-center', post.userVote === 1 ? 'text-brand-600' : post.userVote === -1 ? 'text-red-500' : 'text-surface-600 dark:text-surface-400')}>
              {formatNumber(post.score)}
            </span>
            <button
              onClick={() => handleVote(-1)}
              className={cn('p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20', post.userVote === -1 && 'text-red-500')}
              aria-label="Downvote"
            >
              <svg className="w-5 h-5" fill={post.userVote === -1 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => toast('info', 'Link copied to clipboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors',
              post.isSaved ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800',
            )}
          >
            <Bookmark className={cn('w-4 h-4', post.isSaved && 'fill-brand-600')} />
            {post.isSaved ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={() => toast('info', 'Report submitted')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 ml-auto"
          >
            <Flag className="w-4 h-4" />
            Report
          </button>
        </div>
      </article>

      {/* Comments */}
      <Card>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Comments ({formatNumber(post.commentsCount)})
        </h2>
        <CommentTree postId={post.id} />
      </Card>

      {/* Sidebar info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Author info */}
          {author && (
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">About the author</h3>
              <div className="flex items-center gap-3">
                <Avatar src={author.avatar} alt={author.displayName} size="lg" />
                <div>
                  <Link to={`/user/${author.username}`} className="font-medium text-surface-900 dark:text-surface-100 hover:underline">
                    {author.displayName}
                  </Link>
                  <p className="text-sm text-surface-500">@{author.username}</p>
                  <p className="text-sm text-surface-500">{formatNumber(author.karma)} karma</p>
                </div>
              </div>
            </Card>
          )}
        </div>
        <div>
          {/* Community info */}
          {community && (
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">About the community</h3>
              <div className="flex items-center gap-3 mb-3">
                <Avatar src={community.icon} alt={community.name} size="md" />
                <div>
                  <Link to={`/community/${community.slug}`} className="font-medium text-surface-900 dark:text-surface-100 hover:underline">
                    {community.name}
                  </Link>
                  <p className="text-sm text-surface-500">{formatNumber(community.membersCount)} members</p>
                </div>
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-400">{community.description}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
