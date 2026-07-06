import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact — BlueZoid",
  description:
    "Get in touch with BlueZoid — tell us about your project and let's build something great together.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">
      <Navbar />
      <ContactSection />
      <Footer />
    </main>
  );
}
