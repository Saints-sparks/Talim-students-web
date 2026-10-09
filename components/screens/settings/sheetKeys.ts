/** The sheets Settings opens, one at a time. */
export type SettingsSheetKey = "photo" | "password" | "sessions" | "contact" | "privacy" | "terms" | "delete";

/** Props every Settings sheet takes. */
export interface SettingsSheetProps {
  /** Whether the sheet is showing. */
  open: boolean;
  /** Called with `false` when it closes. */
  onOpenChange: (open: boolean) => void;
}
