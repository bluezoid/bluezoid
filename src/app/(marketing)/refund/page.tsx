import { Section, SectionHeader } from "@/components/shared/section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — BlueZoid",
  description: "BlueZoid's refund and cancellation policy for software services.",
};

export default function RefundPage() {
  return (
    <Section className="pt-32">
      <SectionHeader badge="Legal" title="Refund & Cancellation Policy" description="Effective Date: December 22, 2025" align="center" />
      <div className="mx-auto max-w-3xl space-y-8">

        <Block title="Nature of Our Services">
          <p>BlueZoid provides custom software development, SaaS solutions, API integrations, and technical consulting. Because our work is bespoke and time-based, refund eligibility depends on the stage of delivery.</p>
        </Block>

        <Block title="Cancellation by Client">
          <ul>
            <li><strong className="text-white/80">Before work begins:</strong> Full refund of any advance paid, minus payment gateway fees.</li>
            <li><strong className="text-white/80">After work has started:</strong> Refund is pro-rated based on work completed at the time of cancellation. Completed milestones are non-refundable.</li>
            <li><strong className="text-white/80">After project delivery:</strong> No refund is applicable once the final deliverable has been accepted or deployed.</li>
          </ul>
        </Block>

        <Block title="Cancellation by BlueZoid">
          <p>If we are unable to deliver a project due to unforeseen circumstances, we will refund all amounts paid for work not yet completed and provide adequate notice.</p>
        </Block>

        <Block title="Consultation Calls">
          <p>Booked discovery or consultation calls may be cancelled or rescheduled up to <strong className="text-white/80">24 hours</strong> before the scheduled time at no charge. Cancellations within 24 hours are non-refundable if a fee was charged.</p>
        </Block>

        <Block title="Disputes">
          <p>If you believe a charge was made in error, contact us within 7 days of the transaction. We resolve all disputes in good faith.</p>
        </Block>

        <Block title="Contact">
          <p>For refund or cancellation requests, email us at:{" "}
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
