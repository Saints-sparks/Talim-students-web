"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { authService } from "@/services/auth.service";
import { accountService } from "@/services/account.service";
import { useAuthContext } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/apiError";
import { INVALID_CREDENTIALS_TEXT, accessDeniedMessage, isStudentRole } from "@/lib/auth/signIn";
import { logger } from "@/lib/logger";
import { toast } from "@/components/CustomToast";
import { DELETION_CANCELLED_MESSAGE } from "@/lib/auth/accountDeletion";
import type { LoginCredentials, User } from "@/types/auth";

/**
 * Where a student lands after signing in: onboarding until they finish or
 * dismiss it on this browser, then Today.
 *
 * @param userId - The student's user id.
 * @returns The route.
 */
function postLoginRoute(userId: string | undefined): string {
  if (!userId) return "/onboarding";
  try {
    const raw = localStorage.getItem(`student_onboarding_${userId}`);
    const state = raw ? (JSON.parse(raw) as { setupDismissed?: boolean; phase1Completed?: boolean }) : null;
    if (state?.setupDismissed || state?.phase1Completed) return "/dashboard";
  } catch {
    /* fall through to onboarding */
  }
  return "/onboarding";
}

/**
 * Signing in and out of the students portal.
 *
 * `login` refuses any account that is not a student: it introspects the new
 * token before storing anything, and for another role it revokes the session
 * the sign-in just created (`POST /auth/logout`) and throws the Teachers-style
 * "Access denied …" message. A wrong identifier or password throws
 * {@link INVALID_CREDENTIALS_TEXT}. A sign-in that cancelled a scheduled
 * account deletion (`deletionCancelled: true`) says so in a toast.
 *
 * @returns `login`, `logout` and whether a sign-in is running.
 */
export const useAuth = () => {
  const router = useRouter();
  const { setAuthState, logout: contextLogout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Signs a student in and routes them on.
   *
   * @param credentials - Identifier, password, device token and platform.
   * @returns The signed-in student.
   * @throws {Error} The access-denied or wrong-credentials sentence, or the API error.
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<User> => {
      setIsLoading(true);
      try {
        let loginResponse;
        try {
          loginResponse = await authService.login(credentials);
        } catch (error) {
          if (error instanceof ApiError && (error.status === 401 || error.code === "UNAUTHENTICATED")) {
            throw new Error(INVALID_CREDENTIALS_TEXT);
          }
          throw error;
        }

        const introspected = await authService.introspect(loginResponse.access_token);
        const userData = introspected.user as unknown as User;

        if (!isStudentRole(userData?.role)) {
          // Revoke the session the sign-in created; never store it.
          await accountService.logout(loginResponse.access_token).catch((error) => logger.debug("auth", "Revoking a refused sign-in failed", error));
          throw new Error(accessDeniedMessage(userData?.role));
        }

        nookies.set(null, "access_token", loginResponse.access_token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        localStorage.setItem("accessToken", loginResponse.access_token);
        localStorage.setItem("user", JSON.stringify(userData));
        setAuthState(userData, loginResponse.access_token);
        window.dispatchEvent(new CustomEvent("auth-changed", { detail: { type: "login", user: userData } }));
        if (loginResponse.deletionCancelled) toast.success(DELETION_CANCELLED_MESSAGE);

        const userId = userData?.userId || (typeof userData?.id === "string" ? userData.id : undefined);
        router.push(postLoginRoute(userId));
        return userData;
      } finally {
        setIsLoading(false);
      }
    },
    [router, setAuthState]
  );

  return { login, logout: contextLogout, isLoading };
};
