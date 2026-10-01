"use client";

import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/account.service";
import { queryKeys } from "@/lib/queryKeys";
import { toScreenQuery } from "@/hooks/learner/queries";
import type { RoomMediaKind } from "@/types/learner";

/**
 * What was shared in a group, one kind at a time (`GET
 * /chat/rooms/:roomId/media?kind=`). Videos have their own tab (`kind=video`,
 * B10) instead of being filed under documents. Loaded only while the info
 * dialog shows that tab.
 *
 * @param roomId - The room.
 * @param kind - Which tab.
 * @param enabled - Whether the tab is showing.
 * @returns The first page's state.
 */
export function useRoomMedia(roomId: string, kind: RoomMediaKind, enabled: boolean) {
  const query = useQuery({
    queryKey: queryKeys.chat.media(roomId, kind),
    enabled: enabled && Boolean(roomId),
    staleTime: 60_000,
    queryFn: () => accountService.getRoomMedia(roomId, kind),
  });
  return toScreenQuery(query, "We couldn't load what was shared here.");
}
