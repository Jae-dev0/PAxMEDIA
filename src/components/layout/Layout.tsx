import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftNav from './LeftNav';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import AuthModal from '../auth/AuthModal';

export default function Layout() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header onOpenAuth={() => setIsAuthModalOpen(true)} />
      <div className="flex max-w-[1800px] mx-auto">
        <LeftNav />
        <main className="flex-1 min-w-0 px-3 py-3 pb-20 md:pb-3">
          <Outlet />
        </main>
        <Sidebar />
      </div>
      <MobileNav />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
