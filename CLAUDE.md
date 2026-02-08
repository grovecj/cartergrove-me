# cartergrove.me

Personal website for Carter Grove — resume, portfolio, and blog.

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui (new-york style)
- PostgreSQL via Prisma (DigitalOcean managed database)
- NextAuth.js v5 + GitHub OAuth (restricted to `grovecj`)
- framer-motion for portfolio animations
- next-themes for dark mode
- unified (remark + rehype + rehype-pretty-code) for markdown

## Project Structure
- `src/app/` — App Router pages and API routes
- `src/components/` — React components (ui/ for shadcn, layout/ for shared)
- `src/lib/` — Utilities (prisma, auth, markdown)
- `prisma/` — Schema and seed data
- `terraform/` — Infrastructure as code
- `nginx/` — Reverse proxy config

## Commands
- `npm run dev` — Start dev server
- `npx prisma db push` — Sync schema to PostgreSQL
- `npx prisma db seed` — Seed database
- `npm run build` — Production build
- `npm run lint` — ESLint

## Conventions
- Use `@/` import alias for `src/`
- JSON arrays in PostgreSQL stored as text strings, parse with `JSON.parse()`
- All admin routes behind NextAuth session check
- shadcn/ui components in `src/components/ui/`
