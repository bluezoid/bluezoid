import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/projects";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Work — BlueZoid",
  description:
    "Case studies from SaaS platforms, e-commerce, APIs, and web applications BlueZoid has shipped for clients.",
};

export default async function WorkIndexPage() {
  const projects = await getAllProjects();

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
          href="/"
          className="font-ibm-mono text-[10px] md:text-[11px] text-[#888888] tracking-[1.5px] hover:text-[#F5F5F0] transition-colors"
        >
          &lt; BACK HOME
        </Link>
      </header>

      {/* Header */}
      <section className="flex flex-col w-full py-16 px-6 md:py-[100px] md:px-[120px] gap-6 md:gap-[24px] border-b border-b-[#1D1D1D]">
        <SectionHeader
          label="[07] // ALL WORK"
          title={"EVERY PROJECT\nWE'VE SHIPPED."}
          subtitle="FROM SAAS PLATFORMS TO E-COMMERCE, APIS, AND WEB APPS — HERE'S WHAT WE'VE BUILT FOR CLIENTS."
        />
      </section>

      {/* Grid */}
      <section className="flex flex-col w-full px-6 py-16 md:px-[120px] md:py-[100px] gap-[2px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="group flex flex-col gap-[24px] p-8 md:p-[40px] border-2 transition-transform duration-300 hover:-translate-y-1"
              style={{ backgroundColor: p.cardBg, borderColor: p.cardBorder }}
            >
              <div className="relative flex items-center justify-center h-[320px] bg-[#1A1A1A] border border-[#2D2D2D] overflow-hidden">
                {p.screenshotUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.screenshotUrl} alt={p.title} className="h-full w-full object-contain" />
                ) : (
                  <span className="font-ibm-mono text-[11px] text-[#333333] tracking-[2px] group-hover:text-[#666666] transition-colors">[SCREENSHOT]</span>
                )}
              </div>
              <div className="flex items-center justify-between w-full">
                <div
                  className="flex items-center justify-center h-[24px] px-[10px] border"
                  style={{ backgroundColor: p.tagBg, borderColor: p.tagBorder || "transparent" }}
                >
                  <span className="font-ibm-mono text-[9px] font-bold tracking-[1px]" style={{ color: p.tagColor }}>
                    {p.tag}
                  </span>
                </div>
                <span className="font-ibm-mono text-[11px] tracking-[2px]" style={{ color: p.idxColor }}>
                  {p.idx}
                </span>
              </div>
              <h3 className="font-grotesk text-[22px] font-bold text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line group-hover:text-[#FFD600] transition-colors">
                {p.cardTitle}
              </h3>
              <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">{p.tagline}</p>
              <span className="mt-auto font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                VIEW CASE STUDY &gt;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center w-full py-16 px-6 md:py-[100px] gap-6 md:gap-[24px] border-t border-t-[#1D1D1D]">
        <h2 className="font-grotesk text-[28px] md:text-[48px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] text-center max-w-[700px]">
          READY TO BUILD YOUR
          <span className="text-[#FFD600]"> OWN SUCCESS STORY?</span>
        </h2>
        <a
          href="mailto:hello@bluezoid.in"
          className="flex items-center justify-center w-full sm:w-[240px] h-[56px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors"
        >
          <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
            START A PROJECT
          </span>
        </a>
      </section>

      <Footer />
    </main>
  );
}
