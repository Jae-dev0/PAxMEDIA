import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api/auth';
import { useAuth } from '../app/providers/AuthProvider';

/**
 * Current-user state is owned by AuthProvider, which only calls /auth/me when a
 * token exists. This hook reads that shared state rather than firing its own
 * request, so guests never trigger a 401 on every render.
 */
export function useCurrentUser() {
  const { user, isLoading } = useAuth();
  return { data: user, isLoading };
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      username: string;
      email: string;
      password: string;
      password_confirmation: string;
      display_name: string;
    }) => registerApi(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
