import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import { Mail, Lock, Eye, EyeOff, Globe, Code2, ArrowRight } from 'lucide-react';

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
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              PAxMEDIA
            </span>
          </Link>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
              Where communities come alive.
            </h1>
            <p className="text-brand-100/80 text-lg leading-relaxed">
              Join millions of users discussing topics they love. Share your thoughts, discover new communities, and connect with people who share your interests.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-white">2.4M+</p>
              <p className="text-brand-200/70 text-sm">Active members</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <p className="text-3xl font-bold text-white">8.2K</p>
              <p className="text-brand-200/70 text-sm">Communities</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <p className="text-3xl font-bold text-white">156K</p>
              <p className="text-brand-200/70 text-sm">Daily posts</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <p className="text-white/90 text-sm leading-relaxed italic">
              "PAxMEDIA has become my go-to platform for discovering new communities. The discussions are engaging and the people are amazing."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
                alt="User"
                className="w-8 h-8 rounded-full bg-white/20"
              />
              <div>
                <p className="text-white text-sm font-medium">Sarah Miller</p>
                <p className="text-brand-200/60 text-xs">Community Moderator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between">
          <p className="text-brand-200/50 text-sm">
            &copy; 2026 PAxMEDIA. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-brand-200/50 hover:text-white text-sm transition-colors">Privacy</a>
            <a href="#" className="text-brand-200/50 hover:text-white text-sm transition-colors">Terms</a>
            <a href="#" className="text-brand-200/50 hover:text-white text-sm transition-colors">Help</a>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-surface-950">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-display font-bold text-lg text-surface-900 dark:text-surface-100">
                PAxMEDIA
              </span>
            </Link>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 tracking-tight">Sign in</h2>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Social login */}
          <div className="space-y-2.5">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50 hover:border-surface-300 dark:hover:border-surface-600 transition-all duration-200"
            >
              <Globe className="w-4 h-4 text-surface-500" />
              Continue with Google
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50 hover:border-surface-300 dark:hover:border-surface-600 transition-all duration-200"
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
              <span className="px-3 bg-white dark:bg-surface-950 text-surface-400 uppercase tracking-wider">or</span>
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
                className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Remember me"
              />
              <Link to="/forgot-password" className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-surface-500 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
              Create one
            </Link>
          </p>

          {/* Mobile footer */}
          <div className="lg:hidden pt-4 border-t border-surface-200 dark:border-surface-700">
            <p className="text-center text-xs text-surface-400">
              &copy; 2026 PAxMEDIA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
