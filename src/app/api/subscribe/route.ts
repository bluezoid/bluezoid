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

const EMAIL_LOGO = `data:image/png;base64,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`;

function welcomeTemplate() {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 32px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 24px;">
          <img src="${EMAIL_LOGO}" alt="BlueZoid" width="48" height="48" style="border-radius: 10px; display: block;" />
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
