"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface InfoModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  guide?: string;
}

/** Responsive dialog frame for chat info: full width on phones, capped on larger screens. */
export default function InfoModalShell({
  isOpen,
  onClose,
  title,
  children,
  footer,
  guide,
}: InfoModalShellProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-4 py-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex w-full max-w-md max-h-[calc(100svh-3rem)] flex-col overflow-hidden rounded-lg bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
        data-guide={guide}
      >
        <div className="flex items-center justify-between border-b border-[#F0F0F0] px-5 py-3">
          <h2 className="text-base font-medium text-[#030E18]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#434343] hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">{children}</div>
        {footer && <div className="border-t border-[#F0F0F0] px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
