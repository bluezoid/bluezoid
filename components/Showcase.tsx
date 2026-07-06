import Link from "next/link";
import SectionHeader from "./SectionHeader";
import { getAllProjects } from "@/lib/projects";

export default async function Showcase() {
  const projects = await getAllProjects();
  if (projects.length === 0) return null;

  return (
    <section id="showcase" className="flex flex-col w-full bg-[#080808] py-16 md:py-[100px] gap-8 md:gap-[48px] overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-[120px]">
        <SectionHeader
          label="[07] // OUR WORK"
          title={"BUILT BY\nBLUEZOID."}
          titleWidth="w-full max-w-[600px]"
        />
      </div>

      {/* Infinite scrolling track */}
      <div className="relative w-full">
        <style>{`
          @keyframes showcase-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .showcase-track {
            animation: showcase-marquee 50s linear infinite;
          }
          .showcase-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="flex w-max gap-[2px] showcase-track">
          {[...projects, ...projects].map((s, i) => (
            <Link
              key={i}
              href={`/work/${s.slug}`}
              className="group flex flex-col gap-[24px] p-8 md:p-[40px] h-[460px] md:h-[560px] w-[300px] md:w-[560px] shrink-0 border-2 transition-transform duration-300 hover:-translate-y-1"
              style={{ backgroundColor: s.cardBg, borderColor: s.cardBorder }}
            >
              <div className="relative flex items-center justify-center h-[240px] md:h-[340px] bg-[#1A1A1A] border border-[#2D2D2D] overflow-hidden">
                {s.screenshotUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.screenshotUrl} alt={s.title} className="h-full w-full object-contain" />
                ) : (
                  <span className="font-ibm-mono text-[11px] text-[#333333] tracking-[2px] group-hover:text-[#666666] transition-colors">[SCREENSHOT]</span>
                )}
              </div>
              <div className="flex items-center justify-between w-full">
                <div
                  className="flex items-center justify-center h-[24px] px-[10px] border"
                  style={{ backgroundColor: s.tagBg, borderColor: s.tagBorder || "transparent" }}
                >
                  <span className="font-ibm-mono text-[9px] font-bold tracking-[1px]" style={{ color: s.tagColor }}>
                    {s.tag}
                  </span>
                </div>
                <span className="font-ibm-mono text-[11px] tracking-[2px]" style={{ color: s.idxColor }}>
                  {s.idx}
                </span>
              </div>
              <h3 className="font-grotesk text-[20px] font-bold text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line group-hover:text-[#FFD600] transition-colors">
                {s.cardTitle}
              </h3>
              <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">{s.tagline}</p>
              <span className="mt-auto font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                VIEW CASE STUDY &gt;
              </span>
            </Link>
          ))}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-[120px] bg-linear-to-r from-[#080808] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-[120px] bg-linear-to-l from-[#080808] to-transparent" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 md:px-[120px]">
        <span className="font-ibm-mono text-[11px] text-[#444444] tracking-[2px]">
          {String(projects.length).padStart(2, "0")} PROJECTS AND COUNTING
        </span>
        <Link href="/work" className="font-ibm-mono text-[11px] text-[#FFD600] tracking-[2px] hover:underline">
          VIEW ALL &gt;
        </Link>
      </div>
    </section>
  );
}
