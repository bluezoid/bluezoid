import Link from "next/link";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "./container";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Services", href: "/services" },
    { label: "Process", href: "/services#process" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund & Cancellation", href: "/refund" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "hello@bluezoid.in", href: "/contact-email" },
  ],
};

interface FooterProps {
  socialLinks: { twitter: string; github: string; linkedin: string };
}

export function Footer({ socialLinks }: FooterProps) {
  const socials = [
    { Icon: XIcon, href: socialLinks.twitter, label: "X (Twitter)" },
    { Icon: GitHubIcon, href: socialLinks.github, label: "GitHub" },
    { Icon: LinkedInIcon, href: socialLinks.linkedin, label: "LinkedIn" },
  ];
  return (
    <footer className="relative border-t border-white/6" style={{ background: "oklch(0.03 0.008 250)" }}>
      {/* Top CTA strip */}
      <div className="border-b border-white/6" style={{ background: "linear-gradient(90deg, #0ea5e908 0%, #6366f108 50%, #0ea5e908 100%)" }}>
        <Container className="flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-sm text-white/40">
            Ready to ship something great? <span className="text-white/70 font-medium">Let&apos;s talk.</span>
          </p>
          <Link href="/contact" className="group flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors">
            Book a free call
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="group flex w-fit items-center gap-3 mb-5">
              <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
                <defs>
                  <linearGradient id="foot-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="16" fill="url(#foot-bg)" />
                <path d="M14 18h36l-28 28h28" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="50" cy="14" r="4" fill="white" opacity="0.9" />
              </svg>
              <span className="text-3xl font-black tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
                Blue<span className="text-sky-400">Zoid</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/30 max-w-xs">
              Production-grade SaaS platforms, APIs, and web applications for ambitious teams worldwide.
            </p>
            <div className="mt-6 space-y-2">
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 text-xs text-white/30 hover:text-sky-400 transition-colors">
                <Mail className="h-3.5 w-3.5" />{siteConfig.contact.email}
              </a>

              <div className="flex items-center gap-2 text-xs text-white/30">
                <MapPin className="h-3.5 w-3.5" />{siteConfig.contact.address}
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/30 transition-all hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-400">
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">{category}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/40 transition-colors hover:text-sky-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/6 pt-8 md:flex-row">
          <p className="text-xs text-white/20">&copy; {new Date().getFullYear()} BlueZoid.in — All rights reserved.</p>
          <p className="text-xs text-white/20">Built with love, care &amp; obsessive attention to detail ♥</p>
        </div>
      </Container>
    </footer>
  );
}
