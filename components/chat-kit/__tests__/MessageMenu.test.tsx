/**
 * @jest-environment jsdom
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MessageMenu } from "../MessageMenu";

const open = (label = "Message options") => fireEvent.click(screen.getByRole("button", { name: label }));

describe("MessageMenu", () => {
  afterEach(cleanup);

  it("renders nothing when no action applies", () => {
    const { container } = render(<MessageMenu messageId="m1" />);
    expect(container.firstChild).toBeNull();
  });

  it("offers only the actions that apply", () => {
    render(<MessageMenu messageId="m1" text="hello" onReply={jest.fn()} />);
    open();

    expect(screen.getByRole("menuitem", { name: /reply/i })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: /copy text/i })).toBeTruthy();
    expect(screen.queryByRole("menuitem", { name: /delete/i })).toBeNull();
    expect(screen.queryByRole("menuitem", { name: /download/i })).toBeNull();
  });

  it("replies and closes", () => {
    const onReply = jest.fn();
    render(<MessageMenu messageId="m1" text="hi" onReply={onReply} />);
    open();
    fireEvent.click(screen.getByRole("menuitem", { name: /reply/i }));

    expect(onReply).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("copies the text and says so", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onNotify = jest.fn();
    render(<MessageMenu messageId="m1" text="copy me" onNotify={onNotify} />);
    open();
    await act(async () => {
      fireEvent.click(screen.getByRole("menuitem", { name: /copy text/i }));
    });

    expect(writeText).toHaveBeenCalledWith("copy me");
    expect(onNotify).toHaveBeenCalledWith("Message copied");
  });

  it("downloads: one attachment is a plain Download link, several are listed by name", () => {
    const { unmount } = render(
      <MessageMenu messageId="m1" attachments={[{ url: "https://cdn/a.pdf", name: "a.pdf" }]} />,
    );
    open();
    const single = screen.getByRole("menuitem", { name: "Download" });
    expect(single.getAttribute("href")).toBe("https://cdn/a.pdf");
    expect(single.getAttribute("rel")).toContain("noopener");
    unmount();

    render(
      <MessageMenu
        messageId="m2"
        attachments={[
          { url: "https://cdn/a.pdf", name: "a.pdf" },
          { url: "https://cdn/b.png", name: "b.png" },
        ]}
      />,
    );
    open();
    expect(screen.getByRole("menuitem", { name: /Download a\.pdf/ })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: /Download b\.png/ })).toBeTruthy();
  });

  it("asks before deleting, and only deletes on confirm", async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    render(<MessageMenu messageId="m1" text="x" onDelete={onDelete} />);
    open();
    fireEvent.click(screen.getByRole("menuitem", { name: /delete/i }));
    expect(onDelete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("menuitem", { name: "Cancel" }));
    expect(onDelete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("menuitem", { name: /delete/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    });
    expect(onDelete).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("reports a failed delete and keeps the message", async () => {
    const onDelete = jest.fn().mockRejectedValue(new Error("You are not allowed to delete this message"));
    const onNotify = jest.fn();
    render(<MessageMenu messageId="m1" text="x" onDelete={onDelete} onNotify={onNotify} />);
    open();
    fireEvent.click(screen.getByRole("menuitem", { name: /delete/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    });

    expect(onNotify).toHaveBeenCalledWith("You are not allowed to delete this message");
  });

  it("opens one menu at a time across messages", () => {
    render(
      <>
        <MessageMenu messageId="m1" text="first" onReply={jest.fn()} />
        <MessageMenu messageId="m2" text="second" onReply={jest.fn()} />
      </>,
    );
    const [first, second] = screen.getAllByRole("button", { name: "Message options" });

    fireEvent.click(first);
    expect(screen.getAllByRole("menu")).toHaveLength(1);
    fireEvent.click(second);
    expect(screen.getAllByRole("menu")).toHaveLength(1);
    expect(second.getAttribute("aria-expanded")).toBe("true");
    expect(first.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Escape", () => {
    render(<MessageMenu messageId="m1" text="x" />);
    open();
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
