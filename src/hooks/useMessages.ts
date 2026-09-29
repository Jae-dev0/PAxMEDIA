import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversations, getConversation, getMessages, sendMessage, markConversationAsRead } from '../api/messages';

export function useConversations(page: number = 1, perPage: number = 20) {
  return useQuery({
    queryKey: ['conversations', page, perPage],
    queryFn: () => getConversations(page, perPage),
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => getConversation(id),
    enabled: !!id,
  });
}

export function useMessages(conversationId: string, page: number = 1, perPage: number = 50) {
  return useQuery({
    queryKey: ['messages', conversationId, page, perPage],
    queryFn: () => getMessages(conversationId, page, perPage),
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, body }: { conversationId: string; body: string }) =>
      sendMessage(conversationId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useMarkConversationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => markConversationAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
