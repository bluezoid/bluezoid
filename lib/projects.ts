import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface ProjectDoc {
  _id: ObjectId;
  slug: string;
  title: string;
  client: string;
  category: string;
  tagLabel: string;
  tagline: string;
  timeline: string;
  stack: string[];
  summary: string;
  overview: string[];
  results: { value: string; label: string }[];
  testimonial: { quote: string; name: string; role: string };
  screenshotUrl?: string;
  videoUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project extends Omit<ProjectDoc, "_id"> {
  id: string;
  idx: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  tagBorder: string;
  accent: string;
  cardTitle: string;
  cardBg: string;
  cardBorder: string;
  idxColor: string;
}

export type ProjectInput = Omit<ProjectDoc, "_id" | "order" | "createdAt" | "updatedAt">;

/** Visual style rotation — keeps the same alternating look as the original static cards. */
const PALETTE = [
  { cardBg: "#111111", cardBorder: "#2D2D2D", tagBg: "#FFD600", tagColor: "#0A0A0A", tagBorder: "", idxColor: "#444444", accent: "#FFD600" },
  { cardBg: "#0F0F0F", cardBorder: "#2D2D2D", tagBg: "#111111", tagColor: "#FFD600", tagBorder: "#FFD600", idxColor: "#FFD600", accent: "#FF6B35" },
  { cardBg: "#0A0A0A", cardBorder: "#2D2D2D", tagBg: "#1A1A1A", tagColor: "#FF6B35", tagBorder: "#FF6B35", idxColor: "#444444", accent: "#60A5FA" },
  { cardBg: "#111111", cardBorder: "#2D2D2D", tagBg: "#FFD600", tagColor: "#0A0A0A", tagBorder: "", idxColor: "#444444", accent: "#4ADE80" },
];

function toProject(doc: ProjectDoc, position: number, total: number): Project {
  const style = PALETTE[position % PALETTE.length];
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
    idx: `${String(position + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
    tag: `[${doc.tagLabel}]`,
    cardTitle: doc.title,
    ...style,
  };
}

async function collection() {
  const db = await getDb();
  return db.collection<ProjectDoc>("projects");
}

export async function getAllProjects(): Promise<Project[]> {
  const col = await collection();
  const docs = await col.find({}).sort({ order: 1 }).toArray();
  return docs.map((d, i) => toProject(d, i, docs.length));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug);
}

export async function getProjectById(id: string): Promise<ProjectDoc | null> {
  const col = await collection();
  return col.findOne({ _id: new ObjectId(id) });
}

export async function createProject(input: ProjectInput): Promise<string> {
  const col = await collection();
  const count = await col.countDocuments();
  const now = new Date();
  const result = await col.insertOne({
    ...input,
    order: count,
    createdAt: now,
    updatedAt: now,
  } as ProjectDoc);
  return result.insertedId.toString();
}

export async function updateProject(
  id: string,
  input: Partial<ProjectInput>
): Promise<void> {
  const col = await collection();
  await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: new Date() } }
  );
}

export async function deleteProject(id: string): Promise<void> {
  const col = await collection();
  await col.deleteOne({ _id: new ObjectId(id) });
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
