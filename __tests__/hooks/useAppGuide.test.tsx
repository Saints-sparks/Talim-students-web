import { act, renderHook, waitFor } from "@testing-library/react";
import { useAppGuide } from "@/hooks/useAppGuide";
import { findGuideConfig } from "@/components/onboarding/guideSteps";
import { getCompletedKey, getSeenKey } from "@/lib/appGuide";

let mockPathname = "/timetable";
let mockAuth: { user: { userId: string } | null; isLoading: boolean } = { user: { userId: "u1" }, isLoading: false };

jest.mock("next/navigation", () => ({ usePathname: () => mockPathname }));
jest.mock("@/contexts/AuthContext", () => ({ useAuthContext: () => mockAuth }));

const config = findGuideConfig("/timetable")!;

/** Puts one element per guide step on the page, with a real-looking box. */
function renderTargets() {
  for (const step of config.steps) {
    const el = document.createElement("div");
    el.setAttribute("data-guide", step.target);
    el.getBoundingClientRect = () => ({ top: 10, left: 10, width: 100, height: 40 }) as DOMRect;
    el.scrollIntoView = jest.fn();
    document.body.appendChild(el);
  }
}

describe("useAppGuide", () => {
  beforeEach(() => {
    mockPathname = "/timetable";
    mockAuth = { user: { userId: "u1" }, isLoading: false };
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("opens by itself the first time, once the targets have rendered", async () => {
    renderTargets();
    const { result } = renderHook(() => useAppGuide());

    await waitFor(() => expect(result.current.isOpen).toBe(true));
    expect(result.current.steps).toHaveLength(config.steps.length);
    expect(result.current.currentStep?.target).toBe(config.steps[0].target);
  });

  it("steps forward and back without leaving the list", async () => {
    renderTargets();
    const { result } = renderHook(() => useAppGuide());
    await waitFor(() => expect(result.current.isOpen).toBe(true));

    act(() => result.current.back());
    expect(result.current.stepIndex).toBe(0);
    for (let i = 0; i < config.steps.length + 2; i++) act(() => result.current.next());
    expect(result.current.stepIndex).toBe(config.steps.length - 1);
  });

  it("remembers a dismissal as seen, and a finish as completed", async () => {
    renderTargets();
    const { result } = renderHook(() => useAppGuide());
    await waitFor(() => expect(result.current.isOpen).toBe(true));

    act(() => result.current.dismiss());
    expect(result.current.isOpen).toBe(false);
    expect(localStorage.getItem(getSeenKey(config.id, "u1"))).toBe("done");
    expect(localStorage.getItem(getCompletedKey(config.id, "u1"))).toBeNull();

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.finish());
    expect(localStorage.getItem(getCompletedKey(config.id, "u1"))).toBe("done");
  });

  it("does not open again once it has been seen", async () => {
    renderTargets();
    localStorage.setItem(getSeenKey(config.id, "u1"), "done");
    const { result } = renderHook(() => useAppGuide());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isAvailable).toBe(true);
  });

  it("offers nothing on a page without a guide or before sign-in", () => {
    mockPathname = "/no-such-page";
    expect(renderHook(() => useAppGuide()).result.current.isAvailable).toBe(false);

    mockPathname = "/timetable";
    mockAuth = { user: null, isLoading: false };
    expect(renderHook(() => useAppGuide()).result.current.isAvailable).toBe(false);
  });
});
