export const siteConfig = {
  name: "BlueZoid",
  domain: "bluezoid.in",
  url: "https://bluezoid.in",
  tagline: "Build. Scale. Dominate.",
  description:
    "BlueZoid is a premium software company delivering scalable SaaS platforms, custom web applications, and developer-first solutions for modern businesses.",
  keywords: [
    "SaaS development",
    "web development",
    "software company",
    "Next.js",
    "React",
    "scalable apps",
    "BlueZoid",
  ],
  ogImage: "https://bluezoid.in/og.png",
  contact: {
    email: "hello@bluezoid.in",
    phone: null,
    address: "Kolkata, West Bengal, India (Remote)",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
};

export type SiteConfig = typeof siteConfig;
