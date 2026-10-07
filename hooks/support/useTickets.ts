"use client";

/**
 * Support-ticket hooks (v1.5 §1) for Settings → Help → Support: the
 * student's tickets (one list call per page, "Load more" for the next), one
 * ticket's thread, and raising, replying, reopening and closing. Every
 * change refetches the ticket afterwards, whatever the API answered, and
 * refreshes the list.
 */
import { useEffect, useMemo } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { ticketsService } from "@/services/tickets.service";
import { useStudentIdentity } from "@/hooks/useStudentIdentity";
import { queryKeys } from "@/lib/queryKeys";
import { messageForError } from "@/lib/errorMessages";
import type { CreateTicketPayload, PostTicketMessagePayload, Ticket, TicketPage, TicketSummary } from "@/types/tickets";

/** Tickets per page of the list. */
export const TICKETS_PAGE_SIZE = 10;

/**
 * The signed-in user's id for the cache keys, and whether the session is ready.
 *
 * @returns The scope id ("anonymous" while signed out) and readiness.
 */
function useScope(): { scope: string; ready: boolean } {
  const { userId, isReady } = useStudentIdentity();
  return { scope: userId ?? "anonymous", ready: Boolean(isReady && userId) };
}

/** What {@link useMyTickets} hands the list. */
export interface MyTicketsState {
  /** The loaded tickets, newest activity first, without duplicates across pages. */
  tickets: TicketSummary[];
  /** How many tickets the student has in all, once known. */
  total: number | undefined;
  /** True only for the first load. */
  isLoading: boolean;
  /** A sentence to show when the first page failed, else null. */
  error: string | null;
  /** Loads the list again. */
  refetch: () => void;
  /** Whether `meta.lastPage` is past the last loaded page. */
  hasMore: boolean;
  /** Loads the next page. */
  loadMore: () => void;
  /** True while the next page loads. */
  isLoadingMore: boolean;
  /** A sentence when "Load more" failed, else null. */
  loadMoreError: string | null;
}

/**
 * The student's own tickets (`GET /tickets/mine`), a page at a time.
 *
 * @param enabled - Whether to load now (the Help panel is showing).
 * @returns The list's state.
 */
export function useMyTickets(enabled = true): MyTicketsState {
  const { scope, ready } = useScope();
  const query = useInfiniteQuery({
    queryKey: queryKeys.support.mine(scope),
    enabled: enabled && ready,
    staleTime: 0,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => ticketsService.listMine({ page: pageParam, limit: TICKETS_PAGE_SIZE }),
    getNextPageParam: (last: TicketPage) => (last.meta.lastPage > last.meta.page ? last.meta.page + 1 : undefined),
  });

  const tickets = useMemo(() => {
    const byId = new Map<string, TicketSummary>();
    for (const page of query.data?.pages ?? []) for (const ticket of page.data) if (!byId.has(ticket.id)) byId.set(ticket.id, ticket);
    return [...byId.values()];
  }, [query.data]);

  const firstFailed = query.isError && !query.data;
  return {
    tickets,
    total: query.data?.pages[0]?.meta.total,
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: firstFailed ? messageForError(query.error, "We couldn't load your tickets.") : null,
    refetch: () => void query.refetch(),
    hasMore: Boolean(query.hasNextPage),
    loadMore: () => void query.fetchNextPage(),
    isLoadingMore: query.isFetchingNextPage,
    loadMoreError: query.isFetchNextPageError ? messageForError(query.error, "We couldn't load more tickets.") : null,
  };
}

/**
 * Marks one ticket read in the cached list, as the API does when the
 * student opens it, so its "N new" badge goes without another list call.
 *
 * @param data - The cached pages.
 * @param ticketId - The opened ticket.
 * @returns The pages with that ticket read, or the same object when unchanged.
 */
export function markReadInPages(data: InfiniteData<TicketPage> | undefined, ticketId: string): InfiniteData<TicketPage> | undefined {
  if (!data?.pages.some((page) => page.data.some((ticket) => ticket.id === ticketId && ticket.unread > 0))) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      data: page.data.map((ticket) => (ticket.id === ticketId ? { ...ticket, unread: 0 } : ticket)),
    })),
  };
}

/**
 * One ticket with its thread (`GET /tickets/:id`).
 *
 * @param ticketId - The ticket, or null when none is open.
 * @returns The query's state.
 */
export function useTicket(ticketId: string | null) {
  const { scope, ready } = useScope();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.support.ticket(scope, ticketId ?? "none"),
    enabled: ready && Boolean(ticketId),
    staleTime: 0,
    queryFn: () => ticketsService.get(ticketId as string),
  });

  const loadedId = query.data?.id;
  useEffect(() => {
    if (!loadedId) return;
    queryClient.setQueryData<InfiniteData<TicketPage>>(queryKeys.support.mine(scope), (data) => markReadInPages(data, loadedId));
  }, [loadedId, queryClient, scope]);

  return {
    ticket: query.data,
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.isError && !query.data ? messageForError(query.error, "We couldn't open this ticket.") : null,
    refetch: () => void query.refetch(),
  };
}

/**
 * Raises a ticket. The new ticket is put in the cache so its thread opens
 * at once, and the list is refreshed.
 *
 * @returns The mutation (takes the payload, resolves with the ticket).
 */
export function useCreateTicket() {
  const { scope } = useScope();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => ticketsService.create(payload),
    onSuccess: (ticket: Ticket) => {
      queryClient.setQueryData(queryKeys.support.ticket(scope, ticket.id), ticket);
      void queryClient.invalidateQueries({ queryKey: queryKeys.support.mine(scope) });
    },
  });
}

/**
 * Reply, reopen and close for one ticket. After each, success or failure
 * (a 409 means the ticket changed), the ticket is refetched and the list
 * refreshed.
 *
 * @param ticketId - The open ticket.
 * @returns The three mutations.
 */
export function useTicketActions(ticketId: string) {
  const { scope } = useScope();
  const queryClient = useQueryClient();

  /**
   * Refetches the ticket and marks the list stale.
   *
   * @returns Once the ticket has reloaded.
   */
  const refresh = async () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.support.mine(scope) });
    await queryClient.invalidateQueries({ queryKey: queryKeys.support.ticket(scope, ticketId) });
  };

  const reply = useMutation({
    mutationFn: (payload: PostTicketMessagePayload) => ticketsService.reply(ticketId, payload),
    onSettled: refresh,
  });
  const reopen = useMutation({ mutationFn: () => ticketsService.reopen(ticketId), onSettled: refresh });
  const close = useMutation({ mutationFn: () => ticketsService.close(ticketId), onSettled: refresh });
  return { reply, reopen, close };
}
