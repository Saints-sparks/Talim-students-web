import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { CheckCheck } from "lucide-react";
import AudioMessage from "./AudioMessage";
import MessageOptionsDropdown from "./MessageDropdown";

interface MessageBubbleProps {
  msg: {
    senderType: string;
    avatar: string;
    sender: string;
    color: string;
    type: string;
    text?: string;
    videoThumbnail?: string;
    duration?: string;
    time: string;
  };
  index: number;
  openSubMenu: { index: number; type: string } | null;
  toggleSubMenu: (index: number, type: string) => void;
  setReplyingMessage: (msg: any) => void;
}

export default function MessageBubble({
  msg,
  index,
  openSubMenu,
  toggleSubMenu,
  setReplyingMessage,
}: MessageBubbleProps) {
  return (
    <div
      className={`flex items-end ${msg.sender === "me" ? "justify-end" : "justify-start"
        } mb-2 gap-2`}
    >
      <div className="flex flex-col">
        <div className="flex items-end gap-2">
          {msg.sender !== "me" && (
            <Avatar className="w-8 h-8 rounded-full">
              <AvatarImage src="/image/teachers/english.png" />
            </Avatar>
          )}
          <Card
            className={`p-3 font-normal border-none shadow-none max-w-md ${msg.sender === "me"
                ? "bg-blue-500 text-white"
                : "bg-white text-[#030E18]"
              } rounded-2xl`}
            style={msg.sender === "me" ? { borderTopRightRadius: 4 } : { borderTopLeftRadius: 4 }}
          >
            <MessageOptionsDropdown
              index={index}
              msg={msg}
              openSubMenu={openSubMenu}
              toggleSubMenu={toggleSubMenu}
              setReplyingMessage={setReplyingMessage}
            />
            {msg.type === "text" ? (
              msg.text
            ) : (
              <AudioMessage sender={msg.sender} />
            )}
          </Card>
        </div>
        <div className="flex gap-1 text-xs text-[#9CA3AF] self-end mt-1">
          <span className="text-xs">{msg.time}</span>
          {msg.sender === "me" && (
            <CheckCheck size={14} className="text-blue-300" />
          )}
        </div>
      </div>
    </div>
  );
}
