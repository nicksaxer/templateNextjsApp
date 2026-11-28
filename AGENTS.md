# Agent instructions

Read `docs/architecture.md` before changing structure, data flow, or server/client boundaries.

## Code style

- TypeScript, four-space indentation, single quotes, semicolons.
- Keep signatures, calls, imports, and destructuring on one line when readable.
- Compact guards: `if (invalid) {throw new AppError(...);}`
- CSS: four-space indentation, one declaration per line, a blank line between rules. Never single-line blocks.
- Use the `tsconfig.json` aliases across features/layers and in tests; relative imports within a feature.
- No `any`, unchecked casts, or suppressions.
- Keep it simple: no speculative layers, wrappers, or unrelated refactors.

## UI

- The app is a plain component gallery with labeled, interactive examples. No dashboard shell, sidebar, hero, marketing copy, code samples, or code viewers.
- Keep the GuildMarket/SeppOS look: Rubik, the original palette variables, accent borders, moving input labels, button hover glow, the number stepper, themed native selects, compact switches. Don't swap in a new design system.
- Every styled component gets an adjacent, same-named CSS Module. Shared values come from tokens in `globals.css`.
- Gallery-only examples live in `modules/Showcase`.

## Server

- Config with credentials, models, services, queries, and server utils are `server-only`. Client Components import only types and Server Actions.
- Read through queries/services directly; never fetch the app's own API.
- Validate untrusted input on the server and return `ActionResult`/`AppError`.
- There is no auth. Protected operations must establish identity on the server and check ownership; hidden UI is not authorization.
- The showcase stays stateless: no database writes, and mail previews never send.

## Checks

- Node.js 24 and npm; install with `npm ci`.
- Run `npm run check` (lint, types, tests). Also run `npm run build` for routing, config, dependency, or server/client changes.
- Add tests in `scripts/tests` for meaningful behavior. Never weaken checks to pass.
- Keep secrets out of code. When a convention changes, update `.env.example`, README, and `docs/architecture.md`.
- Report which checks actually ran, and say when something was only verified locally or with mocks.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
