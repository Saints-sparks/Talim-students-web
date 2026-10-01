/** How long a sent `join-chat-room` may go unanswered before the join fails. */
export const JOIN_TIMEOUT = 10000;
/** How long a `send-chat-message` may go unacknowledged before it is marked failed. */
export const SEND_TIMEOUT = 10000;
/** How long a message may wait offline before its bubble offers Retry / Delete. */
export const OFFLINE_SEND_GRACE = 20000;
/** Messages per page when scrolling back through history. */
export const PAGE_SIZE = 20;
/** Messages per page when catching up on what arrived while away. */
export const BACKFILL_PAGE_SIZE = 50;
/**
 * Most pages one catch-up will fetch. A bigger gap is not walked page by page
 * (that was up to 10 × 100 messages per rejoin): the room is reset to the
 * newest page instead, and older history loads on scroll as usual.
 */
export const BACKFILL_MAX_PAGES = 1;

export const JOIN_FAILED_MESSAGE = "Couldn't load this chat";
