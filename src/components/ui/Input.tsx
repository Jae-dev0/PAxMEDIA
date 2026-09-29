import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/format';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
              'dark:bg-surface-800 dark:border-surface-600 dark:text-surface-100 dark:placeholder-surface-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon ? 'pl-10' : '',
              error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
