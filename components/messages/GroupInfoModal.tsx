"use client";
import { useEffect, useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/CustomToast";
import { useChatContext } from "@/contexts/ChatContext";
import { generateColorFromString, getUserInitials } from "@/lib/colorUtils";
import { LEAVABLE_ROOM_TYPES, ROOM_TYPE_LABELS } from "@/lib/chat";
import type { ChatMessage, ChatParticipant, ChatRoomType } from "@/types/chat";
import Classmates from "./Classmates";
import InfoModalShell from "./InfoModalShell";
import SharedMedia from "./SharedMedia";

type InfoTab = "members" | "media";

interface GroupInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
    roomType?: ChatRoomType;
    name: string;
    description: string;
    avatarUrl: string;
    participants: ChatParticipant[];
    /** Loaded messages of the room, for the Media tab. */
    messages: ChatMessage[];
}

/**
 * Group details for students: picture, name, description and members.
 * Students don't manage groups; they may only leave custom and parent groups.
 * Media lists what is in the loaded messages.
 */
export default function GroupInfoModal({
    isOpen,
    onClose,
    roomId,
    roomType,
    name,
    description,
    avatarUrl,
    participants,
    messages,
}: GroupInfoModalProps) {
    const { currentUserIds, leaveGroup } = useChatContext();
    const [confirmLeave, setConfirmLeave] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [tab, setTab] = useState<InfoTab>("members");

    useEffect(() => {
        if (!isOpen) {
            setConfirmLeave(false);
            setTab("members");
        }
    }, [isOpen]);

    const canLeave = Boolean(roomType && LEAVABLE_ROOM_TYPES.includes(roomType));

    const handleLeave = async () => {
        setLeaving(true);
        const result = await leaveGroup(roomId);
        setLeaving(false);
        if (result.ok) {
            onClose();
        } else {
            toast.error(result.message || "Couldn't leave the group. Please try again.");
        }
    };

    const footer = canLeave ? (
        confirmLeave ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#545454]">Leave {name}? You'll stop getting its messages.</p>
                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        className="rounded-lg border border-[#F0F0F0] px-3 py-1.5 text-sm text-[#545454] hover:bg-gray-50"
                        onClick={() => setConfirmLeave(false)}
                        disabled={leaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-70"
                        onClick={handleLeave}
                        disabled={leaving}
                    >
                        {leaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Leave
                    </button>
                </div>
            </div>
        ) : (
            <button
                type="button"
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                onClick={() => setConfirmLeave(true)}
            >
                <LogOut size={16} />
                Leave group
            </button>
        )
    ) : undefined;

    return (
        <InfoModalShell
            isOpen={isOpen}
            onClose={onClose}
            title="Group info"
            footer={footer}
            guide="messages-group-info-modal"
        >
            <div className="text-center">
                <Avatar className="w-16 h-16 rounded-full mx-auto">
                    <AvatarImage src={avatarUrl} alt="" />
                    <AvatarFallback
                        className="text-white font-medium text-lg"
                        style={{ backgroundColor: generateColorFromString(name) }}
                    >
                        {getUserInitials(name)}
                    </AvatarFallback>
                </Avatar>
                <h3 className="mt-3 text-lg text-[#030E18] font-medium break-words">{name}</h3>
                <p className="text-sm text-[#7B7B7B]">
                    {roomType ? ROOM_TYPE_LABELS[roomType] : "Group"} · {participants.length}{" "}
                    {participants.length === 1 ? "member" : "members"}
                </p>
            </div>

            {description ? (
                <p className="mt-4 text-sm p-3 border border-[#F0F0F0] rounded-lg text-[#545454] whitespace-pre-line break-words">
                    {description}
                </p>
            ) : (
                <p className="mt-4 text-sm text-center text-[#9B9B9B] italic">No description</p>
            )}

            <div role="tablist" aria-label="Group info" className="mt-5 mb-3 flex gap-1 border-b border-[#F0F0F0]">
                {([
                    ["members", `Members (${participants.length})`],
                    ["media", "Media"],
                ] as const).map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={tab === value}
                        onClick={() => setTab(value)}
                        className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${
                            tab === value
                                ? "border-blue-500 font-medium text-[#030E18]"
                                : "border-transparent text-[#7B7B7B] hover:text-[#030E18]"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {tab === "members" ? (
                <Classmates participants={participants} currentUserIds={currentUserIds} />
            ) : (
                <SharedMedia messages={messages} />
            )}
        </InfoModalShell>
    );
}
