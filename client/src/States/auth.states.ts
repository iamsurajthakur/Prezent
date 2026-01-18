import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type User = {
    id: string,
    name: string,
    email: string,
}

type AuthState = {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

type AuthActions = {
    setAuth: (user: User, token: string) => void
    logout: () => void
    setLoading: (value: boolean) => void
    setError: (message: string | null) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setAuth: (user, token) => 
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    error: null,
                }),

            logout: () => 
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),
            
            setLoading: (value) => 
                set({ isLoading: value }),

            setError: (message) => 
                set({ error: message })
            }
        ),
        {
            name: 'auth-state',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)