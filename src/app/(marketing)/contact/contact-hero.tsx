"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-12" style={{ background: "oklch(0.04 0.01 250)" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse, #0ea5e9 0%, transparent 65%)", filter: "blur(80px)" }} />
      </div>
      <Container className="relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Contact Us</p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
            Let&apos;s build your
            <br />
            <span className="gradient-bz-text-vibrant">next big thing.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-white/45">
            Fill in your details and book a time that works for you. We&apos;ll come prepared with insights specific to your project.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
