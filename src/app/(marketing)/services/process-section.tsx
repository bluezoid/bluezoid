"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/shared/section";

const steps = [
  { step: "01", title: "Discovery Call", description: "We learn about your goals, constraints, and technical landscape. Usually 45–60 minutes.", time: "Day 1" },
  { step: "02", title: "Proposal & Scoping", description: "We deliver a detailed technical proposal with architecture overview, timeline, and fixed-price milestone breakdown.", time: "Day 2–3" },
  { step: "03", title: "Kickoff & Build", description: "We kick off within 48 hours. Weekly demos, async communication, full transparency on progress.", time: "Week 1+" },
  { step: "04", title: "Launch & Handover", description: "We deploy to production, hand over full source code, and provide thorough documentation and knowledge transfer.", time: "Final week" },
];

export function ProcessSection() {
  return (
    <Section className="relative overflow-hidden" id="process" style={{ background: "oklch(0.06 0.012 250)" }}>
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">How We Work</p>
          <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            A process built for
            <br />
            <span className="gradient-bz-text-vibrant">zero surprises.</span>
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line */}
          <div className="absolute top-8 left-8 right-8 h-[1px] hidden lg:block" style={{ background: "linear-gradient(90deg, #0ea5e940, #6366f140)" }} />

          {steps.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card relative rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white relative z-10"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", boxShadow: "0 0 20px #0ea5e930" }}>
                  {step.step}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/25">{step.time}</span>
              </div>
              <h3 className="mb-2 font-bold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/40">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
