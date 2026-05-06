"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import { Container } from "@/components/shared/container";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-28" style={{ background: "oklch(0.04 0.01 250)" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse, #0ea5e9 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="animate-spin-slow absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-sky-500/[0.06]" />
        <div className="animate-spin-slow absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-500/[0.08]" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10">
            <Rocket className="h-7 w-7 text-sky-400" />
          </div>

          <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
            Let&apos;s build something
            <br />
            <span className="gradient-bz-text-vibrant">extraordinary together.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/40">
            Whether you&apos;re a startup launching your MVP or an enterprise modernizing at scale — BlueZoid has the depth and speed to get you there.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group relative overflow-hidden rounded-full px-8 py-4 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)", boxShadow: "0 0 60px #0ea5e930" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Book a Free Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <a
              href="mailto:hello@bluezoid.in"
              className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-white/60 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white"
            >
              hello@bluezoid.in
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {["No lock-in contracts", "48h kickoff guaranteed", "Full source code ownership"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-white/30">
                <span className="h-1 w-1 rounded-full bg-sky-500/60" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
