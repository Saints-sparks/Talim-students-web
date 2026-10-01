"use client";

/**
 * Account hooks for the Settings sheets: password policy and change, active
 * sessions, profile photo, and problem reports to Talim support.
 */
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setCookie } from "nookies";
import { accountService } from "@/services/account.service";
import { settingsService } from "@/services/settings.service";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { toScreenQuery } from "@/hooks/learner/queries";
import { APP_VERSION } from "@/lib/appInfo";
import type { SupportArea } from "@/types/learner";
import type { User } from "@/types/auth";

/**
 * §34 the password rules; loaded once a sheet that needs them opens.
 *
 * @param enabled - Whether to load now.
 * @returns The policy's state.
 */
export function usePasswordPolicy(enabled = true) {
  const query = useQuery({
    queryKey: queryKeys.account.passwordPolicy(),
    enabled,
    staleTime: staleTimes.reference,
    queryFn: () => accountService.getPasswordPolicy(),
  });
  return toScreenQuery(query, "We couldn't load the password rules; the usual ones are shown.");
}

/**
 * Changes the password. The API signs every other device out and answers a
 * fresh token for this one, which is adopted at once so the student stays
 * signed in here.
 *
 * @returns The mutation.
 */
export function useChangePassword() {
  const { user, setAuthState } = useAuthContext();
  return useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string; confirmPassword: string }) => settingsService.changePassword(body),
    onSuccess: (result) => {
      if (!result?.access_token) return;
      localStorage.setItem("accessToken", result.access_token);
      setCookie(null, "access_token", result.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      setAuthState(user, result.access_token);
    },
  });
}

/**
 * §34 the student's active sessions, with "sign out" for one or all others.
 *
 * @param enabled - Whether to load now (the sheet is open).
 * @returns The list's state and the two actions.
 */
export function useSessions(enabled = true) {
  const { userId } = useStudentIdentity();
  const queryClient = useQueryClient();
  const key = queryKeys.account.sessions(userId ?? "anonymous");
  const query = useQuery({
    queryKey: key,
    enabled: enabled && Boolean(userId),
    staleTime: 0,
    queryFn: () => accountService.getSessions(),
  });
  const revokeOne = useMutation({
    mutationFn: (sessionId: string) => accountService.revokeSession(sessionId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: key }),
  });
  const revokeOthers = useMutation({
    mutationFn: () => accountService.revokeOtherSessions(),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: key }),
  });
  return { ...toScreenQuery(query, "We couldn't load where you're signed in."), revokeOne, revokeOthers };
}

/**
 * Uploads a new profile photo to Cloudinary, saves it on the account, and
 * updates the signed-in user so the avatar changes everywhere at once.
 *
 * @returns The mutation (takes the picked file).
 */
export function useChangePhoto() {
  const { user, accessToken, setAuthState } = useAuthContext();
  return useMutation({
    mutationFn: async (file: File) => {
      const url = await uploadImageToCloudinary(file);
      await accountService.updateAvatar(url);
      return url;
    },
    onSuccess: (url) => {
      if (!user) return;
      const next: User = { ...user, userAvatar: url };
      try {
        localStorage.setItem("user", JSON.stringify(next));
      } catch {
        /* storage full or blocked: the session still updates */
      }
      setAuthState(next, accessToken);
    },
  });
}

/** Where a problem happened, as the report sheet offers them. */
export const SUPPORT_AREA_OPTIONS: ReadonlyArray<{ value: SupportArea; label: string }> = [
  { value: "results", label: "Results" },
  { value: "attendance", label: "Attendance" },
  { value: "timetable", label: "Timetable" },
  { value: "messages", label: "Messages" },
  { value: "signing_in", label: "Signing in" },
  { value: "other", label: "Something else" },
];

/**
 * §35 sends a problem report to Talim support, with the page it came from,
 * the app version and the browser.
 *
 * @returns `send(area, description)` and the mutation's state.
 */
export function useSupportTicket() {
  const mutation = useMutation({
    mutationFn: ({ area, description }: { area: SupportArea; description: string }) =>
      accountService.createSupportTicket({
        area,
        description: description.trim(),
        context: {
          path: typeof window === "undefined" ? "" : window.location.pathname.slice(0, 300),
          appVersion: APP_VERSION,
          userAgent: typeof navigator === "undefined" ? "" : navigator.userAgent.slice(0, 500),
        },
      }),
  });
  const send = useCallback((area: SupportArea, description: string) => mutation.mutateAsync({ area, description }), [mutation]);
  return { send, ...mutation };
}
