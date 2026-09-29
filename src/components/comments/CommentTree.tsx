import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment } from '../../api/comments';
import type { Comment } from '../../types';
import CommentComponent from './Comment';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { MessageSquare } from 'lucide-react';

export interface CommentTreeProps {
  postId: string;
}

export default function CommentTree({ postId }: CommentTreeProps) {
  const [sort, setSort] = useState('best');
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['comments', postId, sort],
    queryFn: () => getComments({ postId, sort: sort as 'best' | 'top' | 'newest' | 'oldest' | 'controversial' }),
  });

  const createMutation = useMutation({
    mutationFn: (body: string) => createComment({ postId, body }),
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleReply = (_parentId: string, body: string) => {
    createMutation.mutate(body);
  };

  const handleSubmit = () => {
    if (newComment.trim()) {
      createMutation.mutate(newComment);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton width="200px" height={24} />
        <Skeleton width="100%" height={100} />
        <Skeleton width="100%" height={100} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-surface-500 mb-4">Failed to load comments</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* New comment */}
      <div className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!newComment.trim() || createMutation.isPending}>
            Comment
          </Button>
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-surface-500">Sort by:</span>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          options={[
            { value: 'best', label: 'Best' },
            { value: 'top', label: 'Top' },
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
            { value: 'controversial', label: 'Controversial' },
          ]}
          className="w-32"
        />
      </div>

      {/* Comments */}
      {data?.data.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-12 h-12" />}
          title="No comments yet"
          description="Be the first to share your thoughts!"
        />
      ) : (
        <div className="divide-y divide-surface-100 dark:divide-surface-800">
          {data?.data.map((comment: Comment) => (
            <CommentComponent key={comment.id} comment={comment} onReply={handleReply} />
          ))}
        </div>
      )}
    </div>
  );
}
