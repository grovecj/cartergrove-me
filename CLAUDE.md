# cartergrove.me

Personal website for Carter Grove — resume, portfolio, and blog.

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui (new-york style)
- PostgreSQL via Prisma (Docker for local dev, DigitalOcean managed for prod)
- NextAuth.js v5 + GitHub OAuth (restricted to `grovecj`)
- framer-motion for portfolio animations
- next-themes for dark mode
- unified (remark + rehype + rehype-pretty-code) for markdown

## Project Structure
- `src/app/` — App Router pages and API routes
- `src/components/` — React components (ui/ for shadcn, layout/ for shared)
- `src/lib/` — Utilities (prisma, auth, markdown)
- `prisma/` — Schema, config, and seed data
- `terraform/` — Infrastructure as code
- `nginx/` — Reverse proxy config

## Local Development
```sh
npm run db:up        # Start PostgreSQL via Docker (port 5434)
npm run db:push      # Sync Prisma schema to database
npm run db:seed      # Seed with sample data
npm run dev          # Start Next.js dev server
```

## Commands
- `npm run dev` — Start dev server
- `npm run db:up` / `npm run db:down` — Start/stop Docker PostgreSQL
- `npm run db:push` — Sync Prisma schema
- `npm run db:seed` — Seed database
- `npm run db:reset` — Wipe and re-seed database
- `npm run db:studio` — Open Prisma Studio GUI
- `npm run build` — Production build
- `npm run lint` — ESLint

## Conventions
- Use `@/` import alias for `src/`
- JSON arrays in PostgreSQL stored as text strings, parse with `JSON.parse()`
- All admin routes behind NextAuth session check
- shadcn/ui components in `src/components/ui/`
- Prisma 7: PrismaClient requires `@prisma/adapter-pg` with a `pg.Pool`
- Prisma seed config lives in `prisma.config.ts`, not `package.json`
