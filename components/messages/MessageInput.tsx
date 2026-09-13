import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Mic, SendHorizontal, FileText } from "lucide-react";

interface MessageInputProps {
  onSendMessage?: (content: string) => void;
  replyingMessage?: { sender: string; text: string } | null;
  disabled?: boolean;
  /** Draft restored when the room is reopened. */
  initialValue?: string;
  onDraftChange?: (text: string) => void;
}

export default function MessageInput({
  onSendMessage,
  disabled = false,
  initialValue = "",
  onDraftChange,
}: MessageInputProps) {
  const [message, setMessage] = useState(initialValue);

  const updateMessage = (text: string) => {
    setMessage(text);
    onDraftChange?.(text);
  };

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage && !disabled) {
      // The text now lives in a pending bubble, which offers Retry if it fails.
      onSendMessage(message.trim());
      updateMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100" data-guide="messages-input">
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          disabled={disabled}
        >
          <FileText className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Input
            placeholder="Type a message..."
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 resize-none"
            value={message}
            onChange={(e) => updateMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
        </div>

        {/* Send Button */}
        <button
          className={`p-2 rounded-full transition-all duration-200 ${
            message.trim() && !disabled
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-100 text-gray-400"
          }`}
          onClick={handleSendMessage}
          disabled={disabled || !message.trim()}
        >
          {message.trim() ? (
            <SendHorizontal className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
