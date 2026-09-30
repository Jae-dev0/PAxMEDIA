import { Link } from 'react-router-dom';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark, MoreHorizontal, Pin, Lock, EyeOff, Repeat2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Post } from '../../types';
import { votePost, savePost, hidePost, repostPost } from '../../api/posts';
import { formatNumber, timeAgo, cn } from '../../utils/format';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Dropdown from '../ui/Dropdown';
import { useToast } from '../ui/Toast';

export interface PostCardProps {
  post: Post;
  variant?: 'full' | 'compact';
}

export default function PostCard({ post, variant = 'full' }: PostCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const voteMutation = useMutation({
    mutationFn: (direction: 1 | -1 | 0) => votePost(post.id, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => savePost(post.id),
    onSuccess: (data) => {
      toast('success', data.is_saved ? 'Post saved' : 'Post unsaved');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const hideMutation = useMutation({
    mutationFn: () => hidePost(post.id),
    onSuccess: () => {
      toast('info', 'Post hidden');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const repostMutation = useMutation({
    mutationFn: () => repostPost(post.id),
    onSuccess: (data) => {
      toast('success', data.is_reposted ? 'Post reposted' : 'Repost removed');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleVote = (direction: 1 | -1) => {
    const newVote = post.userVote === direction ? 0 : direction;
    voteMutation.mutate(newVote);
  };

  const menuItems = [
    { label: post.isSaved ? 'Unsave' : 'Save', icon: <Bookmark className="w-4 h-4" />, onClick: () => saveMutation.mutate() },
    { label: 'Hide', icon: <EyeOff className="w-4 h-4" />, onClick: () => hideMutation.mutate() },
    { label: '', divider: true },
    { label: 'Report', icon: <MoreHorizontal className="w-4 h-4" />, onClick: () => toast('info', 'Report submitted'), danger: true },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex gap-3 p-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleVote(1)}
            className={cn('p-1 rounded hover:bg-brand-50 dark:hover:bg-brand-900/20', post.userVote === 1 && 'text-brand-600')}
            aria-label="Upvote"
          >
            <ArrowBigUp className={cn('w-5 h-5', post.userVote === 1 && 'fill-brand-600')} />
          </button>
          <span className={cn('text-sm font-semibold', post.userVote === 1 ? 'text-brand-600' : post.userVote === -1 ? 'text-red-500' : 'text-surface-600 dark:text-surface-400')}>
            {formatNumber(post.score)}
          </span>
          <button
            onClick={() => handleVote(-1)}
            className={cn('p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20', post.userVote === -1 && 'text-red-500')}
            aria-label="Downvote"
          >
            <ArrowBigDown className={cn('w-5 h-5', post.userVote === -1 && 'fill-red-500')} />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-surface-500 mb-1">
            <Link to={`/community/${post.communitySlug}`} className="font-medium text-surface-700 dark:text-surface-300 hover:underline">
              {post.communityName}
            </Link>
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
            {post.isPinned && <Pin className="w-3 h-3 text-green-500" />}
            {post.isLocked && <Lock className="w-3 h-3 text-yellow-500" />}
          </div>
          <Link to={`/post/${post.id}`}>
            <h3 className="text-sm font-medium text-surface-900 dark:text-surface-100 line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400">
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 mt-2 text-xs text-surface-500">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {formatNumber(post.commentsCount)}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 text-xs text-surface-500">
        <Link to={`/community/${post.communitySlug}`}>
          <Avatar src={post.communityIcon} alt={post.communityName} size="xs" />
        </Link>
        <Link to={`/community/${post.communitySlug}`} className="font-medium text-surface-700 dark:text-surface-300 hover:underline">
          {post.communityName}
        </Link>
        <span>·</span>
        <span>{timeAgo(post.createdAt)}</span>
        {post.isPinned && <Pin className="w-3 h-3 text-green-500" />}
        {post.isLocked && <Lock className="w-3 h-3 text-yellow-500" />}
        {post.flair && (
          <Badge variant="primary" size="sm" className="ml-auto">
            {post.flair}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <Link to={`/post/${post.id}`}>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            {post.title}
          </h2>
        </Link>
        {post.body && (
          <p className="mt-2 text-sm text-surface-600 dark:text-surface-400 line-clamp-3">
            {post.body}
          </p>
        )}
      </div>

      {/* Media */}
      {post.media.length > 0 && (
        <div className="px-4 pb-3">
          {post.media[0].type === 'image' && (
            <img
              src={post.media[0].url}
              alt={post.title}
              className="w-full rounded-lg object-cover max-h-[400px]"
              loading="lazy"
            />
          )}
          {post.media[0].type === 'video' && (
            <div className="relative">
              <img
                src={post.media[0].thumbnail}
                alt={post.title}
                className="w-full rounded-lg object-cover max-h-[400px]"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-2 border-t border-surface-100 dark:border-surface-800">
        <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 rounded-full px-2 py-1">
          <button
            onClick={() => handleVote(1)}
            className={cn('p-1 rounded hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors', post.userVote === 1 && 'text-brand-600')}
            aria-label="Upvote"
          >
            <ArrowBigUp className={cn('w-5 h-5', post.userVote === 1 && 'fill-brand-600')} />
          </button>
          <span className={cn('text-sm font-semibold min-w-[2ch] text-center', post.userVote === 1 ? 'text-brand-600' : post.userVote === -1 ? 'text-red-500' : 'text-surface-600 dark:text-surface-400')}>
            {formatNumber(post.score)}
          </span>
          <button
            onClick={() => handleVote(-1)}
            className={cn('p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors', post.userVote === -1 && 'text-red-500')}
            aria-label="Downvote"
          >
            <ArrowBigDown className={cn('w-5 h-5', post.userVote === -1 && 'fill-red-500')} />
          </button>
        </div>
        <Link
          to={`/post/${post.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          {formatNumber(post.commentsCount)}
        </Link>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          onClick={() => toast('info', 'Link copied to clipboard')}
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button
          onClick={() => saveMutation.mutate()}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors',
            post.isSaved
              ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20'
              : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800',
          )}
        >
          <Bookmark className={cn('w-4 h-4', post.isSaved && 'fill-brand-600')} />
          Save
        </button>
        <button
          onClick={() => repostMutation.mutate()}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors',
            post.isReposted
              ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
              : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800',
          )}
        >
          <Repeat2 className={cn('w-4 h-4', post.isReposted && 'fill-green-600')} />
          {post.repostsCount > 0 ? formatNumber(post.repostsCount) : 'Repost'}
        </button>
        <div className="ml-auto">
          <Dropdown
            trigger={
              <button className="p-1.5 rounded-full text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            }
            items={menuItems}
          />
        </div>
      </div>
    </article>
  );
}
