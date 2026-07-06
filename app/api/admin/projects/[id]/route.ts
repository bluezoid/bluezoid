import { NextRequest, NextResponse } from "next/server";
import { deleteFromR2, keyFromPublicUrl } from "@/lib/r2";
import {
  deleteProject,
  getProjectById,
  slugify,
  updateProject,
  type ProjectInput,
} from "@/lib/projects";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const update: Partial<ProjectInput> = {};

  if (typeof b.slug === "string" && b.slug.trim()) update.slug = slugify(b.slug);
  if (typeof b.title === "string") update.title = b.title;
  if (typeof b.client === "string") update.client = b.client;
  if (typeof b.category === "string") update.category = b.category;
  if (typeof b.tagLabel === "string") update.tagLabel = b.tagLabel;
  if (typeof b.tagline === "string") update.tagline = b.tagline;
  if (typeof b.timeline === "string") update.timeline = b.timeline;
  if (typeof b.summary === "string") update.summary = b.summary;
  if (Array.isArray(b.stack)) update.stack = b.stack as string[];
  if (Array.isArray(b.overview)) update.overview = b.overview as string[];
  if (Array.isArray(b.results)) update.results = b.results as { value: string; label: string }[];
  if (b.testimonial && typeof b.testimonial === "object") {
    update.testimonial = b.testimonial as { quote: string; name: string; role: string };
  }
  if (typeof b.screenshotUrl === "string") update.screenshotUrl = b.screenshotUrl;
  if (typeof b.videoUrl === "string") update.videoUrl = b.videoUrl;

  try {
    await updateProject(id, update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update project";
    const isDup = message.includes("E11000");
    return NextResponse.json(
      { ok: false, error: isDup ? "A project with this slug already exists" : message },
      { status: isDup ? 409 : 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const doc = await getProjectById(id);
  if (doc) {
    for (const url of [doc.screenshotUrl, doc.videoUrl]) {
      if (!url) continue;
      const key = keyFromPublicUrl(url);
      if (key) await deleteFromR2(key).catch(() => {});
    }
  }

  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
