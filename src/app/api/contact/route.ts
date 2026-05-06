import { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validations";
import { readBrevoConfig, sendTransactionalEmail } from "@/lib/brevo";
import { fail, ok, validationError } from "@/lib/api";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { name, email, subject, message } = parsed.data;
  const config = readBrevoConfig();

  if (!config) {
    console.warn("[/api/contact] Brevo not configured — skipping delivery (dev mode)");
    return ok({ delivered: false, mode: "dry-run" });
  }

  try {
    await sendTransactionalEmail(
      {
        to: [{ email: config.adminEmail, name: "BlueZoid Team" }],
        subject: `New Contact: ${subject}`,
        replyTo: { email, name },
        htmlContent: adminEmailTemplate({ name, email, subject, message }),
      },
      config
    );

    await sendTransactionalEmail(
      {
        to: [{ email, name }],
        subject: "We received your message — BlueZoid",
        htmlContent: autoReplyTemplate({ name, message }),
      },
      config
    );

    return ok({ delivered: true });
  } catch (err) {
    console.error("[/api/contact]", err);
    return fail("delivery_failed", "Failed to send message. Please try again later.", 502);
  }
}

function adminEmailTemplate(d: { name: string; email: string; subject: string; message: string }) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 16px;"><strong>Name:</strong> ${escapeHtml(d.name)}</p>
        <p style="margin: 0 0 16px;"><strong>Email:</strong> <a href="mailto:${d.email}">${escapeHtml(d.email)}</a></p>
        <p style="margin: 0 0 16px;"><strong>Subject:</strong> ${escapeHtml(d.subject)}</p>
        <div style="background: #f8fafc; padding: 16px; border-radius: 6px; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(d.message)}</p>
        </div>
      </div>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; text-align: center;">BlueZoid.in · Bengaluru, India</p>
    </div>`;
}

function autoReplyTemplate(d: { name: string; message: string }) {
  const preview = d.message.slice(0, 200) + (d.message.length > 200 ? "…" : "");
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Thanks for reaching out, ${escapeHtml(d.name)}!</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; line-height: 1.7;">We've received your message and our team will get back to you within <strong>24 hours</strong>.</p>
        <p style="color: #334155; line-height: 1.7;">In the meantime, feel free to explore our services at <a href="https://bluezoid.in/services" style="color: #0ea5e9;">bluezoid.in/services</a>.</p>
        <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin-top: 16px; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0; font-style: italic; color: #64748b;">Your message: "${escapeHtml(preview)}"</p>
        </div>
      </div>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; text-align: center;">BlueZoid.in · hello@bluezoid.in · Bengaluru, India</p>
    </div>`;
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
