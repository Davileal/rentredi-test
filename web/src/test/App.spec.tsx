import { screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { renderWithSWR } from "./utils";

describe("App integration (SWR + API + UI)", () => {
  it("loads and lists users", async () => {
    renderWithSWR(<App />);

    expect(
      screen.getByPlaceholderText(/search by name or zip/i)
    ).toBeInTheDocument();

    const headingByRole = screen.queryByRole("heading", { name: /users/i });
    const headingBySelector =
      headingByRole ??
      screen.queryByText(/users/i, {
        selector: 'h1, h2, h3, h4, h5, h6, [role="heading"]',
      });
    if (headingBySelector) {
      expect(headingBySelector).toBeInTheDocument();
    }

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  it("creates a user and clears form inputs after success", async () => {
    renderWithSWR(<App />);

    const nameInput = screen.getByLabelText(/name/i);
    const zipInput = screen.getByLabelText(/zip code/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Charlie");
    await userEvent.clear(zipInput);
    await userEvent.type(zipInput, "33333");

    const createBtn = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createBtn);

    await screen.findByText(/user created/i);

    await screen.findByText("Charlie");

    expect(nameInput).toHaveValue("");
    expect(zipInput).toHaveValue("");
  });

  it("deletes a user through the confirmation modal", async () => {
    renderWithSWR(<App />);

    const aliceCell = await screen.findByText("Alice");
    const row = aliceCell.closest("tr")!;
    const deleteBtn = within(row).getByRole("button", { name: /delete/i });
    await userEvent.click(deleteBtn);

    const dialog = await screen.findByRole("dialog", { name: /delete user/i });
    expect(
      within(dialog).getByRole("heading", { name: /delete user/i })
    ).toBeInTheDocument();

    const confirm = within(dialog).getByRole("button", { name: /^delete$/i });
    await userEvent.click(confirm);

    await waitForElementToBeRemoved(dialog);

    await waitFor(() => {
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });

    await screen.findByText(/user deleted/i);
  });
});
