import { useQuery } from '@tanstack/react-query';
import { getUser, getUsers, getRisingCreators } from '../api/users';

export function useUser(username: string) {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username),
    enabled: !!username,
  });
}

export function useUsers(page: number = 1, perPage: number = 10) {
  return useQuery({
    queryKey: ['users', page, perPage],
    queryFn: () => getUsers(page, perPage),
  });
}

export function useRisingCreators(limit: number = 5) {
  return useQuery({
    queryKey: ['risingCreators', limit],
    queryFn: () => getRisingCreators(limit),
  });
}

