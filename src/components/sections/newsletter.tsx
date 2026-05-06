"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, BellRing, BookOpen, Gift, ArrowRight, Loader2 } from "lucide-react";
import { Section } from "@/components/shared/section";
import { useSubscribeStore } from "@/stores/subscribe-store";
import { subscribeSchema } from "@/lib/validations";

const benefits = [
  { icon: BellRing, text: "Early access to new features & products" },
  { icon: BookOpen, text: "Engineering deep-dives and best practices" },
  { icon: Gift, text: "Exclusive offers for our community" },
];

export function Newsletter() {
  const { email, status, message, setEmail, setStatus, setMessage } = useSubscribeStore();
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/subscriber-count")
      .then((r) => r.json())
      .then((j) => { if (j.ok) setSubscriberCount(j.data.count); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = subscribeSchema.safeParse({ email });
    if (!result.success) {
      setMessage(result.error.flatten().fieldErrors.email?.[0] ?? "Invalid email");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error?.message ?? "Subscription failed");
      setMessage(
        json.data?.mode === "dry-run"
          ? "You're on the list! (dev mode — delivery skipped)"
          : json.data?.alreadyExists
          ? "You're already subscribed!"
          : "Successfully subscribed!"
      );
      setStatus("success");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <Section className="relative overflow-hidden" style={{ background: "oklch(0.065 0.013 250)" }} id="newsletter">
      {/* BG */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-150 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)", filter: "blur(100px)" }} />
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Newsletter</p>
          <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Stay ahead of
            <br />
            <span className="gradient-bz-text-vibrant">the curve.</span>
          </h2>
          <p className="mt-5 text-white/50 leading-relaxed max-w-md">
            Join 1,200+ developers and founders who get engineering insights, product updates, and exclusive community perks — directly in their inbox.
          </p>

          <ul className="mt-8 space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10">
                  <Icon className="h-4 w-4 text-sky-400" />
                </span>
                <span className="text-sm text-white/60">{text}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-white/25">No spam. Unsubscribe anytime. We respect your inbox.</p>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="glass-card rounded-3xl p-8 md:p-10"
        >
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20 mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>You&apos;re in!</h3>
              <p className="text-sm text-white/50">{message}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>Subscribe for free</h3>
                <p className="text-sm text-white/40">Get updates before anyone else.</p>
              </div>

              <div className="relative mb-3">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all"
                />
              </div>

              {status === "error" && (
                <p className="mb-3 text-xs text-red-400">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="group w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)", boxShadow: "0 0 30px #0ea5e930" }}
              >
                <span className="flex items-center justify-center gap-2">
                  {status === "loading" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</>
                  ) : (
                    <>Subscribe <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                  )}
                </span>
              </button>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["PS", "AM", "SC", "RP"].map((init, i) => (
                    <div key={init} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[oklch(0.065_0.013_250)] text-[9px] font-bold text-white"
                      style={{ background: ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24"][i] + "55", zIndex: 4 - i }}>
                      {init}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/30">
                  +{subscriberCount !== null ? subscriberCount.toLocaleString() : "1,200"} subscribers already joined
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </Section>
  );
}
