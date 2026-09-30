import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Button from '../ui/Button';

interface SignInPromptProps {
  action: string;
  onDismiss: () => void;
}

export default function SignInPrompt({ action, onDismiss }: SignInPromptProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-surface-900 rounded-2xl shadow-2xl p-6 text-center animate-scale-in">
        <div className="w-14 h-14 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-brand-600" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">
          Sign in to {action}
        </h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
          You need to be signed in to {action}. Join PAxMEDIA to participate in discussions.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onDismiss}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => { onDismiss(); navigate('/login'); }}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
