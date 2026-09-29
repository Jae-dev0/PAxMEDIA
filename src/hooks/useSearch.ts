import { useQuery } from '@tanstack/react-query';
import { search } from '../api/search';
import type { SearchQuery } from '../types';

export function useSearch(query: SearchQuery) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => search(query),
    enabled: !!query.q,
  });
}
