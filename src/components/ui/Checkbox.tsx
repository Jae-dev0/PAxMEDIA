import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/format';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500/50',
            'dark:border-surface-600 dark:bg-surface-800',
            className,
          )}
          {...props}
        />
        {label && (
          <span className="text-sm text-surface-700 dark:text-surface-300">{label}</span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
