/**
 * Helper types over `./api.d.ts`.
 *
 * `api.d.ts` is a COPY of the backend's generated contract
 * (`talimBE-V2/docs/api-types.d.ts`, produced by `openapi-typescript` from the
 * controllers and DTOs). Never edit it here. To refresh it after a backend
 * contract change:
 *
 *   npm run types:api                      # reads ../talimBE-V2
 *   TALIM_BACKEND_PATH=/path/to/talimBE-V2 npm run types:api
 *
 * then run `npm run typecheck`: any request payload that no longer matches a
 * DTO fails the build instead of returning a 400 in production (the API runs
 * `whitelist + forbidNonWhitelisted`).
 *
 * The types describe the LEGACY body of each endpoint. Success responses are
 * only partly typed by the backend, so prefer these for request bodies.
 */
import type { components, paths } from "./api";

type Json = "application/json";

/** HTTP methods that appear in the generated `paths` map. */
export type ApiMethod = "get" | "post" | "put" | "patch" | "delete";

/** Body of `METHOD path` for one content type; `never` when the operation has none. */
type BodyOf<P extends keyof paths, M extends ApiMethod, C extends string> =
  NonNullable<paths[P][M]> extends { requestBody?: infer R }
    ? [NonNullable<R>] extends [never]
      ? never
      : NonNullable<R> extends { content: Record<C, infer B> }
        ? B
        : never
    : never;

/** Request body of `METHOD path` (`never` when the operation takes no JSON body). */
export type RequestBody<P extends keyof paths, M extends ApiMethod = "post"> = BodyOf<P, M, Json>;

/** Success (200/201) body of `METHOD path` (`never` when the backend does not type it). */
export type ResponseBody<P extends keyof paths, M extends ApiMethod = "get"> =
  NonNullable<paths[P][M]> extends { responses: infer R }
    ? R extends { 200: { content: Record<Json, infer B> } }
      ? B
      : R extends { 201: { content: Record<Json, infer B> } }
        ? B
        : never
    : never;

/** Multipart body of `METHOD path` (file uploads), or `never`. */
export type MultipartBody<P extends keyof paths, M extends ApiMethod = "post"> = BodyOf<P, M, "multipart/form-data">;

/** Query string of `METHOD path`. */
export type RequestQuery<P extends keyof paths, M extends ApiMethod = "get"> =
  NonNullable<paths[P][M]> extends { parameters: { query?: infer Q } } ? Q : never;

/** A schema by name, e.g. `Schema<"CreateAttendanceDto">`. */
export type Schema<N extends keyof components["schemas"]> = components["schemas"][N];
