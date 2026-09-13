import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import AudioMessage from "./AudioMessage";
import VideoMessage from "./VideoMessage";
import MessageOptionsDropdown from "./MessageDropdown";
import { generateColorFromString, getUserInitials } from "@/lib/colorUtils";

interface MessageBubbleProps {
  msg: {
    senderType: string;
    avatar: string;
    sender: string;
    color: string;
    type: string;
    text?: string;
    videoThumbnail?: string;
    duration?: string | number;
    time: string;
    status?: "sent" | "pending" | "failed";
    error?: string;
  };
  index: number;
  openSubMenu: { index: number; type: string } | null;
  toggleSubMenu: (index: number, type: string) => void;
  setReplyingMessage: (msg: any) => void;
  onRetry?: () => void;
  onDelete?: () => void;
}

export default function GroupMessageBubble({
  msg,
  index,
  openSubMenu,
  toggleSubMenu,
  setReplyingMessage,
  onRetry,
  onDelete,
}: MessageBubbleProps) {
  const isPending = msg.status === "pending";
  const isFailed = msg.status === "failed";

  const initials = getUserInitials(msg.sender);
  const bgColor = msg.color || generateColorFromString(msg.sender);

  return (
    <div
      className={`relative flex items-end ${
        msg.senderType === "self" ? "justify-end" : "justify-start"
      } gap-2 px-2 sm:px-0 mb-3`}
    >
      <div className={`flex gap-2 max-w-[85%] sm:max-w-md ${
        msg.senderType === "self" ? "flex-row-reverse" : "flex-row"
      }`}>
        {/* Avatar - only show for other users, not self */}
        {msg.senderType !== "self" && (
          <div className="relative w-8 h-8 flex-shrink-0 self-end mb-1">
            <Avatar className="w-8 h-8 rounded-full">
              <AvatarImage src={msg.avatar} />
              <AvatarFallback 
                className="text-white font-medium text-xs"
                style={{ backgroundColor: bgColor }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${
          msg.senderType === "self" ? "items-end" : "items-start"
        }`}>
          {/* Sender Name - only show for group messages from others */}
          {msg.sender !== "me" && msg.senderType !== "self" && (
            <div className="mb-1 px-1">
              <p 
                className="text-xs font-semibold"
                style={{ color: bgColor }}
              >
                {msg.sender}
              </p>
            </div>
          )}

          {/* Message Bubble */}
          <Card
            className={`px-3 py-2 sm:px-4 sm:py-3 border-none shadow-sm relative ${
              isPending ? "opacity-70" : ""
            } ${
              msg.senderType === "self"
                ? "bg-blue-500 text-white rounded-2xl rounded-br-md"
                : "bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-md"
            }`}
          >
            {!isPending && !isFailed && (
              <MessageOptionsDropdown
                index={index}
                msg={msg}
                openSubMenu={openSubMenu}
                toggleSubMenu={toggleSubMenu}
                setReplyingMessage={setReplyingMessage}
              />
            )}

            {msg.type !== "voice" && msg.text && (
              <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
                {msg.text}
              </p>
            )}
            {msg.type === "voice" && <AudioMessage sender={msg.sender} />}
            {msg.type === "video" && (
              <VideoMessage
                videoThumbnail={msg.videoThumbnail || ""}
                videoDuration={String(msg.duration || "")}
                messageText={msg.text || ""}
              />
            )}
          </Card>

          {/* Time and Status */}
          <div className={`flex items-center gap-1 text-xs text-gray-400 mt-1 px-1 ${
            msg.senderType === "self" ? "flex-row-reverse" : "flex-row"
          }`}>
            {isFailed ? (
              <span className="text-red-600" title={msg.error}>
                Not sent
                {onRetry && (
                  <>
                    {" · "}
                    <button className="underline hover:text-red-800" onClick={onRetry}>
                      Retry
                    </button>
                  </>
                )}
                {onDelete && (
                  <>
                    {" · "}
                    <button className="underline hover:text-red-800" onClick={onDelete}>
                      Delete
                    </button>
                  </>
                )}
              </span>
            ) : (
              <span>{isPending ? "Sending…" : msg.time}</span>
            )}
            {msg.senderType === "self" && !isPending && !isFailed && (
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 16 16" 
                className="text-blue-400"
                fill="currentColor"
              >
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
