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

/** Talim's privacy policy on the public site. */
export const PRIVACY_POLICY_URL = "https://www.mytalim.com/privacy";

/** Talim's terms of service on the public site. */
export const TERMS_OF_SERVICE_URL = "https://www.mytalim.com/terms";

/** How to get help with Talim, on the public site. */
export const SUPPORT_URL = "https://www.mytalim.com/support";

/** What deleting an account does, and what to do without access, on the public site. */
export const DELETE_ACCOUNT_INFO_URL = "https://www.mytalim.com/delete-account";
