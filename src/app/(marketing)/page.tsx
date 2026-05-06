import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { ServicesPreview } from "@/components/sections/services-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { Newsletter } from "@/components/sections/newsletter";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <ServicesPreview />
      <Testimonials />
      <Newsletter />
      <CTA />
    </>
  );
}
