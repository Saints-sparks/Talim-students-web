// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { User } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { unsubscribeBrowserPush } from "@/lib/webPush";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  checkAuth: () => Promise<boolean>;
  logout: () => void;
  setAuthState: (user: User | null, token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: null,
  checkAuth: async () => false,
  logout: () => {},
  setAuthState: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const setAuthState = (newUser: User | null, newToken: string | null) => {
    setUser(newUser);
    setAccessToken(newToken);
    setIsAuthenticated(!!newUser && !!newToken);
  };

  const checkAuth = async () => {
    try {
      let token = localStorage.getItem("accessToken");

      // Fallback to cookies if no token in localStorage
      if (!token) {
        const cookies = parseCookies();
        token = cookies.access_token;
      }

      const persistValidatedSession = async (nextToken: string) => {
        const introspectResponse = await authService.introspect(nextToken);
        const userData = introspectResponse.user as User;

        localStorage.setItem("accessToken", nextToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setCookie(null, "access_token", nextToken, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        setAuthState(userData, nextToken);
      };

      if (token) {
        try {
          await persistValidatedSession(token);
          return true;
        } catch (error) {
          console.warn("Stored access token validation failed:", error);
        }
      }

      try {
        const refreshResponse = await authService.refresh();
        await persistValidatedSession(refreshResponse.access_token);
        return true;
      } catch (error) {
        console.warn("Session refresh failed:", error);
      }

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      destroyCookie(null, "access_token");
      destroyCookie(null, "refresh_token");
      setAuthState(null, null);
      return false;
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState(null, null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Stop this browser receiving the user's pushes. Captures the token first;
    // runs in the background so sign-out is never blocked.
    void unsubscribeBrowserPush(
      localStorage.getItem("accessToken"),
      user?.userId || user?.id
    );

    // Clear cookies
    destroyCookie(null, "access_token");
    destroyCookie(null, "refresh_token");

    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("studentDetails");

    setAuthState(null, null);

    // Trigger custom auth event for WebSocket context
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("auth-changed", { detail: { type: "logout" } })
      );
    }

    router.push("/");
  };

  useEffect(() => {
    checkAuth();

    // Sync auth state across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkAuth();
      }
    };

    const handleTokenRefresh = (event: Event) => {
      const token = (event as CustomEvent<{ accessToken?: string }>).detail
        ?.accessToken;
      if (token) {
        setAccessToken(token);
        setIsAuthenticated(!!localStorage.getItem("user"));
      }
    };

    const handleRefreshFailure = () => {
      // Session expired: no token left for the server call, but the browser
      // subscription is still removed so nobody else gets these pushes.
      void unsubscribeBrowserPush(null);
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
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        accessToken,
        checkAuth,
        logout,
        setAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
