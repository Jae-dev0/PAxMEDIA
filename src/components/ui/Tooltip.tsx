import { useState } from 'react';
import { cn } from '../../utils/format';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export default function Tooltip({ content, children, position = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-surface-900 dark:bg-surface-700 rounded shadow-lg whitespace-nowrap animate-fade-in',
            positions[position],
          )}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
}
