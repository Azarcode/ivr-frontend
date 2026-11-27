'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, AdminUser } from '@/lib/api/auth.api';
import { tokenStorage } from '@/lib/api/axios';
import { queryKeys } from '@/lib/query-client';

const emptySubscribe = () => () => {};

interface AuthContextValue {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
  refetchProfile: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [token, setToken] = useState<string | null>(() => tokenStorage.get());
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch admin profile whenever token is available
  const {
    data: admin,
    isLoading: isProfileLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: authApi.getProfile,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  // Handle invalid or expired token
  useEffect(() => {
    if (isError && token) {
      tokenStorage.clear();
      queryClient.removeQueries({ queryKey: queryKeys.auth.profile });
      const timer = setTimeout(() => {
        setToken(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isError, token, queryClient]);

  const login = useCallback(
    (newToken: string, newAdmin: AdminUser) => {
      tokenStorage.set(newToken);
      setToken(newToken);
      queryClient.setQueryData(queryKeys.auth.profile, newAdmin);
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    queryClient.clear();
    router.push('/login');
  }, [queryClient, router]);

  const value: AuthContextValue = {
    admin: admin ?? null,
    token,
    isAuthenticated: !!token && !!admin && !isError,
    isLoading: !isClient || (!!token && isProfileLoading),
    login,
    logout,
    refetchProfile: () => {
      void refetch();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
