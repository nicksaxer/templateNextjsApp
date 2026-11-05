# Project instructions

Read `docs/architecture.md` before changing structure, data flow, persistence, configuration, or server/client boundaries.

## Coding style

- Use TypeScript, four-space indentation, single quotes, and semicolons in handwritten code.
- Keep function signatures, calls, imports, destructuring, and simple expressions on one line when readable. Use multiline blocks for complex structures.
- Prefer compact guards: `if (invalid) {throw new AppError(...);}`.
- Preserve naming, capitalization, terminology, aliases, component props, and export patterns.
- Use meaningful types and type-only imports for client-safe contracts. Avoid `any`, unchecked assertions, and suppressions used to hide errors.
- Use straightforward implementations. Avoid unrelated refactors, speculative layers, and boilerplate.

## Architecture

- Preserve `src/app`, frontend layout/modules/ui, and the numbered backend layers.
- Use Server Components for composition and reads, and Client Components for interactions and browser APIs.
- Keep config requiring credentials, models, services, queries, and server utilities marked `server-only`.
- Client Components may import shared types and Server Action references, never server-only implementations.
- Read through queries/services directly; do not fetch the app's own HTTP endpoints for internal calls.
- Validate all untrusted values on the server; use shared ActionResult/AppError contracts and preserve framework control flow.
- Authentication is not included. Protected operations must establish a trusted identity and enforce ownership; layouts and hidden UI do not provide authorization.
- Keep showcase operations stateless and mail previews side-effect-free unless a task deliberately changes that behavior.

## UI

- Reuse CSS Modules, shared tokens, and existing controls. Keep feature presentation in modules.
- Preserve form semantics, native resets, accessible labels, error descriptions, focus, keyboard behavior, and disabled states.
- Keep reduced-motion content visible and usable. Closed animated content must not receive focus.
- The running app demonstrates components through interactions. Do not add code viewers, code samples, or architecture explanations to the UI.

## Verification and delivery

- Use Node.js 24, npm, and the committed lockfile (`npm ci`).
- Run `npm run check`; run `npm run build` for routing, configuration, dependencies, server/client, or production changes.
- For relevant UI changes, build and run `npm run test:e2e` against production. Add tests for meaningful behavior without mirroring trivial implementation.
- Read version-specific Next.js documentation in `node_modules/next/dist/docs/` before changing framework behavior.
- Never weaken checks to make them pass. Distinguish mocked or local validation from live integration verification.
- Keep secrets out of code/logs. Update `.env.example`, README, and architecture documentation when lasting conventions change.
- Review the final diff and report actual checks and limitations. Preserve unrelated user work.
