"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { generateColorFromString, getUserInitials } from "@/lib/colorUtils";
import { participantName, roleLabel } from "@/lib/chat";
import type { ChatParticipant } from "@/types/chat";
import InfoModalShell from "./InfoModalShell";

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  person?: ChatParticipant;
  fallbackName: string;
  fallbackAvatar?: string;
}

/** The other person in a direct message: name, role and online state. */
export default function ContactInfoModal({
  isOpen,
  onClose,
  person,
  fallbackName,
  fallbackAvatar,
}: ContactInfoModalProps) {
  const name = person ? participantName(person, fallbackName) : fallbackName;
  const avatar = person?.userAvatar || fallbackAvatar || "";
  const online = Boolean(person?.isOnline);

  return (
    <InfoModalShell isOpen={isOpen} onClose={onClose} title="Contact info">
      <div className="text-center py-2">
        <div className="relative mx-auto w-20 h-20">
          <Avatar className="w-20 h-20 rounded-full">
            <AvatarImage src={avatar} alt="" />
            <AvatarFallback
              className="text-white font-medium text-xl"
              style={{ backgroundColor: generateColorFromString(name) }}
            >
              {getUserInitials(name)}
            </AvatarFallback>
          </Avatar>
          {online && (
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>
        <h3 className="mt-3 text-lg text-[#030E18] font-medium break-words">{name}</h3>
        <p className="text-sm text-[#7B7B7B]">{person ? roleLabel(person.role) : "Member"}</p>
        <p className={`mt-1 text-xs ${online ? "text-green-600" : "text-[#9B9B9B]"}`}>
          {online ? "Online" : "Offline"}
        </p>
      </div>
    </InfoModalShell>
  );
}
