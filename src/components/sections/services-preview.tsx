"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Monitor, Server, Smartphone, BrainCircuit, ShoppingCart, Settings } from "lucide-react";
import { Section } from "@/components/shared/section";

const services = [
  { icon: Monitor, id: "saas", title: "SaaS Development", description: "Multi-tenant platforms with billing, RBAC, and admin dashboards.", accent: "#38bdf8" },
  { icon: Server, id: "api", title: "API & Backend", description: "Scalable REST & GraphQL APIs — battle-tested, fully documented.", accent: "#a78bfa" },
  { icon: Smartphone, id: "web", title: "Web Applications", description: "Pixel-perfect, fast, accessible UIs built with modern best practices.", accent: "#34d399" },
  { icon: BrainCircuit, id: "ai", title: "AI Integration", description: "LLMs, vector search, and AI workflows from POC to production.", accent: "#fbbf24" },
  { icon: ShoppingCart, id: "ecommerce", title: "E-Commerce", description: "Headless storefronts with blazing-fast pages and integrated payments.", accent: "#f472b6" },
  { icon: Settings, id: "consulting", title: "Tech Consulting", description: "Architecture audits, stack selection, team augmentation, and roadmaps.", accent: "#6366f1" },
];

export function ServicesPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <Section className="relative overflow-hidden" style={{ background: "oklch(0.06 0.012 250)" }} id="services">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">What We Build</p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
              Services built for
              <br />
              <span className="gradient-bz-text-vibrant">serious products.</span>
            </h2>
            <Link
              href="/services"
              className="group flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              View all services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Services list — editorial style */}
        <div ref={ref} className="divide-y divide-white/6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              >
                <Link href={`/services#${service.id}`} className="group flex items-center gap-6 py-5 transition-all duration-200 hover:px-3 rounded-xl hover:bg-white/3">
                  <span className="text-3xl font-black text-white/[0.06] tabular-nums w-10 shrink-0" style={{ fontFamily: "var(--font-display)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 transition-all group-hover:border-transparent"
                    style={{ background: `${service.accent}18`, boxShadow: `0 0 0 0 ${service.accent}00` }}>
                    <Icon className="h-5 w-5" style={{ color: service.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white/80 transition-colors group-hover:text-white">{service.title}</h3>
                    <p className="mt-0.5 text-sm text-white/35">{service.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/20 transition-all group-hover:text-sky-400 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
