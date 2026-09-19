"use client";

import { useState } from "react";
import ChatHeader from "./ChatHeader";
import ContactInfoModal from "./ContactInfoModal";
import ChatThread, { ReplyingMessage } from "./ChatThread";
import { useChatContext } from "@/contexts/ChatContext";
import { useRoomMessages } from "@/hooks/useRoomMessages";
import type { ReplyTarget } from "@/types/chat";
import { otherParticipant, participantName } from "@/lib/chat";

interface PrivateChatProps {
  roomId: string;
  replyingMessage: ReplyingMessage | null;
  setReplyingMessage: (msg: ReplyTarget | null) => void;
  openSubMenu: { index: number; type: string } | null;
  toggleSubMenu: (index: number, type: string) => void;
  onBack: () => void;
}

export default function PrivateChat({
  roomId,
  replyingMessage,
  setReplyingMessage,
  openSubMenu,
  toggleSubMenu,
  onBack,
}: PrivateChatProps) {
  const { chatRooms, currentUserIds } = useChatContext();
  const { participants: joinedParticipants } = useRoomMessages(roomId);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Live room data: the chat list (chat-rooms-update) first, then what the join returned.
  const room = chatRooms.find((item) => item.roomId === roomId);
  const participants = room?.participants?.length ? room.participants : joinedParticipants;
  const other = otherParticipant(participants, currentUserIds);

  const name = room?.displayName || (other ? participantName(other) : "Conversation");
  const avatar =
    room?.avatarInfo.type === "image" ? room.avatarInfo.value : other?.userAvatar || "";

  return (
    <>
      <ChatThread
        roomId={roomId}
        roomType="one_to_one"
        participants={participants}
        replyingMessage={replyingMessage}
        setReplyingMessage={setReplyingMessage}
        openSubMenu={openSubMenu}
        toggleSubMenu={toggleSubMenu}
        header={
          <ChatHeader
            avatar={avatar}
            name={name}
            status={other?.isOnline ? "Online" : undefined}
            participants={participants}
            currentUserId={currentUserIds[0]}
            onBack={onBack}
            onOpenInfo={() => setIsInfoOpen(true)}
          />
        }
      />
      <ContactInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        person={other}
        fallbackName={name}
        fallbackAvatar={avatar}
      />
    </>
  );
}
