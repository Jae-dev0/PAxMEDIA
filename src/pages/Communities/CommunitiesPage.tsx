import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommunities, joinCommunity } from '../../api/communities';
import CommunityCard from '../../components/communities/CommunityCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Search, Users } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export default function CommunitiesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: communities, isLoading } = useQuery({
    queryKey: ['communities', search, category],
    queryFn: () => getCommunities(1, 50),
  });

  const joinMutation = useMutation({
    mutationFn: (id: string) => joinCommunity(id),
    onSuccess: (data, id) => {
      const community = communities?.data.find((c) => c.id === id);
      toast('success', data.is_joined ? `Joined ${community?.name}` : `Left ${community?.name}`);
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });

  const filteredCommunities = communities?.data.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || c.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(communities?.data.map((c) => c.category) ?? [])];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Communities</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search communities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="flex-1"
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories.map((c) => ({ value: c, label: c === 'all' ? 'All Categories' : c }))}
          className="w-full sm:w-48"
        />
      </div>

      {/* Communities grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={150} />
          ))}
        </div>
      ) : filteredCommunities?.length === 0 ? (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="No communities found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommunities?.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={(id) => joinMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
