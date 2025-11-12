import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, SendHorizontal, FileText, Image, FileVideo, Loader2 } from "lucide-react";

interface MessageInputProps {
  onSendMessage?: (content: string) => void;
  replyingMessage?: { sender: string; text: string } | null;
  disabled?: boolean;
  isSending?: boolean;
  onTyping?: (isTyping: boolean) => void;
}

export default function MessageInput({
  onSendMessage,
  replyingMessage,
  disabled = false,
  isSending = false
  , onTyping
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      // user sent message -> indicate not typing
      if (onTyping) onTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div className="flex items-center space-x-3">
        {/* Attachment Buttons: Document, Image, Video */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" disabled={disabled} title="Document">
            <FileText className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" disabled={disabled} title="Image">
            <Image className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" disabled={disabled} title="Video">
            <FileVideo className="w-4 h-4" />
          </button>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Input
            placeholder={disabled ? "Connecting..." : "Type something here..."}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 resize-none text-sm"
            value={message}
            onChange={(e) => {
              const v = e.target.value;
              setMessage(v);
              // typing indicator
              if (onTyping) {
                if (typingTimerRef.current) {
                  clearTimeout(typingTimerRef.current);
                }
                onTyping(v.trim().length > 0);
                // debounce: consider stopped typing after 1.5s of inactivity
                typingTimerRef.current = setTimeout(() => {
                  onTyping(false);
                }, 1500);
              }
            }}
            onKeyPress={handleKeyPress}
            disabled={disabled}
          />
        </div>

        {/* Send / Mic Button */}
        <button
          className={`p-2 rounded-full transition-all duration-200 ${message.trim() && !disabled && !isSending
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-100 text-gray-400"
            }`}
          onClick={handleSendMessage}
          disabled={disabled || (!message.trim() && !isSending)}
          title={message.trim() ? 'Send' : 'Record'}
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : message.trim() ? (
            <SendHorizontal className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
