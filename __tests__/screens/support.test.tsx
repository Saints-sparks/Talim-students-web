/**
 * Settings → Help → My tickets (v1.5 tickets) against the ticket fixtures:
 * the list, the thread, a new ticket (the student's desk choice and the
 * checks), a reply, reopen inside and outside the 7-day window (409), close,
 * the `?ticket=` deep link, and the settings guide's targets.
 */
import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@/test-utils/render";
import SettingsScreen from "@/components/screens/settings/SettingsScreen";
import { TourProvider } from "@/components/tour/TourProvider";
import { findGuideConfig } from "@/components/onboarding/guideSteps";
import { ticketsService } from "@/services/tickets.service";
import { ApiError } from "@/lib/apiError";

const mockReplace = jest.fn();
let mockSearch = "";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: mockReplace, prefetch: jest.fn() }),
  usePathname: () => "/settings",
  useSearchParams: () => new URLSearchParams(mockSearch),
}));

jest.mock("@/services/tickets.service", () => {
  const { createTicketStore } = jest.requireActual("@/lib/fixtures/tickets.fixture");
  const store = createTicketStore();
  return {
    mockStore: store,
    ticketsService: {
      listMine: jest.fn(async (query: object) => store.listMine(query)),
      get: jest.fn(async (id: string) => store.get(id)),
      create: jest.fn(async (payload: object) => store.create(payload)),
      reply: jest.fn(async (id: string, payload: object) => store.reply(id, payload)),
      reopen: jest.fn(async (id: string) => store.reopen(id)),
      close: jest.fn(async (id: string) => store.close(id)),
      uploadAttachment: jest.fn(async (file: File) => ({ url: `https://files.test/${file.name}`, name: file.name, mimeType: file.type, size: file.size })),
    },
  };
});

const service = jest.mocked(ticketsService);
const { mockStore } = jest.requireMock("@/services/tickets.service") as { mockStore: { reset: () => void } };

/**
 * Renders Settings with a query string.
 *
 * @param search - e.g. "tab=help&ticket=ticket-waiting".
 * @returns The render result.
 */
function renderSettings(search: string) {
  mockSearch = search;
  return render(
    <TourProvider>
      <SettingsScreen />
    </TourProvider>
  );
}

/**
 * Opens a thread from ?ticket= and waits for its messages.
 *
 * @param ticketId - The ticket.
 * @returns The thread's dialog.
 */
async function openThread(ticketId: string) {
  renderSettings(`tab=help&ticket=${ticketId}`);
  const dialog = await screen.findByRole("dialog");
  await within(dialog).findByRole("list", { name: "Messages" });
  return dialog;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockStore.reset();
});

describe("My tickets list", () => {
  it("replaces Report a problem with the student's tickets: status chips, unread dot and last activity, in one call", async () => {
    renderSettings("tab=help");
    const list = await screen.findByRole("list", { name: "My tickets" });
    const rows = within(list).getAllByRole("button");
    expect(rows).toHaveLength(4);
    expect(rows[0]).toHaveTextContent("New reply.");
    expect(rows[0]).toHaveTextContent("Signed out every time I close the tab");
    expect(rows[0]).toHaveTextContent("TS-4K7QM · Talim support · Updated 3 h ago");
    expect(rows[0]).toHaveTextContent("Waiting on you");
    expect(rows[1]).toHaveTextContent("CMP-2026-0142 · My school (Talim Test School)");
    expect(rows[1]).toHaveTextContent("Open");
    expect(rows[1]).not.toHaveTextContent("New reply.");
    expect(rows[2]).toHaveTextContent("Resolved");
    expect(service.listMine).toHaveBeenCalledTimes(1);
    expect(service.get).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /Report a problem/ })).not.toBeInTheDocument();
  });

  it("opens a thread from a row and records it in the URL", async () => {
    renderSettings("tab=help");
    const list = await screen.findByRole("list", { name: "My tickets" });
    fireEvent.click(within(list).getByRole("button", { name: /Two lessons at 10:00/ }));
    const dialog = await screen.findByRole("dialog");
    expect(await within(dialog).findByRole("heading", { name: "Two lessons at 10:00 on Wednesday" })).toBeInTheDocument();
    expect(mockReplace).toHaveBeenCalledWith("/settings?tab=help&ticket=ticket-open", { scroll: false });
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(mockReplace).toHaveBeenLastCalledWith("/settings?tab=help", { scroll: false }));
  });

  it("shows the settings guide's targets on Help, the support section included", async () => {
    renderSettings("tab=help");
    await screen.findByRole("list", { name: "My tickets" });
    const guide = findGuideConfig("/settings");
    expect(guide?.steps.map((step) => step.target)).toContain("settings-support");
    const missing = guide!.steps.map((step) => step.target).filter((target) => !document.querySelector(`[data-guide="${target}"]`));
    expect(missing).toEqual([]);
  });
});

describe("Ticket thread", () => {
  it("opens from the ?ticket= deep link with the messages, authors and status", async () => {
    const dialog = await openThread("ticket-waiting");
    expect(within(dialog).getByRole("heading", { name: "Signed out every time I close the tab" })).toBeInTheDocument();
    expect(dialog).toHaveTextContent("TS-4K7QM");
    expect(dialog).toHaveTextContent("Talim support · Signing in");
    expect(within(dialog).getByText("Waiting on you")).toBeInTheDocument();
    const messages = within(within(dialog).getByRole("list", { name: "Messages" })).getAllByRole("listitem");
    expect(messages[0]).toHaveTextContent("You");
    expect(messages[0]).toHaveTextContent("Each time I close the tab");
    expect(messages[1]).toHaveTextContent("Amaka Obi");
    expect(messages[1]).toHaveTextContent("Talim support");
    expect(service.get).toHaveBeenCalledWith("ticket-waiting");
  });

  it("sends a reply and shows it in the thread", async () => {
    const dialog = await openThread("ticket-waiting");
    fireEvent.click(within(dialog).getByRole("button", { name: "Send reply" }));
    expect(within(dialog).getByLabelText("Your reply")).toHaveAccessibleDescription(/Write a reply first\./);
    expect(service.reply).not.toHaveBeenCalled();

    fireEvent.change(within(dialog).getByLabelText("Your reply"), { target: { value: "  Chrome, not private.  " } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Send reply" }));
    await waitFor(() => expect(service.reply).toHaveBeenCalledWith("ticket-waiting", { body: "Chrome, not private." }));
    expect(await within(dialog).findByText("Chrome, not private.")).toBeInTheDocument();
    await waitFor(() => expect(within(dialog).getByLabelText("Your reply")).toHaveValue(""));
  });

  it("reopens a ticket resolved two days ago", async () => {
    const dialog = await openThread("ticket-resolved");
    expect(within(dialog).getByText(/^You can reopen until /)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "Reopen" }));
    await waitFor(() => expect(service.reopen).toHaveBeenCalledWith("ticket-resolved"));
    expect(await within(dialog).findByText("Open")).toBeInTheDocument();
  });

  it("shows the 409 when the server refuses a reopen", async () => {
    service.reopen.mockRejectedValueOnce(new ApiError("CONFLICT", "", 409));
    const dialog = await openThread("ticket-resolved");
    fireEvent.click(within(dialog).getByRole("button", { name: "Reopen" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "This ticket was resolved more than 7 days ago, so it can't be reopened. Raise a new ticket and mention CMP-2026-0131."
    );
  });

  it("offers no Reopen ten days after resolving, only the reason and a new ticket", async () => {
    const dialog = await openThread("ticket-old");
    expect(within(dialog).getByText(/can't be reopened\. Raise a new ticket and mention TS-9PX2D\./)).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: "Reopen" })).not.toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "New ticket" }));
    expect(await screen.findByRole("heading", { name: "How can we help?" })).toBeInTheDocument();
  });

  it("closes after a confirm step, then takes no replies", async () => {
    const dialog = await openThread("ticket-open");
    fireEvent.click(within(dialog).getByRole("button", { name: "Close ticket" }));
    expect(within(dialog).getByRole("button", { name: "Yes, close ticket" })).toHaveFocus();
    fireEvent.click(within(dialog).getByRole("button", { name: "Yes, close ticket" }));
    await waitFor(() => expect(service.close).toHaveBeenCalledWith("ticket-open"));
    expect(await within(dialog).findByText("This ticket is closed, so it takes no more replies. Raise a new ticket if you still need help.")).toBeInTheDocument();
    expect(within(dialog).queryByLabelText("Your reply")).not.toBeInTheDocument();
  });

  it("explains a 409 on a reply and keeps the draft", async () => {
    service.reply.mockRejectedValueOnce(new ApiError("CONFLICT", "This ticket was closed by your school.", 409));
    const dialog = await openThread("ticket-open");
    fireEvent.change(within(dialog).getByLabelText("Your reply"), { target: { value: "Any news?" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Send reply" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent("This ticket was closed by your school.");
    expect(within(dialog).getByLabelText("Your reply")).toHaveValue("Any news?");
  });
});

describe("New ticket", () => {
  /**
   * Opens the New ticket sheet from Help.
   *
   * @returns Its dialog.
   */
  async function openNew() {
    renderSettings("tab=help");
    await screen.findByRole("list", { name: "My tickets" });
    fireEvent.click(screen.getByRole("button", { name: "New ticket" }));
    return screen.findByRole("dialog", { name: "How can we help?" });
  }

  it("lets a student choose My school or Talim support, and checks every field on Send", async () => {
    const dialog = await openNew();
    const desks = within(dialog).getByRole("radiogroup", { name: "Who should help?" });
    expect(within(desks).getAllByRole("radio").map((radio) => radio.textContent)).toEqual(["My school (Talim Test School)", "Talim support"]);
    fireEvent.click(within(dialog).getByRole("button", { name: "Send ticket" }));

    expect(within(dialog).getByText("Choose who should help: your school or Talim support.")).toBeInTheDocument();
    expect(within(dialog).getByText("Choose what it is about.")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Subject")).toHaveAccessibleDescription(/Give it a subject of at least 3 characters\./);
    expect(within(dialog).getByLabelText("Message")).toHaveAccessibleDescription(/Write what you need help with\./);
    expect(within(desks).getByRole("radio", { name: /My school/ })).toHaveFocus();
    expect(service.create).not.toHaveBeenCalled();
  });

  it("raises a ticket to the school with a file, then opens its thread", async () => {
    const dialog = await openNew();
    fireEvent.click(within(dialog).getByRole("radio", { name: /My school/ }));
    fireEvent.click(within(dialog).getByRole("radio", { name: "Fees" }));
    fireEvent.change(within(dialog).getByLabelText("Subject"), { target: { value: " Fee receipt missing " } });
    fireEvent.change(within(dialog).getByLabelText("Message"), { target: { value: "I paid on Monday but have no receipt." } });
    const file = new File(["pdf"], "receipt.pdf", { type: "application/pdf" });
    fireEvent.change(dialog.querySelector('input[type="file"]') as HTMLInputElement, { target: { files: [file] } });
    expect(within(dialog).getByRole("list", { name: "Attached files" })).toHaveTextContent("receipt.pdf");
    fireEvent.click(within(dialog).getByRole("button", { name: "Send ticket" }));

    await waitFor(() =>
      expect(service.create).toHaveBeenCalledWith({
        desk: "school",
        area: "fees",
        subject: "Fee receipt missing",
        body: "I paid on Monday but have no receipt.",
        attachments: [{ url: "https://files.test/receipt.pdf", name: "receipt.pdf", mimeType: "application/pdf", size: 3 }],
      })
    );
    expect(await screen.findByRole("heading", { name: "Fee receipt missing" })).toBeInTheDocument();
    expect(mockReplace).toHaveBeenCalledWith("/settings?tab=help&ticket=ticket-new-1", { scroll: false });
  });
});
