# Architecture

This project preserves the shared architecture of GuildMarket and SeppOS while removing their product-specific rules and integrations. The frontend is a plain interactive component gallery; reusable infrastructure does not depend on the showcase UI.

## Boundaries

`src/app` owns routing, document layout, loading/error boundaries, and HTTP interfaces. Pages load their data through queries and compose frontend modules. Server Components are the default. Interactive modules and controls declare their client boundaries explicitly.

`src/frontend/components/layout` owns the shared container. `modules` owns complete features. `ui/inputs`, `ui/elements`, and `ui/animations` own reusable presentation and behavior. Shared presentation tokens live in the frontend root's `globals.css`; component styling uses CSS Modules. `src/frontend/utils` contains browser-compatible functions without backend runtime dependencies.

The backend layers are ordered by responsibility, not a rule requiring a wrapper for every call:

| Layer | Responsibility |
| --- | --- |
| `00_config` | App metadata, environment and infrastructure settings, example domain constants |
| `01_types` | DTOs, result contracts, and domain types, safe for type-only client imports |
| `02_models` | Mongoose persistence schemas/document contracts |
| `03_services` | Business operations, persistence, mail rendering and delivery |
| `04_queries` | Read entry points for server rendering |
| `05_actions` | UI entry points, FormData parsing, result handling and mutation coordination |
| `06_utils` | Domain validation, error conversion and supporting server helpers |
| `07_mailtemplates` | HTML base, partials, and allowlisted templates |

Services may perform data access directly; do not introduce a repository layer merely to forward arguments. Organize new domain code within feature folders in the existing layers. Retain the aliases in `tsconfig.json`.

## Data flow

The example read path is page → query → services/config → serializable props. The project preview path is form → Server Action → FormData parsing → service validation → model validation → DTO and rendered mail → result UI.

The example is deliberately stateless: model construction and validation do not save a document or connect to MongoDB. The user sees server-calculated prices, validation errors and the actual generated email. It is safe to run this public showcase without a database or SMTP credentials. Live database and mail adapters are opt-in building blocks for future projects, not switches that turn the public example into an unauthenticated writer or mail relay.

Validate inputs in services even when the UI constrains them. Parse transport values in actions. Derive price and allowed plans from server configuration. Return only explicit DTO fields; never send Mongoose documents or infrastructure configuration to clients. Dates crossing the boundary are ISO strings; identifiers are strings.

`ActionResult<T>` separates success data from expected errors. AppError may include field messages. Unexpected failures throw a generic client-facing error after minimal server diagnostics; they are not reported as successful results. `unstable_rethrow` preserves Next.js redirects/not-found and other framework signals at generic boundaries. HTTP error conversion follows the same policy with response status codes.

When adding real mutations, reconcile the affected UI through the returned data and appropriate Next.js revalidation. Do not assume arbitrary local client drafts automatically follow refreshed server props. No persistent shared caching is enabled by this template.

## Infrastructure

Configuration is validated lazily at use, so optional integrations do not block unrelated rendering. Mongoose connection attempts are shared within the loaded configuration module and reset after failures. Models are reused through Mongoose's registry to avoid duplicate compilation during reloads. The example schema provides strict fields, timestamps and optimistic concurrency; actual operations must choose atomicity, ownership and transaction rules for their domain.

Email rendering uses an allowlist of template filenames, escaped Handlebars variables and local partials. The base layout only inserts pre-rendered template HTML unescaped. Runtime packaging traces `07_mailtemplates`; moving that directory requires changing the tracing configuration and renderer together. SMTP transport is only created when delivery is explicitly invoked. Delivery failure is either thrown or returned explicitly for a secondary notification; a caller must not hide a failed primary operation behind a success result.

There is no authentication system in this template. Before exposing private reads or persistent writes, choose a supported authentication solution, establish identity at protected entry points, and enforce resource permissions in the application call path. Never accept client-supplied identity as authorization. Do not present the public stateless example as a secure CRUD implementation.

## Interaction and preferences

Native form semantics are preserved through reusable wrappers. Field IDs connect labels, hints and errors. SelectInput retains SeppOS’s custom portaled menu, keyboard navigation, typeahead, and hidden native select. NumberInput retains its custom stepper and native number input events. Button defaults to `type="button"` so accidental form submission is avoided. Form submission buttons explicitly opt into submit behavior.

SlideDown uses grid track interpolation with an overflow-clipped child, avoiding fixed maximum heights and imperative timers. Closed children retain state but are inert and aria-hidden. The trigger owns its expanded state, controls relationship, and focus. FadeIn, loaders, and skeletons have usable reduced-motion states. Dialog uses the native modal API. Tabs implement one active tab stop and arrow/Home/End navigation.

The default colors and component CSS come from SeppOS; the gallery can preview GuildMarket’s original palette. Do not redesign the shared controls or add a product-style shell to the gallery. The theme is initially rendered from a validated cookie. Client changes update both document tokens and the cookie so navigation and reload agree. Tokens live on the document, including for native top-layer dialogs. The cookie stores only a presentation preference.

## Extending the template

Remove example domain files together and replace the pages/modules with your own feature. Keep reusable UI and backend infrastructure according to actual needs. Add environment variables with placeholders and setup documentation. Keep future product rules in their feature rather than spreading them through universal controls.

Use the installed Next.js documentation for version-specific APIs. The lockfile, Node.js pin, package scripts and CI workflow define reproducible verification. Backend tests exercise actual validation and rendering without live services; browser tests use the built production server. A live database or SMTP integration needs a separate check with development credentials.
