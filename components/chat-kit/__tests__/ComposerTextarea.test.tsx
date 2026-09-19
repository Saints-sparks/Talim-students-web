/**
 * @jest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { ComposerTextarea, shouldSubmitOnEnter } from "../ComposerTextarea";

describe("shouldSubmitOnEnter", () => {
  const base = { key: "Enter", shiftKey: false, isComposing: false, enterSends: true };

  it("sends on a plain Enter where Enter sends", () => {
    expect(shouldSubmitOnEnter(base)).toBe(true);
  });

  it("does not send on Shift+Enter, while composing, on other keys, or on a touch device", () => {
    expect(shouldSubmitOnEnter({ ...base, shiftKey: true })).toBe(false);
    expect(shouldSubmitOnEnter({ ...base, isComposing: true })).toBe(false);
    expect(shouldSubmitOnEnter({ ...base, key: "a" })).toBe(false);
    expect(shouldSubmitOnEnter({ ...base, enterSends: false })).toBe(false);
  });
});

describe("ComposerTextarea", () => {
  afterEach(cleanup);

  function Harness({ onSubmit, submitOnEnter }: { onSubmit: () => void; submitOnEnter?: boolean }) {
    const [value, setValue] = useState("hello");
    return (
      <ComposerTextarea
        aria-label="Message"
        value={value}
        onValueChange={setValue}
        onSubmit={onSubmit}
        submitOnEnter={submitOnEnter}
      />
    );
  }

  it("submits on Enter, but not on Shift+Enter", () => {
    const onSubmit = jest.fn();
    render(<Harness onSubmit={onSubmit} submitOnEnter />);
    const box = screen.getByLabelText("Message");

    fireEvent.keyDown(box, { key: "Enter", shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.keyDown(box, { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("leaves Enter alone (a new line) when Enter does not send", () => {
    const onSubmit = jest.fn();
    render(<Harness onSubmit={onSubmit} submitOnEnter={false} />);
    const notPrevented = fireEvent.keyDown(screen.getByLabelText("Message"), { key: "Enter" });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(notPrevented).toBe(true);
  });

  it("reports edits through onValueChange", () => {
    render(<Harness onSubmit={jest.fn()} />);
    const box = screen.getByLabelText("Message") as HTMLTextAreaElement;
    fireEvent.change(box, { target: { value: "line one\nline two" } });
    expect(box.value).toBe("line one\nline two");
  });
});
