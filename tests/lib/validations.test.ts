import { describe, expect, it } from "vitest";
import { contactSchema, subscribeSchema } from "@/lib/validations";

describe("subscribeSchema", () => {
  it("accepts a valid email", () => {
    expect(subscribeSchema.safeParse({ email: "hi@bluezoid.in" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const res = subscribeSchema.safeParse({ email: "not-an-email" });
    expect(res.success).toBe(false);
  });

  it("rejects empty payload", () => {
    expect(subscribeSchema.safeParse({}).success).toBe(false);
  });
});

describe("contactSchema", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    subject: "Project inquiry",
    message: "I'd like to discuss building a SaaS platform for our team.",
  };

  it("accepts a valid payload", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects short name", () => {
    const res = contactSchema.safeParse({ ...valid, name: "J" });
    expect(res.success).toBe(false);
  });

  it("rejects short message", () => {
    const res = contactSchema.safeParse({ ...valid, message: "too short" });
    expect(res.success).toBe(false);
  });

  it("rejects malformed email", () => {
    const res = contactSchema.safeParse({ ...valid, email: "no-at-sign" });
    expect(res.success).toBe(false);
  });

  it("rejects short subject", () => {
    const res = contactSchema.safeParse({ ...valid, subject: "Hi" });
    expect(res.success).toBe(false);
  });
});
