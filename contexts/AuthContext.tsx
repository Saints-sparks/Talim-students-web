// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { User } from "@/types/auth";

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
    setUser(
      newUser
        ? {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
            isActive: newUser.isActive,
            isEmailVerified: newUser.isEmailVerified,
          }
        : null
    );

    setAccessToken(newToken);
    setIsAuthenticated(!!newUser && !!newToken);
  };

  const checkAuth = async () => {
    try {
      // Check localStorage first (primary storage for students app)
      const userStr = localStorage.getItem("user");
      let token = localStorage.getItem("accessToken");

      // Fallback to cookies if no token in localStorage
      if (!token) {
        const cookies = parseCookies();
        token = cookies.access_token;
      }

      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr) as User;
          setAuthState(userData, token);
          return true;
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
        }
      }

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

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
