/**
 * @jest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QuotedMessage, ReplyBar } from "../ReplyQuote";

describe("reply quote", () => {
  afterEach(cleanup);

  it("shows who and what you are replying to, and can be cancelled", () => {
    const onCancel = jest.fn();
    render(<ReplyBar reply={{ messageId: "m1", senderName: "Bola Ade", preview: "See you at 8" }} onCancel={onCancel} />);

    expect(screen.getByText("Replying to Bola Ade")).toBeTruthy();
    expect(screen.getByText("See you at 8")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Cancel reply" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renders the quoted snapshot, as a jump button only when the original can be found", () => {
    const replyTo = { messageId: "m1", senderName: "Bola Ade", preview: "Photo" };
    const onJump = jest.fn();
    const { rerender } = render(<QuotedMessage replyTo={replyTo} onJump={onJump} />);

    fireEvent.click(screen.getByRole("button", { name: /Go to the message from Bola Ade/ }));
    expect(onJump).toHaveBeenCalledWith("m1");

    rerender(<QuotedMessage replyTo={replyTo} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Photo")).toBeTruthy();
  });
});
