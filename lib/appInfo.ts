/**
 * The app's name and version as Settings → About shows them. The version is
 * read from `package.json`, so a release bump shows up without another edit.
 */
import packageJson from "../package.json";

/** The version in `package.json` (e.g. "1.5.0"). */
export const APP_VERSION: string = packageJson.version;

/** The platform line on Settings → About. */
export const APP_PLATFORM = "Talim Students Web";

/** Where students write to Talim (not their school). */
export const SUPPORT_EMAIL = "support@mytalim.com";
