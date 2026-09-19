import type { Socket } from "socket.io-client";

/** Handlers by event name; each receives that event's payload. */
export type SocketHandlers = Record<string, (payload: never) => void>;

/**
 * Attaches every handler to the socket.
 *
 * @param socket - The app's socket.
 * @param handlers - Listeners by event name.
 * @returns A function that detaches exactly those listeners.
 */
export function subscribe(socket: Socket, handlers: SocketHandlers): () => void {
  // Each handler knows its own payload type; the socket only passes it along.
  const entries = Object.entries(handlers).map(
    ([event, handler]) => [event, handler as (...args: unknown[]) => void] as const
  );
  entries.forEach(([event, handler]) => socket.on(event, handler));
  return () => {
    entries.forEach(([event, handler]) => socket.off(event, handler));
  };
}
