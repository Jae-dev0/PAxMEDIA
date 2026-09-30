import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCurrentUser } from '../../api/auth';
import type { User } from '../../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    display_name: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('paxmedia_token');
    if (token) {
      getCurrentUser()
        .then(setUser)
        .catch(() => localStorage.removeItem('paxmedia_token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { login: loginApi } = await import('../../api/auth');
    const response = await loginApi(email, password);
    setUser(response.user);
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    display_name: string;
  }) => {
    const { register: registerApi } = await import('../../api/auth');
    const response = await registerApi(data);
    setUser(response.user);
  };

  const logout = async () => {
    const { logout: logoutApi } = await import('../../api/auth');
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
