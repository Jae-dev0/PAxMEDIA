import { api, setToken, getToken } from './client';
import type { User } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  setToken(response.token);
  return response;
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  display_name: string;
}): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>('/auth/register', data);
  setToken(response.token);
  return response;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    setToken(null);
  }
}

export async function getCurrentUser(): Promise<User> {
  return api.get<User>('/auth/me');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
