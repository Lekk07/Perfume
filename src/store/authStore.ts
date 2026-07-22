"use client";

import { create } from "zustand";
import type { AuthUser, Address } from "@/types/auth";

type Status = "idle" | "loading" | "authenticated" | "unauthenticated";

interface ActionResult {
  success: boolean;
  message?: string;
}

interface AuthState {
  user: AuthUser | null;
  status: Status;

  hydrate: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<ActionResult>;
  login: (email: string, password: string) => Promise<ActionResult>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<ActionResult & { message: string }>;
  updateProfile: (data: { name: string; email: string; phone?: string }) => Promise<ActionResult>;
  addAddress: (address: Omit<Address, "id" | "isDefault"> & { isDefault?: boolean }) => Promise<ActionResult>;
  updateAddress: (
    id: string,
    address: Omit<Address, "id" | "isDefault"> & { isDefault?: boolean }
  ) => Promise<ActionResult>;
  removeAddress: (id: string) => Promise<ActionResult>;
  currentUser: () => AuthUser | null;
}

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user as AuthUser;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "idle",

  hydrate: async () => {
    if (get().status === "loading") return;
    set({ status: "loading" });
    const user = await fetchMe();
    set({ user, status: user ? "authenticated" : "unauthenticated" });
  },

  register: async (name, email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data.error ?? "Something went wrong. Please try again." };
    }
    const user = await fetchMe();
    set({ user, status: "authenticated" });
    return { success: true };
  },

  login: async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data.error ?? "Incorrect email or password." };
    }
    const user = await fetchMe();
    set({ user, status: "authenticated" });
    return { success: true };
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null, status: "unauthenticated" });
  },

  requestPasswordReset: async (email) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      message: data.message ?? "If an account exists for that email, a reset link has been sent.",
    };
  },

  updateProfile: async (profileData) => {
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, message: data.error ?? "Couldn't save changes." };
    const user = await fetchMe();
    set({ user });
    return { success: true };
  },

  addAddress: async (address) => {
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, message: data.error ?? "Couldn't save address." };
    const user = await fetchMe();
    set({ user });
    return { success: true };
  },

  updateAddress: async (id, address) => {
    const res = await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, message: data.error ?? "Couldn't save address." };
    const user = await fetchMe();
    set({ user });
    return { success: true };
  },

  removeAddress: async (id) => {
    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, message: data.error ?? "Couldn't remove address." };
    const user = await fetchMe();
    set({ user });
    return { success: true };
  },

  currentUser: () => get().user,
}));
