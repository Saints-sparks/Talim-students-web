"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** How long typing must pause before the search reaches the query. */
export const SEARCH_DEBOUNCE_MS = 300;

/** The Files screen's filters and their setters. */
export interface FileFilterState {
  /** The subject filter (a course id), or "" for every subject. */
  course: string;
  /** What is in the search box right now. */
  text: string;
  /** The search the list is filtered by (the box's text after the pause, trimmed). */
  q: string;
  /** The 1-based page. */
  page: number;
  /** Updates the search box; the search follows after {@link SEARCH_DEBOUNCE_MS}. */
  setText: (value: string) => void;
  /** Picks a subject ("" for all) and goes back to the first page. */
  setCourse: (courseId: string) => void;
  /** Empties the search at once. */
  clearSearch: () => void;
  /** Goes to a page. */
  setPage: (page: number) => void;
}

/**
 * The Files filters, kept in the address as `?course=&q=` so a notification
 * link (`/files?course=…`) opens on that subject and a search can be shared.
 * The search text waits for a {@link SEARCH_DEBOUNCE_MS} pause before it is
 * used, so typing does not send a request per key. The address is replaced,
 * not pushed, so Back leaves the page instead of undoing each keystroke.
 *
 * @returns The filters and setters.
 */
export function useFileFilters(): FileFilterState {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlString = searchParams?.toString() ?? "";
  const urlRef = useRef(urlString);
  const written = useRef<string | null>(null);

  const [course, setCourseState] = useState(() => searchParams?.get("course") ?? "");
  const [text, setText] = useState(() => searchParams?.get("q") ?? "");
  const [q, setQ] = useState(() => (searchParams?.get("q") ?? "").trim());
  const [page, setPage] = useState(1);

  // Follow the address when it changes from outside (a link to another subject);
  // our own replacements are recognised and skipped.
  useEffect(() => {
    urlRef.current = urlString;
    if (written.current === urlString) return;
    written.current = urlString;
    const params = new URLSearchParams(urlString);
    const nextQ = params.get("q") ?? "";
    setCourseState(params.get("course") ?? "");
    setText(nextQ);
    setQ(nextQ.trim());
    setPage(1);
  }, [urlString]);

  // The search follows the box once typing pauses.
  useEffect(() => {
    const next = text.trim();
    if (next === q) return undefined;
    const timer = setTimeout(() => {
      setQ(next);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text, q]);

  // Write the filters back to the address, keeping any other parameters.
  useEffect(() => {
    const params = new URLSearchParams(urlRef.current);
    if (course) params.set("course", course);
    else params.delete("course");
    if (q) params.set("q", q);
    else params.delete("q");
    const next = params.toString();
    if (next === urlRef.current) return;
    written.current = next;
    router.replace(next ? `/files?${next}` : "/files", { scroll: false });
  }, [course, q, router]);

  const setCourse = useCallback((courseId: string) => {
    setCourseState(courseId);
    setPage(1);
  }, []);

  const clearSearch = useCallback(() => {
    setText("");
    setQ("");
    setPage(1);
  }, []);

  return { course, text, q, page, setText, setCourse, clearSearch, setPage };
}
