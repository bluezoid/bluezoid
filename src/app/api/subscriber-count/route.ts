import { readBrevoConfig } from "@/lib/brevo";
import { ok, fail } from "@/lib/api";

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const cfg = readBrevoConfig();
  if (!cfg) {
    return ok({ count: 1200, mode: "dry-run" });
  }

  const res = await fetch(
    `https://api.brevo.com/v3/contacts/lists/${cfg.listId}`,
    { headers: { "api-key": cfg.apiKey, Accept: "application/json" } }
  );

  if (!res.ok) {
    return fail("fetch_failed", "Could not fetch subscriber count", 502);
  }

  const data = await res.json();
  const count: number = data?.totalSubscribers ?? data?.uniqueSubscribers ?? 0;
  return ok({ count });
}
