import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationService } from "@/services/notification.service";
import { accountService } from "@/services/account.service";
import { makeRawAnnouncements, makeRawNotifications } from "@/lib/fixtures/learner.fixture";
import { makeTestQueryClient } from "@/test-utils/render";

jest.mock("@/services/notification.service", () => ({
  notificationService: {
    getNotifications: jest.fn(),
    getAnnouncements: jest.fn(),
    markNotificationAsRead: jest.fn(),
    markAnnouncementAsRead: jest.fn(),
  },
}));
jest.mock("@/services/account.service", () => ({ accountService: { markAllNotificationsRead: jest.fn() } }));
jest.mock("@/hooks/useStudentIdentity", () => ({
  useStudentIdentity: () => ({ userId: "user-1", studentId: "s1", classId: "c1", className: "Jss1 A", termId: "t1", isReady: true }),
}));

const getNotifications = notificationService.getNotifications as jest.Mock;
const getAnnouncements = notificationService.getAnnouncements as jest.Mock;
const markOne = notificationService.markNotificationAsRead as jest.Mock;
const markAnnouncement = notificationService.markAnnouncementAsRead as jest.Mock;
const readAll = accountService.markAllNotificationsRead as jest.Mock;

/**
 * A fresh query cache per test.
 *
 * @param props - Standard children.
 * @param props.children - The hook's host.
 * @returns The provider.
 */
function wrapper({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={makeTestQueryClient()}>{children}</QueryClientProvider>;
}

describe("useNotifications mark all as read", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getNotifications.mockResolvedValue({ data: makeRawNotifications("normal") });
    getAnnouncements.mockResolvedValue({ data: makeRawAnnouncements("normal") });
  });

  it("sends one PATCH /notifications/read-all, never a request per item", async () => {
    let release: () => void = () => undefined;
    readAll.mockImplementation(() => new Promise((resolve) => (release = () => resolve({ updated: 2 }))));
    const { result } = renderHook(() => useNotifications(), { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(4));
    expect(result.current.notifications.filter((n) => n.unread)).toHaveLength(2);

    let done: Promise<void> = Promise.resolve();
    act(() => {
      done = result.current.markAllAsRead();
    });
    // Optimistic: everything reads as read before the server answers.
    await waitFor(() => expect(result.current.notifications.every((n) => !n.unread)).toBe(true));
    await act(async () => {
      release();
      await done;
    });

    expect(readAll).toHaveBeenCalledTimes(1);
    expect(markOne).not.toHaveBeenCalled();
    expect(markAnnouncement).not.toHaveBeenCalled();
  });

  it("rolls back when the server refuses", async () => {
    readAll.mockRejectedValue(new Error("nope"));
    getNotifications.mockResolvedValueOnce({ data: makeRawNotifications("normal") }).mockResolvedValue({ data: makeRawNotifications("normal") });
    const { result } = renderHook(() => useNotifications(), { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(4));
    await act(async () => {
      await result.current.markAllAsRead();
    });
    await waitFor(() => expect(result.current.notifications.filter((n) => n.unread)).toHaveLength(2));
    expect(readAll).toHaveBeenCalledTimes(1);
  });

  it("does nothing when nothing is unread", async () => {
    getNotifications.mockResolvedValue({ data: makeRawNotifications("normal").map((n) => ({ ...n, isRead: true })) });
    const { result } = renderHook(() => useNotifications(), { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(4));
    await act(async () => {
      await result.current.markAllAsRead();
    });
    expect(readAll).not.toHaveBeenCalled();
  });
});
