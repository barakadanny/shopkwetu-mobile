import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import type { User, UserRole } from "@/types/auth";

const TOKEN_KEY = "shopkwetu_auth_token";
const USER_KEY = "shopkwetu_auth_user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  shopId: string | undefined;
  locale: "fr" | "en";
  permissions: string[];

  setAuth: (user: User, token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
  shopId: undefined,
  locale: "fr",
  permissions: [],

  setAuth: async (user: User, token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      role: user.role,
      shopId: user.shopId,
      locale: user.locale,
      permissions: user.permissions,
    });
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      role: null,
      shopId: undefined,
      locale: "fr",
      permissions: [],
    });
  },

  loadStoredAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);

      if (token && userStr) {
        const user: User = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          role: user.role,
          shopId: user.shopId,
          locale: user.locale,
          permissions: user.permissions,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  updateUser: async (partial: Partial<User>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...partial };
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updated));
    set({
      user: updated,
      role: updated.role,
      shopId: updated.shopId,
      locale: updated.locale,
      permissions: updated.permissions,
    });
  },
}));
