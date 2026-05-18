"use client";

import { createContext, useContext, useMemo } from "react";

import type { AuthSession } from "@/lib/auth/types";

type AuthContextValue = {
  session: AuthSession | null;
  isAdmin: boolean;
  isSignedIn: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  session,
  children,
}: {
  session: AuthSession | null;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      session,
      isAdmin: session?.role === "admin",
      isSignedIn: Boolean(session),
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
