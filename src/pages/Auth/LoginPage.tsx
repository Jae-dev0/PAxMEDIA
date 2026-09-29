import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    toast('success', 'Welcome back!');
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="PAxMEDIA" className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Welcome back</h1>
          <p className="text-sm text-surface-500 mt-1">Sign in to your PAxMEDIA account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4" />}
            required
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-surface-300" />
              <span className="text-surface-600 dark:text-surface-400">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-surface-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
