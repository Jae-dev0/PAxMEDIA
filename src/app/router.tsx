import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/layout/Layout';
import Spinner from '../components/ui/Spinner';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const ExplorePage = lazy(() => import('../pages/Explore/ExplorePage'));
const CommunitiesPage = lazy(() => import('../pages/Communities/CommunitiesPage'));
const CommunityPage = lazy(() => import('../pages/Community/CommunityPage'));
const PostPage = lazy(() => import('../pages/Post/PostPage'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const MessagesPage = lazy(() => import('../pages/Messages/MessagesPage'));
const NotificationsPage = lazy(() => import('../pages/Notifications/NotificationsPage'));
const SavedPage = lazy(() => import('../pages/Saved/SavedPage'));
const CreatePostPage = lazy(() => import('../pages/Create/CreatePostPage'));
const SearchPage = lazy(() => import('../pages/Search/SearchPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const ModerationPage = lazy(() => import('../pages/Moderation/ModerationPage'));
const AdminPage = lazy(() => import('../pages/Admin/AdminPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: 'explore', element: <Suspense fallback={<PageLoader />}><ExplorePage /></Suspense> },
      { path: 'communities', element: <Suspense fallback={<PageLoader />}><CommunitiesPage /></Suspense> },
      { path: 'community/:slug', element: <Suspense fallback={<PageLoader />}><CommunityPage /></Suspense> },
      { path: 'post/:id', element: <Suspense fallback={<PageLoader />}><PostPage /></Suspense> },
      { path: 'user/:username', element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense> },
      { path: 'messages', element: <Suspense fallback={<PageLoader />}><MessagesPage /></Suspense> },
      { path: 'notifications', element: <Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense> },
      { path: 'saved', element: <Suspense fallback={<PageLoader />}><SavedPage /></Suspense> },
      { path: 'create', element: <Suspense fallback={<PageLoader />}><CreatePostPage /></Suspense> },
      { path: 'search', element: <Suspense fallback={<PageLoader />}><SearchPage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense> },
      { path: 'moderation', element: <Suspense fallback={<PageLoader />}><ModerationPage /></Suspense> },
      { path: 'admin', element: <Suspense fallback={<PageLoader />}><AdminPage /></Suspense> },
      // Auth routes redirect to home (modal handles auth)
      { path: 'login', element: <Navigate to="/" replace /> },
      { path: 'register', element: <Navigate to="/" replace /> },
      { path: 'forgot-password', element: <Navigate to="/" replace /> },
      // Catch all
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
