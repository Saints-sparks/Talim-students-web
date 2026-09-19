"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatContacts, type ChatContact } from "@/hooks/useChatContacts";
import { generateColorFromString, getUserInitials } from "@/lib/colorUtils";

interface NewMessageModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the teacher's user id; resolves when the chat is open. */
  onPick: (contact: ChatContact) => Promise<void>;
}

/** Picks one of the student's teachers and opens a direct message with them. */
export default function NewMessageModal({ open, onClose, onPick }: NewMessageModalProps) {
  const { contacts, isLoading, error, refetch } = useChatContacts(open);
  const [term, setTerm] = useState("");
  const [startingId, setStartingId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTerm("");
    searchRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const visible = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return contacts;
    return contacts.filter((c) => `${c.firstName} ${c.lastName} ${c.subtitle}`.toLowerCase().includes(needle));
  }, [contacts, term]);

  if (!open) return null;

  const pick = async (contact: ChatContact) => {
    if (startingId) return;
    setStartingId(contact.userId);
    try {
      await onPick(contact);
      onClose();
    } finally {
      setStartingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Message a teacher"
        className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">Message a teacher</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="relative px-4 py-3">
          <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            ref={searchRef}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search your teachers"
            aria-label="Search your teachers"
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="min-h-[10rem] flex-1 overflow-y-auto px-2 pb-3">
          {error ? (
            <div className="px-3 py-6 text-center text-sm text-red-600">
              <p>{error}</p>
              <button type="button" onClick={refetch} className="mt-2 underline">
                Try again
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : visible.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-gray-500">
              {term ? `No teachers match "${term}".` : "Your class doesn't have any teachers assigned yet."}
            </p>
          ) : (
            visible.map((contact) => {
              const name = `${contact.firstName} ${contact.lastName}`.trim();
              return (
                <button
                  key={contact.userId}
                  type="button"
                  disabled={Boolean(startingId)}
                  onClick={() => void pick(contact)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none disabled:opacity-60"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={contact.userAvatar ?? undefined} />
                    <AvatarFallback
                      className="text-xs font-medium text-white"
                      style={{ backgroundColor: generateColorFromString(name) }}
                    >
                      {getUserInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-gray-900">{name}</span>
                    <span className="block truncate text-xs text-gray-500">{contact.subtitle}</span>
                  </span>
                  {startingId === contact.userId && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
