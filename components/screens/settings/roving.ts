"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";

/**
 * Where arrow keys, Home and End move in a roving list of `count` items
 * (tabs, theme cards, chips). Both axes move, so the same list works stacked
 * on a phone and side by side on a wide screen.
 *
 * @param key - The key pressed.
 * @param index - The item that has focus.
 * @param count - How many items there are.
 * @returns The index to move to, or null when the key does not move.
 */
export function rovingIndex(key: string, index: number, count: number): number | null {
  if (count <= 0) return null;
  switch (key) {
    case "ArrowDown":
    case "ArrowRight":
      return (index + 1) % count;
    case "ArrowUp":
    case "ArrowLeft":
      return (index - 1 + count) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}

/** The props {@link useRovingGroup} gives each item. */
export interface RovingItemProps {
  ref: (element: HTMLButtonElement | null) => void;
  tabIndex: number;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * A single-choice group the keyboard moves through with the arrow keys (the
 * APG tabs and radio-group pattern): only the chosen item is in the Tab
 * order, and an arrow key both chooses and focuses the next item.
 *
 * @param values - The choices, in order.
 * @param selected - The chosen one.
 * @param onSelect - Called with the choice an arrow key lands on.
 * @returns A function giving each item its `ref`, `tabIndex` and key handler.
 */
export function useRovingGroup<T extends string>(
  values: readonly T[],
  selected: T,
  onSelect: (value: T) => void
): (value: T, index: number) => RovingItemProps {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const focusable = values.includes(selected) ? selected : values[0];

  const onKey = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const next = rovingIndex(event.key, index, values.length);
      if (next === null) return;
      event.preventDefault();
      onSelect(values[next]);
      refs.current[next]?.focus();
    },
    [values, onSelect]
  );

  return (value, index) => ({
    ref: (element) => {
      refs.current[index] = element;
    },
    tabIndex: value === focusable ? 0 : -1,
    onKeyDown: (event) => onKey(event, index),
  });
}
