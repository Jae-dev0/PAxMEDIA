import { useQuery } from '@tanstack/react-query';
import { getReportStats } from '../../api/moderation';
import { formatNumber } from '../../utils/format';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

export default function ModerationStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['reportStats'],
    queryFn: getReportStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton height={100} />
        <Skeleton height={100} />
        <Skeleton height={100} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <div className="text-center">
          <p className="text-3xl font-bold text-surface-900 dark:text-surface-100">
            {formatNumber(stats?.total ?? 0)}
          </p>
          <p className="text-sm text-surface-500 mt-1">Total Reports</p>
        </div>
      </Card>
      <Card>
        <div className="text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {formatNumber(stats?.pending ?? 0)}
          </p>
          <p className="text-sm text-surface-500 mt-1">Pending</p>
        </div>
      </Card>
      <Card>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">
            {formatNumber(stats?.resolved ?? 0)}
          </p>
          <p className="text-sm text-surface-500 mt-1">Resolved</p>
        </div>
      </Card>
    </div>
  );
}
