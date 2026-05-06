"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Sparkles, TrendingUp, Users, Zap, Star } from "lucide-react";
import { Container } from "@/components/shared/container";

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + step;
        if (next >= end) { clearInterval(timer); return end; }
        return next;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <div ref={ref} className="num-highlight">{count}{suffix}</div>;
}

const words = ["SaaS Platforms", "Web Applications", "API Systems", "AI Products", "Digital Futures"];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-block" style={{ minWidth: "min(320px, 90vw)" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="gradient-bz-text-vibrant inline-block"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const stats = [
  { icon: TrendingUp, value: 50, suffix: "+", label: "Projects Shipped", color: "#38bdf8" },
  { icon: Users, value: 30, suffix: "+", label: "Global Clients", color: "#a78bfa" },
  { icon: Zap, value: 99, suffix: "%", label: "Uptime SLA", color: "#34d399" },
  { icon: Star, value: 4, suffix: ".9★", label: "Client Rating", color: "#fbbf24" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: "oklch(0.04 0.01 250)" }}>

      {/* Mesh gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="mesh-blob absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 opacity-30" />
        <div className="absolute top-1/3 right-[-10%] h-[500px] w-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #a78bfa33 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 left-[-5%] h-[400px] w-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #34d39920 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Animated grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(oklch(0.64 0.17 233) 1px, transparent 1px), linear-gradient(90deg, oklch(0.64 0.17 233) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />


      <Container className="relative z-10 flex min-h-screen flex-col items-center justify-center pt-28 pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{
              background: "linear-gradient(90deg, #0ea5e915, #6366f115)",
              border: "1px solid #0ea5e930",
              color: "#7dd3fc",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Developer-First Software Agency · India
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[96px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We Engineer
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mt-1 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-[96px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <RotatingWord />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mt-1 text-5xl font-black leading-[0.95] tracking-tight text-white/15 sm:text-7xl md:text-8xl lg:text-[96px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            That Scale.
          </motion.p>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg"
          >
            BlueZoid delivers production-grade software — architectured for resilience, designed for velocity, built to outlast trends.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/contact"
              className="group relative overflow-hidden rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)", boxShadow: "0 0 40px #0ea5e940" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10" />
            </Link>

            <Link
              href="/services"
              className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20">
                <Play className="h-3 w-3 fill-current ml-0.5" />
              </span>
              See Our Work
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
          >
            {stats.map(({ icon: Icon, value, suffix, label, color }) => (
              <div key={label} className="glass-card group rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/15">
                <Icon className="mx-auto mb-2 h-5 w-5" style={{ color }} />
                <div className="text-2xl font-black text-white sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                  <AnimatedCounter end={value} suffix={suffix} />
                </div>
                <div className="mt-1 text-xs text-white/40">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">Scroll</span>
        <div className="h-8 w-[1px] bg-linear-to-b from-white/20 to-transparent" />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[oklch(0.04_0.01_250)] to-transparent" />
    </section>
  );
}
