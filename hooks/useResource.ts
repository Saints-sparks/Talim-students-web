"use client";

import { useQuery } from "@tanstack/react-query";
import { ResourceServices, type Resource } from "@/services/resource.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys, staleTimes } from "@/lib/queryKeys";
import { getErrorMessage } from "@/lib/apiError";

export type { Resource };

/**
 * Teaching resources uploaded to the signed-in student's class. The API
 * narrows `classId` to the caller's own class, so a tampered id returns an
 * empty list rather than another class's files.
 *
 * @returns The resources with their loading/error state and a refetch.
 */
export const useResources = () => {
  const { classId, isReady } = useStudentIdentity();

  const query = useQuery({
    queryKey: queryKeys.resources.byClass(classId ?? "unknown"),
    enabled: Boolean(isReady && classId),
    staleTime: staleTimes.reference,
    queryFn: () => ResourceServices.getResourceDetails(classId as string),
  });

  return {
    resources: query.data ?? [],
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.error ? getErrorMessage(query.error, "We couldn't load your resources.") : null,
    refetch: () => {
      void query.refetch();
    },
  };
};
