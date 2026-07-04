import { create } from 'zustand';

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  profilePhoto?: string;
  memberNumber?: string;
  country?: string;
  joinedAt?: string;
  chapter?: { _id: string; name: string; slug: string };
  privacy: {
    showPhone: boolean;
    showWhatsapp: boolean;
    showEmail: boolean;
    showProfession: boolean;
    allowMessages: boolean;
    allowNetworking: boolean;
  };
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  setAuth: (user, accessToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    set({ user, accessToken, isLoading: false });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    set({ user: null, accessToken: null, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

// Convenience selectors
export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.user !== null);
export const useIsAdmin = () =>
  useAuthStore((s) =>
    s.user?.role === 'ADMIN' || s.user?.role === 'SUPER_ADMIN'
  );
export const useIsSuperAdmin = () =>
  useAuthStore((s) => s.user?.role === 'SUPER_ADMIN');
