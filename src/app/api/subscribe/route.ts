import { NextRequest } from "next/server";
import { subscribeSchema } from "@/lib/validations";
import { addContactToList, readBrevoConfig, sendTransactionalEmail } from "@/lib/brevo";
import { fail, ok, validationError } from "@/lib/api";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { email } = parsed.data;
  const config = readBrevoConfig();

  if (!config) {
    console.warn("[/api/subscribe] Brevo not configured — skipping delivery (dev mode)");
    return ok({ subscribed: false, alreadyExists: false, mode: "dry-run" });
  }

  try {
    const result = await addContactToList(email, config);
    if (!result.alreadyExists) {
      await sendTransactionalEmail(
        {
          to: [{ email }],
          subject: "Welcome to BlueZoid — You're in!",
          htmlContent: welcomeTemplate(),
        },
        config
      );
    }
    return ok({ subscribed: true, alreadyExists: result.alreadyExists });
  } catch (err) {
    console.error("[/api/subscribe]", err);
    return fail("delivery_failed", "Failed to subscribe. Please try again later.", 502);
  }
}

function welcomeTemplate() {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 32px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 24px;">
          <img src="https://bluezoid.in/email-logo-80.png" alt="BlueZoid" width="48" height="48" style="border-radius: 10px; display: block;" />
          <span style="color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; font-family: sans-serif;">BlueZoid</span>
        </div>
        <h1 style="color: white; margin: 0 0 8px; font-size: 28px;">Welcome to BlueZoid</h1>
        <p style="color: #bae6fd; margin: 0; font-size: 16px;">Build. Scale. Dominate.</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; line-height: 1.7; font-size: 16px;">
          You're now part of our community of developers, founders, and innovators.
        </p>
        <p style="color: #334155; line-height: 1.7;">Here's what you can expect:</p>
        <ul style="color: #334155; line-height: 2; padding-left: 20px;">
          <li>Early access to our new products &amp; features</li>
          <li>Engineering insights and best practices</li>
          <li>Exclusive offers for our community</li>
        </ul>
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://bluezoid.in/services" style="background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
            Explore Our Services
          </a>
        </div>
      </div>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; text-align: center;">
        BlueZoid.in · hello@bluezoid.in · Kolkata, West Bengal, India (Remote)
      </p>
    </div>`;
}
