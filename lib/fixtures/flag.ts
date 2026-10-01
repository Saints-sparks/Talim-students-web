/**
 * Dev-only fixtures for the students redesign, used while the learner-view
 * backend (Part B of the portals contract) is built in parallel.
 *
 * On only when `NEXT_PUBLIC_USE_FIXTURES=true` AND this is not a production
 * build. Next inlines both values at build time, so in production the fixture
 * branch is dead code and the fixture module (always loaded with a dynamic
 * `import()`) is never fetched.
 */

/** The data states the fixtures can show, picked per browser in dev. */
export type FixtureVariant = "normal" | "empty" | "weekend" | "holiday" | "partial";

const VARIANTS: readonly FixtureVariant[] = ["normal", "empty", "weekend", "holiday", "partial"];

/** localStorage key that picks the fixture variant in dev. */
export const FIXTURE_VARIANT_KEY = "talim.fixture";

/**
 * Whether the redesign's services answer from local fixtures.
 *
 * @returns True in a non-production build with the flag set.
 */
export function fixturesEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_USE_FIXTURES === "true";
}

/**
 * The fixture variant this browser asked for: `?fixture=holiday` in the URL
 * (remembered), else the stored choice, else "normal".
 *
 * @returns The variant.
 */
export function fixtureVariant(): FixtureVariant {
  if (typeof window === "undefined") return "normal";
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("fixture");
    if (fromUrl && VARIANTS.includes(fromUrl as FixtureVariant)) {
      window.localStorage.setItem(FIXTURE_VARIANT_KEY, fromUrl);
      return fromUrl as FixtureVariant;
    }
    const stored = window.localStorage.getItem(FIXTURE_VARIANT_KEY);
    return stored && VARIANTS.includes(stored as FixtureVariant) ? (stored as FixtureVariant) : "normal";
  } catch {
    return "normal";
  }
}
