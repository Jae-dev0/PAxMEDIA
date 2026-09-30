import { api } from './client';
import type { SearchQuery, SearchResult } from '../types';

interface SearchResponse {
  data: SearchResult[];
  total: number;
}

export async function search(query: SearchQuery): Promise<SearchResponse> {
  return api.get<SearchResponse>('/search', {
    q: query.q,
    type: query.type,
    sort: query.sort,
    time_range: query.timeRange,
    community_id: query.communityId,
    page: query.page,
    per_page: query.perPage,
  });
}
