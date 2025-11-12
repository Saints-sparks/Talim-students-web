"use client";
import { useState } from "react";
import Layout from "@/components/Layout";
import ChatSidebar from "@/components/messages/ChatSidebar";
import PrivateChat from "@/components/messages/PrivateChat";
import GroupChat from "@/components/messages/GroupChat";
import { RealtimeChatRoom } from "@/hooks/useChat";

export default function ChatUI() {
  const [selectedChat, setSelectedChat] = useState<{
    type: "private" | "group";
    room?: RealtimeChatRoom;
  } | null>(null);
  const [replyingMessage, setReplyingMessage] = useState<{
    sender: string;
    text: string;
  } | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<{
    index: number;
    type: string;
  } | null>(null);

  const [showSidebar, setShowSidebar] = useState(true);

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

  const onBack = () => {
    setSelectedChat(null);
    setShowSidebar(true);
  };

  return (
    <Layout>
      <div className="flex flex-1 h-[100vh] sm:h-[calc(100vh-85px)] overflow-hidden gap-1 px-5 pt-8 relative">
        <div className="flex flex-1 gap-1 border border-[#F0F0F0] ">
          {/* Sidebar - Show only when showSidebar is true on mobile */}
          <div
            className={`${showSidebar ? "block" : "hidden"
              } md:block w-full md:w-auto  scrollbar-hide`}
          >
            <ChatSidebar
              onSelectChat={(chat) => {
                setSelectedChat(chat);
                setShowSidebar(false); // Hide sidebar when chat is selected
              }}
            />
          </div>
          {/* Chat Window - Show only when showSidebar is false on mobile */}
          <div
            className={`${showSidebar ? "hidden" : "block"} md:flex flex-1 `}
          >
            {selectedChat && (
              <>
                {selectedChat.type === "group" ? (
                  <GroupChat
                    replyingMessage={replyingMessage}
                    setReplyingMessage={setReplyingMessage}
                    openSubMenu={openSubMenu}
                    toggleSubMenu={toggleSubMenu}
                    onBack={onBack}
                    room={selectedChat.room}
                  />
                ) : (
                  <PrivateChat
                    replyingMessage={replyingMessage}
                    setReplyingMessage={setReplyingMessage}
                    openSubMenu={openSubMenu}
                    toggleSubMenu={toggleSubMenu}
                    onBack={onBack}
                    room={selectedChat.room}
                  />
                )}
              </>
            )}

            {/* Empty state when no chat is selected on desktop */}
            {!selectedChat && (
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
