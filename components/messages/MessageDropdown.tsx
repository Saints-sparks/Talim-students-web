"use client";
import React, { useEffect, useRef } from "react";
import { ChevronDown, CirclePlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ReplyTarget } from "@/types/chat";
import { Button } from "@/components/ui/button";

interface MessageOptionsDropdownProps {
  index: number;
  msg: ReplyTarget;
  openSubMenu: { index: number; type: string } | null;
  toggleSubMenu: (index: number, type: string) => void;
  setReplyingMessage: (msg: ReplyTarget | null) => void;
}

export default function MessageOptionsDropdown({
  index,
  msg,
  openSubMenu,
  toggleSubMenu,
  setReplyingMessage,
}: MessageOptionsDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDropdownOpen = openSubMenu && openSubMenu.index === index;

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // If the submenu is open, close it by toggling to an empty state.
        if (isDropdownOpen) {
          toggleSubMenu(index, ""); // Passing empty string to clear submenu.
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef, isDropdownOpen, index, toggleSubMenu]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="absolute z-50 -top-1 right-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="px-4 w-6 h-6 bg-white border border-[#F0F0F0] shadow-none rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronDown className="text-[#878787]" size={16} />
            </Button>
          </DropdownMenuTrigger>
          {!isDropdownOpen && (
            <DropdownMenuContent
              className="border-[#F0F0F0] font-manrope shadow-none"
              align="end"
            >
              <DropdownMenuItem
                onClick={() => setReplyingMessage(msg)}
                className="text-[#131616]"
              >
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#131616]">
                Reply privately
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleSubMenu(index, "emojis")}
                className="text-[#131616]"
              >
                Emojis
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#131616]">
                Download
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#131616]">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
      {/* Submenu for Emojis */}
      {openSubMenu &&
        openSubMenu.index === index &&
        openSubMenu.type === "emojis" && (
          <div
            className="absolute right-0 bg-white border border-[#F0F0F0] rounded shadow-lg p-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-2">
              <button onClick={() => toggleSubMenu(index, "emojis")}>
                💯
              </button>
              <button onClick={() => toggleSubMenu(index, "emojis")}>
                👍🏻
              </button>
              <button onClick={() => toggleSubMenu(index, "emojis")}>
                ✋🏻
              </button>
              <button onClick={() => toggleSubMenu(index, "emojis")}>
                ☺️
              </button>
              <button onClick={() => toggleSubMenu(index, "emojis")}>
                <CirclePlus className="text-[#878787]" size={20} />
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
