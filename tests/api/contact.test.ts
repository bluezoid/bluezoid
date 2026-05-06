import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function req(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Project inquiry",
  message: "I'd like to discuss building a SaaS platform for my team.",
};

describe("POST /api/contact", () => {
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

  it("422s on validation failure", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(req({ ...validBody, email: "nope" }) as never);
    expect(res.status).toBe(422);
  });

  it("dry-runs when Brevo is not configured", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(req(validBody) as never);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data.mode).toBe("dry-run");
    expect(body.data.delivered).toBe(false);
  });

  it("sends admin + auto-reply when configured", async () => {
    process.env.BREVO_API_KEY = "k";
    process.env.BREVO_SENDER_EMAIL = "hello@bluezoid.in";
    process.env.BREVO_LIST_ID = "3";
    process.env.BREVO_ADMIN_EMAIL = "admin@bluezoid.in";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ messageId: "m1" }), { status: 201 })
    );
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(req(validBody) as never);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data.delivered).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("502s when Brevo rejects", async () => {
    process.env.BREVO_API_KEY = "k";
    process.env.BREVO_SENDER_EMAIL = "hello@bluezoid.in";
    process.env.BREVO_LIST_ID = "3";
    process.env.BREVO_ADMIN_EMAIL = "admin@bluezoid.in";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "boom" }), { status: 500 })
    );
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(req(validBody) as never);
    expect(res.status).toBe(502);
  });
});
