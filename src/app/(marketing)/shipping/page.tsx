import { Section, SectionHeader } from "@/components/shared/section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — BlueZoid",
  description: "BlueZoid's delivery policy for digital software services.",
};

export default function ShippingPage() {
  return (
    <Section className="pt-32">
      <SectionHeader badge="Legal" title="Shipping & Delivery Policy" description="Effective Date: December 22, 2025" align="center" />
      <div className="mx-auto max-w-3xl space-y-8">

        <Block title="Digital Delivery Only">
          <p>BlueZoid delivers exclusively digital services — software, code, APIs, and technical documentation. We do not ship any physical goods. No physical delivery is ever applicable.</p>
        </Block>

        <Block title="Delivery Timelines">
          <p>Delivery timelines are agreed upon at the start of each project and documented in the project scope or contract. Typical timelines:</p>
          <ul>
            <li><strong className="text-white/80">Discovery & Consultation:</strong> Scheduled within 2–5 business days of booking.</li>
            <li><strong className="text-white/80">MVP / Prototype:</strong> 4–8 weeks depending on scope.</li>
            <li><strong className="text-white/80">Full SaaS / Web Application:</strong> 8–20 weeks depending on complexity.</li>
            <li><strong className="text-white/80">API Integration:</strong> 1–4 weeks.</li>
          </ul>
          <p className="mt-3">All timelines are estimates and may vary based on client feedback cycles and change requests.</p>
        </Block>

        <Block title="Delivery Method">
          <p>Deliverables are shared via:</p>
          <ul>
            <li>Private GitHub / GitLab repository access</li>
            <li>Staging environment links for review</li>
            <li>Production deployment to agreed hosting (Vercel, AWS, etc.)</li>
            <li>Email with documentation and handover notes</li>
          </ul>
        </Block>

        <Block title="Delays">
          <p>If a delay is anticipated, we will notify you as early as possible with a revised timeline. Delays caused by incomplete client inputs, approvals, or third-party services are not the responsibility of BlueZoid.</p>
        </Block>

        <Block title="Contact">
          <p>For delivery-related queries, reach us at:{" "}
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
      <div className="text-sm text-white/55 leading-relaxed [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:mt-2">
        {children}
      </div>
    </div>
  );
}
