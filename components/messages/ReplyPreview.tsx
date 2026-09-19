// ReplyPreview.tsx
import type { ReplyTarget } from "@/types/chat";
import React from "react";

interface ReplyPreviewProps {
  replyingMessage: ReplyTarget;
  onCancel: () => void;
}

const ReplyPreview = ({ replyingMessage, onCancel }: ReplyPreviewProps) => {
  return (
    <div className="p-3 flex border-b border-[#F0F0F0] justify-between mx-4 bg-white rounded-lg items-start">
      <div className="flex flex-col">
        <p className="font-semibold text-[#F39C12] text-sm mb-1">
          {replyingMessage.sender}
        </p>
        <p className="text-sm text-[#030E18] leading-tight">
          {replyingMessage.text}
        </p>
      </div>
      <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">
        ✕
      </button>
    </div>
  );
};

export default ReplyPreview;
