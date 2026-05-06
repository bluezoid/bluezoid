"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16" style={{ background: "oklch(0.04 0.01 250)" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[400px] w-[500px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute right-1/4 bottom-0 h-[300px] w-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>
      <Container className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">What We Build</p>
          <h1 className="text-5xl font-black leading-[1.0] tracking-tight text-white sm:text-6xl md:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
            Services built for
            <br />
            <span className="gradient-bz-text-vibrant">serious products.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/45">
            From greenfield SaaS platforms to enterprise API migrations — we bring full-stack engineering expertise to every engagement, with zero hand-holding required.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
