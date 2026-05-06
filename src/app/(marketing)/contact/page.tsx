import type { Metadata } from "next";
import { ContactHero } from "./contact-hero";
import { ContactSection } from "./contact-section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with BlueZoid — tell us about your project and let's build something great together.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSection />
    </>
  );
}
