import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className ?? ''}`}>
      <div className="text-red-500 mb-4">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
