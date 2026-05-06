import { Section, SectionHeader } from "@/components/shared/section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — BlueZoid",
  description: "Terms and conditions for using BlueZoid.in.",
};

export default function TermsPage() {
  return (
    <Section className="pt-32">
      <SectionHeader badge="Legal" title="Terms of Service" description="Effective Date: December 22, 2025" align="center" />
      <div className="mx-auto max-w-3xl space-y-8">

        <Block title="Use of the Website">
          <p>This website is provided for informational purposes only. You agree to use the site lawfully and not in a way that could harm, disable, or interfere with its operation.</p>
        </Block>

        <Block title="No Professional Guarantees">
          <p>Information on this site is provided "as is" and does not constitute professional, technical, or legal advice. We make no guarantees regarding outcomes or results.</p>
        </Block>

        <Block title="Intellectual Property">
          <p>All content on this website — including text, graphics, and branding — is the property of BlueZoid unless otherwise noted. You may not copy, reproduce, or distribute content without permission.</p>
        </Block>

        <Block title="Limitation of Liability">
          <p>BlueZoid is not liable for any damages arising from the use of, or inability to use, this website.</p>
        </Block>

        <Block title="Third-Party Links">
          <p>This site may contain links to third-party websites. We are not responsible for their content or practices.</p>
        </Block>

        <Block title="Changes to These Terms">
          <p>We may update these Terms of Service at any time. Continued use of the site constitutes acceptance of any changes.</p>
        </Block>

        <Block title="Contact">
          <p>Questions regarding these terms can be sent to:{" "}
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
      <div className="text-sm text-white/55 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
