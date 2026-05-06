import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function req(body: unknown) {
  return new Request("http://localhost/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/subscribe", () => {
  const snap = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...snap };
    delete process.env.BREVO_API_KEY;
    delete process.env.BREVO_SENDER_EMAIL;
    delete process.env.BREVO_LIST_ID;
    delete process.env.BREVO_ADMIN_EMAIL;
  });

  afterEach(() => {
    process.env = { ...snap };
    vi.restoreAllMocks();
  });

  it("422s on invalid email", async () => {
    const { POST } = await import("@/app/api/subscribe/route");
    const res = await POST(req({ email: "nope" }) as never);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("validation_error");
  });

  it("400s on malformed JSON", async () => {
    const { POST } = await import("@/app/api/subscribe/route");
    const res = await POST(req("{ not-json") as never);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("invalid_json");
  });

  it("returns dry-run success when Brevo is unconfigured", async () => {
    const { POST } = await import("@/app/api/subscribe/route");
    const res = await POST(req({ email: "hi@bluezoid.in" }) as never);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.mode).toBe("dry-run");
  });

  it("calls Brevo and returns success when configured", async () => {
    process.env.BREVO_API_KEY = "k";
    process.env.BREVO_SENDER_EMAIL = "hello@bluezoid.in";
    process.env.BREVO_LIST_ID = "3";
    process.env.BREVO_ADMIN_EMAIL = "admin@bluezoid.in";

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: 1 }), { status: 201 })
    );
    const { POST } = await import("@/app/api/subscribe/route");
    const res = await POST(req({ email: "new@x.com" }) as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.subscribed).toBe(true);
    expect(body.data.alreadyExists).toBe(false);
    // contact create + welcome email
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
