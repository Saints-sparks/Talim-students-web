/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { PushNotificationToggle } from "@/components/notifications/PushNotificationToggle";
import { usePushNotifications } from "@/hooks/usePushNotifications";

jest.mock("@/hooks/usePushNotifications");

/**
 * Renders the toggle for a given hook state.
 *
 * @param state - Fields of the hook result to override.
 */
function renderWith(state: Partial<ReturnType<typeof usePushNotifications>>) {
  (usePushNotifications as jest.Mock).mockReturnValue({
    isSupported: true,
    permission: "default",
    isSubscribed: false,
    isLoading: false,
    error: null,
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    ...state,
  });
  return render(<PushNotificationToggle />);
}

describe("PushNotificationToggle when the browser blocks notifications", () => {
  it("explains calmly what is lost, what still works and how to re-enable, with no alarm styling", () => {
    const { container } = renderWith({ permission: "denied" });

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/not to show Talim alerts/i);
    expect(status).toHaveTextContent(/Notifications inside Talim keep working/i);
    expect(status).toHaveTextContent(/site.s settings/i);
    expect(screen.queryByText("Blocked")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/red-/);
    // Readable in both themes.
    expect(container.innerHTML).toMatch(/dark:text-slate-400/);
  });

  it("still offers the switch when permission has not been decided", () => {
    renderWith({ permission: "default" });

    expect(screen.getByRole("button", { name: /enable browser notifications/i })).toBeEnabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
