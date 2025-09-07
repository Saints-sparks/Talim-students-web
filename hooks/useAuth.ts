// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import nookies from "nookies";
import { authService } from "@/services/auth.service";
import { useAuthContext } from "@/contexts/AuthContext";
import { LoginCredentials } from "@/types/auth";

export const useAuth = () => {
  const router = useRouter();
  const { setAuthState, logout: contextLogout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // make em check the token
    const checkToken = async () => {
      const token =
        nookies.get(null).access_token || localStorage.getItem("accessToken");

      // if e no dey make e auto redirect go signin
      if (!token) {
        router.push("/signin");
        return;
      }
      
      // We dey try check the token wey dey here
      // If server say e no active again, we go log the person comot
      // If wahala happen sef (like network or server scatter), we no dey trust am,
      // we still go logout make e no use dead token waka
      try {
        const introspectResponse = await authService.introspect(token);

        if (!introspectResponse.active) {
          handleLogout(); // expired token
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        handleLogout();
      }
    };

    checkToken();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // 1. Perform login to get tokens
      const loginResponse = await authService.login(credentials);

      // 2. Use introspect endpoint to get complete user details
      const introspectResponse = await authService.introspect(
        loginResponse.access_token
      );

      // 3. Structure user data from introspect response
      const userData = {
        id: introspectResponse.user.userId,
        email: introspectResponse.user.email,
        firstName: introspectResponse.user.firstName,
        lastName: introspectResponse.user.lastName,
        phoneNumber: introspectResponse.user.phoneNumber,
        role: introspectResponse.user.role,
        isActive: introspectResponse.user.isActive,
        isEmailVerified: introspectResponse.user.isEmailVerified,
      };

      // 4. Store tokens and user data
      nookies.set(null, "access_token", loginResponse.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Also store in localStorage for consistency
      localStorage.setItem("accessToken", loginResponse.access_token);
      localStorage.setItem("refreshToken", loginResponse.refresh_token || "");
      localStorage.setItem("user", JSON.stringify(userData));
      setAuthState(userData, loginResponse.access_token);

      // Trigger custom auth event for WebSocket context
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth-changed", {
            detail: { type: "login", user: userData },
          })
        );
      }

      toast.success("Login successful!");
      router.push("/dashboard");

      return userData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    contextLogout();
    router.push("/signin");
    nookies.destroy(null, "access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  return {
    login,
    logout: handleLogout,
    isLoading,
  };
};
