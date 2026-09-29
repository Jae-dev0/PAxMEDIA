import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, MoreHorizontal } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, sendMessage } from '../../api/messages';
import type { Conversation } from '../../types';
import { timeAgo, cn } from '../../utils/format';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Skeleton from '../ui/Skeleton';

export interface MessageThreadProps {
  conversation: Conversation;
}

export default function MessageThread({ conversation }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversation.id],
    queryFn: () => getMessages(conversation.id),
  });

  const sendMutation = useMutation({
    mutationFn: (body: string) => sendMessage(conversation.id, body),
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', conversation.id] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMutation.mutate(newMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherUser = conversation.participants.find((p) => p.id !== 'u1');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-surface-200 dark:border-surface-700">
        {conversation.isGroup ? (
          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
            <span className="text-brand-600 font-medium">{conversation.groupName?.charAt(0)}</span>
          </div>
        ) : (
          <Avatar src={otherUser?.avatar} alt={otherUser?.displayName ?? 'User'} size="md" isOnline={otherUser?.isOnline} />
        )}
        <div className="flex-1">
          <p className="font-medium text-surface-900 dark:text-surface-100">
            {conversation.isGroup ? conversation.groupName : otherUser?.displayName}
          </p>
          <p className="text-xs text-surface-500">
            {conversation.isGroup
              ? `${conversation.participants.length} members`
              : otherUser?.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <>
            <Skeleton width="60%" height={40} />
            <Skeleton width="40%" height={40} />
            <Skeleton width="70%" height={40} />
          </>
        ) : (
          messages?.data.map((message) => {
            const isOwn = message.senderId === 'u1';
            return (
              <div
                key={message.id}
                className={cn('flex gap-2', isOwn && 'flex-row-reverse')}
              >
                {!isOwn && (
                  <Avatar src={message.senderAvatar} alt={message.senderName} size="xs" />
                )}
                <div
                  className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-2',
                    isOwn
                      ? 'bg-brand-600 text-white rounded-br-md'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-bl-md',
                  )}
                >
                  <p className="text-sm">{message.body}</p>
                  <p className={cn('text-xs mt-1', isOwn ? 'text-brand-100' : 'text-surface-500')}>
                    {timeAgo(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="shrink-0">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button variant="ghost" size="sm" className="shrink-0">
            <Smile className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!newMessage.trim() || sendMutation.isPending}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
