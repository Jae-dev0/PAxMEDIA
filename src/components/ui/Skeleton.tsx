import { cn } from '../../utils/format';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  const base = 'bg-surface-200 dark:bg-surface-700 animate-shimmer bg-gradient-to-r from-surface-200 via-surface-100 to-surface-200 dark:from-surface-700 dark:via-surface-600 dark:to-surface-700 bg-[length:200%_100%]';

  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(base, variants[variant], className)}
      style={{ width, height }}
    />
  );
}

export function SkeletonPost() {
  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="40%" height={16} />
          <Skeleton width="20%" height={12} />
        </div>
      </div>
      <Skeleton width="80%" height={20} />
      <Skeleton width="100%" height={14} />
      <Skeleton width="90%" height={14} />
      <Skeleton width="60%" height={14} />
      <div className="flex gap-4 pt-2">
        <Skeleton width={60} height={24} />
        <Skeleton width={60} height={24} />
        <Skeleton width={60} height={24} />
      </div>
    </div>
  );
}

export function SkeletonComment() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton width="100px" height={14} />
      </div>
      <Skeleton width="100%" height={14} />
      <Skeleton width="80%" height={14} />
    </div>
  );
}
