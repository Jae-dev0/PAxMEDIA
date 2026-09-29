import type { Conversation, Message, PaginatedResponse } from '../types';
import { mockConversations, mockMessages } from './mockData';

/**
 * Messages API - Mock implementation.
 */

export async function getConversations(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Conversation>> {
  await new Promise((r) => setTimeout(r, 200));
  const start = (page - 1) * perPage;
  const data = mockConversations.slice(start, start + perPage);
  return {
    data,
    total: mockConversations.length,
    page,
    perPage,
    hasMore: start + perPage < mockConversations.length,
  };
}

export async function getConversation(id: string): Promise<Conversation | null> {
  await new Promise((r) => setTimeout(r, 150));
  return mockConversations.find((c) => c.id === id) ?? null;
}

export async function getMessages(conversationId: string, page: number = 1, perPage: number = 50): Promise<PaginatedResponse<Message>> {
  await new Promise((r) => setTimeout(r, 200));
  const messages = mockMessages.filter((m) => m.conversationId === conversationId);
  const start = (page - 1) * perPage;
  const data = messages.slice(start, start + perPage);
  return {
    data,
    total: messages.length,
    page,
    perPage,
    hasMore: start + perPage < messages.length,
  };
}

export async function sendMessage(conversationId: string, body: string): Promise<Message> {
  await new Promise((r) => setTimeout(r, 300));
  const newMessage: Message = {
    id: `msg${Date.now()}`,
    conversationId,
    senderId: 'u1',
    senderName: 'alexchen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    body,
    attachments: [],
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  mockMessages.push(newMessage);
  return newMessage;
}

export async function markConversationAsRead(conversationId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 100));
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (conversation) conversation.unreadCount = 0;
}
