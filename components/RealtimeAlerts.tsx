"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/components/CustomToast";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { useChatContext } from "@/contexts/ChatContext";
import { NOTIFICATION_EVENT } from "@/hooks/useNotifications";
import { isGroupRoomType, isSameUser } from "@/lib/chat";
import type { ChatRoomActivity } from "@/types/chat";

const TITLE_PREFIX = /^\(\d+\+?\) /;
// A busy group shouldn't bury the screen: one chat toast per room per window.
const CHAT_TOAST_COOLDOWN = 5000;

/** A realtime `notification` socket event, exactly as the server emits it. */
interface RealtimeNotificationEvent {
  type?: string;
  title?: string;
  body?: string;
  message?: string;
  metadata?: { url?: string };
  data?: { url?: string };
}

/** Only same-origin paths are routed (URLs come from push payloads). */
const toAppPath = (url: unknown): string | null => {
  if (typeof url !== "string" || !url) return null;
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin !== window.location.origin) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
};

/**
 * App-level realtime alerts, mounted once in the root layout:
 * - a toast for chat activity in rooms that aren't open (click opens the room)
 * - a toast for in-app notifications (chat pushes are excluded)
 * - "(N) " unread prefix in the tab title
 * - routing for notification clicks posted by the service worker
 */
export default function RealtimeAlerts() {
  const router = useRouter();
  const pathname = usePathname();
  const { socket } = useWebSocketContext();
  const { chatRooms, selectedRoomId, currentUserIds, totalUnread } = useChatContext();

  const lastChatToastRef = useRef(new Map<string, number>());
  const stateRef = useRef({ pathname, chatRooms, selectedRoomId, currentUserIds });
  stateRef.current = { pathname, chatRooms, selectedRoomId, currentUserIds };

  // Chat activity and in-app notifications
  useEffect(() => {
    if (!socket) return;

    const onChatRoomActivity = ({ roomId, lastMessage }: ChatRoomActivity) => {
      if (!roomId || !lastMessage) return;
      const state = stateRef.current;
      if (isSameUser(lastMessage.senderId, state.currentUserIds)) return;
      if (state.pathname === "/messages" && state.selectedRoomId === roomId) return;

      const now = Date.now();
      if (now - (lastChatToastRef.current.get(roomId) || 0) < CHAT_TOAST_COOLDOWN) return;
      lastChatToastRef.current.set(roomId, now);

      const room = state.chatRooms.find((item) => item.roomId === roomId);
      const sender = lastMessage.senderName || "New message";
      toast.info(`${sender}: ${lastMessage.preview || "New message"}`, {
        title: room && isGroupRoomType(room.type) ? room.displayName : undefined,
        onClick: () => router.push(`/messages?room=${encodeURIComponent(roomId)}`),
      });
    };

    const onNotification = (notification: RealtimeNotificationEvent) => {
      window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT, { detail: notification }));
      // Chat alerts come from chat-room-activity.
      if (notification?.type === "chat_message") return;

      const body = notification?.body || notification?.message || "";
      const path = toAppPath(notification?.metadata?.url || notification?.data?.url);
      toast.info(body || notification?.title || "New notification", {
        title: body ? notification?.title : undefined,
        onClick: () => router.push(path || "/notifications"),
      });
    };

    socket.on("chat-room-activity", onChatRoomActivity);
    socket.on("notification", onNotification);
    return () => {
      socket.off("chat-room-activity", onChatRoomActivity);
      socket.off("notification", onNotification);
    };
  }, [socket, router]);

  // "(N) " prefix on the tab title. Pages set their own titles, so re-apply on change.
  useEffect(() => {
    const apply = () => {
      const base = document.title.replace(TITLE_PREFIX, "");
      const next =
        totalUnread > 0 ? `(${totalUnread > 99 ? "99+" : totalUnread}) ${base}` : base;
      if (document.title !== next) document.title = next;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [totalUnread]);

  // Notification clicks from the service worker (tab already open).
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const onMessage = (event: MessageEvent) => {
      const type = event.data?.type;
      if (type !== "OPEN_URL" && type !== "NOTIFICATION_CLICK") return;
      const path = toAppPath(event.data?.url);
      if (path) router.push(path);
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, [router]);

  return null;
}
