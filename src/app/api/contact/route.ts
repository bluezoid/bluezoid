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

  const { name, email, phone, subject, message } = parsed.data;
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
        htmlContent: adminEmailTemplate({ name, email, phone, subject, message }),
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

const EMAIL_LOGO = `data:image/png;base64,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`;

function adminEmailTemplate(d: { name: string; email: string; phone: string; subject: string; message: string }) {
  const row = (label: string, value: string, link?: string) => `
    <tr>
      <td style="padding: 14px 20px; width: 130px; vertical-align: top; background: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">${label}</span>
      </td>
      <td style="padding: 14px 20px; vertical-align: top; background: #ffffff; border-bottom: 1px solid #e2e8f0;">
        ${link
          ? `<a href="${link}" style="color: #0ea5e9; text-decoration: none; font-size: 14px; font-weight: 500;">${escapeHtml(value)}</a>`
          : `<span style="color: #1e293b; font-size: 14px; font-weight: 500;">${escapeHtml(value)}</span>`
        }
      </td>
    </tr>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 640px; margin: 40px auto; padding: 0 16px 40px;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); border-radius: 16px 16px 0 0; padding: 36px 32px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
        <img src="${EMAIL_LOGO}" alt="BlueZoid" width="48" height="48" style="border-radius: 10px; display: block;" />
        <span style="color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; font-family: sans-serif;">BlueZoid</span>
      </div>
      <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 8px; padding: 6px 14px; margin-bottom: 16px;">
        <span style="color: #bae6fd; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">New Inquiry</span>
      </div>
      <h1 style="color: white; margin: 0 0 6px; font-size: 26px; font-weight: 800; line-height: 1.2;">Contact Form Submission</h1>
      <p style="color: rgba(255,255,255,0.75); margin: 0; font-size: 14px;">A new message has arrived — reply directly to the sender below.</p>
    </div>

    <!-- Contact Details Card -->
    <div style="background: white; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 0 0; overflow: hidden;">
      <div style="padding: 20px 24px; background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
        <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;">Contact Details</span>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${row("Name", d.name)}
        ${row("Email", d.email, `mailto:${d.email}`)}
        ${row("Mobile", d.phone, `tel:${d.phone}`)}
        ${row("Subject", d.subject)}
      </table>
    </div>

    <!-- Message Card -->
    <div style="background: white; border: 1px solid #e2e8f0; border-top: none; overflow: hidden;">
      <div style="padding: 20px 24px; background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
        <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;">Message</span>
      </div>
      <div style="padding: 24px; background: white;">
        <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${escapeHtml(d.message)}</p>
      </div>
    </div>

    <!-- Reply CTA -->
    <div style="background: white; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; padding: 24px; text-align: center;">
      <a href="mailto:${d.email}?subject=Re: ${encodeURIComponent(d.subject)}"
        style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: 0.02em;">
        Reply to ${escapeHtml(d.name)} →
      </a>
    </div>

    <!-- Footer -->
    <p style="text-align: center; color: #94a3b8; font-size: 11px; margin-top: 24px; line-height: 1.6;">
      BlueZoid.in &nbsp;·&nbsp; Kolkata, West Bengal, India (Remote)<br/>
      This email was generated automatically from your contact form.
    </p>

  </div>
</body>
</html>`;
}

function autoReplyTemplate(d: { name: string; message: string }) {
  const preview = d.message.slice(0, 200) + (d.message.length > 200 ? "…" : "");
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 40px auto; padding: 0 16px 40px;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); border-radius: 16px 16px 0 0; padding: 36px 32px; text-align: center;">
      <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 24px;">
        <img src="${EMAIL_LOGO}" alt="BlueZoid" width="48" height="48" style="border-radius: 10px; display: block;" />
        <span style="color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; font-family: sans-serif;">BlueZoid</span>
      </div>
      <h1 style="color: white; margin: 0 0 8px; font-size: 26px; font-weight: 800;">Thanks for reaching out, ${escapeHtml(d.name)}!</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 15px;">We've received your message and will get back to you shortly.</p>
    </div>

    <!-- Body -->
    <div style="background: white; border: 1px solid #e2e8f0; border-top: none; padding: 32px; border-radius: 0 0 16px 16px;">
      <p style="color: #334155; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
        Our team typically responds within <strong>24 business hours</strong>. We'll review your message carefully and come back with a tailored response.
      </p>

      <!-- Quote box -->
      <div style="background: #f1f5f9; border-left: 4px solid #0ea5e9; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 28px;">
        <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;">Your message</p>
        <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.7; font-style: italic;">"${escapeHtml(preview)}"</p>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin-bottom: 28px;">
        <a href="https://bluezoid.in/services"
          style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 700;">
          Explore Our Services →
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
        BlueZoid.in &nbsp;·&nbsp; hello@bluezoid.in &nbsp;·&nbsp; Kolkata, West Bengal, India (Remote)
      </p>
    </div>

  </div>
</body>
</html>`;
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
