import { cn } from '../../utils/format';

export interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  color?: 'brand' | 'green' | 'red' | 'yellow';
}

const colors = {
  brand: 'bg-brand-600',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
};

const sizes = {
  sm: 'h-1',
  md: 'h-2',
};

export default function ProgressBar({
  value,
  max = 100,
  className,
  showLabel,
  size = 'md',
  color = 'brand',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-surface-500">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
