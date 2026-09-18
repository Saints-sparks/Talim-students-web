import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/providers/theme-provider";
import type { User } from "@/types/auth";

// ─── Mock user presets ───────────────────────────────────────────────────────

export const mockStudent: User = {
  userId: "user-1",
  id: "user-1",
  studentId: "student-1",
  firstName: "Ada",
  lastName: "Nwosu",
  email: "ada@talim.test",
  role: "student",
  schoolId: "0123456789abcdef01234567",
  schoolName: "Talim Test School",
};

// ─── Mock auth context value ─────────────────────────────────────────────────

function makeMockAuthValue(user: User | null) {
  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: false,
    accessToken: user ? "mock-token" : null,
    checkAuth: jest.fn().mockResolvedValue(Boolean(user)),
    logout: jest.fn(),
    setAuthState: jest.fn(),
  };
}

/** A QueryClient that never retries and never leaks cache between tests. */
export function makeTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

function AllProviders({
  children,
  user = mockStudent,
  client,
}: {
  children: React.ReactNode;
  user?: User | null;
  client: QueryClient;
}) {
  return (
    <QueryClientProvider client={client}>
      <AuthContext.Provider value={makeMockAuthValue(user)}>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

type ProviderOptions = RenderOptions & { user?: User | null; client?: QueryClient };

/**
 * Renders a component inside the app's providers (query cache, auth, theme).
 *
 * @param ui - The element under test.
 * @param options - Testing Library options plus an optional `user` and `client`.
 * @returns The Testing Library render result, plus the QueryClient used.
 */
function renderWithProviders(ui: React.ReactElement, options?: ProviderOptions) {
  const { user, client = makeTestQueryClient(), ...renderOptions } = options ?? {};
  const result = render(ui, {
    wrapper: ({ children }) => (
      <AllProviders user={user} client={client}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
  return { ...result, client };
}

export * from "@testing-library/react";
export { renderWithProviders, renderWithProviders as render };
