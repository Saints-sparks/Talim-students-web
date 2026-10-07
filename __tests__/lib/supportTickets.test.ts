import { ApiError, messageForStatus } from "@/lib/apiError";
import {
  AREA_LABELS,
  CLOSED_TICKET_TEXT,
  STATUS_META,
  allowedDesks,
  areasFor,
  authorLine,
  canReopen,
  conflictMessage,
  deskLabel,
  messageCapText,
  parseTicketParam,
  relativeTime,
  reopenDeadline,
  reopenExpiredText,
  reopenHint,
  supportHref,
  ticketContext,
  unreadLabel,
  validateNewTicket,
  validateReply,
  INVALID_TRANSITION_TEXT,
  TICKET_CHANGED_TEXT,
} from "@/lib/support/tickets";
import { markReadInPages } from "@/hooks/support/useTickets";
import { createTicketStore } from "@/lib/fixtures/tickets.fixture";

const NOW = new Date("2026-10-07T12:00:00.000Z");
const DAY = 24 * 60 * 60 * 1000;
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();
const GOOD = { area: "results" as const, subject: "Biology total", body: "It shows blank.", attachmentCount: 0 };

describe("desks per role", () => {
  it("lets students and parents choose either desk, and staff only Talim", () => {
    expect(allowedDesks("student")).toEqual(["school", "talim"]);
    expect(allowedDesks("parent")).toEqual(["school", "talim"]);
    expect(allowedDesks("teacher")).toEqual(["talim"]);
    expect(allowedDesks("school_admin")).toEqual(["talim"]);
  });

  it("accepts either desk from a student, and refuses the school desk from a teacher", () => {
    expect(validateNewTicket({ ...GOOD, desk: "school" }, "student")).toEqual({});
    expect(validateNewTicket({ ...GOOD, desk: "talim" }, "student")).toEqual({});
    expect(validateNewTicket({ ...GOOD, desk: null }, "student").desk).toBe("Choose who should help: your school or Talim support.");
    expect(validateNewTicket({ ...GOOD, desk: "school" }, "teacher").desk).toBe("Tickets from your account go to Talim support.");
  });

  it("asks a parent for the child, never a student", () => {
    expect(validateNewTicket({ ...GOOD, desk: "school" }, "parent").childId).toBe("Choose which child this is about.");
    expect(validateNewTicket({ ...GOOD, desk: "school" }, "student").childId).toBeUndefined();
  });

  it("names the desks and offers the student's areas", () => {
    expect(deskLabel("school", "Easy Sparks")).toBe("My school (Easy Sparks)");
    expect(deskLabel("school")).toBe("My school");
    expect(deskLabel("talim", "Easy Sparks")).toBe("Talim support");
    expect(areasFor("student").map((area) => AREA_LABELS[area])).toEqual([
      "Results",
      "Attendance",
      "Timetable",
      "Messages",
      "Signing in",
      "Fees",
      "Transport",
      "Behaviour",
      "Something else",
    ]);
  });
});

describe("new ticket and reply checks", () => {
  it("needs an area, a 3–140 character subject and a 1–5000 character message, and at most 5 files", () => {
    expect(validateNewTicket({ desk: "talim", area: null, subject: " a ", body: "  ", attachmentCount: 6 }, "student")).toEqual({
      area: "Choose what it is about.",
      subject: "Give it a subject of at least 3 characters.",
      body: "Write what you need help with.",
      attachments: "Attach up to 5 files.",
    });
    expect(validateNewTicket({ ...GOOD, desk: "talim", subject: "x".repeat(141) }, "student").subject).toBe("Keep the subject to 140 characters.");
    expect(validateNewTicket({ ...GOOD, desk: "talim", body: "x".repeat(5001) }, "student").body).toBe("Keep the message to 5000 characters.");
    expect(validateReply("  ", 0)).toBe("Write a reply first.");
    expect(validateReply("Thanks", 6)).toBe("Attach up to 5 files.");
    expect(validateReply("Thanks", 5)).toBeNull();
  });

  it("names every status", () => {
    expect(Object.values(STATUS_META).map((meta) => meta.label)).toEqual(["Open", "In progress", "Waiting on you", "Resolved", "Closed"]);
    expect(STATUS_META.waiting_on_user.tone).toBe("warning");
    expect(STATUS_META.resolved.tone).toBe("success");
  });
});

describe("the 7-day reopen window", () => {
  it("runs from resolvedAt", () => {
    const recent = { status: "resolved" as const, resolvedAt: ago(2 * DAY) };
    const old = { status: "resolved" as const, resolvedAt: ago(10 * DAY) };
    expect(reopenDeadline(recent)?.toISOString()).toBe(new Date(NOW.getTime() + 5 * DAY).toISOString());
    expect(canReopen(recent, NOW)).toBe(true);
    expect(canReopen(old, NOW)).toBe(false);
    expect(canReopen({ status: "open", resolvedAt: null }, NOW)).toBe(false);
    expect(reopenHint(new Date("2026-10-12T09:00:00.000Z"))).toBe("You can reopen until 12 Oct 2026.");
  });
});

describe("409 words", () => {
  const bare = new ApiError("CONFLICT", messageForStatus(409), 409);

  it("maps the API's reason (top-level code) to its words", () => {
    const reason = (code: string) => ApiError.fromResponse({ status: 409, headers: { get: () => null } } as unknown as Response, { code, message: "Server words.", error: { code: "CONFLICT", message: "Server words." } });
    const resolved = { status: "resolved" as const, reference: "TS-1" };
    expect(reason("MESSAGE_CAP").reasonCode).toBe("MESSAGE_CAP");
    expect(conflictMessage(reason("TICKET_CLOSED"), "reply", resolved)).toBe(CLOSED_TICKET_TEXT);
    expect(conflictMessage(reason("REOPEN_WINDOW_PASSED"), "reply", resolved)).toBe(reopenExpiredText("TS-1"));
    expect(conflictMessage(reason("MESSAGE_CAP"), "reply", resolved)).toBe(messageCapText("TS-1"));
    expect(conflictMessage(reason("INVALID_TRANSITION"), "reopen", resolved)).toBe(INVALID_TRANSITION_TEXT);
    expect(conflictMessage(reason("TICKET_CHANGED"), "close", resolved)).toBe(TICKET_CHANGED_TEXT);
    expect(conflictMessage(reason("SOMETHING_NEW"), "close", resolved)).toBe("Server words.");
  });

  it("prefers the server's message when there is no reason", () => {
    expect(conflictMessage(new ApiError("CONFLICT", "Resolved over 7 days ago.", 409), "reopen", { status: "resolved", reference: "TS-1" })).toBe("Resolved over 7 days ago.");
  });

  it("explains a bare 409 from what was being done", () => {
    expect(conflictMessage(bare, "reopen", { status: "resolved", reference: "TS-9PX2D" })).toBe(reopenExpiredText("TS-9PX2D"));
    expect(reopenExpiredText("TS-9PX2D")).toBe("This ticket was resolved more than 7 days ago, so it can't be reopened. Raise a new ticket and mention TS-9PX2D.");
    expect(conflictMessage(bare, "reply", { status: "closed", reference: "TS-1" })).toBe(CLOSED_TICKET_TEXT);
    expect(conflictMessage(bare, "reply", { status: "open", reference: "TS-1" })).toBe(messageCapText("TS-1"));
  });

  it("answers 409 from the fixtures for a late reopen and a reply to a closed ticket", () => {
    const store = createTicketStore(() => NOW);
    expect(() => store.reopen("ticket-old")).toThrow(ApiError);
    expect(store.reopen("ticket-resolved").status).toBe("open");
    store.close("ticket-open");
    expect(() => store.reply("ticket-open", { body: "Hello?" })).toThrow(expect.objectContaining({ status: 409, reasonCode: "TICKET_CLOSED" }));
    expect(() => store.reply("ticket-old", { body: "Hello?" })).toThrow(expect.objectContaining({ status: 409, reasonCode: "REOPEN_WINDOW_PASSED" }));
  });
});

describe("unread and context", () => {
  it("reads the server's count as an 'N new' badge, cleared in the cached list once opened", () => {
    expect(unreadLabel({ unread: 0 })).toBeNull();
    expect(unreadLabel({ unread: 3 })).toBe("3 new");
    const store = createTicketStore(() => NOW);
    const pages = { pages: [store.listMine()], pageParams: [1] };
    expect(pages.pages[0].data[0]).toMatchObject({ id: "ticket-waiting", unread: 1 });
    const read = markReadInPages(pages, "ticket-waiting");
    expect(read?.pages[0].data[0].unread).toBe(0);
    expect(markReadInPages(read, "ticket-waiting")).toBe(read);
  });

  it("reads the reopen window from reopenableUntil when the detail has it", () => {
    expect(canReopen({ status: "resolved", resolvedAt: new Date(NOW.getTime() - 9 * 864e5).toISOString(), reopenableUntil: new Date(NOW.getTime() + 864e5).toISOString() }, NOW)).toBe(true);
    expect(canReopen({ status: "resolved", resolvedAt: new Date(NOW.getTime() - 864e5).toISOString(), reopenableUntil: new Date(NOW.getTime() - 1).toISOString() }, NOW)).toBe(false);
  });

  it("sends where the student was as context, cut to the API's lengths", () => {
    expect(ticketContext("1.5.0", { path: "/settings?tab=help", userAgent: "y".repeat(501) })).toEqual({ path: "/settings?tab=help", appVersion: "1.5.0", userAgent: "y".repeat(500) });
    expect(ticketContext("1.5.0", { path: null, userAgent: null })).toEqual({ appVersion: "1.5.0" });
  });
});

describe("thread and list words", () => {
  it("calls the student You and names the staff member's side", () => {
    expect(authorLine({ id: "me", name: "Musa", role: "student" }, "me")).toEqual({ name: "You", side: null });
    expect(authorLine({ id: "a", name: "Amaka Obi", role: "admin" }, "me")).toEqual({ name: "Amaka Obi", side: "Talim support" });
    expect(authorLine({ id: "s", name: "", role: "school_admin" }, "me")).toEqual({ name: "Your school", side: "School" });
  });

  it("says how long ago", () => {
    expect(relativeTime(ago(20_000), NOW)).toBe("just now");
    expect(relativeTime(ago(5 * 60_000), NOW)).toBe("5 min ago");
    expect(relativeTime(ago(3 * 60 * 60_000), NOW)).toBe("3 h ago");
    expect(relativeTime(ago(DAY + 1000), NOW)).toBe("yesterday");
    expect(relativeTime(ago(4 * DAY), NOW)).toBe("4 days ago");
    expect(relativeTime(null, NOW)).toBe("");
  });
});

describe("deep link", () => {
  it("opens Settings → Help with the thread, or the list without an id", () => {
    expect(supportHref("ticket-waiting")).toBe("/settings?tab=help&ticket=ticket-waiting");
    expect(supportHref()).toBe("/settings?tab=help");
    expect(parseTicketParam(" t1 ")).toBe("t1");
    expect(parseTicketParam(null)).toBeNull();
  });
});
