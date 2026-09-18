import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { notificationService } from "@/services/notification.service";
import { ApiError } from "@/lib/apiError";
import { makeTestQueryClient, mockStudent } from "@/test-utils/render";

jest.mock("@/services/notification.service", () => ({
  notificationService: { getPreferences: jest.fn(), updatePreferences: jest.fn() },
}));

jest.mock("@/hooks/useStudentIdentity", () => ({
  useStudentIdentity: () => ({
    userId: "user-1",
    studentId: "student-1",
    classId: "class-1",
    className: "JSS 2A",
    termId: "term-1",
    isReady: true,
  }),
}));

const getPreferences = notificationService.getPreferences as jest.Mock;
const updatePreferences = notificationService.updatePreferences as jest.Mock;

function wrapper({ children }: { children: React.ReactNode }) {
  const client = makeTestQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useNotificationPreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    expect(mockStudent.role).toBe("student");
  });

  it("merges the server's document over the defaults", async () => {
    getPreferences.mockResolvedValue({ resultsEnabled: false, emailEnabled: false });
    const { result } = renderHook(() => useNotificationPreferences(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.preferences.resultsEnabled).toBe(false);
    expect(result.current.preferences.announcementsEnabled).toBe(true);
  });

  it("PATCHes only the field that changed", async () => {
    getPreferences.mockResolvedValue({});
    updatePreferences.mockResolvedValue({ attendanceEnabled: false });
    const { result } = renderHook(() => useNotificationPreferences(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.set("attendanceEnabled", false));

    await waitFor(() => expect(updatePreferences).toHaveBeenCalledWith({ attendanceEnabled: false }));
    await waitFor(() => expect(result.current.preferences.attendanceEnabled).toBe(false));
  });

  it("rolls the switch back and explains when the save fails", async () => {
    getPreferences.mockResolvedValue({ messagesEnabled: true });
    updatePreferences.mockRejectedValue(new ApiError("VALIDATION_FAILED", "Some details need attention.", 400));
    const { result } = renderHook(() => useNotificationPreferences(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.set("messagesEnabled", false));

    await waitFor(() => expect(result.current.saveError).toBe("Some details need attention."));
    expect(result.current.preferences.messagesEnabled).toBe(true);
  });

  it("still lets the student save when the read failed", async () => {
    getPreferences.mockRejectedValue(ApiError.unreachable());
    const { result } = renderHook(() => useNotificationPreferences(), { wrapper });

    await waitFor(() => expect(result.current.loadError).toMatch(/Defaults are shown/));
    expect(result.current.preferences.announcementsEnabled).toBe(true);
  });
});
