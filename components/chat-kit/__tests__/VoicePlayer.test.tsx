/**
 * @jest-environment jsdom
 */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { VoicePlayer, VOICE_PLAY_ERROR } from "../VoicePlayer";

describe("VoicePlayer", () => {
  let playSpy: jest.SpyInstance;
  let pauseSpy: jest.SpyInstance;

  beforeEach(() => {
    pauseSpy = jest.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event("pause"));
    });
  });

  afterEach(() => {
    cleanup();
    playSpy?.mockRestore();
    pauseSpy.mockRestore();
  });

  it("prefers playbackUrl and shows the message duration when the file has none", () => {
    const { container } = render(<VoicePlayer url="https://cdn/n.webm" playbackUrl="https://cdn/n.mp3" duration={12} />);
    expect(container.querySelector("audio")?.getAttribute("src")).toBe("https://cdn/n.mp3");
    expect(screen.getByText("0:12")).toBeTruthy();
  });

  it("shows a spinner while sending and a static warning once the send failed", () => {
    const { container, rerender } = render(<VoicePlayer duration={3} pending />);
    expect(container.querySelector(".animate-spin")).toBeTruthy();

    rerender(<VoicePlayer duration={3} pending failed />);
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect((screen.getByRole("button", { name: "Play voice note" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows an error and resets when play() is rejected", async () => {
    playSpy = jest
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockImplementation(() => Promise.reject(Object.assign(new Error("denied"), { name: "NotSupportedError" })));
    const onError = jest.fn();
    render(<VoicePlayer url="https://cdn/n.m4a" duration={3} onError={onError} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Play voice note" }));
    });

    expect(screen.getByRole("alert").textContent).toBe(VOICE_PLAY_ERROR);
    expect(onError).toHaveBeenCalledWith(VOICE_PLAY_ERROR);
    expect(screen.getByRole("button", { name: "Play voice note" })).toBeTruthy();
  });

  it("pauses the other player when a second one starts", async () => {
    playSpy = jest.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
      Object.defineProperty(this, "paused", { configurable: true, get: () => false });
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    });
    const { container } = render(
      <>
        <VoicePlayer url="https://cdn/a.m4a" duration={3} />
        <VoicePlayer url="https://cdn/b.m4a" duration={4} />
      </>
    );
    const [first, second] = Array.from(container.querySelectorAll("audio"));
    const buttons = screen.getAllByRole("button", { name: "Play voice note" });

    await act(async () => {
      fireEvent.click(buttons[0]);
    });
    await act(async () => {
      fireEvent.click(buttons[1]);
    });

    const pausedElements = pauseSpy.mock.contexts as HTMLMediaElement[];
    expect(pausedElements).toContain(first);
    expect(pausedElements).not.toContain(second);
  });
});
