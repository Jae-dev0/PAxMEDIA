import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    toast('success', 'Account created successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="PAxMEDIA" className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Create account</h1>
          <p className="text-sm text-surface-500 mt-1">Join the PAxMEDIA community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            icon={<User className="w-4 h-4" />}
            required
          />
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
            placeholder="Create a password"
            icon={<Lock className="w-4 h-4" />}
            required
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-surface-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
