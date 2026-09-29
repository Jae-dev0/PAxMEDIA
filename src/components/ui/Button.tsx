import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/format';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
      secondary: 'bg-surface-100 text-surface-900 hover:bg-surface-200 active:bg-surface-300 dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700',
      ghost: 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
      outline: 'border border-surface-300 text-surface-700 hover:bg-surface-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
