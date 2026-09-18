import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { WEBSOCKET_URL } from "@/lib/constants";
import { refreshAccessToken } from "@/lib/authFetch";
import type { ChatAck } from "@/types/chat";

/**
 *
 */
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

/**
 *
 */
export interface WebSocketContextType {
  /** The app's single socket, or null while signed out. */
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: ConnectionStatus;

  /**
   * Emits with an acknowledgement and a timeout. Resolves with the server's
   * ack, or with `{ ok: false }` on timeout / when not connected.
   */
  emitWithAck: (event: string, payload?: unknown, timeoutMs?: number) => Promise<ChatAck>;

  // Connection management
  connect: (userId: string) => void;
  disconnect: () => void;
  /** Kicks an immediate connection attempt (built-in reconnection keeps retrying anyway). */
  reconnect: () => void;
}

const ACK_TIMEOUT = 10000;

const isUnauthenticated = (value: any) =>
  value?.error?.code === "UNAUTHENTICATED" ||
  value?.code === "UNAUTHENTICATED" ||
  value?.data?.code === "UNAUTHENTICATED" ||
  (typeof value?.message === "string" && value.message.includes("UNAUTHENTICATED"));

/**
 *
 */
export const useWebSocket = (): WebSocketContextType => {
  const socketRef = useRef<Socket | null>(null);
  const userIdRef = useRef<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");

  // One token refresh per rejected handshake; cleared once the server accepts a request.
  const authRetryUsedRef = useRef(false);
  const reconnectAfterAuthRef = useRef(false);

  const disconnect = useCallback(() => {
    const current = socketRef.current;
    socketRef.current = null;
    userIdRef.current = null;
    reconnectAfterAuthRef.current = false;
    authRetryUsedRef.current = false;
    if (current) {
      current.disconnect();
      current.removeAllListeners();
      current.io.removeAllListeners();
    }
    setSocket(null);
    setIsConnected(false);
    setConnectionStatus("disconnected");
  }, []);

  const connect = useCallback(
    (userId: string) => {
      if (socketRef.current && userIdRef.current === userId) {
        if (!socketRef.current.connected && !socketRef.current.active) {
          socketRef.current.connect();
        }
        return;
      }
      if (socketRef.current) disconnect();

      userIdRef.current = userId;
      setConnectionStatus("connecting");

      // The server authenticates the socket with the access token. The callback runs
      // on every connect and reconnect, so a refreshed token is always used.
      // `query.userId` is the legacy fallback the server still accepts; harmless to keep.
      const next = io(WEBSOCKET_URL, {
        auth: (cb) => cb({ token: localStorage.getItem("accessToken") }),
        query: { userId },
        transports: ["websocket", "polling"],
        // Our own manager per signed-in user, never a cached one from a previous session.
        forceNew: true,
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelayMax: 10000,
      });

      const handleUnauthenticated = () => {
        if (socketRef.current !== next) return;
        if (authRetryUsedRef.current) {
          // Refreshed once already and the server still refuses: stop here. A real
          // session expiry is handled by the refresh failing (app sign-out flow).
          setConnectionStatus("error");
          return;
        }
        authRetryUsedRef.current = true;
        refreshAccessToken()
          .then(() => {
            if (socketRef.current !== next) return;
            if (next.connected) {
              // The server disconnects right after `exception`; reconnect when it does.
              reconnectAfterAuthRef.current = true;
            } else {
              next.connect();
            }
          })
          .catch(() => {
            // refreshAccessToken already cleared the session and fired
            // `auth-refresh-failed`; the provider disconnects on sign-out.
            if (socketRef.current === next) setConnectionStatus("error");
          });
      };

      next.on("connect", () => {
        setIsConnected(true);
        setConnectionStatus("connected");
        // Confirms the server accepted this token before allowing another refresh.
        next.timeout(ACK_TIMEOUT).emit("fetch-unread-count", {}, (err: unknown, ack: ChatAck) => {
          if (!err && ack?.ok) authRetryUsedRef.current = false;
        });
      });

      next.on("disconnect", (reason) => {
        setIsConnected(false);
        setConnectionStatus("disconnected");
        // Socket.IO doesn't auto-reconnect after a server-side disconnect.
        if (reason === "io server disconnect" && reconnectAfterAuthRef.current) {
          reconnectAfterAuthRef.current = false;
          next.connect();
        }
      });

      next.on("connect_error", (error) => {
        setIsConnected(false);
        setConnectionStatus("error");
        if (isUnauthenticated(error)) handleUnauthenticated();
      });

      next.on("exception", (payload) => {
        if (isUnauthenticated(payload)) handleUnauthenticated();
      });

      next.io.on("reconnect_attempt", () => {
        setConnectionStatus((status) => (status === "connected" ? status : "connecting"));
      });

      socketRef.current = next;
      setSocket(next);
    },
    [disconnect]
  );

  const reconnect = useCallback(() => {
    const current = socketRef.current;
    if (current && !current.connected) {
      authRetryUsedRef.current = false;
      current.connect();
    }
  }, []);

  const emitWithAck = useCallback(
    (event: string, payload: unknown = {}, timeoutMs: number = ACK_TIMEOUT) =>
      new Promise<ChatAck>((resolve) => {
        const current = socketRef.current;
        if (!current?.connected) {
          resolve({
            ok: false,
            error: { code: "OFFLINE", message: "You're offline. We'll retry when you reconnect." },
          });
          return;
        }
        current.timeout(timeoutMs).emit(event, payload, (err: unknown, ack: ChatAck) => {
          if (err) {
            resolve({
              ok: false,
              error: { code: "TIMEOUT", message: "The server didn't respond. Please try again." },
            });
            return;
          }
          resolve(ack && typeof ack === "object" ? ack : { ok: true });
        });
      }),
    []
  );

  // Cleanup on unmount
  useEffect(() => disconnect, [disconnect]);

  return {
    socket,
    isConnected,
    connectionStatus,
    emitWithAck,
    connect,
    disconnect,
    reconnect,
  };
};
