"use client";

import ChatHeader from "./ChatHeader";
import ChatThread, { ReplyingMessage } from "./ChatThread";
import { useChatContext } from "@/contexts/ChatContext";
import { useRoomMessages } from "@/hooks/useRoomMessages";
import { otherParticipant, participantName } from "@/lib/chat";

interface PrivateChatProps {
  roomId: string;
  replyingMessage: ReplyingMessage | null;
  setReplyingMessage: (msg: any) => void;
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

  // Live room data: the chat list (chat-rooms-update) first, then what the join returned.
  const room = chatRooms.find((item) => item.roomId === roomId);
  const participants = room?.participants?.length ? room.participants : joinedParticipants;
  const other = otherParticipant(participants, currentUserIds);

  const name = room?.displayName || (other ? participantName(other) : "Conversation");
  const avatar =
    room?.avatarInfo.type === "image" ? room.avatarInfo.value : other?.userAvatar || "";

  return (
    <ChatThread
      roomId={roomId}
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
        />
      }
    />
  );
}
