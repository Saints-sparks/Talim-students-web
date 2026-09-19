import type { User } from "@/types/auth";

/** One labelled line of the account card. */
export interface ProfileRow {
  label: string;
  value: string;
}

const NONE = "—";

/**
 * The lines shown on the Account card, in order. Anything the school has not
 * recorded reads as a dash rather than blank or "undefined".
 *
 * @param user - The signed-in student, or `null` before the session loads.
 * @returns The rows to render.
 */
export function buildProfileRows(user: User | null | undefined): ProfileRow[] {
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  return [
    { label: "Full Name", value: fullName || NONE },
    { label: "Role", value: "Student" },
    { label: "Email Address", value: user?.email || NONE },
    { label: "School", value: user?.schoolName || NONE },
    { label: "Phone Number", value: user?.phoneNumber || NONE },
    { label: "Admission Number", value: user?.admissionNumber || NONE },
  ];
}

/**
 * The letters shown in the avatar circle when there is no photo.
 *
 * @param user - The signed-in student, or `null`.
 * @returns Up to two capitals, or "ST" when the name is unknown.
 */
export function getProfileInitials(user: User | null | undefined): string {
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();
  return initials || "ST";
}
