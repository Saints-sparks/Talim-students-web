"use client";

import { useEffect } from "react";
import { discardAllEntries } from "./outbox";
import type { ChatStore } from "./useChatStore";

/**
 * A different (or no) user: start from a clean slate. Timers, queued media,
 * drafts and every published state are dropped when the user changes or the
 * provider unmounts.
 *
 * @param store - The shared chat store.
 * @param primaryUserId - The signed-in user's id; a change means a different user.
 */
export function useResetOnUserChange(store: ChatStore, primaryUserId: string | null) {
  const {
    joinTimersRef,
    chatRoomsRef,
    roomStatesRef,
    selectedRef,
    inflightSendsRef,
    lastReadSentRef,
    outboxRef,
    draftsRef,
    roomListInflightRef,
    resetState,
  } = store;

  useEffect(() => {
    // These collections are created once and only ever mutated in place.
    const timers = joinTimersRef.current;
    const inflight = inflightSendsRef.current;
    const lastRead = lastReadSentRef.current;
    const outbox = outboxRef.current;
    const drafts = draftsRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
      chatRoomsRef.current = [];
      roomStatesRef.current = {};
      selectedRef.current = null;
      inflight.clear();
      lastRead.clear();
      discardAllEntries(outbox);
      drafts.clear();
      roomListInflightRef.current = false;
      resetState();
    };
    // `primaryUserId` is the trigger: the cleanup runs when it changes. Everything
    // else is a stable ref or setter from the store.
  }, [
    primaryUserId,
    joinTimersRef,
    chatRoomsRef,
    roomStatesRef,
    selectedRef,
    inflightSendsRef,
    lastReadSentRef,
    outboxRef,
    draftsRef,
    roomListInflightRef,
    resetState,
  ]);
}
