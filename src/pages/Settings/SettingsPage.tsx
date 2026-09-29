import { useState } from 'react';
import { User, Bell, Palette, Lock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import Tabs from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const { toast } = useToast();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Settings</h1>

      <Tabs tabs={tabs.map(t => ({ ...t, label: t.label }))} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'account' && (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Account Settings</h2>
          <Input label="Display Name" defaultValue="Alex Chen" />
          <Input label="Username" defaultValue="alexchen" />
          <Textarea label="Bio" defaultValue="Full-stack developer. Open source enthusiast. Coffee addict." rows={3} />
          <Input label="Email" defaultValue="alex@example.com" type="email" />
          <div className="flex justify-end">
            <Button onClick={() => toast('success', 'Settings saved')}>Save Changes</Button>
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Notification Preferences</h2>
          <div className="space-y-4">
            <Toggle checked={true} onChange={() => {}} label="Email notifications" />
            <Toggle checked={true} onChange={() => {}} label="Push notifications" />
            <Toggle checked={false} onChange={() => {}} label="SMS notifications" />
            <Toggle checked={true} onChange={() => {}} label="Comment replies" />
            <Toggle checked={true} onChange={() => {}} label="Upvotes" />
            <Toggle checked={false} onChange={() => {}} label="Marketing emails" />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast('success', 'Preferences saved')}>Save Changes</Button>
          </div>
        </Card>
      )}

      {activeTab === 'privacy' && (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Privacy Settings</h2>
          <div className="space-y-4">
            <Toggle checked={true} onChange={() => {}} label="Public profile" />
            <Toggle checked={false} onChange={() => {}} label="Show online status" />
            <Toggle checked={true} onChange={() => {}} label="Allow direct messages" />
            <Toggle checked={false} onChange={() => {}} label="Show activity status" />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast('success', 'Privacy settings saved')}>Save Changes</Button>
          </div>
        </Card>
      )}

      {activeTab === 'appearance' && (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Appearance</h2>
          <div className="space-y-4">
            <Toggle checked={false} onChange={() => {}} label="Dark mode" />
            <Toggle checked={true} onChange={() => {}} label="Compact view" />
            <Toggle checked={false} onChange={() => {}} label="Show animations" />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast('success', 'Appearance saved')}>Save Changes</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
