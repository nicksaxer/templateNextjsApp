# Architecture

## Layout

| Location | Purpose |
| --- | --- |
| `src/app` | Routes, root layout, error/loading boundaries, HTTP endpoints (`api/health`) |
| `src/frontend/components/layout` | Shared container |
| `src/frontend/components/modules` | Complete features: `Showcase` (the gallery), `Alert` (`showAlert`/`showConfirm`) |
| `src/frontend/components/ui` | Reusable `inputs`, `elements`, `animations` |
| `src/frontend/utils` | Browser-safe helpers |
| `src/backend/00_config` | App metadata, lazily validated env, MongoDB connection, example constants |
| `src/backend/01_types` | DTOs and `ActionResult`; safe for type-only client imports |
| `src/backend/02_models` | Mongoose schemas |
| `src/backend/03_services` | Business logic, persistence, mail rendering/delivery |
| `src/backend/04_queries` | Read entry points for Server Components |
| `src/backend/05_actions` | Server Actions: parse FormData, call services, return results |
| `src/backend/06_utils` | Validation, `AppError`, error conversion |
| `src/backend/07_mailtemplates` | Handlebars base, partials, allowlisted templates |
| `scripts` | Dev launcher, Node tests (`scripts/tests`), Compose version hook |

The layers are ordered by responsibility, not a chain every call must pass through. Services may access data directly; don't add a repository layer. New domain code goes in feature folders inside the existing layers.

## Data flow

- Read: page → query → service/config → serializable props.
- Write: form → Server Action → service validation → model validation → DTO → result UI.
- Only explicit DTO fields cross to the client (dates as ISO strings, IDs as strings), never Mongoose documents or config.
- Expected errors are returned as `ActionResult` with optional field messages. Unexpected errors throw a generic message. Use `unstable_rethrow` so redirects and not-found still work.

## Decisions worth knowing

- **Stateless showcase:** the example validates a model but never saves it or sends mail, so the public app runs without a database or SMTP. The live adapters are building blocks for real projects.
- **Lazy config:** env is validated when used, so missing optional integrations don't break unrelated pages.
- **Mail:** template names are allowlisted and variables escaped. `next.config.ts` traces `07_mailtemplates` into the build, so moving it means updating both.
- **Theme:** GuildMarket palette and dark theme by default, rendered on the server from a cookie. Tokens sit on the document so native dialogs inherit them.
- **Tests:** Node tests import utils through `@backend/utils/*` instead of the barrel, which pulls in Next.js navigation code.
- **Deploy:** CI runs checks, then publishes the Docker image to GHCR as `latest` and as the package version. `npm version` syncs the tag in `compose.yaml`. Portainer pulls it and checks `/api/health`.
