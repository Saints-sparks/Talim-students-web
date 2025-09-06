"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useWebSocket, WebSocketContextType } from '@/hooks/useWebSocket';

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthContext();
  const webSocket = useWebSocket();

  // Add debugging for auth state
  console.log('🔍 WebSocketProvider state:', { 
    isAuthenticated, 
    userId: user?.id || user?.userId, // Check both id and userId
    isConnected: webSocket.isConnected,
    connectionStatus: webSocket.connectionStatus,
    userObject: user
  });

  // Auto-connect when user is authenticated
  useEffect(() => {
    // Use either id or userId property based on students app structure
    const userId = user?.id || user?.userId;
    
    console.log('🔍 WebSocket useEffect triggered:', { 
      isAuthenticated, 
      userId: userId, 
      isConnected: webSocket.isConnected,
      connectionStatus: webSocket.connectionStatus
    });
    
    if (isAuthenticated && userId && !webSocket.isConnected && webSocket.connectionStatus !== 'connecting') {
      console.log('🔌 Auto-connecting WebSocket for user:', userId);
      console.log('🔌 WebSocket URL:', process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:5005');
      webSocket.connect(userId);
    } else if (!isAuthenticated && webSocket.isConnected) {
      console.log('🔌 Auto-disconnecting WebSocket - user not authenticated');
      webSocket.disconnect();
    } else {
      console.log('🔍 No WebSocket action needed:', {
        isAuthenticated,
        hasUserId: !!userId,
        isConnected: webSocket.isConnected,
        connectionStatus: webSocket.connectionStatus
      });
    }

    // Listen for custom auth events (for immediate WebSocket connection after login)
    const handleAuthEvent = (e: CustomEvent) => {
      console.log('🔍 Auth event received in WebSocket context');
      if (e.detail?.type === 'login' && e.detail?.user) {
        const loginUserId = e.detail.user.id || e.detail.user.userId;
        if (loginUserId && !webSocket.isConnected) {
          console.log('🔌 Connecting WebSocket after login event');
          webSocket.connect(loginUserId);
        }
      }
    };

    window.addEventListener('auth-changed', handleAuthEvent as EventListener);
    return () => {
      window.removeEventListener('auth-changed', handleAuthEvent as EventListener);
    };
  }, [isAuthenticated, user?.id, user?.userId, webSocket]);

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
