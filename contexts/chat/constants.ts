/** How long a sent `join-chat-room` may go unanswered before the join fails. */
export const JOIN_TIMEOUT = 10000;
/** How long a `send-chat-message` may go unacknowledged before it is marked failed. */
export const SEND_TIMEOUT = 10000;
/** Messages per page when scrolling back through history. */
export const PAGE_SIZE = 20;
/** Messages per page when catching up on what arrived while away. */
export const BACKFILL_PAGE_SIZE = 100;
/** Most pages one catch-up will fetch. */
export const BACKFILL_MAX_PAGES = 10;

export const JOIN_FAILED_MESSAGE = "Couldn't load this chat";
