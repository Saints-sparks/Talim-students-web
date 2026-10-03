"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import type { ReplyingMessage } from "@/components/messages/ChatThread";
import { PageHeader } from "@/components/tl/bits";
import { ScreenLoading } from "@/components/tl/states";
import { cardFrame } from "@/components/tl/styles";
import { useChatContext } from "@/contexts/ChatContext";
import { ThreadList } from "./ThreadList";
import { ThreadPane } from "./ThreadPane";
import { orderThreads } from "./threads";

/** The page's URL; `?room=` names the open thread. */
const MESSAGES_PATH = "/messages";

/**
 * The Messages screen's content. The URL (`?room=`) is the source of truth for
 * the open thread: deep links, toasts and push clicks land here, selecting a
 * room joins it, leaving the page leaves it, and being removed from the open
 * group goes back to the list. Wide screens show the list and the thread side
 * by side; below 980px they show one or the other.
 *
 * @returns The screen.
 */
export function MessagesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room");

  const {
    chatRooms,
    roomStates,
    isLoading,
    error,
    refreshChatRooms,
    selectRoom,
    unselectRoom,
    retryJoin,
    onRoomRemoved,
  } = useChatContext();

  // Reply previews are kept per room so they never follow you into another chat.
  const [replies, setReplies] = useState<Record<string, ReplyingMessage | null>>({});

  useEffect(() => {
    if (roomParam) selectRoom(roomParam);
    else unselectRoom();
  }, [roomParam, selectRoom, unselectRoom]);

  // Leaving the page leaves the room.
  useEffect(() => () => unselectRoom(), [unselectRoom]);

  // Removed from (or left) the open group: back to the list. The store shows the toast.
  const roomParamRef = useRef(roomParam);
  useEffect(() => {
    roomParamRef.current = roomParam;
  }, [roomParam]);
  useEffect(
    () =>
      onRoomRemoved((roomId) => {
        setReplies((prev) => {
          if (!(roomId in prev)) return prev;
          const next = { ...prev };
          delete next[roomId];
          return next;
        });
        if (roomParamRef.current === roomId) router.replace(MESSAGES_PATH, { scroll: false });
      }),
    [onRoomRemoved, router]
  );

  const openRoom = useCallback(
    (roomId: string) => {
      if (roomId === roomParam) {
        // Already open: a click retries a failed load.
        if (roomStates[roomId]?.status === "error") retryJoin(roomId);
        return;
      }
      router.replace(`${MESSAGES_PATH}?room=${encodeURIComponent(roomId)}`, { scroll: false });
    },
    [roomParam, roomStates, retryJoin, router]
  );

  const onBack = useCallback(() => {
    unselectRoom();
    router.replace(MESSAGES_PATH, { scroll: false });
  }, [router, unselectRoom]);

  const threads = useMemo(() => orderThreads(chatRooms), [chatRooms]);
  const activeRoom = useMemo(
    () => (roomParam ? chatRooms.find((room) => room.roomId === roomParam) : undefined),
    [chatRooms, roomParam]
  );

  const replyingMessage = roomParam ? replies[roomParam] ?? null : null;
  const setReplyingMessage = useCallback(
    (message: ReplyingMessage | null) => {
      if (roomParam) setReplies((prev) => ({ ...prev, [roomParam]: message }));
    },
    [roomParam]
  );

  return (
    <div className="flex flex-col gap-3.5">
      <PageHeader title="Messages" subtitle="Your subject groups and class chat." guide="messages-header" />
      <div className="grid grid-cols-1 gap-3.5 min-[980px]:h-[calc(100dvh-210px)] min-[980px]:min-h-[600px] min-[980px]:grid-cols-[minmax(220px,300px)_minmax(0,1fr)]">
        <div className={`${roomParam ? "hidden" : "block"} min-h-0 min-[980px]:block`}>
          <ThreadList
            rooms={threads}
            selectedId={roomParam}
            onSelect={openRoom}
            isLoading={isLoading}
            error={error}
            onRetry={refreshChatRooms}
          />
        </div>
        <div
          className={`${roomParam ? "flex" : "hidden"} h-[calc(100dvh-150px)] min-h-[460px] min-w-0 flex-col min-[980px]:flex min-[980px]:h-full min-[980px]:min-h-0`}
        >
          {roomParam ? (
            <ThreadPane
              key={roomParam}
              roomId={roomParam}
              room={activeRoom}
              onBack={onBack}
              replyingMessage={replyingMessage}
              setReplyingMessage={setReplyingMessage}
            />
          ) : (
            <div className={`${cardFrame} flex h-full flex-col items-center justify-center gap-2 p-8 text-center`}>
              <MessagesSquare className="h-10 w-10 text-tl-faint" aria-hidden />
              <p className="text-base font-bold text-tl-ink">Pick a conversation</p>
              <p className="max-w-[320px] text-sm text-tl-muted">Choose your class group or a subject group to read and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The Messages screen (`/messages`). `useSearchParams` needs a Suspense
 * boundary for the static build.
 *
 * @returns The screen.
 */
export default function MessagesScreen() {
  return (
    <Suspense fallback={<ScreenLoading label="Loading your messages" blocks={2} />}>
      <MessagesView />
    </Suspense>
  );
}
