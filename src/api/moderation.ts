import type { Report, Ban, PaginatedResponse } from '../types';
import { mockReports, mockBans } from './mockData';

/**
 * Moderation API - Mock implementation.
 */

export async function getReports(status?: string, page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Report>> {
  await new Promise((r) => setTimeout(r, 200));
  let filtered = [...mockReports];
  if (status) {
    filtered = filtered.filter((r) => r.status === status);
  }
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);
  return {
    data,
    total: filtered.length,
    page,
    perPage,
    hasMore: start + perPage < filtered.length,
  };
}

export async function getReportStats(): Promise<{ total: number; pending: number; resolved: number }> {
  await new Promise((r) => setTimeout(r, 150));
  return {
    total: mockReports.length,
    pending: mockReports.filter((r) => r.status === 'pending').length,
    resolved: mockReports.filter((r) => r.status === 'approved' || r.status === 'removed' || r.status === 'dismissed').length,
  };
}

export async function resolveReport(reportId: string, action: 'approve' | 'remove' | 'dismiss'): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  const report = mockReports.find((r) => r.id === reportId);
  if (report) {
    report.status = action === 'approve' ? 'approved' : action === 'remove' ? 'removed' : 'dismissed';
    report.resolvedAt = new Date().toISOString();
  }
}

export async function getBans(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Ban>> {
  await new Promise((r) => setTimeout(r, 200));
  const start = (page - 1) * perPage;
  const data = mockBans.slice(start, start + perPage);
  return {
    data,
    total: mockBans.length,
    page,
    perPage,
    hasMore: start + perPage < mockBans.length,
  };
}

export async function banUser(data: {
  userId: string;
  reason: string;
  communityId?: string;
  isPermanent: boolean;
  expiresAt?: string;
}): Promise<Ban> {
  await new Promise((r) => setTimeout(r, 300));
  const newBan: Ban = {
    id: `ban${Date.now()}`,
    userId: data.userId,
    username: 'banned_user',
    reason: data.reason,
    moderatorId: 'u1',
    moderatorName: 'alexchen',
    communityId: data.communityId,
    isPermanent: data.isPermanent,
    expiresAt: data.expiresAt,
    createdAt: new Date().toISOString(),
  };
  mockBans.push(newBan);
  return newBan;
}
