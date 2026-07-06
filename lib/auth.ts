// Uses Web Crypto (SubtleCrypto) so this works in both the Edge middleware
// runtime and Node.js API routes without relying on the node:crypto module.

export const SESSION_COOKIE = "bz_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("Missing SESSION_SECRET environment variable");
  return s;
}

const encoder = new TextEncoder();

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string): Promise<string> {
  const key = await hmacKey();
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bufferToHex(mac);
}

/** Constant-time string comparison (works without node:crypto). */
function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Build a signed session token: base64(expiry).hmac */
export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = btoa(String(expires));
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;

  const expected = await sign(payload);
  if (!timingSafeEqualStr(mac, expected)) return false;

  const expires = Number(atob(payload));
  return Number.isFinite(expires) && Date.now() < expires;
}

export function checkCredentials(username: string, password: string): boolean {
  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;
  if (!validUser || !validPass) return false;

  const userMatches = timingSafeEqualStr(username, validUser);
  const passMatches = timingSafeEqualStr(password, validPass);
  return userMatches && passMatches;
}
