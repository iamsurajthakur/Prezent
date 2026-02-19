import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Typescript type used for type safety on User
export type User = {
  id: string;
  name: string;
  email: string;
};

// Define what data live in the auth store
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

// Define how the state can be changed also known as actions
type AuthActions = {
  setAuth: (user: User) => void;
  logout: () => void;
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  setIsAuthenticated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setAuth: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (value) => set({ isLoading: value }),

      setError: (message) => set({ error: message }),

      setIsAuthenticated: (value) => set({ isAuthenticated: value}),
    }),
    {
      name: 'auth-state',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
