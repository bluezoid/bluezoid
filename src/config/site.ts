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
  links: {
    twitter: "https://twitter.com/bluezoid",
    github: "https://github.com/bluezoid",
    linkedin: "https://linkedin.com/company/bluezoid",
  },
  contact: {
    email: "hello@bluezoid.in",
    phone: "+91 98765 43210",
    address: "Bengaluru, Karnataka, India",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
};

export type SiteConfig = typeof siteConfig;
