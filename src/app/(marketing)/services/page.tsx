import type { Metadata } from "next";
import { ServicesHero } from "./services-hero";
import { ServicesGrid } from "./services-grid";
import { ProcessSection } from "./process-section";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "BlueZoid offers SaaS development, API engineering, web apps, AI integration, e-commerce, and tech consulting — built to scale.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <ProcessSection />
      <CTA />
    </>
  );
}
