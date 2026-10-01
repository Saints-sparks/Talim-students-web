import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { AuthContext } from "@/contexts/AuthContext";
import { StudentOnboardingProvider } from "@/contexts/OnboardingContext";
import { resetOnboardingSync, useStudentOnboardingSync } from "@/hooks/useStudentOnboardingSync";
import { accountService } from "@/services/account.service";
import { learnerService } from "@/services/learner.service";
import { makeFiles, makeNotificationCounts, makeTimetable } from "@/lib/fixtures/learner.fixture";
import { makeTestQueryClient, mockStudent } from "@/test-utils/render";

jest.mock("@/services/account.service", () => ({ accountService: { getNotificationCounts: jest.fn() } }));
jest.mock("@/services/learner.service", () => ({ learnerService: { getTimetable: jest.fn(), getFiles: jest.fn() } }));

const counts = accountService.getNotificationCounts as jest.Mock;
const timetable = learnerService.getTimetable as jest.Mock;
const files = learnerService.getFiles as jest.Mock;

/**
 * The providers the sync needs: query cache, a signed-in student, onboarding.
 *
 * @param props - Standard children.
 * @param props.children - The hook's host.
 * @returns The providers.
 */
function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={makeTestQueryClient()}>
      <AuthContext.Provider
        value={{ user: mockStudent, isAuthenticated: true, isLoading: false, accessToken: "t", checkAuth: jest.fn(), logout: jest.fn(), setAuthState: jest.fn() }}
      >
        <StudentOnboardingProvider>{children}</StudentOnboardingProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

describe("useStudentOnboardingSync", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    resetOnboardingSync();
    counts.mockResolvedValue(makeNotificationCounts("normal"));
    timetable.mockResolvedValue(makeTimetable("normal"));
    files.mockResolvedValue(makeFiles("normal"));
  });

  it("runs its checks once per student, at most three requests, however often it is called", async () => {
    const { result } = renderHook(() => useStudentOnboardingSync(), { wrapper });
    await act(async () => {
      await result.current.syncProgress();
      await result.current.syncProgress();
      await result.current.syncProgress();
    });
    expect(counts).toHaveBeenCalledTimes(1);
    expect(timetable).toHaveBeenCalledTimes(1);
    expect(files).toHaveBeenCalledTimes(1);
    expect(files).toHaveBeenCalledWith({ page: 1, limit: 20 });
    const saved = JSON.parse(localStorage.getItem("student_onboarding_user-1") ?? "{}");
    expect(saved.completedSteps).toEqual(expect.arrayContaining(["student-profile", "view-notifications", "view-timetable", "download-resource"]));
  });

  it("sends nothing for steps that are already done", async () => {
    localStorage.setItem(
      "student_onboarding_user-1",
      JSON.stringify({ completedSteps: ["student-profile", "view-notifications", "view-timetable", "download-resource"], phase1Completed: true })
    );
    const { result } = renderHook(() => useStudentOnboardingSync(), { wrapper });
    await act(async () => {
      await result.current.syncProgress();
    });
    expect(counts).not.toHaveBeenCalled();
    expect(timetable).not.toHaveBeenCalled();
    expect(files).not.toHaveBeenCalled();
  });
});
