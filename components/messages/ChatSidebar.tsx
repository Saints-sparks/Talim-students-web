"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Search, ChevronDown, CheckCheck, Wifi, WifiOff, Loader2, Filter, MessageCircle, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat, RealtimeChatRoom } from "@/hooks/useChat";
import { generateColorFromString } from "@/lib/colorUtils";

interface ChatSidebarProps {
  onSelectChat: (chat: { type: "private" | "group"; room?: RealtimeChatRoom }) => void;
  className?: string;
}

export default function ChatSidebar({ onSelectChat, className = "" }: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "classes" | "groups">("all");

  const {
    chatRooms,
    isLoading,
    isConnected,
    error,
    refreshChatRooms,
    searchChatRooms,
    getFilteredChatRooms,
    selectRoom,
    selectedRoomId
  } = useChat();
  // expose markRoomAsRead if the hook provides it
  const { markRoomAsRead } = useChat();

  // Get filtered and searched rooms
  const getDisplayRooms = (): RealtimeChatRoom[] => {
    let rooms = getFilteredChatRooms(filterType);

    if (searchTerm.trim()) {
      rooms = searchChatRooms(searchTerm);
    }

    return rooms;
  };

  const displayRooms = getDisplayRooms();

  // Provide dummy rooms when no real rooms are available (useful for local/dev without backend)
  const DUMMY_ROOMS: RealtimeChatRoom[] = [
    {
      roomId: 'dummy-1',
      name: 'Mrs. Yetunde Adebayo',
      type: 'one_to_one',
      participants: [],
      unreadCount: 2,
      updatedAt: new Date(),
      lastMessage: {
        content: 'typing...',
        senderId: 't1',
        senderName: 'Mrs Yetunde Adebayo',
        timestamp: new Date(),
        type: 'text',
      },
      displayName: 'Mrs. Yetunde Adebayo',
      avatarInfo: { type: 'image', value: '/image/teachers/english.png' },
      isOnline: true,
    } as any,
    {
      roomId: 'dummy-2',
      name: 'JSS 1',
      type: 'group',
      participants: [],
      unreadCount: 0,
      updatedAt: new Date(),
      lastMessage: {
        content: 'Good evening everyone.',
        senderId: 's1',
        senderName: 'Class',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'text',
      },
      displayName: 'JSS 1',
      avatarInfo: { type: 'initials', value: 'J1', bgColor: generateColorFromString('JSS 1') },
      isOnline: false,
    } as any,
  ];

  const effectiveRooms = displayRooms.length > 0 ? displayRooms : DUMMY_ROOMS;

  const handleSelectChat = (room: RealtimeChatRoom) => {
    selectRoom(room.roomId);
    // clear unread badge locally and inform server
    try {
      markRoomAsRead?.(room.roomId);
    } catch (err) { }
    onSelectChat({
      type: room.type === 'one_to_one' ? "private" : "group",
      room
    });
  };

  const handleFilterChange = (newFilter: "all" | "classes" | "groups") => {
    setFilterType(newFilter);
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
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
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
      </div>

      {/* Search Section */}
      <div className="p-3 sm:p-4 space-y-3 bg-white border-b border-gray-50">
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
      <div className="flex-1 overflow-y-auto bg-white chat-list-container">
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
                {searchTerm ? 'No chats found' : 'No chats yet'}
              </p>
              {!searchTerm && (
                <p className="text-xs text-gray-400 mt-1">
                  Join a class to start chatting
                </p>
              )}
            </div>
          </div>
        )}

        {/* Chat Items */}
        <div className="px-2 sm:px-3">
          {effectiveRooms.map((room) => {
            const roomInitials = room.displayName.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
            const roomBgColor = generateColorFromString(room.displayName);

            return (
              <div
                key={room.roomId}
                className={`flex items-center gap-3 p-3 mx-1 hover:bg-gray-50 active:bg-gray-100 rounded-xl cursor-pointer transition-all duration-200 ${selectedRoomId === room.roomId
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
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full ${room.isOnline ? 'bg-green-500' : 'bg-gray-400'
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
                      {room.lastMessage?.content || "No messages yet"}
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
