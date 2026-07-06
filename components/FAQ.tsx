"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";

const faqs = [
  {
    question: "DO YOU REQUIRE LONG-TERM CONTRACTS?",
    answer:
      "NO. NO LOCK-IN CONTRACTS, EVER. WE WORK ON FIXED-SCOPE PROJECTS OR MONTHLY RETAINERS THAT YOU CAN PAUSE OR CANCEL ANYTIME. YOU OWN THE FULL SOURCE CODE FROM DAY ONE.",
    defaultOpen: true,
  },
  { question: "HOW DO YOU PRICE PROJECTS?", answer: "MOST ENGAGEMENTS ARE FIXED-SCOPE, FIXED-PRICE AFTER A SCOPING CALL. FOR ONGOING WORK WE OFFER MONTHLY RETAINERS WITH A DEDICATED TEAM. NO SURPRISE INVOICES." },
  { question: "WHAT'S YOUR TECH STACK?", answer: "NEXT.JS, TYPESCRIPT, NODE.JS, POSTGRES — WITH AI/LLM INTEGRATION WHERE IT ADDS REAL VALUE. WE MATCH THE STACK TO YOUR TEAM'S EXISTING TOOLING WHEN POSSIBLE." },
  { question: "CAN YOU WORK WITH OUR EXISTING TEAM?", answer: "YES. WE REGULARLY EMBED WITH IN-HOUSE ENGINEERING TEAMS FOR ARCHITECTURE REVIEWS, CODE AUDITS, OR AS AN EXTRA PAIR OF SENIOR HANDS DURING CRUNCH PERIODS." },
  { question: "HOW FAST CAN YOU START?", answer: "48-HOUR KICKOFF GUARANTEED AFTER SCOPE IS CONFIRMED. MOST MVPS SHIP WITHIN 4-8 WEEKS DEPENDING ON COMPLEXITY." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
      <section id="faq" className="flex flex-col w-full bg-[#060606] py-16 px-6 md:py-[100px] md:px-[120px]">
      <div className="w-full max-w-[480px]">
        <SectionHeader
          label="[08] // FAQ"
          title={"GOT\nQUESTIONS?"}
          subtitle="EVERYTHING YOU NEED TO KNOW BEFORE WE START BUILDING TOGETHER."
          titleWidth="w-full"
          subtitleWidth="w-full"
        />
      </div>

      <div className="h-10 md:h-[64px]" />

      {/* FAQ items */}
      <div className="flex flex-col w-full">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="flex flex-col w-full border-t border-t-[#1D1D1D]">
              <button
                className="flex items-center justify-between w-full py-5 md:h-[72px] text-left gap-4"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
              >
                <span className="font-grotesk text-[14px] md:text-[16px] font-bold text-[#F5F5F0] tracking-[1px]">
                  {faq.question}
                </span>
                <div
                  className="flex items-center justify-center w-[32px] h-[32px] shrink-0 transition-colors duration-300 ease-in-out"
                  style={{ backgroundColor: isOpen ? "#FFD600" : "#1A1A1A", border: isOpen ? "none" : "1px solid #3D3D3D" }}
                >
                  <span
                    className="font-ibm-mono text-[14px] font-bold inline-block transition-transform duration-300 ease-in-out"
                    style={{ color: isOpen ? "#0A0A0A" : "#888888", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </div>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p
                    className="font-ibm-mono text-[12px] md:text-[13px] text-[#888888] tracking-[1px] leading-[1.6] pb-8 transition-opacity duration-300 ease-in-out"
                    style={{ opacity: isOpen ? 1 : 0, transitionDelay: isOpen ? "100ms" : "0ms" }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="border-t border-t-[#1D1D1D]" />
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-[16px] pt-10 md:pt-[48px]">
        <span className="font-ibm-mono text-[13px] text-[#555555] tracking-[1px]">
          STILL HAVE QUESTIONS?
        </span>
        <a href="mailto:hello@bluezoid.in" className="font-ibm-mono text-[13px] font-bold text-[#FFD600] tracking-[1px] cursor-pointer hover:underline">
          TALK TO A HUMAN &gt;
        </a>
      </div>
    </section>
  );
}
