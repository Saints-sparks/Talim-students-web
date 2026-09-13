"use client";

import ChatHeader from "./ChatHeader";
import ChatThread, { ReplyingMessage } from "./ChatThread";
import { useChatContext } from "@/contexts/ChatContext";
import { useRoomMessages } from "@/hooks/useRoomMessages";

interface GroupChatProps {
    roomId: string;
    replyingMessage: ReplyingMessage | null;
    setReplyingMessage: (msg: any) => void;
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
    const { roomName, participants: joinedParticipants } = useRoomMessages(roomId);

    // Live room data: the chat list (chat-rooms-update) first, then what the join returned.
    const room = chatRooms.find((item) => item.roomId === roomId);
    const participants = room?.participants?.length ? room.participants : joinedParticipants;
    const name = room?.displayName || roomName || "Chat Room";

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
                    avatar={room?.avatarInfo.type === 'image' ? room.avatarInfo.value : '/icons/chat.svg'}
                    name={name}
                    participants={participants}
                    currentUserId={currentUserIds[0]}
                    onBack={onBack}
                />
            }
        />
    );
};

export default GroupChat;
