'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { apiClient } from '@/lib/api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Restores auth state on page load by calling /members/me with
 * the stored access token (or letting the refresh interceptor handle expiry).
 */
function AuthInitializer() {
  const { setAuth, clearAuth, setLoading } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      clearAuth();
      return;
    }

    apiClient
      .get('/members/me')
      .then(({ data }) => setAuth(data.data, token))
      .catch(() => clearAuth())
      .finally(() => setLoading(false));
  }, [setAuth, clearAuth, setLoading]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      {children}
    </QueryClientProvider>
  );
}
