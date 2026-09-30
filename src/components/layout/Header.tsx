import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  MessageSquare,
  Plus,
  Menu,
  X,
  Home,
  Compass,
  Users,
  Bookmark,
  Settings,
  LogOut,
  User,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from '../../api/notifications';
import { getCurrentUser } from '../../api/users';
import Avatar from '../ui/Avatar';
import Dropdown from '../ui/Dropdown';
import Input from '../ui/Input';
import Button from '../ui/Button';

export interface HeaderProps {
  onOpenAuth: () => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const { data: unreadCount } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const userMenuItems = [
    { label: 'Profile', icon: <User className="w-4 h-4" />, onClick: () => navigate(`/user/${user?.username}`) },
    { label: 'Settings', icon: <Settings className="w-4 h-4" />, onClick: () => navigate('/settings') },
    { label: 'Saved', icon: <Bookmark className="w-4 h-4" />, onClick: () => navigate('/saved') },
    { label: 'Moderation', icon: <Shield className="w-4 h-4" />, onClick: () => navigate('/moderation') },
    { label: '', divider: true },
    { label: 'Log out', icon: <LogOut className="w-4 h-4" />, onClick: () => {}, danger: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700">
      <div className="flex items-center justify-between h-14 px-4 max-w-[1800px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="PAxMEDIA" className="h-8 w-auto" />
        </Link>

        {/* Search - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
          <Input
            placeholder="Search PAxMEDIA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="bg-surface-100 dark:bg-surface-800 border-transparent"
          />
        </form>

        {/* Nav - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            to="/explore"
            className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
            aria-label="Explore"
          >
            <Compass className="w-5 h-5" />
          </Link>
          <Link
            to="/communities"
            className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
            aria-label="Communities"
          >
            <Users className="w-5 h-5" />
          </Link>
          <Link
            to="/create"
            className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
            aria-label="Create Post"
          >
            <Plus className="w-5 h-5" />
          </Link>
          <Link
            to="/notifications"
            className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount && unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          <Link
            to="/messages"
            className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
            aria-label="Messages"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>

          {user ? (
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors ml-2">
                  <Avatar src={user.avatar} alt={user.displayName} size="sm" isOnline={user.isOnline} />
                  <ChevronDown className="w-4 h-4 text-surface-400" />
                </button>
              }
              items={userMenuItems}
            />
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Button variant="ghost" size="sm" onClick={onOpenAuth}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={onOpenAuth}>
                Open Account
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 animate-slide-down">
          <div className="p-4 space-y-2">
            <form onSubmit={handleSearch}>
              <Input
                placeholder="Search PAxMEDIA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </form>
            <nav className="flex flex-col gap-1 pt-2">
              {[
                { to: '/', icon: Home, label: 'Home' },
                { to: '/explore', icon: Compass, label: 'Explore' },
                { to: '/communities', icon: Users, label: 'Communities' },
                { to: '/create', icon: Plus, label: 'Create Post' },
                { to: '/notifications', icon: Bell, label: 'Notifications' },
                { to: '/messages', icon: MessageSquare, label: 'Messages' },
              ].map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-surface-200 dark:border-surface-700">
              <Button variant="primary" className="w-full" onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
