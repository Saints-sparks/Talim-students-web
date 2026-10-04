import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/test-utils/render";
import { TOUR_STEPS, TourProvider, useTour } from "@/components/tour/TourProvider";
import { learnerService } from "@/services/learner.service";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/settings",
}));
jest.mock("@/services/learner.service", () => ({
  learnerService: { getPreferences: jest.fn(), updatePreferences: jest.fn() },
}));

const getPreferences = learnerService.getPreferences as jest.Mock;
const updatePreferences = learnerService.updatePreferences as jest.Mock;

/**
 * A button that opens the tour, and whether it is done.
 *
 * @returns The probe.
 */
function Probe() {
  const { openTour, tourDone } = useTour();
  return (
    <>
      <button type="button" onClick={openTour}>
        Take the tour
      </button>
      <p>{tourDone ? "done" : "not done"}</p>
    </>
  );
}

describe("portal tour", () => {
  beforeEach(() => jest.clearAllMocks());

  it("reads the flag from GET /students/me/preferences and saves Finish with PATCH", async () => {
    getPreferences.mockResolvedValue({ guides: { tourCompletedAt: null } });
    updatePreferences.mockResolvedValue({ guides: { tourCompletedAt: "2026-10-04T08:00:00.000Z" } });
    render(
      <TourProvider>
        <Probe />
      </TourProvider>
    );
    await waitFor(() => expect(getPreferences).toHaveBeenCalledTimes(1));
    expect(screen.getByText("not done")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Take the tour" }));
    expect(await screen.findByText(`Step 1 of ${TOUR_STEPS.length}`)).toBeInTheDocument();
    for (let i = 1; i < TOUR_STEPS.length; i++) await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await userEvent.click(screen.getByRole("button", { name: "Finish" }));

    expect(updatePreferences).toHaveBeenCalledWith({ guides: { tourCompleted: true } });
    expect(await screen.findByText("done")).toBeInTheDocument();
  });

  it("does not save again when the account already finished it", async () => {
    getPreferences.mockResolvedValue({ guides: { tourCompletedAt: "2026-10-01T08:00:00.000Z" } });
    render(
      <TourProvider>
        <Probe />
      </TourProvider>
    );
    expect(await screen.findByText("done")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Take the tour" }));
    for (let i = 1; i < TOUR_STEPS.length; i++) await userEvent.click(await screen.findByRole("button", { name: "Next" }));
    await userEvent.click(screen.getByRole("button", { name: "Finish" }));
    expect(updatePreferences).not.toHaveBeenCalled();
  });
});
