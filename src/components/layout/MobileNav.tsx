import { NavLink } from 'react-router-dom';
import { Home, Compass, Plus, Bell, User } from 'lucide-react';
import { cn } from '../../utils/format';
import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from '../../api/notifications';
import { useAuth } from '../../app/providers/AuthProvider';
import Avatar from '../ui/Avatar';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/create', icon: Plus, label: 'Create' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

export default function MobileNav() {
  // Reuse AuthProvider's user instead of firing a second /auth/me request.
  const { user, isAuthenticated } = useAuth();

  const { data: unreadCount } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: getUnreadCount,
    refetchInterval: 30000,
    // Guests must not hit this endpoint, or it 401s on every page load.
    enabled: isAuthenticated,
    retry: false,
  });

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-t border-surface-200 dark:border-surface-700">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors relative',
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-surface-500 dark:text-surface-400',
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
            {label === 'Notifications' && unreadCount && unreadCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
        <NavLink
          to={user ? `/user/${user.username}` : '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors',
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-surface-500 dark:text-surface-400',
            )
          }
        >
          {user ? (
            <Avatar src={user.avatar} alt={user.displayName} size="xs" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] font-medium">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
