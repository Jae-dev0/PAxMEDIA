import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { search } from '../../api/search';
import type { SearchResultType } from '../../types';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNumber, timeAgo } from '../../utils/format';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'posts', label: 'Posts' },
  { id: 'communities', label: 'Communities' },
  { id: 'users', label: 'Users' },
  { id: 'comments', label: 'Comments' },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [timeRange, setTimeRange] = useState('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', query, activeTab, sortBy, timeRange],
    queryFn: () => search({
      q: query,
      type: activeTab === 'all' ? undefined : (activeTab as SearchResultType),
      sort: sortBy as 'relevance' | 'newest' | 'popular',
      timeRange: timeRange as 'hour' | 'day' | 'week' | 'month' | 'year' | 'all',
    }),
    enabled: !!query,
  });

  if (!query) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Search</h1>
        <Input
          placeholder="Search PAxMEDIA..."
          icon={<Search className="w-4 h-4" />}
        />
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="Search PAxMEDIA"
          description="Find posts, communities, users, and comments."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
        Search results for "{query}"
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="flex items-center gap-2 ml-auto">
          <SlidersHorizontal className="w-4 h-4 text-surface-400" />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'relevance', label: 'Relevance' },
              { value: 'newest', label: 'Newest' },
              { value: 'popular', label: 'Most Popular' },
            ]}
            className="w-36"
          />
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: 'all', label: 'All time' },
              { value: 'hour', label: 'Past hour' },
              { value: 'day', label: 'Past day' },
              { value: 'week', label: 'Past week' },
              { value: 'month', label: 'Past month' },
              { value: 'year', label: 'Past year' },
            ]}
            className="w-32"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton height={100} />
          <Skeleton height={100} />
          <Skeleton height={100} />
        </div>
      ) : error ? (
        <EmptyState
          title="Search failed"
          description="An error occurred while searching. Please try again."
        />
      ) : data?.data.length === 0 ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="No results found"
          description={`No results found for "${query}". Try different keywords.`}
        />
      ) : (
        <div className="space-y-4">
          {data?.data.map((result) => {
            if (result.type === 'post') {
              return (
                <Card key={result.id} padding="sm">
                  <div className="flex items-center gap-2 text-xs text-surface-500 mb-2">
                    <span className="font-medium text-surface-700 dark:text-surface-300">{result.communityName}</span>
                    <span>·</span>
                    <span>{timeAgo(result.createdAt)}</span>
                    <span>·</span>
                    <span>{formatNumber(result.score)} points</span>
                  </div>
                  <Link to={`/post/${result.id}`} className="block">
                    <h3 className="font-medium text-surface-900 dark:text-surface-100 hover:text-brand-600 dark:hover:text-brand-400">
                      {result.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-surface-500 mt-1 line-clamp-2">{result.subtitle}</p>
                </Card>
              );
            }
            if (result.type === 'community') {
              return (
                <Card key={result.id} padding="sm">
                  <div className="flex items-center gap-3">
                    <Avatar src={result.avatar} alt={result.title} size="md" />
                    <div className="flex-1">
                      <Link to={`/community/${result.title.toLowerCase()}`} className="font-medium text-surface-900 dark:text-surface-100 hover:text-brand-600 dark:hover:text-brand-400">
                        {result.title}
                      </Link>
                      <p className="text-sm text-surface-500">{result.subtitle}</p>
                    </div>
                    <span className="text-sm text-surface-500">{formatNumber(result.score)} members</span>
                  </div>
                </Card>
              );
            }
            if (result.type === 'user') {
              return (
                <Card key={result.id} padding="sm">
                  <div className="flex items-center gap-3">
                    <Avatar src={result.avatar} alt={result.title} size="md" />
                    <div className="flex-1">
                      <Link to={`/user/${result.title.toLowerCase()}`} className="font-medium text-surface-900 dark:text-surface-100 hover:text-brand-600 dark:hover:text-brand-400">
                        {result.title}
                      </Link>
                      <p className="text-sm text-surface-500">{result.subtitle}</p>
                    </div>
                  </div>
                </Card>
              );
            }
            return (
              <Card key={result.id} padding="sm">
                <p className="text-sm text-surface-700 dark:text-surface-300">{result.title}</p>
                <p className="text-xs text-surface-500 mt-1">{result.subtitle}</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
