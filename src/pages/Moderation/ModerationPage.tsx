import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReports, getBans } from '../../api/moderation';
import ModerationStats from '../../components/moderation/ModerationStats';
import ReportCard from '../../components/moderation/ReportCard';
import Tabs from '../../components/ui/Tabs';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Shield, AlertTriangle, Ban, FileText } from 'lucide-react';
import { formatDate } from '../../utils/format';

const tabs = [
  { id: 'reports', label: 'Reports' },
  { id: 'bans', label: 'Bans' },
  { id: 'content', label: 'Content' },
  { id: 'settings', label: 'Settings' },
];

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState('reports');

  const { data: reports, isLoading: loadingReports } = useQuery({
    queryKey: ['reports'],
    queryFn: () => getReports(),
  });

  const { data: bans, isLoading: loadingBans } = useQuery({
    queryKey: ['bans'],
    queryFn: () => getBans(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-brand-600" />
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Moderation Dashboard</h1>
      </div>

      <ModerationStats />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'reports' && (
        <div className="space-y-3">
          {loadingReports ? (
            <>
              <Skeleton height={80} />
              <Skeleton height={80} />
            </>
          ) : reports?.data.length === 0 ? (
            <EmptyState
              icon={<AlertTriangle className="w-12 h-12" />}
              title="No reports"
              description="There are no pending reports to review."
            />
          ) : (
            reports?.data.map((report) => <ReportCard key={report.id} report={report} />)
          )}
        </div>
      )}

      {activeTab === 'bans' && (
        <div className="space-y-3">
          {loadingBans ? (
            <>
              <Skeleton height={80} />
              <Skeleton height={80} />
            </>
          ) : bans?.data.length === 0 ? (
            <EmptyState
              icon={<Ban className="w-12 h-12" />}
              title="No bans"
              description="There are no active bans."
            />
          ) : (
            bans?.data.map((ban) => (
              <Card key={ban.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-100">@{ban.username}</p>
                    <p className="text-sm text-surface-500">Reason: {ban.reason}</p>
                    <p className="text-sm text-surface-500">
                      Banned by {ban.moderatorName} · {formatDate(ban.createdAt)}
                    </p>
                    {ban.expiresAt && (
                      <p className="text-sm text-surface-500">Expires: {formatDate(ban.expiresAt)}</p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${ban.isPermanent ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {ban.isPermanent ? 'Permanent' : 'Temporary'}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'content' && (
        <EmptyState
          icon={<FileText className="w-12 h-12" />}
          title="Content Moderation"
          description="Review and manage flagged content across the platform."
        />
      )}

      {activeTab === 'settings' && (
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Community Settings</h2>
          <p className="text-sm text-surface-500">Configure moderation rules and automated actions for your community.</p>
        </Card>
      )}
    </div>
  );
}
