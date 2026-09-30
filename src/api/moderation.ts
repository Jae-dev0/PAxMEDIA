import { api } from './client';
import type { Report, Ban, PaginatedResponse } from '../types';

export async function getReports(status?: string, page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Report>> {
  return api.get<PaginatedResponse<Report>>('/moderation/reports', { status, page, per_page: perPage });
}

export async function getReportStats(): Promise<{ total: number; pending: number; resolved: number }> {
  return api.get<{ total: number; pending: number; resolved: number }>('/moderation/reports/stats');
}

export async function resolveReport(reportId: string, action: 'approve' | 'remove' | 'dismiss'): Promise<void> {
  return api.post<void>(`/moderation/reports/${reportId}/resolve`, { action });
}

export async function getBans(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Ban>> {
  return api.get<PaginatedResponse<Ban>>('/moderation/bans', { page, per_page: perPage });
}

export async function banUser(data: {
  userId: string;
  reason: string;
  communityId?: string;
  isPermanent: boolean;
  expiresAt?: string;
}): Promise<Ban> {
  return api.post<Ban>('/moderation/bans', {
    user_id: data.userId,
    reason: data.reason,
    community_id: data.communityId,
    is_permanent: data.isPermanent,
    expires_at: data.expiresAt,
  });
}
