"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useWebSocket, WebSocketContextType } from "@/hooks/useWebSocket";

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { isAuthenticated, user, accessToken } = useAuthContext();
  const webSocket = useWebSocket();

  // Auto-connect when user is authenticated
  useEffect(() => {
    // Always prefer user.userId, fallback to user.id only if userId is missing
    const userId = user?.userId || user?.id;

    if (
      isAuthenticated &&
      accessToken &&
      userId &&
      !webSocket.isConnected &&
      webSocket.connectionStatus !== "connecting"
    ) {
      webSocket.connect(userId);
    } else if (!isAuthenticated && webSocket.isConnected) {
      webSocket.disconnect();
    }
  }, [
    isAuthenticated,
    accessToken,
    user?.userId,
    user?.id,
    webSocket.isConnected,
    webSocket.connectionStatus,
  ]);

  // Listen for custom auth events separately
  useEffect(() => {
    const handleAuthEvent = (e: CustomEvent) => {
      if (e.detail?.type === "login" && e.detail?.user) {
        const loginUserId = e.detail.user.userId || e.detail.user.id;
        if (loginUserId && accessToken && !webSocket.isConnected) {
          webSocket.connect(loginUserId);
        }
      }
    };

    window.addEventListener("auth-changed", handleAuthEvent as EventListener);
    return () => {
      window.removeEventListener(
        "auth-changed",
        handleAuthEvent as EventListener
      );
    };
  }, [accessToken, webSocket.connect, webSocket.isConnected]); // Fixed dependencies

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
