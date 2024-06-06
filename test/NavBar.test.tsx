import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TestForm from "~/app/_components/TestForm";
import Navbar from "~/app/_components/Navbar";
import { useUser } from "@clerk/nextjs";

vi.mock("@clerk/nextjs");

describe("TestForm", () => {
  it("renders a heading", () => {
    render(<TestForm />);

    const heading = screen.getByRole("button", { name: "Click" });
    expect(heading).toBeInTheDocument();
  });
});

describe("Component using Clerk", () => {
  it("renders for signed-in user", () => {
    // Mock the useUser hook to return a signed-in user
    (useUser as any).mockReturnValue({
      isSignedIn: true,
      user: { id: "user_123", email: "test@example.com" },
    });

    // ... render your component and assert its behavior ...
    const { getByTestId } = render(<Navbar />);
    expect(getByTestId("user-button")).toBeInTheDocument();
  });

  /* it("renders for signed-out user", () => {
    (useUser as any).mockReturnValue({ isSignedIn: false });
    // ... assertions ...
  }); */
});
