/**
 * The app's name and version as Settings → About and support reports show
 * them. The version comes from `NEXT_PUBLIC_APP_VERSION` at build time.
 */

/** The version string, "1.0.0" unless the build sets one. */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

/** The platform line on Settings → About. */
export const APP_PLATFORM = "Talim Students Web";

/** Where students write to Talim (not their school). */
export const SUPPORT_EMAIL = "support@mytalim.com";
