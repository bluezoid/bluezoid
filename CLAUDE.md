@AGENTS.md

# BlueZoid — Engineering Log

Live engineering log. Update as work progresses.

---

## ✅ Implemented

- **Stack** — Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind v4, Framer Motion, Zustand, React Hook Form + Zod, react-day-picker v9, Lucide icons.
- **Marketing pages** — `/`, `/about`, `/services`, `/contact` under the `(marketing)` route group.
- **Home sections** — Hero (animated counter + rotating words + floating cards), Features, Services preview, Testimonials carousel, Newsletter, CTA.
- **Contact wizard** — 3-step Zustand-backed flow (form → calendar → confirm) with react-day-picker v9 calendar.
- **Brevo integration** — Transactional email + contact list via `src/lib/brevo.ts`. Typed errors (`BrevoApiError`, `BrevoConfigError`). Graceful dry-run when env is unset.
- **Structured API responses** — `src/lib/api.ts` exports `ok()` / `fail()` returning `ApiResponse<T>` (`{ ok: true, data } | { ok: false, error }`). Routes `/api/contact` and `/api/subscribe` use it.
- **HTML escaping** — Admin/auto-reply email templates escape user input.
- **Design tokens + utilities** — `src/app/globals.css` defines the lighter sky/indigo palette, glassmorphism, mesh blobs, animated borders, marquee, shimmer, and float animations.
- **Design system** — Shared `Container`, `Section`, `SectionHeader`, `GradientText`. Custom `Button` (Radix Slot, `asChild`).
- **Testing** — Vitest + React Testing Library + jsdom. 37 tests across validations, Brevo client, Zustand stores, API routes (mocked fetch), and Newsletter component.
- **Tooling** — Prettier config + ignore, `npm run format`, `npm run test`, `npm run lint`.
- **Dev experience** — `.env.example` documented, dry-run fallback means `npm install && npm run dev` works with zero configuration.
- **Docs** — `README.md` (setup, scripts, architecture, conventions, testing), this engineering log.

## 🚧 In progress

_Nothing currently in flight._

## ❌ Pending / nice-to-have

- Visual regression tests (Playwright / Chromatic) for the hero + wizard.
- Sitemap.xml + robots.txt generation via `next-sitemap` or App Router metadata.
- Analytics wiring (Plausible / Umami) — decide before launch.
- OG image generation for dynamic pages.
- Rate limiting on `/api/contact` and `/api/subscribe` (Upstash or edge middleware).
- E2E coverage of the 3-step contact wizard with Playwright.
- Lighthouse CI budget in the build pipeline.

## 🧠 Architectural decisions

- **Dry-run fallback for Brevo.** `readBrevoConfig()` returns `null` when any of the four required env vars are missing; routes then short-circuit to a 200 dry-run response. This lets contributors run the full stack without credentials and keeps the UI's happy path exercisable in CI.
- **`ApiResponse<T>` envelope.** All API routes return `{ ok, data } | { ok, error: { code, message, issues? } }`. Clients branch on `ok`. Easier to evolve than raw shapes and keeps Zod error details out of UI strings.
- **Zustand over Context** for the contact wizard. Multi-step form state is wide, needs devtools, and benefits from selectors — Context would cause unnecessary re-renders.
- **Custom Button (Radix Slot) over shadcn Base UI Button.** The Base UI variant shipped without `asChild`, which is needed to wrap `next/link`.
- **Tailwind v4 only.** Uses `@import "tailwindcss"`, oklch color tokens, and `bg-linear-to-*`. No `tw-animate-css` — all animations live in `globals.css`.
- **Tests live under `/tests`, not `/src`.** Keeps the Next build surface clean (no `__tests__` folders to exclude) and mirrors the layered architecture (`lib/`, `stores/`, `api/`, `components/`).
- **Secrets are server-only.** Everything Brevo-related is read inside API routes. No `NEXT_PUBLIC_` keys anywhere.

## 🛠 Known issues / gotchas

- **Lucide icons** `Twitter`, `Github`, `Linkedin` are removed in latest. Inline SVGs live in `src/components/shared/footer.tsx`.
- **Framer Motion** cubic-bezier eases must be cast `as [number, number, number, number]`. Plain `[0.22, 1, 0.36, 1]` fails TS.
- **react-day-picker v9** uses `components={{ Chevron: ({ orientation }) => … }}`, not `IconLeft`/`IconRight`.
- **Tailwind v4** rejects `bg-gradient-to-*`. Always use `bg-linear-to-*`.
- **Hero** — IntersectionObserver drives the stat counters. Test env shims it in `tests/setup.ts`.
