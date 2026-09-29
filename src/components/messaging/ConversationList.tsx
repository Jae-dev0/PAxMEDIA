import { MessageSquare, Search, Users } from 'lucide-react';
import type { Conversation } from '../../types';
import { timeAgo, cn } from '../../utils/format';
import Avatar from '../ui/Avatar';
import Input from '../ui/Input';
import EmptyState from '../ui/EmptyState';

export interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Messages</h2>
        <Input
          placeholder="Search conversations..."
          icon={<Search className="w-4 h-4" />}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-12 h-12" />}
            title="No conversations"
            description="Start a new conversation by messaging someone."
          />
        ) : (
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {conversations.map((conversation) => {
              const otherUser = conversation.participants.find((p) => p.id !== 'u1');
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelect?.(conversation.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 text-left transition-colors',
                    selectedId === conversation.id
                      ? 'bg-brand-50 dark:bg-brand-900/20'
                      : 'hover:bg-surface-50 dark:hover:bg-surface-800/50',
                  )}
                >
                  {conversation.isGroup ? (
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-600" />
                    </div>
                  ) : (
                    <Avatar
                      src={otherUser?.avatar}
                      alt={otherUser?.displayName ?? 'User'}
                      size="md"
                      isOnline={otherUser?.isOnline}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                        {conversation.isGroup ? conversation.groupName : otherUser?.displayName}
                      </p>
                      <span className="text-xs text-surface-500 shrink-0">
                        {timeAgo(conversation.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-surface-500 truncate">{conversation.lastMessage.body}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                      {conversation.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
