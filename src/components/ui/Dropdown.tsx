import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/format';

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export default function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-48 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg py-1 animate-scale-in',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item, index) =>
            item.divider ? (
              <div key={index} className="my-1 border-t border-surface-200 dark:border-surface-700" />
            ) : (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                  item.danger
                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
