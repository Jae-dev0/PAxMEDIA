import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2 } from 'lucide-react';
import type { Report } from '../../types';
import { resolveReport } from '../../api/moderation';
import { timeAgo } from '../../utils/format';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useToast } from '../ui/Toast';

export interface ReportCardProps {
  report: Report;
}

const statusColors = {
  pending: 'warning',
  approved: 'success',
  removed: 'danger',
  dismissed: 'default',
} as const;

export default function ReportCard({ report }: ReportCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const resolveMutation = useMutation({
    mutationFn: (action: 'approve' | 'remove' | 'dismiss') => resolveReport(report.id, action),
    onSuccess: () => {
      toast('success', 'Report resolved');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={statusColors[report.status]} size="sm">
              {report.status}
            </Badge>
            <span className="text-xs text-surface-500">{timeAgo(report.createdAt)}</span>
          </div>
          <p className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-1">
            {report.targetTitle}
          </p>
          <p className="text-sm text-surface-500">
            Reported by <span className="font-medium">{report.reporterName}</span> · Reason: {report.reason}
          </p>
        </div>
        {report.status === 'pending' && (
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => resolveMutation.mutate('approve')}
              isLoading={resolveMutation.isPending}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => resolveMutation.mutate('remove')}
              isLoading={resolveMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => resolveMutation.mutate('dismiss')}
              isLoading={resolveMutation.isPending}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
