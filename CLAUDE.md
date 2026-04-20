# MEDIREFERTO

Un sistema client–server per la refertazione medica automatizzata. Il medico registra l'audio della visita, l'app trascrive, genera un referto con AI, consente la revisione e lo esporta in PDF su carta intestata.

## CONTEXT FILES

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Database (Prisma)

```bash
npm run db:migrate   # Create + apply a new migration (dev) — always use this, never db push
npm run db:deploy    # Apply pending migrations (production)
npm run db:status    # Check migration sync status
npm run db:seed      # Seed dev data (admin + doctor accounts)
npm run db:reset     # Reset DB and re-seed (dev only — destructive)
npm run db:studio    # Open Prisma Studio
```

No test framework is configured.

## Architecture

This is a **Next.js 16** project using the App Router with React 19, TypeScript (strict), and Tailwind CSS v4.

- `app/` — App Router: `layout.tsx` (root layout with Geist fonts), `page.tsx` (home), `globals.css` (Tailwind v4 + CSS vars for light/dark theme)
- `public/` — Static assets
- Path alias `@/*` maps to the project root

**Tailwind v4** uses `@import "tailwindcss"` syntax in CSS (not `@tailwind` directives).  
**ESLint 9** uses flat config (`eslint.config.mjs`), not `.eslintrc`.

## Next.js 16 Docs

Before writing any Next.js-specific code, consult the bundled docs:

- `node_modules/next/dist/docs/01-app/` — App Router guides and API reference
- `node_modules/next/dist/docs/03-architecture/` — Compiler, rendering, and browser support
