"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService, type ChatPreferences } from "@/services/settings.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { messageForError } from "@/lib/errorMessages";
import { logger } from "@/lib/logger";

const DEFAULTS: Required<ChatPreferences> = {
  messageNotifications: true,
  allowTeacherMessages: true,
  schoolAnnouncements: true,
  readReceipts: true,
};

/**
 * The signed-in student's messaging switches, with optimistic saves.
 *
 * @returns The preferences, the field currently saving, and a `set` function.
 */
export function useChatPreferences() {
  const { userId } = useStudentIdentity();
  const queryClient = useQueryClient();
  const queryKey = ["chat", userId ?? "anonymous", "preferences"] as const;

  const query = useQuery({
    queryKey,
    enabled: Boolean(userId),
    staleTime: 5 * 60_000,
    queryFn: () => settingsService.getChatPreferences(),
  });

  const mutation = useMutation({
    mutationFn: (patch: ChatPreferences) => settingsService.updateChatPreferences(patch),
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ChatPreferences>(queryKey);
      queryClient.setQueryData<ChatPreferences>(queryKey, { ...previous, ...patch });
      return { previous };
    },
    onError: (error, _patch, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      logger.error("settings", "Saving a chat preference failed", error);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<ChatPreferences>(queryKey, (current) => ({ ...current, ...updated }));
    },
  });

  return {
    preferences: { ...DEFAULTS, ...(query.data ?? {}) },
    isLoading: query.isPending && query.fetchStatus !== "idle",
    loadError: query.error ? "Could not load your messaging settings. Defaults are shown." : null,
    saveError: mutation.error ? messageForError(mutation.error, "Couldn't save that. Please try again.") : null,
    savingField: (mutation.isPending ? Object.keys(mutation.variables ?? {})[0] : null) as keyof ChatPreferences | null,
    /**
     * Saves one switch.
     *
     * @param field - Which preference changed.
     * @param value - Its new value.
     */
    set: <K extends keyof ChatPreferences>(field: K, value: ChatPreferences[K]) => {
      mutation.mutate({ [field]: value } as ChatPreferences);
    },
  };
}
