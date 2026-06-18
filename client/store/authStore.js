"use client";

import { create } from "zustand";
import { api, clearToken, setToken } from "../lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  async login(values) {
    set({ loading: true });
    const data = await api("/auth/login", { method: "POST", body: JSON.stringify(values) });
    setToken(data.token);
    set({ user: data.user, loading: false });
  },
  async signup(values) {
    set({ loading: true });
    const data = await api("/auth/signup", { method: "POST", body: JSON.stringify(values) });
    setToken(data.token);
    set({ user: data.user, loading: false });
  },
  logout() {
    clearToken();
    set({ user: null });
  }
}));
