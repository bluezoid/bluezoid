"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

function BZLogo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <div className="relative">
        <Image
          src="/logo-512.png"
          alt="BlueZoid"
          width={46}
          height={46}
          priority
          className="rounded-2xl transition-transform duration-300 group-hover:scale-110"
        />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-sky-400 ring-2 ring-black animate-pulse" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[20px] font-black tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
          BlueZoid
        </span>
        <span className="text-[9px] font-semibold tracking-[0.2em] text-white/25 uppercase">Software</span>
      </div>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "py-2 shadow-2xl shadow-black/60"
            : "py-4"
        )}
        style={scrolled ? { background: "oklch(0.06 0.01 250 / 0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BZLogo />

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {siteConfig.nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors duration-200 group",
                    active ? "text-white" : "text-white/50 hover:text-white"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-sky-400"
                    />
                  )}
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-sky-400/40 scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/contact"
              className="group relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)" }}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Book a Call
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white md:hidden transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-14 z-40 mx-4 mt-2 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden md:hidden"
          style={{ background: "oklch(0.06 0.01 250 / 0.97)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="p-4 space-y-1">
              {siteConfig.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-sky-500/15 text-sky-300"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-2 pb-1">
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
                >
                  Book a Call <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
