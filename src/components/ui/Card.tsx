import { cn } from '../../utils/format';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function Card({ children, className, padding = 'md', hover, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl',
        paddings[padding],
        hover && 'transition-shadow hover:shadow-md cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}
