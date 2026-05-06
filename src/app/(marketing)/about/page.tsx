import type { Metadata } from "next";
import { motion } from "framer-motion";
import { Target, Users, Rocket, Heart } from "lucide-react";
import { Section, SectionHeader } from "@/components/shared/section";
import { GradientText } from "@/components/shared/gradient-text";
import { Container } from "@/components/shared/container";
import { CTA } from "@/components/sections/cta";
import { AboutHero } from "./about-hero";
import { TeamValues } from "./team-values";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about BlueZoid — a developer-first software company on a mission to build scalable, production-grade software that lasts.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <TeamValues />
      <CTA />
    </>
  );
}
