// contexts/AuthContext.tsx
"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { User } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { unsubscribeBrowserPush } from "@/lib/webPush";
import { startWebPushSync } from "@/lib/webPushSync";
import { sessionStore } from "@/lib/session";
import { logger } from "@/lib/logger";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  checkAuth: () => Promise<boolean>;
  logout: () => void;
  setAuthState: (user: User | null, token: string | null) => void;
}

/**
 * The one source of session truth for React code. Non-React code (services,
 * the API client, the socket) reads `sessionStore`, which this provider writes.
 */
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: null,
  checkAuth: async () => false,
  logout: () => {},
  setAuthState: () => {},
});

/**
 * Reads the signed-in student from context.
 *
 * @returns The auth state and its actions.
 */
export const useAuthContext = () => useContext(AuthContext);

const COOKIE_OPTIONS = {
  maxAge: 30 * 24 * 60 * 60,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

/**
 * The user id left in storage by the session that just ended, for cleanup
 * that runs after the in-memory session is gone.
 *
 * @returns The stored user's id, or `null`.
 */
function storedUserId(): string | null {
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "null") as { userId?: string; id?: string } | null;
    return stored?.userId || stored?.id || null;
  } catch {
    return null;
  }
}

/**
 * Provides the session to the app and keeps `sessionStore` in step with it.
 *
 * @param props - Standard children.
 * @param props.children - The tree that needs the session.
 * @returns The provider element.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const setAuthState = useCallback((newUser: User | null, newToken: string | null) => {
    setUser(newUser);
    setAccessToken(newToken);
    setIsAuthenticated(!!newUser && !!newToken);
    sessionStore.set(newUser, newToken);
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      let token = localStorage.getItem("accessToken");

      // Fallback to cookies if no token in localStorage
      if (!token) {
        token = parseCookies().access_token ?? null;
      }

      const persistValidatedSession = async (nextToken: string) => {
        const introspectResponse = await authService.introspect(nextToken);
        const userData = introspectResponse.user as unknown as User;

        localStorage.setItem("accessToken", nextToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setCookie(null, "access_token", nextToken, COOKIE_OPTIONS);
        setAuthState(userData, nextToken);
      };

      if (token) {
        try {
          await persistValidatedSession(token);
          return true;
        } catch (error) {
          logger.warn("auth", "Stored access token failed introspection", error);
        }
      }

      try {
        const refreshResponse = await authService.refresh();
        await persistValidatedSession(refreshResponse.access_token);
        return true;
      } catch (error) {
        logger.warn("auth", "Session refresh failed", error);
      }

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      destroyCookie(null, "access_token");
      destroyCookie(null, "refresh_token");
      setAuthState(null, null);
      return false;
    } catch (error) {
      logger.error("auth", "Auth check failed", error);
      setAuthState(null, null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setAuthState]);

  const logout = useCallback(() => {
    // Stop this browser receiving the student's pushes. Captures the token
    // first; runs in the background so sign-out is never blocked.
    void unsubscribeBrowserPush(localStorage.getItem("accessToken"), user?.userId || user?.id);

    destroyCookie(null, "access_token");
    destroyCookie(null, "refresh_token");

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("studentDetails");

    setAuthState(null, null);

    // Trigger custom auth event for the WebSocket context
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth-changed", { detail: { type: "logout" } }));
    }

    router.push("/");
  }, [router, setAuthState, user?.id, user?.userId]);

  // Keep the backend's push subscription in step with the browser (heals a
  // lost row, follows a rotated endpoint, clears a revoked permission).
  const syncUserId = user?.userId || user?.id || null;
  useEffect(() => {
    if (!syncUserId) return undefined;
    return startWebPushSync(syncUserId);
  }, [syncUserId]);

  useEffect(() => {
    void checkAuth();

    // Sync auth state across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") void checkAuth();
    };

    const handleTokenRefresh = (event: Event) => {
      const token = (event as CustomEvent<{ accessToken?: string }>).detail?.accessToken;
      if (token) {
        setAccessToken(token);
        sessionStore.setToken(token);
        setIsAuthenticated(!!localStorage.getItem("user"));
      }
    };

    const handleRefreshFailure = () => {
      // Session expired: no token left for the server call, but the browser
      // subscription and this user's flag are still removed so nobody else
      // gets these pushes.
      void unsubscribeBrowserPush(null, storedUserId());
      setAuthState(null, null);
      router.push("/signin");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-token-refreshed", handleTokenRefresh);
    window.addEventListener("auth-refresh-failed", handleRefreshFailure);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-token-refreshed", handleTokenRefresh);
      window.removeEventListener("auth-refresh-failed", handleRefreshFailure);
    };
  }, [router, checkAuth, setAuthState]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, accessToken, checkAuth, logout, setAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
}
