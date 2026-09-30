import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import { Mail, Lock, Eye, EyeOff, Globe, Code2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
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
    toast('success', 'Welcome back to PAxMEDIA!');
    navigate('/');
  };

  const handleSocialLogin = (provider: string) => {
    toast('info', `${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="PAxMEDIA" className="h-10 w-auto brightness-0 invert" />
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Welcome to the<br />community that<br />never stops talking.
          </h1>
          <p className="text-brand-100 text-lg max-w-md">
            Join millions of users discussing topics they love. Share your thoughts, discover new communities, and connect with people who share your interests.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {['https://api.dicebear.com/7.x/avataaars/svg?seed=1', 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'].map((src, i) => (
                <img key={i} src={src} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
              ))}
            </div>
            <p className="text-brand-100 text-sm">
              <span className="font-semibold text-white">2.4M+</span> members already joined
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-brand-200 text-sm">
            &copy; 2026 PAxMEDIA. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="PAxMEDIA" className="h-10 w-auto mx-auto" />
            </Link>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Sign in</h2>
            <p className="text-surface-500 dark:text-surface-400">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Social login */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-surface-300 dark:border-surface-600 rounded-lg text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
            >
              <Globe className="w-5 h-5" />
              Continue with Google
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-surface-300 dark:border-surface-600 rounded-lg text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
            >
              <Code2 className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200 dark:border-surface-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-surface-950 text-surface-500">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Remember me"
              />
              <Link to="/forgot-password" className="text-sm text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-surface-500 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
