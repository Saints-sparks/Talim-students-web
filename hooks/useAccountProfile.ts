"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { buildProfileRows, getProfileInitials } from "@/lib/accountProfile";

/**
 * What the Account section shows: the student's details as display rows, their
 * initials for the avatar fallback, and the way to the full profile page.
 *
 * @returns The user, the rows, the initials and `openProfile`.
 */
export function useAccountProfile() {
  const { user } = useAuthContext();
  const router = useRouter();

  const rows = useMemo(() => buildProfileRows(user), [user]);
  const initials = getProfileInitials(user);

  return {
    user,
    rows,
    initials,
    /** Opens the full profile page. */
    openProfile: () => router.push("/profile"),
  };
}
