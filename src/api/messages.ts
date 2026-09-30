import { api } from './client';
import type { Conversation, Message, PaginatedResponse } from '../types';

export async function getConversations(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Conversation>> {
  return api.get<PaginatedResponse<Conversation>>('/conversations', { page, per_page: perPage });
}

export async function getConversation(id: string): Promise<Conversation> {
  return api.get<Conversation>(`/conversations/${id}`);
}

export async function getMessages(conversationId: string, page: number = 1, perPage: number = 50): Promise<PaginatedResponse<Message>> {
  return api.get<PaginatedResponse<Message>>(`/conversations/${conversationId}/messages`, { page, per_page: perPage });
}

export async function sendMessage(conversationId: string, body: string): Promise<Message> {
  return api.post<Message>(`/conversations/${conversationId}/messages`, { body });
}

export async function markConversationAsRead(conversationId: string): Promise<void> {
  return api.post<void>(`/conversations/${conversationId}/read`);
}
