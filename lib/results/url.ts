/**
 * Keeps a screen's choice (the week on Timetable, the term on Results and
 * Attendance) in the address, so a reload or a shared link opens the same
 * view. Used with `router.replace`, so choosing does not pile up history.
 */

/**
 * The address with one search parameter set or removed, the others kept.
 *
 * @param pathname - The page's path ("/results").
 * @param current - The current search parameters (anything with `toString`).
 * @param name - The parameter to change ("term").
 * @param value - The new value; null or empty removes it.
 * @returns The path, with `?…` only when something is left.
 */
export function hrefWithParam(pathname: string, current: { toString(): string } | null | undefined, name: string, value: string | null | undefined): string {
  const params = new URLSearchParams(current?.toString() ?? "");
  if (value) params.set(name, value);
  else params.delete(name);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
