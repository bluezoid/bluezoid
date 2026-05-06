"use client";

import { motion } from "framer-motion";
import { Monitor, Server, Smartphone, BrainCircuit, ShoppingCart, Settings, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/shared/section";

const services = [
  {
    icon: Monitor, id: "saas", title: "SaaS Development", accent: "#38bdf8",
    description: "We architect and build multi-tenant SaaS platforms from the ground up. From database schema to billing flows to admin dashboards — we handle it all.",
    features: ["Multi-tenant architecture", "Subscription billing (Stripe)", "Role-based access control", "Usage analytics & metering", "Admin dashboard", "Email automation"],
    tags: ["Next.js", "Prisma", "Stripe", "Postgres", "Auth.js"],
  },
  {
    icon: Server, id: "api", title: "API & Backend Engineering", accent: "#a78bfa",
    description: "Scalable, documented, and battle-tested REST and GraphQL APIs. Clean architecture principles so your backend is a pleasure to work with.",
    features: ["RESTful & GraphQL APIs", "Authentication & authorization", "Rate limiting & caching", "Real-time with WebSockets", "Background jobs & queues", "API documentation"],
    tags: ["Node.js", "tRPC", "Postgres", "Redis", "BullMQ"],
  },
  {
    icon: Smartphone, id: "web", title: "Web Applications", accent: "#34d399",
    description: "High-performance web applications that look stunning and convert. Pixel-perfect UIs with best-in-class accessibility and performance scores.",
    features: ["Next.js App Router", "Server Components first", "Framer Motion animations", "A11y compliant", "Core Web Vitals optimized", "Mobile-first responsive"],
    tags: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
  },
  {
    icon: BrainCircuit, id: "ai", title: "AI & LLM Integration", accent: "#fbbf24",
    description: "Embed AI capabilities into your product — from chatbots to document processing to semantic search. From POC to production-ready.",
    features: ["LLM-powered features", "RAG pipelines", "Vector search integration", "Streaming responses", "AI workflow automation", "Cost optimization"],
    tags: ["OpenAI", "LangChain", "Pinecone", "Vercel AI SDK"],
  },
  {
    icon: ShoppingCart, id: "ecommerce", title: "E-Commerce Engineering", accent: "#f472b6",
    description: "Custom storefronts with blazing-fast product pages, sophisticated filtering, and seamless checkout flows that maximize conversion.",
    features: ["Headless storefront", "Product catalog & search", "Cart & checkout flow", "Payment integration", "Inventory management", "Order fulfillment hooks"],
    tags: ["Shopify", "Medusa", "Stripe", "Algolia", "Next.js"],
  },
  {
    icon: Settings, id: "consulting", title: "Tech Consulting", accent: "#6366f1",
    description: "Strategic engineering guidance for teams at a crossroads. We help you pick the right stack, fix the wrong architecture, and build the right team.",
    features: ["Architecture review", "Tech stack selection", "Performance audits", "Team augmentation", "Migration roadmaps", "Engineering mentorship"],
    tags: ["Audit", "Strategy", "Roadmap", "Mentorship"],
  },
];

export function ServicesGrid() {
  return (
    <Section className="relative overflow-hidden" style={{ background: "oklch(0.04 0.01 250)" }}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <motion.div key={service.id} id={service.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="glass-card group rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: `${service.accent}10` }}
            >
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${service.accent}18`, border: `1px solid ${service.accent}30`, boxShadow: `0 0 20px ${service.accent}20` }}>
                  <Icon className="h-6 w-6" style={{ color: service.accent }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{service.title}</h3>
                  <p className="mt-1 text-sm text-white/40 leading-relaxed">{service.description}</p>
                </div>
              </div>

              <ul className="mb-5 grid grid-cols-2 gap-y-2 gap-x-3">
                {service.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-white/55">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: service.accent }} />
                    {feat}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-white/6">
                {service.tags.map((tag) => (
                  <span key={tag} className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ background: `${service.accent}12`, color: service.accent, border: `1px solid ${service.accent}25` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
