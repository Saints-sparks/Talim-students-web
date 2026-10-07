"use client";

/**
 * Account hooks for the Settings sheets: password policy and change, active
 * sessions and profile photo. Support tickets live in `hooks/support/useTickets.ts`.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setCookie } from "nookies";
import { accountService } from "@/services/account.service";
import { settingsService } from "@/services/settings.service";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { toScreenQuery } from "@/hooks/learner/queries";
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
