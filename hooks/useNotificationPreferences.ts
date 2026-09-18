"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService, type NotificationPreferences } from "@/services/notification.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys } from "@/lib/queryKeys";
import { messageForError } from "@/lib/errorMessages";
import { logger } from "@/lib/logger";

/** What the API defaults every switch to, so the UI starts in the right place. */
export const NOTIFICATION_PREFERENCE_DEFAULTS: Required<
  Pick<
    NotificationPreferences,
    | "announcementsEnabled"
    | "attendanceEnabled"
    | "resultsEnabled"
    | "timetableEnabled"
    | "resourcesEnabled"
    | "messagesEnabled"
    | "emailEnabled"
    | "pushEnabled"
    | "quietHoursEnabled"
    | "quietHoursStart"
    | "quietHoursEnd"
  >
> = {
  announcementsEnabled: true,
  attendanceEnabled: true,
  resultsEnabled: true,
  timetableEnabled: true,
  resourcesEnabled: true,
  messagesEnabled: true,
  emailEnabled: true,
  pushEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
};

/**
 * The signed-in student's notification switches, with optimistic saves.
 *
 * Each toggle PATCHes only the field that changed — the API whitelists its
 * DTO, so sending the whole document would be a 400. A failed save rolls the
 * switch back and surfaces a message keyed on `error.code`.
 *
 * @returns The preferences, per-field saving flags, and a `set` function.
 */
export function useNotificationPreferences() {
  const { userId } = useStudentIdentity();
  const queryClient = useQueryClient();
  const queryKey = queryKeys.notifications.preferences(userId ?? "anonymous");

  const query = useQuery({
    queryKey,
    enabled: Boolean(userId),
    staleTime: 5 * 60_000,
    queryFn: () => notificationService.getPreferences(),
  });

  const mutation = useMutation({
    mutationFn: (patch: NotificationPreferences) => notificationService.updatePreferences(patch),
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<NotificationPreferences>(queryKey);
      queryClient.setQueryData<NotificationPreferences>(queryKey, { ...previous, ...patch });
      return { previous };
    },
    onError: (error, _patch, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      logger.error("settings", "Saving a notification preference failed", error);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<NotificationPreferences>(queryKey, (current) => ({ ...current, ...updated }));
    },
  });

  const preferences: NotificationPreferences = { ...NOTIFICATION_PREFERENCE_DEFAULTS, ...(query.data ?? {}) };
  const savingField = (mutation.isPending ? Object.keys(mutation.variables ?? {})[0] : null) as
    | keyof NotificationPreferences
    | null;

  return {
    preferences,
    isLoading: query.isPending && query.fetchStatus !== "idle",
    /** Set while the read failed — the defaults are shown but saves still work. */
    loadError: query.error
      ? "Could not load your preferences. Defaults are shown — your changes will still be saved."
      : null,
    saveError: mutation.error ? messageForError(mutation.error, "Couldn't save that. Please try again.") : null,
    savingField,
    /**
     * Saves one switch.
     *
     * @param field - Which preference changed.
     * @param value - Its new value.
     */
    set: <K extends keyof NotificationPreferences>(field: K, value: NotificationPreferences[K]) => {
      mutation.mutate({ [field]: value } as NotificationPreferences);
    },
  };
}
