import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface AuthState {
  user: TelegramUser | null;
  setUser: (user: TelegramUser | null) => void;
  _hasHydrated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      _hasHydrated: false,
    }),
    {
      name: "telegram-user", // nombre de la key en localStorage
      onRehydrateStorage: () => (state) => {
        if (state) state._hasHydrated = true;
      },
    }
  )
);
