"use client";

import { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatThread, { ReplyingMessage } from "./ChatThread";
import GroupInfoModal from "./GroupInfoModal";
import { useChatContext } from "@/contexts/ChatContext";
import type { ReplyTarget } from "@/types/chat";
import { useRoomMessages } from "@/hooks/useRoomMessages";

interface GroupChatProps {
    roomId: string;
    replyingMessage: ReplyingMessage | null;
    setReplyingMessage: (msg: ReplyTarget | null) => void;
    openSubMenu: { index: number; type: string } | null;
    toggleSubMenu: (index: number, type: string) => void;
    onBack: () => void;
}

const GroupChat = ({
    roomId,
    replyingMessage,
    setReplyingMessage,
    openSubMenu,
    toggleSubMenu,
    onBack,
}: GroupChatProps) => {
    const { chatRooms, currentUserIds } = useChatContext();
    const joined = useRoomMessages(roomId);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // Live room data: the chat list (room-updated / participants-changed patch it) first, then what the join returned.
    const room = chatRooms.find((item) => item.roomId === roomId);
    const participants = room?.participants?.length ? room.participants : joined.participants;
    const name = room?.displayName || joined.roomName || "Chat Room";
    const roomType = room?.type || joined.roomType;
    const description = room ? room.description : joined.description;
    const avatarUrl = (room ? room.avatarUrl : joined.avatarUrl) || "";

    return (
        <>
            <ChatThread
                roomId={roomId}
                roomType={roomType}
                participants={participants}
                replyingMessage={replyingMessage}
                setReplyingMessage={setReplyingMessage}
                openSubMenu={openSubMenu}
                toggleSubMenu={toggleSubMenu}
                header={
                    <ChatHeader
                        avatar={avatarUrl}
                        name={name}
                        participants={participants}
                        currentUserId={currentUserIds[0]}
                        onBack={onBack}
                        onOpenInfo={() => setIsInfoOpen(true)}
                    />
                }
            />
            <GroupInfoModal
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                roomId={roomId}
                roomType={roomType}
                name={name}
                description={description}
                avatarUrl={avatarUrl}
                participants={participants}
                messages={joined.messages}
            />
        </>
    );
};

export default GroupChat;
