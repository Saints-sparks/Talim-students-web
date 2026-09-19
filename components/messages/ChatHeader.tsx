"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, Info } from "lucide-react";
import { generateColorFromString, getUserInitials } from "@/lib/colorUtils";

/** The fields of a participant, as sent by the API or the socket. */
interface ParticipantFields {
    userId?: string;
    _id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    userAvatar?: string | null;
    avatar?: string | null;
    role?: string;
    isOnline?: boolean;
}

/** A participant as received: sometimes a Mongoose document with the fields under `_doc`. */
export type RawParticipant = ParticipantFields & { _doc?: ParticipantFields };

/** A participant normalised for display. */
interface HeaderParticipant {
    id?: string;
    /** Every id this person goes by. */
    ids: string[];
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    avatar?: string | null;
    role?: string;
    isOnline: boolean;
}

/**
 * Normalises the room's participants for the header, handling Mongoose
 * documents (fields under `_doc`) and dropping the current user.
 *
 * @param participants - Participants as received.
 * @param currentUserIds - Every id the signed-in user goes by (user id and profile id), none of whom is listed.
 * @returns The other participants, ready to display.
 */
export function processParticipants(participants: RawParticipant[], currentUserIds: string[] = []): HeaderParticipant[] {
    return participants
        .map((p: RawParticipant): HeaderParticipant => {
            // Handle Mongoose documents - data might be in _doc property
            const participantData = p._doc || p;
            const participantId = participantData.userId || participantData._id || p.userId || p._id;

            return {
                id: participantId,
                ids: [participantData.userId, participantData._id, p.userId, p._id].filter((id): id is string => Boolean(id)),
                firstName: participantData.firstName || p.firstName,
                lastName: participantData.lastName || p.lastName,
                name: participantData.name || p.name,
                email: participantData.email || p.email,
                avatar: participantData.userAvatar || participantData.avatar || p.userAvatar || p.avatar,
                role: participantData.role || p.role,
                isOnline: participantData.isOnline || p.isOnline || false,
            };
        })
        // A person can appear under their user id or their profile id; either one is me.
        .filter((p: HeaderParticipant) => !p.ids.some((id) => currentUserIds.includes(id)));
}

interface ChatHeaderProps {
    avatar: string;
    name: string;
    status?: string;
    subtext?: string; // For group members
    /** Groups only: a direct chat's header already names the other person. */
    participants?: RawParticipant[];
    /** Every id the current user goes by, so they are not listed among the members. */
    currentUserIds?: string[];
    onBack: () => void;
    /** Opens group info (groups) or the other person's profile (direct messages). */
    onOpenInfo?: () => void;
}

export default function ChatHeader({
    avatar,
    name,
    status,
    subtext,
    participants = [],
    currentUserIds = [],
    onBack,
    onOpenInfo,
}: ChatHeaderProps) {
    const participantNames = processParticipants(participants, currentUserIds)
        .map((p) => `${p.firstName || ""} ${p.lastName || ""}`.trim())
        .filter((fullName) => fullName.length > 0);
    const participantsText =
        participantNames.length <= 2
            ? participantNames.join(", ")
            : `${participantNames.slice(0, 2).join(", ")} and ${participantNames.length - 2} others`;

    return (
        <div className="flex w-full items-center rounded-tr-lg bg-white p-4" data-guide="messages-chat-header">
            <div className="flex w-full justify-between items-center gap-3">
                {/* Avatar & Name */}
                <div className="flex items-center gap-3 flex-1">
                    {/* Same breakpoint as the messages page layout switch (md) */}
                    <button type="button" className="block md:hidden" onClick={onBack} aria-label="Back to chats">
                        <ChevronLeft />
                    </button>
                    <Avatar className="w-10 h-10 rounded-full">
                        <AvatarImage src={avatar} />
                        <AvatarFallback
                            className="text-white font-medium text-sm"
                            style={{ backgroundColor: generateColorFromString(name) }}
                        >
                            {getUserInitials(name)}
                        </AvatarFallback>
                    </Avatar>

                    <div
                        className="max-w-lg cursor-pointer min-w-0"
                        onClick={onOpenInfo}
                        role={onOpenInfo ? "button" : undefined}
                        tabIndex={onOpenInfo ? 0 : undefined}
                        onKeyDown={(event) => {
                            if (onOpenInfo && (event.key === "Enter" || event.key === " ")) {
                                event.preventDefault();
                                onOpenInfo();
                            }
                        }}
                    >
                        <p className="font-medium truncate">{name}</p>
                        {status && <p className="text-xs text-gray-500">{status}</p>}
                        {participantsText && (
                            <p className="text-xs text-[#7B7B7B] max-w-[150px] sm:max-w-full truncate ">
                                {participantsText}
                            </p>
                        )}
                        {subtext && !participantsText && (
                            <p className="text-xs text-[#7B7B7B] max-w-[150px] sm:max-w-full truncate ">{subtext}</p>
                        )}
                    </div>
                </div>

                {onOpenInfo && (
                    <button
                        type="button"
                        onClick={onOpenInfo}
                        aria-label="Chat info"
                        className="text-[#878787] hover:text-gray-800"
                    >
                        <Info strokeWidth="1.5px" size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
