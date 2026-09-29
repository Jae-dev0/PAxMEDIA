import { NavLink } from 'react-router-dom';
import { Home, Compass, Users, Bookmark, History, TrendingUp } from 'lucide-react';
import { cn } from '../../utils/format';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/communities', icon: Users, label: 'Communities' },
  { to: '/saved', icon: Bookmark, label: 'Saved' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/trending', icon: TrendingUp, label: 'Trending' },
];

export default function LeftNav() {
  return (
    <aside className="hidden lg:block w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-4 pr-4">
      <nav className="space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                  : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
