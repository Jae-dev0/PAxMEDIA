import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/format';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export default function Modal({ isOpen, onClose, title, children, size = 'md', showClose = true }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          'w-full bg-white dark:bg-surface-900 rounded-xl shadow-2xl animate-scale-in',
          sizes[size],
        )}
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
            {title && <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">{title}</h2>}
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
