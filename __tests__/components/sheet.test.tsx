import React, { useState } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { Sheet } from "@/components/tl/Sheet";

/**
 * A button that opens a sheet with one field.
 *
 * @returns The opener and the sheet.
 */
function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Change password
      </button>
      <Sheet open={open} onOpenChange={setOpen} eyebrowText="Security" title="Change password" subtitle="You stay signed in here.">
        <label htmlFor="current">Current password</label>
        <input id="current" />
      </Sheet>
    </>
  );
}

describe("Sheet", () => {
  it("is a labelled modal dialog that takes focus and gives it back to its opener", async () => {
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Change password" });
    await userEvent.click(opener);
    const dialog = await screen.findByRole("dialog", { name: "Change password" });
    expect(dialog).toHaveAccessibleDescription("You stay signed in here.");
    // The first focusable control inside gets focus (the close button comes first in the header).
    expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(opener).toHaveFocus();
  });

  it("closes from its 44px close button", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Change password" }));
    await userEvent.click(await screen.findByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
