"use client";

import { useQuery } from "@tanstack/react-query";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { api } from "@/lib/authFetch";
import { API_BASE_URL } from "@/lib/constants";
import { getErrorMessage } from "@/lib/apiError";
import { queryKeys, staleTimes } from "@/lib/queryKeys";

/** Someone the student may start a direct message with (`GET /chat/contacts`). */
export interface ChatContact {
  /** A user id: what a chat room's participants are. */
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  userAvatar: string | null;
  /** "Class teacher · Mathematics" */
  subtitle: string;
}

/**
 * The teachers of the student's class, from the server (which knows the
 * difference between a teacher's user id and their profile id).
 *
 * @param enabled - Only fetch while the picker is open.
 * @returns The contacts and the query state.
 */
export function useChatContacts(enabled: boolean) {
  const { userId: identity } = useStudentIdentity();
  const userId = identity ?? "unknown";

  const query = useQuery({
    queryKey: queryKeys.chat.contacts(userId),
    enabled: enabled && userId !== "unknown",
    staleTime: staleTimes.reference,
    queryFn: () => api.get<ChatContact[]>(`${API_BASE_URL}/chat/contacts`),
  });

  return {
    contacts: query.data ?? [],
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.error ? getErrorMessage(query.error, "We couldn't load your teachers.") : null,
    refetch: () => void query.refetch(),
  };
}
