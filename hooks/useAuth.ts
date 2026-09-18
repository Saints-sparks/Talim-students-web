// hooks/useAuth.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { authService } from "@/services/auth.service";
import { useAuthContext } from "@/contexts/AuthContext";
import { LoginCredentials } from "@/types/auth";

/**
 *
 */
export const useAuth = () => {
  const router = useRouter();
  const { setAuthState, logout: contextLogout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const loginResponse = await authService.login(credentials);
      const introspectResponse = await authService.introspect(
        loginResponse.access_token
      );
      const userData = introspectResponse.user;

      nookies.set(null, "access_token", loginResponse.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      localStorage.setItem("accessToken", loginResponse.access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setAuthState(userData, loginResponse.access_token);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth-changed", {
            detail: { type: "login", user: userData },
          })
        );
      }

      // Check whether this student has already completed onboarding
      const userId = userData?.userId || (typeof userData?.id === "string" ? userData.id : undefined);
      let postLoginRoute = "/onboarding";
      if (userId) {
        try {
          const raw = localStorage.getItem(`student_onboarding_${userId}`);
          const onboardingState = raw ? JSON.parse(raw) : null;
          if (onboardingState?.setupDismissed || onboardingState?.phase1Completed) {
            postLoginRoute = "/dashboard";
          }
        } catch {
          // fall through to /onboarding
        }
      }

      router.push(postLoginRoute);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    contextLogout();
  };

  return {
    login,
    logout,
    isLoading,
  };
};
