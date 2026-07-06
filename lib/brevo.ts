const BREVO_API_URL = "https://api.brevo.com/v3";

export class BrevoConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BrevoConfigError";
  }
}

export class BrevoApiError extends Error {
  status: number;
  details: unknown;
  constructor(status: number, details: unknown) {
    super(`Brevo API error ${status}`);
    this.name = "BrevoApiError";
    this.status = status;
    this.details = details;
  }
}

export interface BrevoConfig {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  listId: number;
  adminEmail: string;
}

export function readBrevoConfig(): BrevoConfig | null {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const listIdRaw = process.env.BREVO_LIST_ID;
  const adminEmail = process.env.BREVO_ADMIN_EMAIL;
  if (!apiKey || !senderEmail || !listIdRaw || !adminEmail) return null;
  const listId = Number(listIdRaw);
  if (!Number.isFinite(listId) || listId <= 0) return null;
  return {
    apiKey,
    senderEmail,
    senderName: process.env.BREVO_SENDER_NAME || "BlueZoid",
    listId,
    adminEmail,
  };
}

export function requireBrevoConfig(): BrevoConfig {
  const cfg = readBrevoConfig();
  if (!cfg) {
    throw new BrevoConfigError(
      "Brevo is not configured. Set BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_LIST_ID, BREVO_ADMIN_EMAIL."
    );
  }
  return cfg;
}

function headers(apiKey: string) {
  return {
    "api-key": apiKey,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export interface SendEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}

export async function sendTransactionalEmail(
  options: SendEmailOptions,
  config: BrevoConfig = requireBrevoConfig()
): Promise<{ messageId?: string }> {
  const payload = {
    sender: { email: config.senderEmail, name: config.senderName },
    to: options.to,
    subject: options.subject,
    htmlContent: options.htmlContent,
    ...(options.replyTo && { replyTo: options.replyTo }),
  };

  const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: "POST",
    headers: headers(config.apiKey),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const details = await res.json().catch(() => ({}));
    throw new BrevoApiError(res.status, details);
  }
  return res.json().catch(() => ({}));
}

export async function addContactToList(
  email: string,
  config: BrevoConfig = requireBrevoConfig()
): Promise<{ alreadyExists: boolean }> {
  const res = await fetch(`${BREVO_API_URL}/contacts`, {
    method: "POST",
    headers: headers(config.apiKey),
    body: JSON.stringify({
      email,
      listIds: [config.listId],
      updateEnabled: true,
    }),
  });

  if (res.ok || res.status === 204) return { alreadyExists: false };

  const details = await res.json().catch(() => ({}));
  const raw = JSON.stringify(details);
  if (res.status === 400 && raw.includes("Contact already exist")) {
    return { alreadyExists: true };
  }
  throw new BrevoApiError(res.status, details);
}
