import { Section, SectionHeader } from "@/components/shared/section";
import { Mail, Clock, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Email — BlueZoid",
  description: "Reach BlueZoid directly at hello@bluezoid.in",
};

export default function ContactEmailPage() {
  return (
    <Section className="pt-32">
      <SectionHeader badge="Get in Touch" title="hello@bluezoid.in" description="The fastest way to reach us for any inquiry, partnership, or support request." align="center" />
      <div className="mx-auto max-w-3xl space-y-6">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { icon: Mail, label: "General Inquiries", value: "hello@bluezoid.in", href: "mailto:hello@bluezoid.in" },
            { icon: Clock, label: "Response Time", value: "Within 24 business hours", href: null },

            { icon: MapPin, label: "Location", value: siteConfig.contact.address, href: null },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/3 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10">
                <Icon className="h-4 w-4 text-sky-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-1">{label}</p>
                {href ? (
                  <a href={href} className="text-sm font-medium text-white hover:text-sky-400 transition-colors">{value}</a>
                ) : (
                  <p className="text-sm font-medium text-white/70">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-sky-500/15 bg-sky-500/5 p-6">
          <p className="text-sm font-semibold text-sky-400 mb-2">Prefer a scheduled call?</p>
          <p className="text-sm text-white/50 leading-relaxed">
            Head over to our <a href="/contact" className="text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-2">contact page</a> to book a free discovery call at a time that works for you.
          </p>
        </div>

      </div>
    </Section>
  );
}
