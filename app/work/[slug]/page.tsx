import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — BlueZoid`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getAllProjects();
  const otherProjects = allProjects.filter((p) => p.slug !== project.slug);

  return (
    <main className="flex flex-col w-full bg-[#0A0A0A]">
      {/* Minimal header */}
      <header className="flex items-center justify-between h-[60px] px-6 md:px-[48px] border-b border-b-[#1D1D1D]">
        <Link href="/" className="flex items-center gap-[10px] shrink-0 group">
          <Image
            src="/logo.png"
            alt="BlueZoid logo"
            width={24}
            height={24}
            className="w-[24px] h-[24px] shrink-0 group-hover:scale-110 transition-transform"
          />
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
            BLUEZOID
          </span>
        </Link>
        <Link
          href="/#showcase"
          className="font-ibm-mono text-[10px] md:text-[11px] text-[#888888] tracking-[1.5px] hover:text-[#F5F5F0] transition-colors"
        >
          &lt; BACK TO WORK
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-col w-full py-16 px-6 md:py-[100px] md:px-[120px] gap-6 md:gap-[24px] border-b border-b-[#1D1D1D]">
        <div
          className="flex items-center justify-center h-[28px] px-[12px] border w-fit"
          style={{ backgroundColor: project.tagBg, borderColor: project.tagBorder || "transparent" }}
        >
          <span className="font-ibm-mono text-[10px] font-bold tracking-[2px]" style={{ color: project.tagColor }}>
            {project.tag}
          </span>
        </div>

        <h1 className="font-grotesk text-[36px] md:text-[64px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.05] w-full max-w-[900px]">
          {project.title}
        </h1>

        <p className="font-ibm-mono text-[12px] md:text-[14px] text-[#888888] tracking-[1px] leading-[1.6] w-full max-w-[700px]">
          {project.summary}
        </p>
      </section>

      {/* Meta + Screenshot */}
      <section className="flex flex-col w-full px-6 py-12 md:px-[120px] md:py-[64px] gap-10 md:gap-[48px] border-b border-b-[#1D1D1D]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
          {[
            { label: "CLIENT", value: project.client },
            { label: "SERVICE", value: project.category },
            { label: "TIMELINE", value: project.timeline },
            { label: "STACK", value: `${project.stack.length} TOOLS` },
          ].map((m) => (
            <div key={m.label} className="flex flex-col gap-2 p-6 bg-[#111111] border border-[#2D2D2D]">
              <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[2px]">{m.label}</span>
              <span className="font-grotesk text-[14px] font-bold text-[#F5F5F0] tracking-[1px]">{m.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-[8px]">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border border-[#3D3D3D] font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[1.5px]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-center h-[280px] md:h-[720px] bg-[#111111] border border-[#2D2D2D] overflow-hidden">
          {project.videoUrl ? (
            <video src={project.videoUrl} controls className="h-full w-full object-contain" />
          ) : project.screenshotUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.screenshotUrl} alt={project.title} className="h-full w-full object-cover" />
          ) : (
            <span className="font-ibm-mono text-[12px] text-[#333333] tracking-[3px]">[PROJECT SCREENSHOT]</span>
          )}
        </div>
      </section>

      {/* Overview */}
      <section className="flex flex-col w-full px-6 py-16 md:px-[120px] md:py-[100px] gap-8 md:gap-[32px] border-b border-b-[#1D1D1D]">
        <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[3px]">
          [ THE PROJECT ]
        </span>
        <div className="flex flex-col gap-6 md:gap-[28px] max-w-[760px]">
          {project.overview.map((para, i) => (
            <p
              key={i}
              className="font-ibm-mono text-[13px] md:text-[14px] text-[#AAAAAA] tracking-[0.5px] leading-[1.7]"
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="flex flex-col w-full bg-[#FFD600] py-12 px-6 md:py-[64px] md:px-[120px] gap-8 md:gap-[32px]">
        <span className="font-ibm-mono text-[11px] font-bold text-[#0A0A0A] tracking-[3px]">
          [ THE RESULTS ]
        </span>
        <div className="grid grid-cols-2 md:flex w-full gap-[2px] md:gap-0">
          {project.results.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 items-center justify-center py-6 md:py-0 md:h-[140px] md:flex-1
                ${i < project.results.length - 1 ? "md:border-r-2 md:border-r-[#0A0A0A]" : ""}
                ${i % 2 === 0 ? "border-r-2 border-r-[#0A0A0A] pr-4 md:border-r-0 md:pr-0" : "pl-4 md:pl-0"}
                ${i >= 2 ? "border-t-2 border-t-[#0A0A0A] pt-4 md:border-t-0 md:pt-0" : ""}
              `}
            >
              <span className="font-grotesk text-[32px] md:text-[48px] font-bold text-[#0A0A0A] tracking-[-1px] leading-none">
                {stat.value}
              </span>
              <span className="font-ibm-mono text-[9px] md:text-[11px] font-bold text-[#1A1A1A] tracking-[1.5px] text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="flex flex-col w-full px-6 py-16 md:px-[120px] md:py-[100px] border-b border-b-[#1D1D1D]">
        <div
          className="flex flex-col gap-6 p-8 md:p-[48px] border-l-4"
          style={{ backgroundColor: "#111111", borderLeftColor: project.accent }}
        >
          <p className="font-ibm-mono text-[16px] md:text-[20px] text-[#F5F5F0] tracking-[0.5px] leading-[1.6] max-w-[700px]">
            &ldquo;{project.testimonial.quote}&rdquo;
          </p>
          <div className="flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] rounded-full bg-[#333333] shrink-0" />
            <div className="flex flex-col gap-[2px]">
              <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[1px]">
                {project.testimonial.name}
              </span>
              <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
                {project.testimonial.role}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Other projects */}
      <section className="flex flex-col w-full px-6 py-16 md:px-[120px] md:py-[100px] gap-8 md:gap-[32px] border-b border-b-[#1D1D1D]">
        <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[3px]">
          [ MORE WORK ]
        </span>
        <div className="flex flex-col md:flex-row w-full gap-[2px]">
          {otherProjects.map((p) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="group flex flex-col gap-3 p-6 md:p-[28px] bg-[#111111] border border-[#2D2D2D] hover:border-[#FFD600] transition-colors w-full md:flex-1"
            >
              <span className="font-ibm-mono text-[9px] font-bold tracking-[1.5px]" style={{ color: p.accent }}>
                {p.tag}
              </span>
              <h4 className="font-grotesk text-[15px] font-bold text-[#F5F5F0] tracking-[0.5px] leading-[1.2] whitespace-pre-line group-hover:text-[#FFD600] transition-colors">
                {p.cardTitle}
              </h4>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center w-full py-16 px-6 md:py-[100px] gap-6 md:gap-[24px]">
        <h2 className="font-grotesk text-[28px] md:text-[48px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] text-center max-w-[700px]">
          READY TO BUILD YOUR
          <span className="text-[#FFD600]"> OWN SUCCESS STORY?</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-[16px]">
          <a
            href="mailto:hello@bluezoid.in"
            className="flex items-center justify-center w-full sm:w-[240px] h-[56px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors"
          >
            <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
              START A PROJECT
            </span>
          </a>
          <Link
            href="/#showcase"
            className="flex items-center justify-center w-full sm:w-[200px] h-[56px] bg-[#0A0A0A] border-2 border-[#3D3D3D] hover:border-[#888888] transition-colors"
          >
            <span className="font-ibm-mono text-[12px] text-[#888888] tracking-[2px]">
              VIEW ALL WORK &gt;
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
