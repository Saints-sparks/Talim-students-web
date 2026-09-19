"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    ChevronLeft,
    ChevronRight,
    Phone,
    Search,
    Video,
    X,
    Info,
} from "lucide-react";
import { useState } from "react";
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
 * @param currentUserId - The signed-in user, who is not listed.
 * @returns The other participants, ready to display.
 */
function processParticipants(participants: RawParticipant[], currentUserId?: string): HeaderParticipant[] {
    return participants
        .map((p: RawParticipant): HeaderParticipant => {
            // Handle Mongoose documents - data might be in _doc property
            const participantData = p._doc || p;
            const participantId = participantData.userId || participantData._id || p.userId || p._id;

            return {
                id: participantId,
                firstName: participantData.firstName || p.firstName,
                lastName: participantData.lastName || p.lastName,
                name: participantData.name || p.name,
                email: participantData.email || p.email,
                avatar: participantData.userAvatar || participantData.avatar || p.userAvatar || p.avatar,
                role: participantData.role || p.role,
                isOnline: participantData.isOnline || p.isOnline || false,
            };
        })
        .filter((p: HeaderParticipant) => p.id !== currentUserId); // Filter out current user
}

interface ChatHeaderProps {
    avatar: string;
    name: string;
    status?: string;
    subtext?: string; // For group members
    participants?: RawParticipant[]; // Real participants data
    currentUserId?: string; // Current user ID to filter out
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
    currentUserId,
    onBack,
    onOpenInfo,
}: ChatHeaderProps) {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Process participants to get clean data
    const processedParticipants = processParticipants(participants, currentUserId);

    // Generate participants text like Teachers app
    const getParticipantsText = () => {
        if (!participants || participants.length === 0) return "";

        const participantNames = processedParticipants
            .map(p => `${p.firstName || ''} ${p.lastName || ''}`.trim())
            .filter(name => name.length > 0);

        const participantCount = participantNames.length;

        if (participantCount <= 2) {
            return participantNames.join(", ");
        } else {
            return `${participantNames.slice(0, 2).join(", ")} and ${participantCount - 2} others`;
        }
    };

    const participantsText = getParticipantsText();

    return (
        <div className="flex w-full items-center rounded-tr-lg bg-white p-4" data-guide="messages-chat-header">
            <div className="flex w-full justify-between items-center gap-3">
                {/* Avatar & Name / Search Bar */}
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
                        {!isSearching && status && (
                            <p className="text-xs text-gray-500">{status}</p>
                        )}
                        {!isSearching && participantsText && (
                            <p className="text-xs text-[#7B7B7B] max-w-[150px] sm:max-w-full truncate ">
                                {participantsText}
                            </p>
                        )}
                        {!isSearching && subtext && !participantsText && (
                            <p className="text-xs text-[#7B7B7B] max-w-[150px] sm:max-w-full truncate ">
                                {subtext}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-4 text-[#878787]">
                    {onOpenInfo && (
                        <button
                            type="button"
                            onClick={onOpenInfo}
                            aria-label="Chat info"
                            className="hover:text-gray-800"
                        >
                            <Info strokeWidth="1.5px" size={20} />
                        </button>
                    )}
                    <Phone
                        className="cursor-pointer hover:text-gray-800"
                        strokeWidth="1.5px"
                        size={20}
                    />
                    <Video
                        className="cursor-pointer hover:text-gray-800"
                        strokeWidth="1.5px"
                        size={20}
                    />

                    {isSearching ? (
                        <>
                            <div className="relative flex text-[#878787] items-center border px-2 py-1 rounded-md w-44">
                                <Search strokeWidth="1px" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search"
                                    className="w-full bg-transparent pl-2 text-sm focus:outline-none"
                                />
                                <X
                                    className=" cursor-pointer ml-2"
                                    size={16}
                                    onClick={() => {
                                        setIsSearching(false);
                                        setSearchQuery(""); // Clear search when closing
                                    }}
                                />
                            </div>
                            <div className="flex">
                                <ChevronLeft strokeWidth="1px" />
                                <ChevronRight strokeWidth="1px" />
                            </div>
                        </>
                    ) : (
                        <Search
                            className="cursor-pointer hover:text-gray-800"
                            strokeWidth="1.5px"
                            size={20}
                            onClick={() => setIsSearching(true)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
