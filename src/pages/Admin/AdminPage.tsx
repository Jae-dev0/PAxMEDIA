import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../api/users';
import { getCommunities } from '../../api/communities';
import { getReportStats } from '../../api/moderation';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Avatar from '../../components/ui/Avatar';
import Skeleton from '../../components/ui/Skeleton';
import { formatNumber } from '../../utils/format';
import { BarChart3, Users, Shield, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
  { id: 'communities', label: 'Communities' },
  { id: 'reports', label: 'Reports' },
  { id: 'analytics', label: 'Analytics' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => getUsers(1, 10),
  });

  const { data: communities } = useQuery({
    queryKey: ['adminCommunities'],
    queryFn: () => getCommunities(1, 10),
  });

  const { data: reportStats } = useQuery({
    queryKey: ['reportStats'],
    queryFn: getReportStats,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-brand-600" />
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Admin Dashboard</h1>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">2.4M</p>
                  <p className="text-sm text-surface-500">Total Users</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">156K</p>
                  <p className="text-sm text-surface-500">Active Today</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">8.2K</p>
                  <p className="text-sm text-surface-500">Communities</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{reportStats?.pending ?? 0}</p>
                  <p className="text-sm text-surface-500">Pending Reports</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent activity */}
          <Card>
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'New user registered', user: 'john_doe', time: '2 minutes ago' },
                { action: 'Community created', user: 'tech_enthusiasts', time: '15 minutes ago' },
                { action: 'Report resolved', user: 'mod_sarah', time: '1 hour ago' },
                { action: 'User banned', user: 'spam_bot', time: '2 hours ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-surface-100 dark:border-surface-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-surface-400" />
                    <span className="text-sm text-surface-700 dark:text-surface-300">{activity.action}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-surface-900 dark:text-surface-100">{activity.user}</p>
                    <p className="text-xs text-surface-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left p-4 text-sm font-medium text-surface-500">User</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-500">Karma</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-500">Followers</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-500">Joined</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-surface-100 dark:border-surface-800">
                      <td colSpan={5} className="p-4"><Skeleton height={40} /></td>
                    </tr>
                  ))
                ) : (
                  users?.data.map((user) => (
                    <tr key={user.id} className="border-b border-surface-100 dark:border-surface-800">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.avatar} alt={user.displayName} size="sm" />
                          <div>
                            <p className="font-medium text-surface-900 dark:text-surface-100">{user.displayName}</p>
                            <p className="text-sm text-surface-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-surface-700 dark:text-surface-300">{formatNumber(user.karma)}</td>
                      <td className="p-4 text-sm text-surface-700 dark:text-surface-300">{formatNumber(user.followersCount)}</td>
                      <td className="p-4 text-sm text-surface-700 dark:text-surface-300">{new Date(user.joinedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button className="text-sm text-brand-600 hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'communities' && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left p-4 text-sm font-medium text-surface-500">Community</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-500">Members</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-500">Online</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-500">Created</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {communities?.data.map((community) => (
                  <tr key={community.id} className="border-b border-surface-100 dark:border-surface-800">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={community.icon} alt={community.name} size="sm" />
                        <span className="font-medium text-surface-900 dark:text-surface-100">{community.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-surface-700 dark:text-surface-300">{formatNumber(community.membersCount)}</td>
                    <td className="p-4 text-sm text-surface-700 dark:text-surface-300">{formatNumber(community.onlineCount)}</td>
                    <td className="p-4 text-sm text-surface-700 dark:text-surface-300">{new Date(community.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button className="text-sm text-brand-600 hover:underline">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'reports' && (
        <Card>
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Reports Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
              <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{reportStats?.total ?? 0}</p>
              <p className="text-sm text-surface-500">Total</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{reportStats?.pending ?? 0}</p>
              <p className="text-sm text-surface-500">Pending</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{reportStats?.resolved ?? 0}</p>
              <p className="text-sm text-surface-500">Resolved</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <Card>
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Analytics</h3>
          <p className="text-sm text-surface-500">Detailed analytics and charts will be available here.</p>
        </Card>
      )}
    </div>
  );
}
