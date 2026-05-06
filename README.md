# BlueZoid

Production-grade marketing site for [bluezoid.in](https://bluezoid.in) — a developer-first software agency. Built with Next.js 16 (App Router + Turbopack), TypeScript, Tailwind v4, Framer Motion, and Zustand.

---

## Quick start

```bash
git clone <repo>
cd bluezoid
cp .env.example .env.local   # optional — site works in dry-run without it
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **No Brevo keys?** The contact and subscribe endpoints fall back to a safe dry-run mode. The UI still works end-to-end so you can develop the site without any third-party credentials.

## Scripts

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the dev server (Turbopack)              |
| `npm run build`     | Production build with type checking           |
| `npm run start`     | Serve the production build                    |
| `npm run lint`      | ESLint (Next core-web-vitals rules)           |
| `npm run format`    | Prettier write                                |
| `npm run format:check` | Prettier check (CI-friendly)               |
| `npm test`          | Run the full Vitest suite once                |
| `npm run test:watch`| Vitest in watch mode                          |
| `npm run test:ui`   | Vitest interactive UI                         |

## Environment variables

See `.env.example`. All Brevo values are server-only. When missing:

- `/api/contact` and `/api/subscribe` return `200 { ok: true, data: { mode: "dry-run" } }`
- The UI displays a success state with a dev-mode hint

## Architecture

```
src/
  app/
    (marketing)/          # Marketing route group: /, /about, /services, /contact
    api/
      contact/route.ts    # POST → Brevo transactional email (admin + auto-reply)
      subscribe/route.ts  # POST → Brevo contact list + welcome email
  components/
    sections/             # Page-level sections (hero, features, newsletter, …)
    shared/               # Container, Section, Navbar, Footer, GradientText
    ui/                   # Primitives (Button)
  config/site.ts          # Site metadata, nav, socials
  lib/
    api.ts                # ok() / fail() helpers, typed ApiResponse<T>
    brevo.ts              # Brevo client + typed errors + dry-run helpers
    validations.ts        # Zod schemas (contact, subscribe)
    utils.ts              # cn()
  stores/
    booking-store.ts      # 3-step contact wizard state
    subscribe-store.ts    # Newsletter form state
tests/
  lib/                    # Validation + Brevo unit tests
  stores/                 # Zustand store tests
  api/                    # Route handler tests (mocked fetch + env)
  components/             # React Testing Library component tests
```

**API response shape:**

```ts
type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; issues?: unknown } };
```

## Conventions

- **Server-only secrets.** Never expose Brevo keys to the client. If a third-party integration must be called, wrap it in `src/lib/` and call from an API route.
- **Tailwind v4.** Use `bg-linear-to-*`, not `bg-gradient-to-*`. Colors use oklch.
- **Framer Motion.** Cubic-bezier ease arrays need `as [number, number, number, number]`.
- **Lucide.** `Twitter`, `Github`, `Linkedin` are no longer exported — inline SVGs live in the footer.
- **Fonts.** Outfit (`--font-display`) for headings, Inter (`--font-sans`) for body.

## Testing

Vitest + React Testing Library, jsdom environment. Tests colocated under `tests/`, not `src/`, to keep the build surface clean.

```bash
npm test              # one-shot
npm run test:watch    # watch
```

Coverage focuses on:

- **Validation** — Zod schemas (`tests/lib/validations.test.ts`)
- **Brevo client** — env validation, fetch payloads, error classes (`tests/lib/brevo.test.ts`)
- **Stores** — Zustand actions + reset (`tests/stores/`)
- **API routes** — dry-run, validation, success, upstream failure (`tests/api/`)
- **Components** — Newsletter form, error/success states (`tests/components/`)

## Deployment

Vercel is the target. Set the env vars from `.env.example` in the project settings, then deploy. The build is fully static except `/api/*` route handlers.

## License

Proprietary — © BlueZoid.
