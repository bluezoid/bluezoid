"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/projects";

interface ResultRow {
  value: string;
  label: string;
}

interface FormState {
  id?: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  tagLabel: string;
  tagline: string;
  timeline: string;
  stack: string; // comma-separated in the UI
  summary: string;
  overview: string; // one paragraph per line in the UI
  results: ResultRow[];
  testimonialQuote: string;
  testimonialName: string;
  testimonialRole: string;
  screenshotUrl: string;
  videoUrl: string;
}

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  client: "",
  category: "",
  tagLabel: "",
  tagline: "",
  timeline: "",
  stack: "",
  summary: "",
  overview: "",
  results: [{ value: "", label: "" }],
  testimonialQuote: "",
  testimonialName: "",
  testimonialRole: "",
  screenshotUrl: "",
  videoUrl: "",
};

function projectToForm(p: Project): FormState {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    client: p.client,
    category: p.category,
    tagLabel: p.tagLabel,
    tagline: p.tagline,
    timeline: p.timeline,
    stack: p.stack.join(", "),
    summary: p.summary,
    overview: p.overview.join("\n\n"),
    results: p.results.length ? p.results : [{ value: "", label: "" }],
    testimonialQuote: p.testimonial.quote,
    testimonialName: p.testimonial.name,
    testimonialRole: p.testimonial.role,
    screenshotUrl: p.screenshotUrl || "",
    videoUrl: p.videoUrl || "",
  };
}

function formToPayload(f: FormState) {
  return {
    slug: f.slug,
    title: f.title,
    client: f.client,
    category: f.category,
    tagLabel: f.tagLabel,
    tagline: f.tagline,
    timeline: f.timeline,
    stack: f.stack.split(",").map((s) => s.trim()).filter(Boolean),
    summary: f.summary,
    overview: f.overview.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    results: f.results.filter((r) => r.value.trim() && r.label.trim()),
    testimonial: {
      quote: f.testimonialQuote,
      name: f.testimonialName,
      role: f.testimonialRole,
    },
    screenshotUrl: f.screenshotUrl || undefined,
    videoUrl: f.videoUrl || undefined,
  };
}

function inputClass() {
  return "h-[42px] px-3 bg-[#0A0A0A] border border-[#3D3D3D] text-[#F5F5F0] font-ibm-mono text-[12px] outline-none focus:border-[#FFD600] transition-colors w-full";
}

function labelClass() {
  return "font-ibm-mono text-[10px] text-[#666666] tracking-[1.5px]";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass()}>{label}</label>
      {children}
    </div>
  );
}

function UploadField({
  label,
  value,
  onChange,
  accept,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Upload failed");
      onChange(json.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label}>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className="font-ibm-mono text-[11px] text-[#888888] file:mr-3 file:h-[32px] file:px-3 file:bg-[#1A1A1A] file:border file:border-[#3D3D3D] file:text-[#AAAAAA] file:font-ibm-mono file:text-[10px]"
        />
        {uploading && <span className="font-ibm-mono text-[10px] text-[#888888]">UPLOADING...</span>}
        {error && <span className="font-ibm-mono text-[10px] text-red-400">{error}</span>}
        {value && (
          <div className="flex items-center gap-2">
            <span className="font-ibm-mono text-[10px] text-[#4ADE80] truncate max-w-[300px]">{value}</span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="font-ibm-mono text-[10px] text-red-400 hover:underline"
            >
              REMOVE
            </button>
          </div>
        )}
      </div>
    </Field>
  );
}

function ProjectForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: FormState;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setResult = (i: number, patch: Partial<ResultRow>) =>
    setForm((f) => ({
      ...f,
      results: f.results.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    }));

  const addResult = () =>
    setForm((f) => ({ ...f, results: [...f.results, { value: "", label: "" }] }));

  const removeResult = (i: number) =>
    setForm((f) => ({ ...f, results: f.results.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = formToPayload(form);
      const res = await fetch(
        form.id ? `/api/admin/projects/${form.id}` : "/api/admin/projects",
        {
          method: form.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 md:p-8 bg-[#111111] border border-[#2D2D2D]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="TITLE">
          <input required className={inputClass()} value={form.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="SLUG (AUTO IF EMPTY)">
          <input className={inputClass()} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. finova-tech-saas-platform" />
        </Field>
        <Field label="CLIENT">
          <input required className={inputClass()} value={form.client} onChange={(e) => set("client", e.target.value)} />
        </Field>
        <Field label="SERVICE / CATEGORY">
          <input required className={inputClass()} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. SAAS DEVELOPMENT" />
        </Field>
        <Field label="TAG LABEL (SHOWN AS [ TAG ])">
          <input required className={inputClass()} value={form.tagLabel} onChange={(e) => set("tagLabel", e.target.value)} placeholder="e.g. SAAS PLATFORM" />
        </Field>
        <Field label="TIMELINE">
          <input required className={inputClass()} value={form.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="e.g. 12 WEEKS" />
        </Field>
      </div>

      <Field label="TAGLINE (SHORT LINE UNDER CARD TITLE)">
        <input required className={inputClass()} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="FOR CLIENT // SHORT RESULT" />
      </Field>

      <Field label="TECH STACK (COMMA-SEPARATED)">
        <input className={inputClass()} value={form.stack} onChange={(e) => set("stack", e.target.value)} placeholder="NEXT.JS, TYPESCRIPT, POSTGRES" />
      </Field>

      <Field label="SUMMARY">
        <textarea required rows={2} className={inputClass() + " h-auto py-2 resize-y"} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
      </Field>

      <Field label="OVERVIEW (SEPARATE PARAGRAPHS WITH A BLANK LINE)">
        <textarea rows={6} className={inputClass() + " h-auto py-2 resize-y"} value={form.overview} onChange={(e) => set("overview", e.target.value)} />
      </Field>

      <div className="flex flex-col gap-3">
        <span className={labelClass()}>RESULTS</span>
        {form.results.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className={inputClass()} placeholder="VALUE (e.g. 3X)" value={r.value} onChange={(e) => setResult(i, { value: e.target.value })} />
            <input className={inputClass()} placeholder="LABEL (e.g. FASTER ONBOARDING)" value={r.label} onChange={(e) => setResult(i, { label: e.target.value })} />
            <button type="button" onClick={() => removeResult(i)} className="shrink-0 font-ibm-mono text-[11px] text-red-400 hover:underline">
              REMOVE
            </button>
          </div>
        ))}
        <button type="button" onClick={addResult} className="w-fit font-ibm-mono text-[11px] text-[#FFD600] hover:underline">
          + ADD RESULT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="TESTIMONIAL QUOTE">
          <textarea rows={3} className={inputClass() + " h-auto py-2 resize-y md:col-span-1"} value={form.testimonialQuote} onChange={(e) => set("testimonialQuote", e.target.value)} />
        </Field>
        <Field label="TESTIMONIAL NAME">
          <input className={inputClass()} value={form.testimonialName} onChange={(e) => set("testimonialName", e.target.value)} />
        </Field>
        <Field label="TESTIMONIAL ROLE">
          <input className={inputClass()} value={form.testimonialRole} onChange={(e) => set("testimonialRole", e.target.value)} placeholder="CTO, COMPANY" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadField label="SCREENSHOT (IMAGE)" value={form.screenshotUrl} onChange={(v) => set("screenshotUrl", v)} accept="image/*" />
        <UploadField label="DEMO VIDEO (OPTIONAL)" value={form.videoUrl} onChange={(v) => set("videoUrl", v)} accept="video/*" />
      </div>

      {error && <p className="font-ibm-mono text-[11px] text-red-400">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center h-[44px] px-6 bg-[#FFD600] hover:bg-[#e6c200] transition-colors disabled:opacity-60"
        >
          <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
            {saving ? "SAVING..." : form.id ? "SAVE CHANGES" : "CREATE PROJECT"}
          </span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center h-[44px] px-6 bg-[#0A0A0A] border border-[#3D3D3D] hover:border-[#888888] transition-colors"
        >
          <span className="font-ibm-mono text-[11px] text-[#888888] tracking-[1.5px]">CANCEL</span>
        </button>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [mode, setMode] = useState<"list" | "new" | "edit">("list");
  const [editing, setEditing] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin/projects");
    const json = await res.json();
    if (json.ok) setProjects(json.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Delete failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0A0A0A]">
      <header className="flex items-center justify-between h-[60px] px-6 md:px-[48px] border-b border-b-[#1D1D1D]">
        <div className="flex items-center gap-[10px]">
          <span className="w-[10px] h-[10px] bg-[#FFD600]" />
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
            BLUEZOID ADMIN
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" rel="noreferrer" className="font-ibm-mono text-[10px] text-[#888888] tracking-[1.5px] hover:text-[#F5F5F0] transition-colors">
            VIEW SITE
          </a>
          <button onClick={handleLogout} className="font-ibm-mono text-[10px] text-[#888888] tracking-[1.5px] hover:text-[#F5F5F0] transition-colors">
            LOG OUT
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-8 px-6 py-12 md:px-[80px] md:py-[64px] max-w-[1000px] w-full mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-grotesk text-[28px] md:text-[36px] font-bold text-[#F5F5F0] tracking-[-0.5px]">
            PROJECTS
          </h1>
          {mode === "list" && (
            <button
              onClick={() => setMode("new")}
              className="flex items-center justify-center h-[42px] px-5 bg-[#FFD600] hover:bg-[#e6c200] transition-colors"
            >
              <span className="font-grotesk text-[11px] font-bold text-[#0A0A0A] tracking-[1.5px]">
                + NEW PROJECT
              </span>
            </button>
          )}
        </div>

        {error && <p className="font-ibm-mono text-[11px] text-red-400">{error}</p>}

        {mode === "new" && (
          <ProjectForm
            initial={EMPTY_FORM}
            onCancel={() => setMode("list")}
            onSaved={() => {
              setMode("list");
              load();
            }}
          />
        )}

        {mode === "edit" && editing && (
          <ProjectForm
            initial={projectToForm(editing)}
            onCancel={() => {
              setMode("list");
              setEditing(null);
            }}
            onSaved={() => {
              setMode("list");
              setEditing(null);
              load();
            }}
          />
        )}

        {mode === "list" && (
          <div className="flex flex-col gap-[2px]">
            {projects === null && (
              <p className="font-ibm-mono text-[12px] text-[#666666]">LOADING...</p>
            )}
            {projects !== null && projects.length === 0 && (
              <p className="font-ibm-mono text-[12px] text-[#666666]">
                NO PROJECTS YET — CLICK &quot;+ NEW PROJECT&quot; TO ADD ONE.
              </p>
            )}
            {projects?.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-5 bg-[#111111] border border-[#2D2D2D]"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-grotesk text-[14px] font-bold text-[#F5F5F0] truncate">{p.title}</span>
                  <span className="font-ibm-mono text-[10px] text-[#666666] tracking-[1px]">
                    /work/{p.slug} · {p.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setEditing(p);
                      setMode("edit");
                    }}
                    className="font-ibm-mono text-[11px] text-[#FFD600] hover:underline"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="font-ibm-mono text-[11px] text-red-400 hover:underline disabled:opacity-50"
                  >
                    {deletingId === p.id ? "DELETING..." : "DELETE"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
