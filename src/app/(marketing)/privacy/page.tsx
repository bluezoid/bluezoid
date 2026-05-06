import { Section, SectionHeader } from "@/components/shared/section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — BlueZoid",
  description: "How BlueZoid collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <Section className="pt-32">
      <SectionHeader badge="Legal" title="Privacy Policy" description="Effective Date: December 22, 2025" align="center" />
      <div className="prose prose-invert prose-sm mx-auto max-w-3xl space-y-8 text-white/60 leading-relaxed">

        <Block title="Information We Collect">
          <p>We collect only the information you choose to provide to us, including name and email address submitted through our contact form.</p>
          <p className="mt-3">We do <strong className="text-white/80">not</strong>:</p>
          <ul>
            <li>Use analytics or tracking tools</li>
            <li>Process payments</li>
            <li>Collect sensitive personal data</li>
            <li>Collect information from children under 13</li>
          </ul>
        </Block>

        <Block title="How We Use Your Information">
          <p>We use the information you provide solely to:</p>
          <ul>
            <li>Respond to inquiries</li>
            <li>Communicate directly with you regarding your request</li>
          </ul>
          <p className="mt-3">We do not sell, rent, or share your information with third parties.</p>
        </Block>

        <Block title="Cookies">
          <p>At this time, we do not intentionally use cookies for tracking or analytics purposes. Some basic cookies may be used by the website platform to ensure proper site functionality.</p>
        </Block>

        <Block title="Data Security">
          <p>We take reasonable steps to protect your information, but no method of transmission over the internet is 100% secure.</p>
        </Block>

        <Block title="Children's Privacy">
          <p>This website is not directed toward children under the age of 13, and we do not knowingly collect personal information from children.</p>
        </Block>

        <Block title="Contact Us">
          <p>If you have questions about this Privacy Policy, contact us at:{" "}
            <a href="mailto:support@bluezoid.in" className="text-sky-400 hover:text-sky-300 transition-colors">support@bluezoid.in</a>
          </p>
        </Block>

      </div>
    </Section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-6 md:p-8">
      <h2 className="mb-4 text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
      <div className="space-y-2 text-sm text-white/55 leading-relaxed [&_ul]:mt-2 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
