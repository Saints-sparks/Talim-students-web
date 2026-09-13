"use client";

import { useChatContext } from "@/contexts/ChatContext";

export type { RealtimeChatRoom } from "@/types/chat";

/**
 * The app-wide chat list, unread total and room selection. Every caller reads
 * the same store (ChatProvider), so the nav badge, the dashboard and the
 * messages page never disagree or refetch on their own.
 */
export const useRealtimeChat = () => useChatContext();
