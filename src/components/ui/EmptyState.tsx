import { cn } from '../../utils/format';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {icon && <div className="text-surface-400 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
