import { NextRequest, NextResponse } from "next/server";
import { createProject, getAllProjects, slugify, type ProjectInput } from "@/lib/projects";

export async function GET() {
  const projects = await getAllProjects();
  return NextResponse.json({ ok: true, data: projects });
}

function validate(body: unknown): { data?: ProjectInput; error?: string } {
  if (!body || typeof body !== "object") return { error: "Invalid body" };
  const b = body as Record<string, unknown>;

  const required = ["title", "client", "category", "tagLabel", "tagline", "timeline", "summary"];
  for (const field of required) {
    if (typeof b[field] !== "string" || !(b[field] as string).trim()) {
      return { error: `Missing required field: ${field}` };
    }
  }
  if (!Array.isArray(b.stack) || !b.stack.every((s) => typeof s === "string")) {
    return { error: "stack must be an array of strings" };
  }
  if (!Array.isArray(b.overview) || !b.overview.every((s) => typeof s === "string")) {
    return { error: "overview must be an array of strings" };
  }
  if (
    !Array.isArray(b.results) ||
    !b.results.every(
      (r) =>
        r &&
        typeof r === "object" &&
        typeof (r as Record<string, unknown>).value === "string" &&
        typeof (r as Record<string, unknown>).label === "string"
    )
  ) {
    return { error: "results must be an array of { value, label }" };
  }
  const t = b.testimonial as Record<string, unknown> | undefined;
  if (
    !t ||
    typeof t.quote !== "string" ||
    typeof t.name !== "string" ||
    typeof t.role !== "string"
  ) {
    return { error: "testimonial must be { quote, name, role }" };
  }

  const data: ProjectInput = {
    slug: typeof b.slug === "string" && b.slug.trim() ? slugify(b.slug) : slugify(b.title as string),
    title: b.title as string,
    client: b.client as string,
    category: b.category as string,
    tagLabel: b.tagLabel as string,
    tagline: b.tagline as string,
    timeline: b.timeline as string,
    stack: b.stack as string[],
    summary: b.summary as string,
    overview: b.overview as string[],
    results: b.results as { value: string; label: string }[],
    testimonial: t as { quote: string; name: string; role: string },
    screenshotUrl: typeof b.screenshotUrl === "string" ? b.screenshotUrl : undefined,
    videoUrl: typeof b.videoUrl === "string" ? b.videoUrl : undefined,
  };

  return { data };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { data, error } = validate(body);
  if (error || !data) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  try {
    const id = await createProject(data);
    return NextResponse.json({ ok: true, data: { id } }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create project";
    const isDup = message.includes("E11000");
    return NextResponse.json(
      { ok: false, error: isDup ? "A project with this slug already exists" : message },
      { status: isDup ? 409 : 500 }
    );
  }
}
