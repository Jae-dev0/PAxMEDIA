import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigUp, ArrowBigDown, MessageSquare, MoreHorizontal, ChevronDown, ChevronRight, Edit2, Trash2, Flag } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Comment } from '../../types';
import { voteComment, deleteComment } from '../../api/comments';
import { formatNumber, timeAgo, cn } from '../../utils/format';
import Avatar from '../ui/Avatar';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import { useToast } from '../ui/Toast';

export interface CommentProps {
  comment: Comment;
  onReply: (parentId: string, body: string) => void;
}

export default function CommentComponent({ comment, onReply }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [editBody, setEditBody] = useState(comment.body);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const voteMutation = useMutation({
    mutationFn: (direction: 1 | -1 | 0) => voteComment(comment.id, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      toast('success', 'Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const handleVote = (direction: 1 | -1) => {
    const newVote = comment.userVote === direction ? 0 : direction;
    voteMutation.mutate(newVote);
  };

  const handleReply = () => {
    if (replyBody.trim()) {
      onReply(comment.id, replyBody);
      setReplyBody('');
      setIsReplying(false);
    }
  };

  const menuItems = [
    { label: 'Edit', icon: <Edit2 className="w-4 h-4" />, onClick: () => setIsEditing(true) },
    { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, onClick: () => deleteMutation.mutate(), danger: true },
    { label: '', divider: true },
    { label: 'Report', icon: <Flag className="w-4 h-4" />, onClick: () => toast('info', 'Report submitted'), danger: true },
  ];

  return (
    <div className={cn('relative', comment.depth > 0 && 'ml-4 pl-4 border-l-2 border-surface-200 dark:border-surface-700')}>
      <div className="py-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-0.5 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <Link to={`/user/${comment.authorName}`}>
            <Avatar src={comment.authorAvatar} alt={comment.authorName} size="xs" />
          </Link>
          <Link to={`/user/${comment.authorName}`} className="text-sm font-medium text-surface-900 dark:text-surface-100 hover:underline">
            {comment.authorName}
          </Link>
          {comment.authorRole && (
            <span className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded',
              comment.authorRole === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
            )}>
              {comment.authorRole}
            </span>
          )}
          <span className="text-xs text-surface-500">{timeAgo(comment.createdAt)}</span>
          {comment.isEdited && <span className="text-xs text-surface-400">(edited)</span>}
        </div>

        {/* Body */}
        {!isCollapsed && (
          <>
            {isEditing ? (
              <div className="space-y-2 mb-2">
                <Textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setIsEditing(false)}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-surface-700 dark:text-surface-300 mb-2 whitespace-pre-wrap">
                {comment.body}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVote(1)}
                className={cn('p-1 rounded hover:bg-brand-50 dark:hover:bg-brand-900/20', comment.userVote === 1 && 'text-brand-600')}
                aria-label="Upvote"
              >
                <ArrowBigUp className={cn('w-4 h-4', comment.userVote === 1 && 'fill-brand-600')} />
              </button>
              <span className={cn('text-xs font-semibold min-w-[2ch] text-center', comment.userVote === 1 ? 'text-brand-600' : comment.userVote === -1 ? 'text-red-500' : 'text-surface-600 dark:text-surface-400')}>
                {formatNumber(comment.score)}
              </span>
              <button
                onClick={() => handleVote(-1)}
                className={cn('p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20', comment.userVote === -1 && 'text-red-500')}
                aria-label="Downvote"
              >
                <ArrowBigDown className={cn('w-4 h-4', comment.userVote === -1 && 'fill-red-500')} />
              </button>
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Reply
              </button>
              <Dropdown
                trigger={
                  <button className="p-1 rounded text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                }
                items={menuItems}
              />
            </div>

            {/* Reply form */}
            {isReplying && (
              <div className="mt-3 space-y-2">
                <Textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="Write a reply..."
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleReply}>Reply</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Nested replies */}
      {!isCollapsed && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentComponent key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}
