"use client";

import { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  active: boolean;
}

function StepCard({ number, title, description, active }: StepCardProps) {
  return (
    <div
      className="flex flex-col gap-4 p-8 md:p-[40px] border w-full md:flex-1 md:h-[260px] transition-colors duration-700 ease-in-out"
      style={{
        backgroundColor: active ? "#111111" : "#0A0A0A",
        borderColor: active ? "#FFD600" : "#2D2D2D",
      }}
    >
      <span
        className="font-grotesk text-[48px] font-bold tracking-[-2px] transition-colors duration-700 ease-in-out"
        style={{ color: active ? "#FFD600" : "#555555" }}
      >
        {number}
      </span>
      <h3 className="font-grotesk text-[20px] font-bold text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line">
        {title}
      </h3>
      <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px] leading-[1.5]">
        {description}
      </p>
    </div>
  );
}

const steps = [
  {
    number: "01",
    title: "DISCOVERY\n& SCOPE",
    description:
      "48H KICKOFF. WE MAP YOUR REQUIREMENTS INTO A FIXED, TRANSPARENT SCOPE.",
  },
  {
    number: "02",
    title: "BUILD\n& ITERATE",
    description:
      "WEEKLY DEMOS. TIGHT FEEDBACK LOOPS. YOU SEE PROGRESS FROM WEEK ONE.",
  },
  {
    number: "03",
    title: "SHIP\n& SUPPORT",
    description:
      "PRODUCTION DEPLOY WITH FULL SOURCE CODE OWNERSHIP. WE STAY ON FOR SUPPORT.",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % steps.length);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="flex flex-col w-full bg-[#0D0D0D] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]">
      <SectionHeader
        label="[02] // HOW WE WORK"
        title={"THREE STEPS.\nONE PARTNER."}
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        {steps.map((step, i) => (
          <StepCard key={step.number} {...step} active={active === i} />
        ))}
      </div>
    </section>
  );
}
