"use client";

import { motion } from "framer-motion";
import { Target, Users, Rocket, Heart, Code2, Shield } from "lucide-react";
import { Section } from "@/components/shared/section";

const values = [
  { icon: Target, title: "Precision Over Speed", description: "We believe in doing it right the first time. Fast shipping matters — but not at the cost of technical debt that kills future velocity.", color: "#38bdf8" },
  { icon: Users, title: "Real Partnership", description: "We embed with your team, not just deliver code. We care about your product's success as much as you do.", color: "#a78bfa" },
  { icon: Rocket, title: "Scalability by Design", description: "Every architecture decision considers where your product will be in 2 years, not just next sprint.", color: "#34d399" },
  { icon: Code2, title: "Craft Matters", description: "Clean code, consistent conventions, thorough docs. We leave codebases better than we found them.", color: "#fbbf24" },
  { icon: Shield, title: "Security Always", description: "Security isn't a checkbox — it's baked into every layer. From env vars to API design to access control.", color: "#f472b6" },
  { icon: Heart, title: "Honest Communication", description: "No fluff, no overselling. We give you straight talk about scope, timeline, and technical tradeoffs.", color: "#6366f1" },
];

export function TeamValues() {
  return (
    <Section className="relative overflow-hidden" style={{ background: "oklch(0.055 0.011 250)" }}>
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">What We Stand For</p>
          <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Principles that guide
            <br />
            <span className="gradient-bz-text-vibrant">every decision.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div key={v.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${v.color}18`, border: `1px solid ${v.color}30` }}>
                  <Icon className="h-5 w-5" style={{ color: v.color }} />
                </div>
                <h3 className="mb-2 font-bold text-white">{v.title}</h3>
                <p className="text-sm leading-relaxed text-white/40">{v.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
