import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  setRememberMe: (value: boolean) => void;
}

// Custom storage that respects rememberMe flag
const customStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    const localValue = localStorage.getItem(name);
    if (localValue) return localValue;
    return sessionStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return;
    const parsed = JSON.parse(value);
    const rememberMe = parsed?.state?.rememberMe;

    // Store in localStorage if rememberMe, else sessionStorage
    if (rememberMe) {
      localStorage.setItem(name, value);
      sessionStorage.removeItem(name);
    } else {
      sessionStorage.setItem(name, value);
      localStorage.removeItem(name);
    }
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      rememberMe: false,

      setRememberMe: (value: boolean) => {
        set({ rememberMe: value });
      },

      login: async (email: string, password: string, rememberMe: boolean = false) => {
        set({ isLoading: true, rememberMe });
        try {
          const response = await authAPI.login({ email, password });
          const { user, token } = response.data.data;

          if (typeof window !== 'undefined') {
            // Store token in localStorage for axios interceptor
            localStorage.setItem('mhk_token', token);
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            rememberMe,
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(
            error.response?.data?.message || 'Login failed. Please try again.'
          );
        }
      },

      register: async (data: any) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(data);
          const { user, token } = response.data.data;

          if (typeof window !== 'undefined') {
            localStorage.setItem('mhk_token', token);
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(
            error.response?.data?.message || 'Registration failed. Please try again.'
          );
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mhk_token');
          sessionStorage.removeItem('mhk-auth');
          localStorage.removeItem('mhk-auth');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          rememberMe: false,
        });
      },

      loadUser: async () => {
        try {
          const response = await authAPI.me();
          set({
            user: response.data.data.user,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'mhk-auth',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
      }),
    }
  )
);