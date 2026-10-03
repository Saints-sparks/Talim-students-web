import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@/test-utils/render";
import MessagesScreen from "@/components/screens/messages/MessagesScreen";
import { makeRoomMedia } from "@/lib/fixtures/learner.fixture";
import { toRealtimeRoom } from "@/lib/chat";
import { accountService } from "@/services/account.service";
import type { ChatContextValue } from "@/contexts/chat/types";
import type { ChatMessage, ChatParticipant, ChatRoomView, RealtimeChatRoom, RoomState } from "@/types/chat";

const mockReplace = jest.fn();
let mockSearch = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: mockReplace, prefetch: jest.fn() }),
  usePathname: () => "/messages",
  useSearchParams: () => mockSearch,
}));

let mockChat: ChatContextValue;

jest.mock("@/contexts/ChatContext", () => ({
  useChatContext: () => mockChat,
  emptyRoomState: jest.requireActual("@/contexts/chat/roomReducers").emptyRoomState,
}));

jest.mock("@/services/account.service", () => ({
  accountService: { getRoomMedia: jest.fn() },
}));

jest.mock("@/components/CustomToast", () => ({
  toast: { info: jest.fn(), warning: jest.fn(), error: jest.fn(), success: jest.fn() },
}));

const getRoomMedia = jest.mocked(accountService.getRoomMedia);

const ME = "user-1";

const person = (id: string, firstName: string, lastName: string, role: string): ChatParticipant => ({
  _id: id,
  userId: id,
  firstName,
  lastName,
  role,
  isOnline: false,
});

const teacher = person("t-1", "Seyi", "Tinubu", "teacher");
const me = person(ME, "Musa", "Adele", "student");
const classmate = person("s-2", "Ngozi", "Umeh", "student");

/**
 * A room as the store lists it.
 *
 * @param view - The fields that differ from a plain group.
 * @returns The list item.
 */
function room(view: Partial<ChatRoomView> & Pick<ChatRoomView, "_id" | "type" | "name">): RealtimeChatRoom {
  return toRealtimeRoom(
    {
      participants: [teacher, me, classmate],
      lastMessage: null,
      unreadCount: 0,
      updatedAt: "2026-09-14T08:00:00.000Z",
      ...view,
    },
    [ME]
  );
}

const ROOMS: RealtimeChatRoom[] = [
  // The store sorts newest first: a subject group and the direct room are ahead of the class group.
  room({ _id: "room-mth", type: "course_group", name: "Advance Maths group", courseId: "course-mth-1", lastMessage: { senderId: "t-1", senderName: "Seyi Tinubu", type: "text", preview: "Please read pages 14–20 before Tuesday." }, unreadCount: 0 }),
  room({ _id: "dm-1", type: "one_to_one", name: "", participants: [me, classmate], lastMessage: { senderId: "s-2", senderName: "Ngozi Umeh", type: "text", preview: "See you tomorrow" } }),
  room({ _id: "room-class", type: "class_group", name: "Jss1 A", lastMessage: { senderId: "t-1", senderName: "Seyi Tinubu", type: "text", preview: "Assembly moves to 8:15 tomorrow." }, unreadCount: 5 }),
  room({ _id: "room-bio", type: "course_group", name: "Biology group", courseId: "course-bio-1", unreadCount: 2 }),
];

const message = (id: string, roomId: string, senderId: string, senderName: string, text: string): ChatMessage => ({
  _id: id,
  roomId,
  senderId,
  senderName,
  senderAvatar: "",
  text,
  type: "text",
  attachments: [],
  readBy: [],
  createdAt: "2026-09-14T08:12:00.000Z",
  status: "sent",
});

/**
 * A joined room's state with a couple of messages.
 *
 * @param roomId - The room.
 * @param messages - Its messages.
 * @returns The room state.
 */
function joined(roomId: string, messages: ChatMessage[]): RoomState {
  const listed = ROOMS.find((r) => r.roomId === roomId);
  return {
    roomId,
    messages,
    status: "ready",
    error: null,
    hasMore: false,
    isLoadingMore: false,
    loadMoreError: null,
    roomName: listed?.name ?? "",
    roomType: listed?.type,
    participants: listed?.participants ?? [],
    description: "",
    avatarUrl: "",
  };
}

/**
 * The chat store the screen sees.
 *
 * @param overrides - Fields to change.
 * @returns The context value.
 */
function chatValue(overrides: Partial<ChatContextValue> = {}): ChatContextValue {
  return {
    chatRooms: ROOMS,
    isLoading: false,
    isConnected: true,
    connectionStatus: "connected",
    error: null,
    totalUnread: 7,
    refreshChatRooms: jest.fn(),
    currentUserIds: [ME],
    selectedRoomId: null,
    selectRoom: jest.fn(),
    unselectRoom: jest.fn(),
    retryJoin: jest.fn(),
    roomStates: {
      "room-class": joined("room-class", [
        message("m-1", "room-class", "t-1", "Seyi Tinubu", "Good evening Jss1 A. Assembly moves to 8:15 tomorrow."),
        message("m-2", "room-class", ME, "Musa Adele", "Thanks for the heads up."),
      ]),
      "dm-1": joined("dm-1", [message("m-3", "dm-1", "s-2", "Ngozi Umeh", "See you tomorrow")]),
    },
    loadOlderMessages: jest.fn(),
    sendMessage: jest.fn(),
    retryMessage: jest.fn(),
    deleteFailedMessage: jest.fn(),
    deleteStoredMessage: jest.fn(),
    getDraft: () => "",
    setDraft: jest.fn(),
    leaveGroup: jest.fn(async () => ({ ok: true })),
    onRoomRemoved: jest.fn(() => () => undefined),
    ...overrides,
  };
}

/**
 * The thread list's row buttons, top to bottom.
 *
 * @returns The rows.
 */
function rows() {
  const list = screen.getByRole("region", { name: "Conversations" });
  return within(list).getAllByRole("button");
}

beforeEach(() => {
  mockReplace.mockReset();
  mockSearch = new URLSearchParams();
  mockChat = chatValue();
  getRoomMedia.mockReset();
});

describe("Messages screen", () => {
  it("lists the class group first, then subject groups, then the read-only direct room", () => {
    render(<MessagesScreen />);
    expect(screen.getByRole("heading", { level: 1, name: "Messages" })).toBeInTheDocument();
    expect(screen.getByText("Your subject groups and class chat.")).toBeInTheDocument();
    const names = rows().map((row) => row.textContent ?? "");
    expect(names[0]).toMatch(/^JAJss1 A/);
    expect(names[1]).toMatch(/Advance Maths group/);
    expect(names[2]).toMatch(/Biology group/);
    expect(names[3]).toMatch(/Ngozi Umeh/);
    expect(names[3]).toMatch(/Direct · read only/);
    expect(within(rows()[0]).getByText("5")).toBeInTheDocument();
    expect(rows()[0]).toHaveAccessibleName(/5 unread/);
  });

  it("offers no new-message, direct-message or call buttons", () => {
    mockSearch = new URLSearchParams("room=room-class");
    render(<MessagesScreen />);
    expect(screen.queryByRole("button", { name: /new (direct )?message|message a|classmate|call/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/start a (voice|video) call/i)).not.toBeInTheDocument();
  });

  it("opens a room through the URL", async () => {
    const user = userEvent.setup();
    render(<MessagesScreen />);
    expect(mockChat.unselectRoom).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /Biology group/ }));
    expect(mockReplace).toHaveBeenCalledWith("/messages?room=room-bio", { scroll: false });
  });

  it("joins the room named in the URL and marks it current", () => {
    mockSearch = new URLSearchParams("room=room-class");
    render(<MessagesScreen />);
    expect(mockChat.selectRoom).toHaveBeenCalledWith("room-class");
    expect(rows()[0]).toHaveAttribute("aria-current", "true");
    const thread = screen.getByRole("region", { name: "Jss1 A" });
    expect(within(thread).getByRole("heading", { level: 2, name: "Jss1 A" })).toBeInTheDocument();
    expect(within(thread).getByText("Seyi Tinubu and 2 others")).toBeInTheDocument();
    expect(within(thread).getByText("Good evening Jss1 A. Assembly moves to 8:15 tomorrow.")).toBeInTheDocument();
    expect(within(thread).getByText("Seyi Tinubu")).toBeInTheDocument();
  });

  it("shows the composer in a group", async () => {
    const user = userEvent.setup();
    mockSearch = new URLSearchParams("room=room-class");
    render(<MessagesScreen />);
    const box = screen.getByRole("textbox", { name: "Write a message" });
    expect(screen.getByRole("button", { name: "Attach files" })).toBeInTheDocument();
    const send = screen.getByRole("button", { name: "Send" });
    expect(send).toBeDisabled();
    await user.type(box, "Noted sir");
    await user.click(send);
    expect(mockChat.sendMessage).toHaveBeenCalledWith("room-class", "Noted sir", { replyTo: undefined });
  });

  it("keeps a direct room readable but read-only", () => {
    mockSearch = new URLSearchParams("room=dm-1");
    render(<MessagesScreen />);
    const thread = screen.getByRole("region", { name: "Ngozi Umeh" });
    expect(within(thread).getByText("See you tomorrow")).toBeInTheDocument();
    expect(within(thread).getByText("Direct message · read only")).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Write a message" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Send" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Group info" })).not.toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent(
      "Direct messages are closed. You can still read this conversation. Message your teachers in your class or subject groups."
    );
    expect(within(rows()[3]).getByText("Direct · read only")).toBeInTheDocument();
  });

  it("lists members and asks for videos with kind=video in group info", async () => {
    const user = userEvent.setup();
    getRoomMedia.mockImplementation(async (_roomId, kind) => makeRoomMedia(kind));
    mockSearch = new URLSearchParams("room=room-class");
    render(<MessagesScreen />);

    await user.click(screen.getByRole("button", { name: "Group info" }));
    const dialog = await screen.findByRole("dialog", { name: "Jss1 A" });
    const tabs = within(dialog).getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual(["Members", "Images", "Videos", "Links", "Documents"]);
    expect(within(dialog).getByRole("tab", { name: "Members" })).toHaveAttribute("aria-selected", "true");

    const members = within(within(dialog).getByRole("tabpanel")).getAllByRole("listitem");
    expect(members[0]).toHaveTextContent("Seyi TinubuTeacher");
    expect(members[1]).toHaveTextContent("Musa Adele (you)Member");

    await user.click(within(dialog).getByRole("tab", { name: "Videos" }));
    await waitFor(() => expect(getRoomMedia).toHaveBeenCalledWith("room-class", "video"));
    expect(await within(dialog).findByRole("link", { name: /machines\.mp4/ })).toHaveAttribute("target", "_blank");
    expect(getRoomMedia).toHaveBeenCalledTimes(1);

    // Arrow keys move between tabs; the Images tab says when nothing was shared.
    await user.keyboard("{ArrowLeft}");
    expect(within(dialog).getByRole("tab", { name: "Images" })).toHaveAttribute("aria-selected", "true");
    expect(within(dialog).getByRole("tab", { name: "Images" })).toHaveFocus();
    expect(await within(dialog).findByText("No images shared yet.")).toBeInTheDocument();
    expect(getRoomMedia).toHaveBeenLastCalledWith("room-class", "image");
  });

  it("filters the list by name", async () => {
    const user = userEvent.setup();
    render(<MessagesScreen />);
    await user.type(screen.getByRole("searchbox", { name: "Search conversations" }), "bio");
    expect(rows()).toHaveLength(1);
    expect(rows()[0]).toHaveTextContent("Biology group");
    await user.clear(screen.getByRole("searchbox", { name: "Search conversations" }));
    await user.type(screen.getByRole("searchbox", { name: "Search conversations" }), "zzz");
    expect(screen.getByText("No conversations match “zzz”.")).toBeInTheDocument();
  });

  it("says when there are no groups yet", () => {
    mockChat = chatValue({ chatRooms: [] });
    render(<MessagesScreen />);
    expect(screen.getByText("No groups yet.")).toBeInTheDocument();
    expect(screen.getByText("Your class group and subject groups appear here.")).toBeInTheDocument();
  });

  it("goes back to the list when removed from the open group", () => {
    let listener: ((roomId: string, reason: "left" | "removed") => void) | undefined;
    mockChat = chatValue({
      onRoomRemoved: jest.fn((fn) => {
        listener = fn;
        return () => undefined;
      }),
    });
    mockSearch = new URLSearchParams("room=room-bio");
    render(<MessagesScreen />);
    listener?.("room-bio", "removed");
    expect(mockReplace).toHaveBeenCalledWith("/messages", { scroll: false });
  });
});
