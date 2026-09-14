"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import ChatSidebar from "@/components/messages/ChatSidebar";
import PrivateChat from "@/components/messages/PrivateChat";
import GroupChat from "@/components/messages/GroupChat";
import type { ReplyingMessage } from "@/components/messages/ChatThread";
import { useChatContext } from "@/contexts/ChatContext";

function ChatUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room");

  const { chatRooms, roomStates, selectRoom, unselectRoom, retryJoin, onRoomRemoved } =
    useChatContext();

  // Reply previews are kept per room so they never follow you into another chat.
  const [replies, setReplies] = useState<Record<string, ReplyingMessage | null>>({});
  const [openSubMenu, setOpenSubMenu] = useState<{
    index: number;
    type: string;
  } | null>(null);

  // `/messages?room=<id>` is the source of truth for the open chat: deep links,
  // toast clicks and push clicks all land here. Selecting joins the room.
  useEffect(() => {
    if (roomParam) selectRoom(roomParam);
    else unselectRoom();
  }, [roomParam, selectRoom, unselectRoom]);

  // Leaving the messages page leaves the room.
  useEffect(() => () => unselectRoom(), [unselectRoom]);

  // Removed from (or left) the open group: back to the list. The toast comes from the store.
  const roomParamRef = useRef(roomParam);
  roomParamRef.current = roomParam;
  useEffect(
    () =>
      onRoomRemoved((roomId) => {
        setReplies((prev) => {
          if (!(roomId in prev)) return prev;
          const { [roomId]: _dropped, ...rest } = prev;
          return rest;
        });
        if (roomParamRef.current === roomId) router.replace("/messages", { scroll: false });
      }),
    [onRoomRemoved, router]
  );

  const toggleSubMenu = (index: number, type: string) => {
    if (
      openSubMenu &&
      openSubMenu.index === index &&
      openSubMenu.type === type
    ) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu({ index, type });
    }
  };

  const openRoom = useCallback(
    (roomId: string) => {
      if (roomId === roomParam) {
        // Already open: a click retries a failed load.
        if (roomStates[roomId]?.status === "error") retryJoin(roomId);
        return;
      }
      router.replace(`/messages?room=${encodeURIComponent(roomId)}`, { scroll: false });
    },
    [roomParam, roomStates, retryJoin, router]
  );

  const onBack = () => {
    unselectRoom();
    router.replace("/messages", { scroll: false });
  };

  // The URL decides what is shown; the effect above joins it.
  const activeRoomId = roomParam;
  const showSidebar = !activeRoomId;
  const listRoom = chatRooms.find((room) => room.roomId === activeRoomId);
  const roomType = listRoom?.type || (activeRoomId ? roomStates[activeRoomId]?.roomType : undefined);
  const replyingMessage = activeRoomId ? replies[activeRoomId] ?? null : null;
  const setReplyingMessage = (msg: ReplyingMessage | null) => {
    if (activeRoomId) setReplies((prev) => ({ ...prev, [activeRoomId]: msg }));
  };

  return (
    <Layout>
      <div className="flex flex-1 h-[100svh] sm:h-[calc(100svh-85px)] overflow-hidden gap-1 px-2 sm:px-5 pt-4 sm:pt-8 relative" data-guide="messages-shell">
        <div className="flex flex-1 gap-1 border border-[#F0F0F0] ">
          {/* Sidebar - Show only when no chat is open on mobile */}
          <div
            className={`${
              showSidebar ? "block" : "hidden"
            } md:block w-full md:w-auto  scrollbar-hide`}
          >
            <ChatSidebar onSelectChat={(room) => openRoom(room.roomId)} />
          </div>
          {/* Chat Window - Show only when a chat is open on mobile */}
          <div
            className={`${showSidebar ? "hidden" : "block"} md:flex flex-1 `}
          >
            {activeRoomId && (
              <>
                {roomType === "one_to_one" ? (
                  <PrivateChat
                    key={activeRoomId}
                    roomId={activeRoomId}
                    replyingMessage={replyingMessage}
                    setReplyingMessage={setReplyingMessage}
                    openSubMenu={openSubMenu}
                    toggleSubMenu={toggleSubMenu}
                    onBack={onBack}
                  />
                ) : (
                  <GroupChat
                    key={activeRoomId}
                    roomId={activeRoomId}
                    replyingMessage={replyingMessage}
                    setReplyingMessage={setReplyingMessage}
                    openSubMenu={openSubMenu}
                    toggleSubMenu={toggleSubMenu}
                    onBack={onBack}
                  />
                )}
              </>
            )}

            {/* Empty state when no chat is selected on desktop */}
            {!activeRoomId && (
              <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No chat selected
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Select a conversation from the sidebar to start messaging.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function MessagesPage() {
  // useSearchParams needs a Suspense boundary for the static build.
  return (
    <Suspense fallback={null}>
      <ChatUI />
    </Suspense>
  );
}
