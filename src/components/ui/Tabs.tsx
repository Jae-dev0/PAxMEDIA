import { cn } from '../../utils/format';

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 border-b border-surface-200 dark:border-surface-700', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === tab.id
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200',
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-xs text-surface-400">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
