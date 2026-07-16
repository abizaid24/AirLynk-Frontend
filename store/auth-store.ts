import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse } from "@/types/user";
import { tokenStorage } from "@/lib/token-storage";

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  setSession: (user: UserResponse, access: string, refresh: string) => void;
  setUser: (user: UserResponse) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setSession: (user, access, refresh) => {
        tokenStorage.setTokens(access, refresh);
        set({ user, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      clearSession: () => {
        tokenStorage.clear();
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: "airlynk-auth" }
  )
);
