"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { cn } from "@/lib/utils";

const testimonials = [
  { name: "Priya Sharma", role: "CTO", company: "Finova Tech", avatar: "PS", rating: 5, content: "BlueZoid rebuilt our entire platform from a monolith to a scalable SaaS architecture. Delivery was on time, code quality was exceptional, and the team was communicative throughout.", color: "#38bdf8" },
  { name: "Arjun Mehta", role: "Founder", company: "ShopBolt", avatar: "AM", rating: 5, content: "We went from zero to a fully functional e-commerce platform in 6 weeks. The attention to performance and UX detail was something we hadn't seen from any agency before.", color: "#a78bfa" },
  { name: "Sarah Chen", role: "VP Engineering", company: "Datasync", avatar: "SC", rating: 5, content: "The API they built handles millions of requests daily with rock-solid reliability. Their architecture choices made scaling effortless when we hit our growth phase.", color: "#34d399" },
  { name: "Rohan Patel", role: "Co-founder", company: "LearnFlow", avatar: "RP", rating: 5, content: "BlueZoid's consulting gave us clarity on our tech stack before we wasted months going the wrong direction. Worth every rupee — probably saved us 6 months of dev time.", color: "#fbbf24" },
  { name: "Emily Rodriguez", role: "Product Lead", company: "NexaHR", avatar: "ER", rating: 5, content: "The admin dashboard and RBAC system they delivered was far beyond what we expected. Clean code, thorough docs, and it just works. Will definitely work with them again.", color: "#f472b6" },
  { name: "Kiran Nair", role: "CEO", company: "AgroSense", avatar: "KN", rating: 5, content: "They integrated our IoT data streams with a beautiful real-time dashboard. The team understood our domain quickly and delivered production-ready software in record time.", color: "#6366f1" },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  const t = testimonials[active];

  return (
    <Section className="relative overflow-hidden" style={{ background: "oklch(0.055 0.011 250)" }} id="testimonials">
      {/* BG accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/2 h-[500px] w-[700px] -translate-y-1/2 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)", filter: "blur(100px)" }} />
      </div>

      <div ref={ref} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Client Stories</p>
          <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Trusted by builders
            <br />
            <span className="gradient-bz-text-vibrant">around the world.</span>
          </h2>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 rounded-3xl glass-card p-8 md:p-12"
        >
          <div className="flex items-center gap-1 mb-6">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <motion.blockquote
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-xl font-medium leading-relaxed text-white/80 md:text-2xl md:leading-relaxed"
            style={{ fontFamily: "var(--font-display)" }}
          >
            &ldquo;{t.content}&rdquo;
          </motion.blockquote>

          <div className="mt-8 flex items-center justify-between gap-4">
            <motion.div key={`author-${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${t.color}66, ${t.color}33)`, border: `1px solid ${t.color}40` }}>
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-white/40">{t.role} · {t.company}</p>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button onClick={prev} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-white/30 tabular-nums">{active + 1}/{testimonials.length}</span>
              <button onClick={next} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Dot indicators + mini cards */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {testimonials.map((item, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-xl p-3 text-left transition-all duration-200 border",
                i === active
                  ? "border-sky-500/40 bg-sky-500/10"
                  : "border-white/6 bg-white/2 hover:bg-white/4"
              )}
            >
              <div className="text-[10px] font-bold text-white/60">{item.name}</div>
              <div className="text-[10px] text-white/25">{item.company}</div>
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}
