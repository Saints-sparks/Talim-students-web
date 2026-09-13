"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  title?: string;
  duration?: number;
  /** Makes the whole toast clickable (e.g. open the chat it is about). */
  onClick?: () => void;
}

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClick?: () => void;
  onClose: (id: string) => void;
}

type ToastInputOptions = ToastOptions & { position?: string };

const normalizeOptions = (
  titleOrOptions?: string | ToastInputOptions,
  duration?: number
): ToastOptions => {
  if (typeof titleOrOptions === "string") {
    return { title: titleOrOptions, duration };
  }
  return {
    title: titleOrOptions?.title,
    duration: titleOrOptions?.duration ?? duration,
    onClick: titleOrOptions?.onClick,
  };
};

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClick,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  };

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          Icon: CheckCircle2,
          progress: "bg-gradient-to-r from-emerald-500 to-emerald-600",
          accent: "border-emerald-400",
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
        };
      case "error":
        return {
          Icon: XCircle,
          progress: "bg-gradient-to-r from-red-500 to-red-600",
          accent: "border-red-400",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
        };
      case "warning":
        return {
          Icon: AlertTriangle,
          progress: "bg-gradient-to-r from-amber-500 to-amber-600",
          accent: "border-amber-400",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
        };
      default:
        return {
          Icon: Info,
          progress: "bg-gradient-to-r from-[#003366] to-[#002244]",
          accent: "border-[#003366]",
          iconBg: "bg-blue-100",
          iconColor: "text-[#003366]",
        };
    }
  };

  const { Icon, ...config } = getToastConfig();

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={
        onClick
          ? () => {
              onClick();
              handleClose();
            }
          : undefined
      }
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
                handleClose();
              }
            }
          : undefined
      }
      className={`
        ${onClick ? "cursor-pointer" : ""}
        relative mb-3 flex w-[calc(100vw-2rem)] max-w-md items-start rounded-xl border-l-4 bg-white p-4 shadow-lg
        transition-all duration-300 ease-out
        ${config.accent}
        ${
          isVisible && !isLeaving
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-5 scale-95 opacity-0"
        }
      `}
    >
      <div
        className={`mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
      >
        <Icon className={`h-6 w-6 ${config.iconColor}`} />
      </div>

      <div className="min-w-0 flex-1">
        {title && (
          <h4 className="mb-1 text-sm font-semibold leading-tight text-gray-900">
            {title}
          </h4>
        )}
        <p className="break-words text-sm leading-relaxed text-gray-700">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        onKeyDown={(e) => e.stopPropagation()}
        className="ml-2 flex-shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100"
        aria-label="Close notification"
      >
        <X className="h-5 w-5 text-gray-400" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl bg-gray-100">
        <div
          className={`h-full rounded-br-xl ${config.progress}`}
          style={{
            animation: `toast-shrink ${duration}ms linear forwards`,
            transformOrigin: "left",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes toast-shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed left-1/2 top-5 z-[9999] -translate-x-1/2">
      <div className="pointer-events-auto flex max-h-screen flex-col items-center overflow-hidden">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={onRemove} />
        ))}
      </div>
    </div>,
    document.body
  );
};

// ── Manager (singleton, lives outside React) ─────────────────────────────────

let toastId = 0;

class ToastManager {
  private listeners: Set<(toasts: ToastProps[]) => void> = new Set();
  private toasts: ToastProps[] = [];

  subscribe(listener: (toasts: ToastProps[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot() {
    return this.toasts;
  }

  addToast(toast: Omit<ToastProps, "id" | "onClose">) {
    const newToast: ToastProps = {
      ...toast,
      id: `toast-${++toastId}`,
      onClose: this.removeToast,
    };
    this.toasts = [newToast, ...this.toasts].slice(0, 5);
    this.emit();
  }

  removeToast = (id: string) => {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.emit();
  };

  private emit() {
    this.listeners.forEach((l) => l(this.toasts));
  }
}

const toastManager = new ToastManager();

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    setToasts(toastManager.getSnapshot());
    return unsubscribe;
  }, []);

  return { toast, toasts, removeToast: toastManager.removeToast };
};

// ── Viewport (drop into layout) ───────────────────────────────────────────────

export const ToastViewport = () => {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onRemove={removeToast} />;
};

// ── Public API ────────────────────────────────────────────────────────────────

type ToastFn = {
  (message: string, titleOrOptions?: string | ToastInputOptions, duration?: number): void;
  success: (message: string, titleOrOptions?: string | ToastInputOptions, duration?: number) => void;
  error:   (message: string, titleOrOptions?: string | ToastInputOptions, duration?: number) => void;
  warning: (message: string, titleOrOptions?: string | ToastInputOptions, duration?: number) => void;
  info:    (message: string, titleOrOptions?: string | ToastInputOptions, duration?: number) => void;
};

const showToast = (
  type: ToastType,
  message: string,
  titleOrOptions?: string | ToastInputOptions,
  duration?: number
) => {
  const options = normalizeOptions(titleOrOptions, duration);
  toastManager.addToast({ type, message, ...options });
};

export const toast = Object.assign(
  (message: string, titleOrOptions?: string | ToastInputOptions, duration?: number) =>
    showToast("info", message, titleOrOptions, duration),
  {
    success: (message: string, titleOrOptions?: string | ToastInputOptions, duration?: number) =>
      showToast("success", message, titleOrOptions, duration),
    error: (message: string, titleOrOptions?: string | ToastInputOptions, duration?: number) =>
      showToast("error", message, titleOrOptions, duration),
    warning: (message: string, titleOrOptions?: string | ToastInputOptions, duration?: number) =>
      showToast("warning", message, titleOrOptions, duration),
    info: (message: string, titleOrOptions?: string | ToastInputOptions, duration?: number) =>
      showToast("info", message, titleOrOptions, duration),
  }
) as ToastFn;

export default Toast;
