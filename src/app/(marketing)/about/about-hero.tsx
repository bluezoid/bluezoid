"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20" style={{ background: "oklch(0.04 0.01 250)" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse, #a78bfa 0%, transparent 65%)", filter: "blur(100px)" }} />
      </div>
      <Container className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }} className="max-w-4xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">About BlueZoid</p>
          <h1 className="text-5xl font-black leading-[1.0] tracking-tight text-white sm:text-6xl md:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
            We build software that
            <br />
            <span className="gradient-bz-text-vibrant">outlasts trends.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/45">
            BlueZoid was founded by engineers who were tired of building throwaway software. We believe great products are the result of rigorous architecture, relentless attention to detail, and genuine partnership with our clients.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { value: "2021", label: "Year Founded", sub: "Bootstrapped & profitable from day one" },
            { value: "India", label: "Based In", sub: "Bengaluru, Karnataka — serving globally" },
            { value: "10+", label: "Engineers", sub: "Senior-only, no juniors on client projects" },
          ].map((item) => (
            <div key={item.label} className="glass-card rounded-2xl p-6">
              <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>{item.value}</div>
              <div className="text-sm font-semibold text-sky-400 mb-1">{item.label}</div>
              <div className="text-xs text-white/35">{item.sub}</div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
