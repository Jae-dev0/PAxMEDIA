import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConversations, getConversation } from '../../api/messages';
import ConversationList from '../../components/messaging/ConversationList';
import MessageThread from '../../components/messaging/MessageThread';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => getConversations(),
  });

  const { data: selectedConversation } = useQuery({
    queryKey: ['conversation', selectedId],
    queryFn: () => getConversation(selectedId!),
    enabled: !!selectedId,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        <div className="bg-surface-200 dark:bg-surface-700 rounded-xl animate-pulse" />
        <div className="md:col-span-2 bg-surface-200 dark:bg-surface-700 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load messages" onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        {/* Conversation list */}
        <div className={`border-r border-surface-200 dark:border-surface-700 ${selectedId ? 'hidden md:block' : ''}`}>
          <ConversationList
            conversations={conversations?.data ?? []}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Message thread */}
        <div className={`md:col-span-2 ${!selectedId ? 'hidden md:block' : ''}`}>
          {selectedConversation ? (
            <MessageThread conversation={selectedConversation} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState
                icon={<MessageSquare className="w-12 h-12" />}
                title="Select a conversation"
                description="Choose a conversation from the list to start messaging."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
