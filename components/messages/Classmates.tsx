"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { generateColorFromString, getUserInitials } from "@/lib/colorUtils";
import { participantId, participantName, roleLabel } from "@/lib/chat";
import type { ChatParticipant } from "@/types/chat";

interface ClassmatesProps {
  participants: ChatParticipant[];
  currentUserIds: string[];
}

// Staff first, then everyone else; alphabetical within each.
const ROLE_ORDER: Record<string, number> = {
  teacher: 0,
  school_admin: 1,
  school_sub_admin: 1,
  admin: 1,
};

/** Group members with role and online state, and a search over name and role. */
const Classmates = ({ participants, currentUserIds }: ClassmatesProps) => {
  const [query, setQuery] = useState("");

  const members = useMemo(
    () =>
      participants
        .map((p) => {
          const id = participantId(p);
          const isMe = [id, p.userId].filter(Boolean).some((value) => currentUserIds.includes(String(value)));
          return {
            id,
            name: participantName(p),
            role: roleLabel(p.role),
            rank: ROLE_ORDER[p.role || ""] ?? 2,
            avatar: p.userAvatar || "",
            isOnline: Boolean(p.isOnline),
            isMe,
          };
        })
        .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name)),
    [participants, currentUserIds]
  );

  const term = query.trim().toLowerCase();
  const visible = term
    ? members.filter(
        (member) =>
          member.name.toLowerCase().includes(term) || member.role.toLowerCase().includes(term)
      )
    : members;

  return (
    <div>
      <div className="flex items-center border px-2 py-1 rounded-lg text-[#878787]">
        <Search strokeWidth="1px" size={20} />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search members"
          aria-label="Search members"
          className="w-full bg-transparent p-2 text-sm text-[#030E18] focus:outline-none"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
            <X className="text-gray-500 ml-2" size={16} />
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-col">
        {visible.length === 0 && (
          <p className="py-6 text-center text-sm text-[#7B7B7B]">
            {term ? "No members match your search." : "No members yet."}
          </p>
        )}
        {visible.map((member) => (
          <div key={member.id || member.name} className="flex items-center gap-3 px-1 py-2.5">
            <div className="relative">
              <Avatar className="w-10 h-10 rounded-full">
                <AvatarImage src={member.avatar} />
                <AvatarFallback
                  className="text-white font-medium text-sm"
                  style={{ backgroundColor: generateColorFromString(member.name) }}
                >
                  {getUserInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              {member.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-[#030E18]">
                {member.name}
                {member.isMe && <span className="text-[#7B7B7B]"> (You)</span>}
              </p>
              <p className="text-xs text-[#7B7B7B]">
                {member.role}
                {member.isOnline ? " · Online" : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classmates;
