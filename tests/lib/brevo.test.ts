import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addContactToList,
  BrevoApiError,
  readBrevoConfig,
  requireBrevoConfig,
  sendTransactionalEmail,
  type BrevoConfig,
} from "@/lib/brevo";

const baseConfig: BrevoConfig = {
  apiKey: "test-key",
  senderEmail: "hello@bluezoid.in",
  senderName: "BlueZoid",
  listId: 7,
  adminEmail: "admin@bluezoid.in",
};

describe("readBrevoConfig", () => {
  const snap = { ...process.env };
  afterEach(() => {
    process.env = { ...snap };
  });

  it("returns null when required env vars are missing", () => {
    delete process.env.BREVO_API_KEY;
    expect(readBrevoConfig()).toBeNull();
  });

  it("returns a config when all env vars are present", () => {
    process.env.BREVO_API_KEY = "k";
    process.env.BREVO_SENDER_EMAIL = "s@x.com";
    process.env.BREVO_LIST_ID = "3";
    process.env.BREVO_ADMIN_EMAIL = "a@x.com";
    const cfg = readBrevoConfig();
    expect(cfg).toMatchObject({ apiKey: "k", listId: 3 });
  });

  it("rejects a non-numeric list id", () => {
    process.env.BREVO_API_KEY = "k";
    process.env.BREVO_SENDER_EMAIL = "s@x.com";
    process.env.BREVO_LIST_ID = "not-a-number";
    process.env.BREVO_ADMIN_EMAIL = "a@x.com";
    expect(readBrevoConfig()).toBeNull();
  });

  it("requireBrevoConfig throws when unset", () => {
    delete process.env.BREVO_API_KEY;
    expect(() => requireBrevoConfig()).toThrow();
  });
});

describe("sendTransactionalEmail", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("POSTs to Brevo with the right shape", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ messageId: "abc" }), { status: 200 }));

    await sendTransactionalEmail(
      { to: [{ email: "x@y.com" }], subject: "Hi", htmlContent: "<p>hi</p>" },
      baseConfig
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.sender).toEqual({ email: baseConfig.senderEmail, name: baseConfig.senderName });
    expect(body.to[0].email).toBe("x@y.com");
    expect((init as RequestInit).headers).toMatchObject({ "api-key": "test-key" });
  });

  it("throws BrevoApiError on non-2xx", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "boom" }), { status: 500 })
    );
    await expect(
      sendTransactionalEmail(
        { to: [{ email: "x@y.com" }], subject: "s", htmlContent: "h" },
        baseConfig
      )
    ).rejects.toBeInstanceOf(BrevoApiError);
  });
});

describe("addContactToList", () => {
  it("returns alreadyExists=true when Brevo reports duplicate", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Contact already exist" }), { status: 400 })
    );
    const result = await addContactToList("dup@x.com", baseConfig);
    expect(result.alreadyExists).toBe(true);
  });

  it("returns alreadyExists=false on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: 1 }), { status: 201 })
    );
    const result = await addContactToList("new@x.com", baseConfig);
    expect(result.alreadyExists).toBe(false);
  });

  it("throws BrevoApiError on unexpected failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "rate limit" }), { status: 429 })
    );
    await expect(addContactToList("x@x.com", baseConfig)).rejects.toBeInstanceOf(BrevoApiError);
  });
});
