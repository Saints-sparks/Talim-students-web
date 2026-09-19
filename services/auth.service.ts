// services/auth.service.ts
import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import type { LoginCredentials, LoginResponse, IntrospectResponse } from "@/types/auth";
import type { ForgotPasswordPayload, IntrospectPayload, LoginPayload, ResetPasswordPayload } from "@/types/apiPayloads";

/**
 * Authentication calls. Every one of these runs before (or instead of) a
 * session, so they all pass `skipAuth`: a 401 here means "wrong credentials",
 * not "session expired", and must never trigger a token refresh.
 */
export const authService = {
  /**
   * Signs a student in.
   *
   * @param credentials - Identifier/email, password, device token and platform.
   * @returns The tokens and the signed-in user.
   * @throws {ApiError} `UNAUTHENTICATED` for bad credentials.
   */
  login: (credentials: LoginCredentials): Promise<LoginResponse> => {
    const body: LoginPayload = credentials;
    return api.post<LoginResponse>(API_ENDPOINTS.LOGIN, body, { skipAuth: true });
  },

  /**
   * Validates an access token and returns the student behind it.
   *
   * @param token - The access token to introspect.
   * @returns The introspection result, including the student profile.
   * @throws {ApiError} When the token is expired or unknown.
   */
  introspect: (token: string): Promise<IntrospectResponse> => {
    const body: IntrospectPayload = { token };
    return api.post<IntrospectResponse>(API_ENDPOINTS.INTROSPECT, body, { skipAuth: true });
  },

  /**
   * Exchanges the refresh cookie for a new access token.
   *
   * @returns The new access token.
   * @throws {ApiError} `TOKEN_EXPIRED` when the refresh cookie is gone.
   */
  refresh: (): Promise<Pick<LoginResponse, "access_token">> =>
    api.post<Pick<LoginResponse, "access_token">>(API_ENDPOINTS.REFRESH, undefined, { skipAuth: true }),

  /**
   * Starts a password reset by emailing the student a code.
   *
   * @param email - The address the account was registered with.
   * @returns The server's confirmation message.
   * @throws {ApiError} `VALIDATION_FAILED` when the address is malformed.
   */
  forgotPassword: (email: string): Promise<{ message: string }> => {
    const body: ForgotPasswordPayload = { email };
    return api.post<{ message: string }>(API_ENDPOINTS.FORGOT_PASSWORD, body, { skipAuth: true });
  },

  /**
   * Completes a password reset with the emailed code.
   *
   * @param email - The address the code was sent to.
   * @param token - The code from the email.
   * @param newPassword - The password to set.
   * @returns The server's confirmation message.
   * @throws {ApiError} `VALIDATION_FAILED` for a bad code or weak password.
   */
  resetPassword: (email: string, token: string, newPassword: string): Promise<{ message: string }> => {
    const body: ResetPasswordPayload = { email, token, newPassword };
    return api.post<{ message: string }>(API_ENDPOINTS.RESET_PASSWORD, body, { skipAuth: true });
  },
};
