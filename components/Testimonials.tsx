import SectionHeader from "./SectionHeader";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  bgColor?: string;
  accentColor: string;
}

function TestimonialCard({
  quote,
  name,
  role,
  bgColor = "#111111",
  accentColor,
}: TestimonialCardProps) {
  return (
    <div
      className="flex flex-col gap-6 p-8 md:p-[40px] border-l-4 w-[320px] md:w-[420px] shrink-0"
      style={{ backgroundColor: bgColor, borderLeftColor: accentColor }}
    >
      <p className="font-ibm-mono text-[13px] text-[#CCCCCC] tracking-[1px] leading-[1.6]">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-[12px]">
        <div className="w-[36px] h-[36px] rounded-full bg-[#333333] shrink-0" />
        <div className="flex flex-col gap-[2px]">
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[1px]">
            {name}
          </span>
          <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "BLUEZOID REBUILT OUR ENTIRE PLATFORM FROM A MONOLITH TO A SCALABLE SAAS ARCHITECTURE. DELIVERY WAS ON TIME AND CODE QUALITY WAS EXCEPTIONAL.",
    name: "PRIYA SHARMA",
    role: "CTO, FINOVA TECH",
    accentColor: "#FFD600",
  },
  {
    quote:
      "WE WENT FROM ZERO TO A FULLY FUNCTIONAL E-COMMERCE PLATFORM IN 6 WEEKS. THE ATTENTION TO PERFORMANCE AND UX DETAIL WAS UNMATCHED.",
    name: "ARJUN MEHTA",
    role: "FOUNDER, SHOPBOLT",
    bgColor: "#0D0D0D",
    accentColor: "#FF6B35",
  },
  {
    quote:
      "THE API THEY BUILT HANDLES MILLIONS OF REQUESTS DAILY WITH ROCK-SOLID RELIABILITY. THEIR ARCHITECTURE CHOICES MADE SCALING EFFORTLESS.",
    name: "SARAH CHEN",
    role: "VP ENGINEERING, DATASYNC",
    accentColor: "#F5F5F0",
  },
  {
    quote:
      "BLUEZOID'S CONSULTING GAVE US CLARITY ON OUR TECH STACK BEFORE WE WASTED MONTHS GOING THE WRONG DIRECTION. WORTH EVERY RUPEE — PROBABLY SAVED US 6 MONTHS OF DEV TIME.",
    name: "ROHAN PATEL",
    role: "CO-FOUNDER, LEARNFLOW",
    bgColor: "#0D0D0D",
    accentColor: "#4ADE80",
  },
  {
    quote:
      "THE ADMIN DASHBOARD AND RBAC SYSTEM THEY DELIVERED WAS FAR BEYOND WHAT WE EXPECTED. CLEAN CODE, THOROUGH DOCS, AND IT JUST WORKS.",
    name: "EMILY RODRIGUEZ",
    role: "PRODUCT LEAD, NEXAHR",
    accentColor: "#F472B6",
  },
  {
    quote:
      "THEY INTEGRATED OUR IOT DATA STREAMS WITH A BEAUTIFUL REAL-TIME DASHBOARD. THE TEAM UNDERSTOOD OUR DOMAIN QUICKLY AND DELIVERED PRODUCTION-READY SOFTWARE IN RECORD TIME.",
    name: "KIRAN NAIR",
    role: "CEO, AGROSENSE",
    bgColor: "#0D0D0D",
    accentColor: "#60A5FA",
  },
];

export default function Testimonials() {
  return (
    <section className="flex flex-col w-full bg-[#0A0A0A] py-16 md:py-[100px] gap-12 md:gap-[64px] overflow-hidden">
      <div className="px-6 md:px-[120px]">
        <SectionHeader
          label="[04] // WHAT CLIENTS SAY"
          title={"TRUSTED BY BUILDERS\nAROUND THE WORLD."}
        />
      </div>

      <div className="relative w-full">
        <style>{`
          @keyframes testimonials-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .testimonials-track {
            animation: testimonials-marquee 45s linear infinite;
          }
          .testimonials-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="flex w-max gap-[2px] testimonials-track">
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-[120px] bg-linear-to-r from-[#0A0A0A] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-[120px] bg-linear-to-l from-[#0A0A0A] to-transparent" />
      </div>
    </section>
  );
}
