import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftNav from './LeftNav';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header />
      <div className="flex max-w-[1800px] mx-auto">
        <LeftNav />
        <main className="flex-1 min-w-0 px-3 py-3 pb-20 md:pb-3">
          <Outlet />
        </main>
        <Sidebar />
      </div>
      <MobileNav />
    </div>
  );
}
