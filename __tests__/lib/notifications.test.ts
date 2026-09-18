import {
  buildRelated,
  countByCategory,
  inferCategory,
  isDuplicateAnnouncement,
  itemsOf,
  normalizeAnnouncement,
  normalizeNotification,
  sortByNewest,
  type StudentNotification,
} from "@/lib/notifications/normalize";
import { filterNotifications } from "@/lib/notifications/filter";

const USER = "user-1";

describe("inferCategory", () => {
  it("prefers an explicit category", () => {
    expect(inferCategory({ category: "grading", type: "chat_message" }, "other")).toBe("grading");
  });

  it("maps the backend notification types", () => {
    expect(inferCategory({ type: "result_published" }, "other")).toBe("grading");
    expect(inferCategory({ type: "attendance_alert" }, "other")).toBe("attendance");
    expect(inferCategory({ type: "chat_message" }, "other")).toBe("messages");
    // There is no "assignment" category — assignment types are academics.
    expect(inferCategory({ type: "assignment_due" }, "other")).toBe("academics");
  });

  it("falls back to whole-word matching for unknown types", () => {
    expect(inferCategory({ title: "Your result is ready" }, "other")).toBe("grading");
    expect(inferCategory({ title: "Absent on Monday" }, "other")).toBe("attendance");
    expect(inferCategory({ title: "Nothing in particular" }, "other")).toBe("other");
  });
});

describe("normalizeAnnouncement", () => {
  it("builds a renderable item from a populated announcement", () => {
    const item = normalizeAnnouncement(
      {
        _id: "a1",
        title: "Midterm break",
        message: "School closes Friday.",
        publishedAt: "2026-02-01T09:00:00.000Z",
        senderId: { firstName: "Ada", lastName: "Obi", email: "ada@school.test" },
        readBy: [{ userId: "someone-else" }],
        attachments: ["https://cdn/one.pdf"],
      },
      USER
    );

    expect(item.id).toBe("announcement:a1");
    expect(item.rawId).toBe("a1");
    expect(item.endpoint).toBe("announcement");
    expect(item.senderName).toBe("Ada Obi");
    expect(item.unread).toBe(true);
    expect(item.attachments).toEqual(["https://cdn/one.pdf"]);
  });

  it("treats the student's own id in readBy as read", () => {
    const item = normalizeAnnouncement({ _id: "a2", readBy: [{ userId: USER }] }, USER);
    expect(item.unread).toBe(false);
  });

  it("prefers an explicit isRead flag", () => {
    expect(normalizeAnnouncement({ _id: "a3", isRead: true, readBy: [] }, USER).unread).toBe(false);
  });
});

describe("normalizeNotification", () => {
  it("labels the source", () => {
    expect(normalizeNotification({ _id: "n1", source: "talim" }, USER).sourceLabel).toBe("Talim Alert");
    expect(normalizeNotification({ _id: "n2" }, USER).sourceLabel).toBe("System Notification");
  });

  it("falls back through message, body and content", () => {
    expect(normalizeNotification({ _id: "n3", body: "from body" }, USER).message).toBe("from body");
    expect(normalizeNotification({ _id: "n4" }, USER).message).toBe("No message provided.");
  });
});

describe("buildRelated", () => {
  it("keeps chips that lead somewhere this app can open", () => {
    const related = buildRelated({ metadata: { className: "JSS 2A", resourceTitle: "Notes", resourceUrl: "/r/1" } });
    expect(related).toEqual([{ label: "JSS 2A" }, { label: "Notes", href: "/r/1" }]);
  });

  it("drops the assignment chip — the students app has no assignments screen", () => {
    const related = buildRelated({ metadata: { assignmentTitle: "Essay 1", assignmentUrl: "/assignments/1" } });
    expect(related).toEqual([]);
  });
});

describe("itemsOf and isDuplicateAnnouncement", () => {
  it("reads both envelope shapes and a bare array", () => {
    expect(itemsOf({ data: [{ _id: "1" }] })).toHaveLength(1);
    expect(itemsOf({ announcements: [{ _id: "1" }] })).toHaveLength(1);
    expect(itemsOf([{ _id: "1" }])).toHaveLength(1);
    expect(itemsOf(null)).toEqual([]);
  });

  it("spots a notification that mirrors an announcement", () => {
    expect(isDuplicateAnnouncement({ source: "school", category: "announcement" })).toBe(true);
    expect(isDuplicateAnnouncement({ source: "school", metadata: { announcementId: "a1" } })).toBe(true);
    expect(isDuplicateAnnouncement({ source: "school", category: "attendance" })).toBe(false);
    expect(isDuplicateAnnouncement({ source: "talim", category: "announcement" })).toBe(false);
  });
});

function fixture(overrides: Partial<StudentNotification>): StudentNotification {
  return {
    id: "notification:1",
    rawId: "1",
    source: "system",
    sourceLabel: "System Notification",
    category: "other",
    title: "Title",
    message: "Body",
    createdAt: "2026-02-01T09:00:00.000Z",
    unread: false,
    senderName: "Talim",
    attachments: [],
    related: [],
    endpoint: "notification",
    ...overrides,
  };
}

describe("counting, sorting and filtering", () => {
  const items = [
    fixture({ id: "a", category: "grading", unread: true, createdAt: "2026-02-03T09:00:00.000Z", title: "Maths result" }),
    fixture({ id: "b", category: "resources", createdAt: "2026-02-01T09:00:00.000Z", title: "New notes" }),
    fixture({ id: "c", category: "grading", createdAt: "2026-02-02T09:00:00.000Z", title: "English result" }),
  ];

  it("counts every tab in one pass", () => {
    const counts = countByCategory(items);
    expect(counts.all).toBe(3);
    expect(counts.unread).toBe(1);
    expect(counts.grading).toBe(2);
    expect(counts.messages).toBe(0);
  });

  it("sorts newest first", () => {
    expect(sortByNewest(items).map((i) => i.id)).toEqual(["a", "c", "b"]);
  });

  it("filters by tab", () => {
    const filtered = filterNotifications(items, {
      tab: "grading",
      query: "",
      sort: "newest",
      categoryLabel: () => "",
    });
    expect(filtered.map((i) => i.id)).toEqual(["a", "c"]);
  });

  it("filters to unread only", () => {
    const filtered = filterNotifications(items, { tab: "unread", query: "", sort: "newest", categoryLabel: () => "" });
    expect(filtered.map((i) => i.id)).toEqual(["a"]);
  });

  it("searches the title, body, sender and category label", () => {
    const byTitle = filterNotifications(items, { tab: "all", query: "english", sort: "newest", categoryLabel: () => "" });
    expect(byTitle.map((i) => i.id)).toEqual(["c"]);

    const byLabel = filterNotifications(items, {
      tab: "all",
      query: "results",
      sort: "newest",
      categoryLabel: (n) => (n.category === "grading" ? "Results" : "Resources"),
    });
    expect(byLabel.map((i) => i.id)).toEqual(["a", "c"]);
  });

  it("orders oldest first and unread first on request", () => {
    expect(
      filterNotifications(items, { tab: "all", query: "", sort: "oldest", categoryLabel: () => "" }).map((i) => i.id)
    ).toEqual(["b", "c", "a"]);
    expect(
      filterNotifications(items, { tab: "all", query: "", sort: "unread", categoryLabel: () => "" })[0].id
    ).toBe("a");
  });
});
