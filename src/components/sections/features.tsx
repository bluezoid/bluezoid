"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Shield, BarChart3, Code2, Globe, Layers, ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "Sub-second load times with Next.js App Router, edge streaming, and intelligent caching at every layer.",
    gradient: "from-amber-400 to-orange-500",
    glow: "#f59e0b",
    number: "01",
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Zero exposed secrets. Server-only API routes, Zod validation at every boundary, OWASP-compliant by default.",
    gradient: "from-emerald-400 to-teal-500",
    glow: "#10b981",
    number: "02",
  },
  {
    icon: BarChart3,
    title: "Scales Infinitely",
    description: "Layered architecture — UI, feature, service, and server layers — so your codebase grows without rewriting.",
    gradient: "from-sky-400 to-blue-500",
    glow: "#38bdf8",
    number: "03",
  },
  {
    icon: Code2,
    title: "Developer First",
    description: "TypeScript throughout, zero magic, clean abstractions. Any senior engineer onboards in under an hour.",
    gradient: "from-violet-400 to-purple-600",
    glow: "#8b5cf6",
    number: "04",
  },
  {
    icon: Globe,
    title: "Global by Default",
    description: "Deployed to 100+ Vercel edge locations. SEO-ready, i18n-capable, and accessible out of the box.",
    gradient: "from-pink-400 to-rose-500",
    glow: "#ec4899",
    number: "05",
  },
  {
    icon: Layers,
    title: "Pluggable Forever",
    description: "Drop in CMS, auth, payments, or a full dashboard without touching your core product code.",
    gradient: "from-indigo-400 to-blue-600",
    glow: "#6366f1",
    number: "06",
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Section className="relative overflow-hidden" style={{ background: "oklch(0.05 0.01 250)" }} id="features">
      {/* Section bg accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Why BlueZoid</p>
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
              Everything you need
              <br />
              <span className="gradient-bz-text-vibrant">to ship great software.</span>
            </h2>
            <p className="max-w-xl text-sm text-white/40">
              We bring together the best modern engineering practices — so you can focus on your product.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="group relative overflow-hidden rounded-2xl glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
                style={{ borderRadius: "16px" }}
              >
                {/* Number watermark */}
                <span className="absolute right-4 top-3 text-6xl font-black text-white/[0.03] select-none" style={{ fontFamily: "var(--font-display)" }}>
                  {feature.number}
                </span>

                {/* Icon */}
                <div className="mb-5 relative w-fit">
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br", feature.gradient)} style={{ boxShadow: `0 0 20px ${feature.glow}40` }}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>

                <h3 className="mb-2 text-base font-bold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-white/55 group-hover:text-white/80 transition-colors duration-300">{feature.description}</p>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-sky-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3 w-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
