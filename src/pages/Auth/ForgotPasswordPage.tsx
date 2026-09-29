import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setIsSent(true);
    toast('success', 'Password reset email sent!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="PAxMEDIA" className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Reset password</h1>
          <p className="text-sm text-surface-500 mt-1">Enter your email to receive a reset link</p>
        </div>

        {isSent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-surface-600 dark:text-surface-400">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 text-brand-600 hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
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
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Send Reset Link
            </Button>
            <div className="text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
