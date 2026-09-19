"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Wifi, WifiOff, Loader2, Filter, MessageCircle, MessageSquarePlus, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat, RealtimeChatRoom } from "@/hooks/useChat";
import { generateColorFromString } from "@/lib/colorUtils";
import { ChatRoomFilter, filterRooms } from "@/lib/chat";
import NewMessageModal from "./NewMessageModal";
import { api } from "@/lib/authFetch";
import { API_BASE_URL } from "@/lib/constants";
import { getErrorMessage } from "@/lib/apiError";
import { toast } from "@/components/CustomToast";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import type { ChatContact } from "@/hooks/useChatContacts";
import type { CreateChatRoomBody } from "@/types/apiPayloads";

interface ChatSidebarProps {
  onSelectChat: (room: RealtimeChatRoom) => void;
  /** Opens a room by id (a chat this student just started). */
  onOpenRoomId: (roomId: string) => void;
  className?: string;
}

export default function ChatSidebar({ onSelectChat, onOpenRoomId, className = "" }: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const { userId } = useStudentIdentity();
  const [filterType, setFilterType] = useState<ChatRoomFilter>("all");

  const {
    chatRooms,
    isLoading,
    isConnected,
    error,
    refreshChatRooms,
    selectedRoomId
  } = useChat();

  /** Starts (or reopens) a direct chat with a teacher, then opens it. */
  const startDirectMessage = async (contact: ChatContact) => {
    if (!userId) throw new Error("Not signed in");
    try {
      const body: CreateChatRoomBody = { type: "one_to_one", participants: [userId, contact.userId] };
      const room = await api.post<{ _id: string; reused?: boolean }>(`${API_BASE_URL}/chat/rooms`, body);
      refreshChatRooms();
      toast.success(room.reused ? "Opened your existing chat" : "Chat started");
      onOpenRoomId(room._id);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't start that chat. Please try again."));
      throw err;
    }
  };

  // Search applies within the active filter
  const displayRooms = filterRooms(chatRooms, filterType, searchTerm);

  // Selection (and joining) is driven by the page's ?room= URL
  const handleSelectChat = (room: RealtimeChatRoom) => {
    onSelectChat(room);
  };

  const handleFilterChange = (newFilter: ChatRoomFilter) => {
    setFilterType(newFilter);
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={`w-full h-full border-r bg-white flex flex-col ${className}`}>
      {/* Custom styles for hiding scrollbar */}
      <style jsx>{`
        .chat-list-container {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        .chat-list-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 bg-white">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
          Messages
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
        </h2>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
          <button
            type="button"
            onClick={() => setIsNewMessageOpen(true)}
            aria-label="Message a teacher"
            title="Message a teacher"
            data-guide="messages-new-message"
            className="rounded-full p-2 text-blue-600 hover:bg-blue-50"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <NewMessageModal
        open={isNewMessageOpen}
        onClose={() => setIsNewMessageOpen(false)}
        onPick={startDirectMessage}
      />

      {/* Search Section */}
      <div className="p-3 sm:p-4 space-y-3 bg-white border-b border-gray-50" data-guide="messages-search-filter">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <Input
            className="pl-9 pr-4 py-3 sm:py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 transition-all duration-200 text-sm placeholder:text-gray-500 touch-manipulation"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-gray-600 border-gray-200 hover:bg-gray-50 active:bg-gray-100 capitalize rounded-lg px-3 py-2.5 sm:py-2 text-xs touch-manipulation"
              >
                <Filter size={12} />
                {filterType}
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32">
              <DropdownMenuItem onClick={() => handleFilterChange('all')}>
                All Chats
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('classes')}>
                Classes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('groups')}>
                Groups
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-3 sm:mx-4 mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={refreshChatRooms}
            className="text-xs text-red-700 underline mt-1 hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-white chat-list-container" data-guide="messages-list">
        {/* Connection Status */}
        {!isConnected && (
          <div className="flex items-center justify-center p-6 text-gray-500">
            <div className="text-center">
              <WifiOff className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Connecting to chat...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {isConnected && displayRooms.length === 0 && !isLoading && (
          <div className="flex items-center justify-center p-6 text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">
                {searchTerm || filterType !== 'all' ? 'No chats found' : 'No chats yet'}
              </p>
              {!searchTerm && filterType === 'all' && (
                <p className="text-xs text-gray-400 mt-1">
                  Tap the + button to message a teacher
                </p>
              )}
            </div>
          </div>
        )}

        {/* Chat Items */}
        <div className="px-2 sm:px-3">
          {displayRooms.map((room) => {
            const roomInitials = room.displayName.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
            const roomBgColor = generateColorFromString(room.displayName);
            
            return (
              <div
                key={room.roomId}
                className={`flex items-center gap-3 p-3 mx-1 hover:bg-gray-50 active:bg-gray-100 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedRoomId === room.roomId 
                    ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                    : ''
                } touch-manipulation`}
                onClick={() => handleSelectChat(room)}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {room.avatarInfo.type === 'image' ? (
                    <img 
                      src={room.avatarInfo.value} 
                      alt={room.displayName}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: room.avatarInfo.bgColor || roomBgColor }}
                    >
                      {room.avatarInfo.value || roomInitials}
                    </div>
                  )}
                  
                  {/* Online indicator for private chats */}
                  {room.type === 'one_to_one' && (
                    <span 
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full ${
                        room.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  )}
                  
                  {/* Group indicator */}
                  {room.type !== 'one_to_one' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                      <Users className="w-2 h-2 text-white" />
                    </span>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {room.displayName}
                    </h3>
                    {room.lastMessage?.timestamp && (
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(room.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate pr-2">
                      {room.lastMessage
                        ? room.lastMessage.content ||
                          (room.lastMessage.type === "voice"
                            ? "Voice note"
                            : room.lastMessage.type === "image"
                              ? "Photo"
                              : room.lastMessage.type === "file"
                                ? "File"
                                : "")
                        : "No messages yet"}
                    </p>
                    {room.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-medium text-white bg-blue-600 rounded-full">
                        {room.unreadCount > 99 ? '99+' : room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
