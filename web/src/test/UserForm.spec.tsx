import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserForm from "../components/UserForm";

describe("UserForm", () => {
  it("calls onSubmit with name and zipCode", async () => {
    const onSubmit = vi.fn();
    render(<UserForm onCancel={() => {}} onSubmit={onSubmit} editingUser={null} />);

    const nameInput = screen.getByLabelText(/name/i);
    const zipInput  = screen.getByLabelText(/zip code/i);

    await userEvent.type(nameInput, "Dani");
    await userEvent.type(zipInput, "44444");

    const createBtn = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createBtn);

    expect(onSubmit).toHaveBeenCalledWith({ name: "Dani", zipCode: "44444" });
  });

  it("prefills values when editingUser is provided", () => {
    const user = { id: "u9", name: "Edit Me", zipCode: "99999" };
    render(<UserForm onCancel={() => {}} onSubmit={() => {}} editingUser={user} />);
    expect(screen.getByLabelText(/name/i)).toHaveValue("Edit Me");
    expect(screen.getByLabelText(/zip code/i)).toHaveValue("99999");
  });
});
