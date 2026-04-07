import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const INITIAL_AUTH_STATE = {
  token: null,
  user: null,
  isAuthenticated: false,
}

export const useAuthStore = create(
  persist(
    (set) => ({
      ...INITIAL_AUTH_STATE,
      setToken: (token) =>
        set({
          token,
          isAuthenticated: Boolean(token),
        }),
      setUser: (user) => set({ user }),
      setAuth: ({ token, user }) =>
        set({
          token: token ?? null,
          user: user ?? null,
          isAuthenticated: Boolean(token),
        }),
      clearAuth: () => set(INITIAL_AUTH_STATE),
    }),
    {
      name: 'lotus-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return
        }

        state.isAuthenticated = Boolean(state.token)
      },
    },
  ),
)
