"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useWebSocket, WebSocketContextType } from "@/hooks/useWebSocket";

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

/**
 * Owns the app's one socket. It is created when a user is signed in and closed
 * on sign-out or user change; Socket.IO's built-in reconnection handles drops.
 */
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuthContext();
  const webSocket = useWebSocket();
  const { connect, disconnect } = webSocket;

  // Always prefer user.userId, fallback to user.id only if userId is missing
  const userId = user?.userId || user?.id;

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    connect(userId);
    return () => disconnect();
  }, [isAuthenticated, userId, connect, disconnect]);

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};

// Safe variant — returns null instead of throwing when used outside the provider.
export const useWebSocketContextSafe = (): WebSocketContextType | null => {
  return useContext(WebSocketContext);
};
