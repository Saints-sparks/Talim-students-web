import { activePlayerController, createActivePlayerController } from "../activePlayer";

function player() {
  return { pause: jest.fn() };
}

describe("one active voice player", () => {
  it("pauses the previous player when another starts", () => {
    const controller = createActivePlayerController();
    const a = player();
    const b = player();

    controller.activate(a);
    expect(controller.current()).toBe(a);
    expect(a.pause).not.toHaveBeenCalled();

    controller.activate(b);
    expect(a.pause).toHaveBeenCalledTimes(1);
    expect(b.pause).not.toHaveBeenCalled();
    expect(controller.current()).toBe(b);
  });

  it("doesn't pause a player that starts again", () => {
    const controller = createActivePlayerController();
    const a = player();
    controller.activate(a);
    controller.activate(a);
    expect(a.pause).not.toHaveBeenCalled();
  });

  it("release only clears the player that is active", () => {
    const controller = createActivePlayerController();
    const a = player();
    const b = player();
    controller.activate(a);
    controller.activate(b);
    // a's pause event arrives after b took over.
    controller.release(a);
    expect(controller.current()).toBe(b);
    controller.release(b);
    expect(controller.current()).toBeNull();

    // Nothing to pause after a release.
    controller.activate(a);
    expect(b.pause).not.toHaveBeenCalled();
  });

  it("keeps going when the previous player throws on pause", () => {
    const controller = createActivePlayerController();
    const broken = {
      pause: jest.fn(() => {
        throw new Error("detached");
      }),
    };
    const b = player();
    controller.activate(broken);
    expect(() => controller.activate(b)).not.toThrow();
    expect(controller.current()).toBe(b);
  });

  it("exposes one shared controller", () => {
    expect(typeof activePlayerController.activate).toBe("function");
  });
});
