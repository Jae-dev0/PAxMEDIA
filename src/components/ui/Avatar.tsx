import { cn } from '../../utils/format';

export interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const dotSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

export default function Avatar({ src, alt, size = 'md', isOnline, className }: AvatarProps) {
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn('rounded-full object-cover', sizes[size])}
          loading="lazy"
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium',
            sizes[size],
          )}
        >
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-surface-900',
            dotSizes[size],
            isOnline ? 'bg-green-500' : 'bg-surface-400',
          )}
        />
      )}
    </div>
  );
}
