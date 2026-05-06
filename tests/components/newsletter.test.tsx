import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Newsletter } from "@/components/sections/newsletter";
import { useSubscribeStore } from "@/stores/subscribe-store";

beforeEach(() => {
  useSubscribeStore.getState().reset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("<Newsletter />", () => {
  it("renders headline + email field", () => {
    render(<Newsletter />);
    expect(screen.getByPlaceholderText(/you@company\.com/i)).toBeInTheDocument();
  });

  it("shows a validation error on invalid email", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);
    const input = screen.getByPlaceholderText(/you@company\.com/i);
    await user.type(input, "nope");
    const form = input.closest("form")!;
    fireEvent.submit(form);
    await waitFor(() => {
      expect(useSubscribeStore.getState().status).toBe("error");
    });
  });

  it("posts to /api/subscribe and reports success", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true, data: { subscribed: true, alreadyExists: false } }), {
        status: 200,
      })
    );
    const user = userEvent.setup();
    render(<Newsletter />);
    const input = screen.getByPlaceholderText(/you@company\.com/i);
    await user.type(input, "hello@bluezoid.in");
    const form = input.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(useSubscribeStore.getState().status).toBe("success");
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/subscribe",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("surfaces API error messages", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ ok: false, error: { code: "delivery_failed", message: "Upstream down" } }),
        { status: 502 }
      )
    );
    const user = userEvent.setup();
    render(<Newsletter />);
    const input = screen.getByPlaceholderText(/you@company\.com/i);
    await user.type(input, "hello@bluezoid.in");
    const form = input.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(useSubscribeStore.getState().status).toBe("error");
      expect(useSubscribeStore.getState().message).toMatch(/upstream down/i);
    });
  });
});
