import { cn } from '../../utils/format';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const sizes = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
  md: { track: 'w-10 h-5', thumb: 'w-4 h-4', translate: 'translate-x-5' },
};

export default function Toggle({ checked, onChange, label, disabled, size = 'md' }: ToggleProps) {
  const s = sizes[size];

  return (
    <label className={cn('inline-flex items-center gap-2', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50',
          s.track,
          checked ? 'bg-brand-600' : 'bg-surface-300 dark:bg-surface-600',
        )}
      >
        <span
          className={cn(
            'inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200',
            s.thumb,
            'translate-x-0.5',
            checked && s.translate,
          )}
        />
      </button>
      {label && (
        <span className="text-sm text-surface-700 dark:text-surface-300">{label}</span>
      )}
    </label>
  );
}
