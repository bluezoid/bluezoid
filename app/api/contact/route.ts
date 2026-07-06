import { NextRequest, NextResponse } from "next/server";
import { readBrevoConfig, sendTransactionalEmail } from "@/lib/brevo";
import { EMAIL_LOGO } from "@/lib/email-logo";

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function validate(body: unknown): { data?: ContactPayload; error?: string } {
  if (!body || typeof body !== "object") return { error: "Invalid body" };
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const subject = typeof b.subject === "string" ? b.subject.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (name.length < 2 || name.length > 100) return { error: "Name must be at least 2 characters" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address" };
  if (phone.length < 7 || phone.length > 20) return { error: "Enter a valid mobile number" };
  if (subject.length < 5 || subject.length > 200) return { error: "Subject must be at least 5 characters" };
  if (message.length < 20 || message.length > 5000) return { error: "Message must be at least 20 characters" };

  return { data: { name, email, phone, subject, message } };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { data, error } = validate(body);
  if (error || !data) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  const { name, email, phone, subject, message } = data;
  const config = readBrevoConfig();

  if (!config) {
    console.warn("[/api/contact] Brevo not configured — skipping delivery (dev mode)");
    return NextResponse.json({ ok: true, data: { delivered: false, mode: "dry-run" } });
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

    return NextResponse.json({ ok: true, data: { delivered: true } });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send message. Please try again later." },
      { status: 502 }
    );
  }
}

function adminEmailTemplate(d: { name: string; email: string; phone: string; subject: string; message: string }) {
  const row = (label: string, value: string, link?: string) => `
    <tr>
      <td style="padding: 14px 20px; width: 130px; vertical-align: top; background: #1a1a1a; border-bottom: 1px solid #2d2d2d;">
        <span style="font-family: monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #888888;">${label}</span>
      </td>
      <td style="padding: 14px 20px; vertical-align: top; background: #111111; border-bottom: 1px solid #2d2d2d;">
        ${link
          ? `<a href="${link}" style="color: #FFD600; text-decoration: none; font-size: 14px; font-weight: 500;">${escapeHtml(value)}</a>`
          : `<span style="color: #F5F5F0; font-size: 14px; font-weight: 500;">${escapeHtml(value)}</span>`
        }
      </td>
    </tr>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 640px; margin: 40px auto; padding: 0 16px 40px;">

    <!-- Header -->
    <div style="background: #FFD600; padding: 36px 32px;">
      <table role="presentation" style="border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="vertical-align: middle; padding-right: 12px;">
            <img src="${EMAIL_LOGO}" alt="BlueZoid" width="36" height="36" style="display: block; border-radius: 4px;" />
          </td>
          <td style="vertical-align: middle;">
            <span style="color: #0A0A0A; font-size: 18px; font-weight: 800; letter-spacing: 0.05em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">BLUEZOID</span>
          </td>
        </tr>
      </table>
      <div style="display: inline-block; background: rgba(10,10,10,0.1); border: 1px solid rgba(10,10,10,0.3); padding: 6px 14px; margin-bottom: 16px;">
        <span style="color: #0A0A0A; font-family: monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">[ NEW INQUIRY ]</span>
      </div>
      <h1 style="color: #0A0A0A; margin: 0 0 6px; font-size: 26px; font-weight: 800; line-height: 1.2;">Contact Form Submission</h1>
      <p style="color: rgba(10,10,10,0.7); margin: 0; font-size: 14px;">A new message has arrived — reply directly to the sender below.</p>
    </div>

    <!-- Contact Details Card -->
    <div style="background: #111111; border: 1px solid #2d2d2d; border-top: none;">
      <div style="padding: 20px 24px; background: #161616; border-bottom: 2px solid #2d2d2d;">
        <span style="font-family: monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #555555;">Contact Details</span>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${row("Name", d.name)}
        ${row("Email", d.email, `mailto:${d.email}`)}
        ${row("Mobile", d.phone, `tel:${d.phone}`)}
        ${row("Subject", d.subject)}
      </table>
    </div>

    <!-- Message Card -->
    <div style="background: #111111; border: 1px solid #2d2d2d; border-top: none;">
      <div style="padding: 20px 24px; background: #161616; border-bottom: 2px solid #2d2d2d;">
        <span style="font-family: monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #555555;">Message</span>
      </div>
      <div style="padding: 24px; background: #111111;">
        <p style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${escapeHtml(d.message)}</p>
      </div>
    </div>

    <!-- Reply CTA -->
    <div style="background: #111111; border: 1px solid #2d2d2d; border-top: none; padding: 24px; text-align: center;">
      <a href="mailto:${d.email}?subject=Re: ${encodeURIComponent(d.subject)}"
        style="display: inline-block; background: #FFD600; color: #0A0A0A; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: 0.02em;">
        Reply to ${escapeHtml(d.name)} &rarr;
      </a>
    </div>

    <!-- Footer -->
    <p style="text-align: center; color: #555555; font-size: 11px; margin-top: 24px; line-height: 1.6;">
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
<body style="margin: 0; padding: 0; background: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 40px auto; padding: 0 16px 40px;">

    <!-- Header -->
    <div style="background: #FFD600; padding: 36px 32px; text-align: center;">
      <table role="presentation" style="border-collapse: collapse; margin: 0 auto 20px;">
        <tr>
          <td style="vertical-align: middle; padding-right: 12px;">
            <img src="${EMAIL_LOGO}" alt="BlueZoid" width="36" height="36" style="display: block; border-radius: 4px;" />
          </td>
          <td style="vertical-align: middle;">
            <span style="color: #0A0A0A; font-size: 18px; font-weight: 800; letter-spacing: 0.05em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">BLUEZOID</span>
          </td>
        </tr>
      </table>
      <h1 style="color: #0A0A0A; margin: 0 0 8px; font-size: 26px; font-weight: 800;">Thanks for reaching out, ${escapeHtml(d.name)}!</h1>
      <p style="color: rgba(10,10,10,0.7); margin: 0; font-size: 15px;">We&apos;ve received your message and will get back to you shortly.</p>
    </div>

    <!-- Body -->
    <div style="background: #111111; border: 1px solid #2d2d2d; border-top: none; padding: 32px;">
      <p style="color: #cccccc; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
        Our team typically responds within <strong style="color: #FFD600;">24 business hours</strong>. We&apos;ll review your message carefully and come back with a tailored response.
      </p>

      <!-- Quote box -->
      <div style="background: #1a1a1a; border-left: 4px solid #FFD600; padding: 16px 20px; margin-bottom: 28px;">
        <p style="margin: 0 0 4px; font-family: monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #555555;">Your message</p>
        <p style="margin: 0; color: #888888; font-size: 14px; line-height: 1.7; font-style: italic;">"${escapeHtml(preview)}"</p>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin-bottom: 28px;">
        <a href="https://bluezoid.in/services"
          style="display: inline-block; background: #FFD600; color: #0A0A0A; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 700;">
          Explore Our Services &rarr;
        </a>
      </div>

      <p style="color: #555555; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
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
