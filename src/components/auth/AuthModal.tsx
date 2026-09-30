import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Globe, Code2, ArrowRight, User } from 'lucide-react';
import { useToast } from '../ui/Toast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import Modal from '../ui/Modal';

type AuthView = 'login' | 'register';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
}

export default function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [view, setView] = useState<AuthView>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; username?: string }>({});

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setShowPassword(false);
    setRememberMe(false);
    setErrors({});
  };

  const handleViewChange = (newView: AuthView) => {
    setView(newView);
    resetForm();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (view === 'register' && !username) {
      newErrors.username = 'Username is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    toast('success', view === 'login' ? 'Welcome back to PAxMEDIA!' : 'Account created successfully!');
    resetForm();
    onClose();
    navigate('/');
  };

  const handleSocialLogin = (provider: string) => {
    toast('info', `${provider} login coming soon!`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showClose>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
            {view === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            {view === 'login'
              ? 'Sign in to your PAxMEDIA account'
              : 'Join the PAxMEDIA community'}
          </p>
        </div>

        {/* Social login */}
        <div className="space-y-2.5">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all duration-200"
          >
            <Globe className="w-4 h-4 text-surface-500" />
            Continue with Google
          </button>
          <button
            onClick={() => handleSocialLogin('GitHub')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all duration-200"
          >
            <Code2 className="w-4 h-4 text-surface-500" />
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-200 dark:border-surface-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white dark:bg-surface-900 text-surface-400 uppercase tracking-wider">or</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setErrors((prev) => ({ ...prev, username: undefined })); }}
              placeholder="Choose a username"
              icon={<User className="w-4 h-4" />}
              error={errors.username}
              required
            />
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
              placeholder="Enter your password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {view === 'login' && (
            <div className="flex items-center justify-between">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Remember me"
              />
              <button
                type="button"
                onClick={() => toast('info', 'Password reset coming soon!')}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {isLoading
              ? view === 'login' ? 'Signing in...' : 'Creating account...'
              : view === 'login' ? 'Sign In' : 'Create Account'}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        {/* Toggle view */}
        <p className="text-center text-sm text-surface-500 dark:text-surface-400">
          {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => handleViewChange(view === 'login' ? 'register' : 'login')}
            className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            {view === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </Modal>
  );
}
