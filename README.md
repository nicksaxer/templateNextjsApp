# templateNextjsApp

A reusable Next.js App Router foundation based on the structure and coding conventions in [GuildMarket](https://github.com/nicksaxer/guildmarket) and [SeppOS](https://github.com/nicksaxer/SeppOS).

The running app is an interactive playground: inputs, buttons, feedback states, animations, a small form validation example, and actual HTML email previews. It contains no code tutorials or source viewers.

## Start

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables, database, SMTP server, or account are needed. `npm run build` and `npm run start` run the production app.

## Docker and Portainer

One `compose.yaml` works on local Docker Standalone and remote Agent environments. After the checks pass on the default branch, GitHub Actions builds and publishes the image for Linux AMD64 and ARM64. Portainer pulls the image, runs the container, and monitors `/api/health`. Pulling the image avoids the BuildKit session that fails through the Agent. [Portainer remote-build limitations](https://docs.portainer.io/faqs/known-issues/docker-compose-files-including-build-steps-fail)

1. Wait for **Publish the versioned image to GHCR** to succeed in GitHub Actions.
2. Create or update the **Git Repository** stack with `refs/heads/main` and Compose path `compose.yaml`. Set `APP_PORT` if the default host port 3000 is already in use. Supply optional MongoDB or SMTP settings as stack variables. [Portainer stack setup](https://docs.portainer.io/user/docker/stacks/add)
3. For a private copy of the project, configure Git authentication for the repository and add an authenticated `ghcr.io` custom registry for the image. Use a classic GitHub token with `read:packages` and access to the package. [Portainer registry setup](https://docs.portainer.io/admin/registries/add/custom) · [GitHub registry authentication](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
4. For later deployments, use **Pull and redeploy** once publication succeeds. Each successful default-branch build publishes the same image as `latest` and under its package version. The Portainer image status badge compares the local image against the registry. [Portainer image status](https://docs.portainer.io/user/docker/containers)

Run `npm version patch` (or `minor` or `major`) to update the package files and Compose tag in one release commit. GitHub uses that package version for the Docker build, which sets the image's `org.opencontainers.image.version` label. The footer reads the same version. For example, Portainer deploys `ghcr.io/nicksaxer/templatenextjsapp:0.1.0` and the footer shows `v0.1.0`.

For a repo created from this template, GitHub publishes to the lowercase repository path under `ghcr.io`. Update the default image name in `compose.yaml` or set `APP_IMAGE` to that path without the tag in Portainer.

To test a local source build with the same Compose file:

```sh
version=$(node -p "require('./package.json').version")
docker build --build-arg "APP_VERSION=$version" -t "$(docker compose config --images)" .
docker compose up -d --pull never
```

## Coder development

The dev server allows `3000--main--seppos--nicksaxer.dev.guildmarket.net`, matching the existing SeppOS workspace. Localhost remains supported automatically. For another workspace, update `allowedDevOrigins` in `next.config.ts` with its exact browser hostname (no `https://`, port, or path), then restart `npm run dev`.

If HTML/CSS loads but clicks do nothing, check the browser console and terminal for blocked `/_next/` requests. The production and development servers have different asset checks, so the browser suite runs against both. Coder’s port subdomain is the supported workspace entry point; a path-based proxy needs its own routing setup.

## Structure

| Location | Responsibility |
| --- | --- |
| `src/app/(frontend)/(public)` | Pages composing frontend modules |
| `src/app/(frontend)` | Document layout, theme, global tokens, loading/error/not-found boundaries |
| `src/app/api` | HTTP interfaces; includes a minimal health endpoint |
| `src/frontend/components/layout` | Container; gallery appearance controls live with the examples |
| `src/frontend/components/modules` | Showcase gallery and reusable Alert module |
| `src/frontend/components/ui/inputs` | Button, TextInput, NumberInput, SelectInput, TextArea, Switch, Checkbox, shared field behavior |
| `src/frontend/components/ui/elements` | ErrorMessage, InfoBox, inline Alert, Badge, LoadingIndicator, Skeleton, Progress, EmptyState, Card, HLine, Accordion, Tabs, Icon, NavigationLink, ProfilePicture |
| `src/frontend/components/ui/animations` | SlideDown and FadeIn |
| `src/frontend/utils` | Formatting, class names, cancellable delay, theme preferences |
| `src/backend/00_config` | App, environment, MongoDB, example plans and limits |
| `src/backend/01_types` | Client-safe action results, DTOs, example domain and mail contracts |
| `src/backend/02_models` | Example Mongoose schema and model |
| `src/backend/03_services` | Application operations and mail rendering/delivery |
| `src/backend/04_queries` | Server-rendered read entry points |
| `src/backend/05_actions` | Validated Server Action entry points |
| `src/backend/06_utils` | Form parsing, domain validation, AppError, action/HTTP error handling |
| `src/backend/07_mailtemplates` | Handlebars base, header/footer partials, welcome and project templates |

Aliases preserve the existing projects' conventions: `@frontend/*`, `@backend/config/*`, `@backend/types`, `@backend/models`, `@backend/services/*`, `@backend/queries/*`, `@backend/actions/*`, and `@backend/utils`.

## Reuse for a new project

1. Create a repository from this one using GitHub's **Use this template**, if enabled, or copy the source into a fresh repository. In repository Settings → General, **Template repository** enables that GitHub button.
2. Change the package name, `app.config.ts`, page metadata, icon, and the CSS variables in `globals.css`. Keep `next` and `eslint-config-next` versions aligned.
3. Replace the playground modules and public pages with your own features. `example.config.ts`, example types/model/service/query/action/validation, and example mail templates are deliberately named so they are easy to remove together.
4. Keep shared UI, layouts, infrastructure, result/error contracts, and utilities as needed. The template includes no authentication system; select one for your project before adding private reads or mutations.
5. Add only the integrations the project needs. Keep credentials on the server and document new variables in `.env.example`.

Read [docs/architecture.md](docs/architecture.md) for boundaries, data flow, and extension conventions. [AGENTS.md](AGENTS.md) carries the coding conventions forward to future agent work.

## The example flow

The gallery's form validation example submits to a Server Action, parses FormData, validates untrusted values in the service, validates a Mongoose document without saving it, calculates prices using server-owned configuration, and returns a serializable project DTO plus rendered email. Errors are returned through `ActionResult<T>` with field messages. The result and the separate mail template examples both appear on the main gallery page.

Drafts are **not persisted**; they disappear on reload. The public example neither writes to MongoDB nor sends SMTP mail, even when integration credentials are present. It does not claim to demonstrate authentication, authorization, durable storage, or a payment flow.

## Optional integrations

Copy `.env.example` to `.env.local` only when enabling an integration in your own server code. Configuration is validated lazily so unused integrations never block startup or builds.

- **MongoDB:** call `connectDatabase()` from `mongoose.config.ts` before database operations, then use the model in a server-only service. The connection promise is shared within the loaded module, and rejected connections can retry. The example model has timestamps, strict fields, and optimistic concurrency. Establish identity and enforce ownership before exposing persistent operations. Transactions require a replica set or compatible managed database.
- **Mail:** `renderMail(values)` returns HTML, plain text, and subject without credentials. `sendMail(recipient, values)` sends through SMTP and throws on failure. `trySendEmail()` returns an explicit delivery result for a secondary notification; the caller must handle failure. There is no public send action. Set all `SMTP_*` variables in `.env.example` for delivery.
- **Packaging:** `next.config.ts` traces the actual `07_mailtemplates` directory into production output. Template names are allowlisted; Handlebars escapes substituted values. Only already-rendered template content is inserted unescaped into the base layout. Browser previews use sandboxed iframes.

SMTP delivery and live MongoDB connectivity require your development credentials and are not exercised by the default checks. SMTP settings must match the provider's TLS requirements; port 465 normally uses `SMTP_SECURE=true`, while STARTTLS on port 587 uses `false`.

## Component sources

The gallery is a plain collection of labeled, interactive examples. It has no product shell, sidebar, hero, or marketing content.

The original component implementations and CSS Modules come from SeppOS commit `ab08d9219f0ead2a0ee4551fbdd488fec0326ad4`: Button, TextInput, NumberInput, SelectInput, Switch, InfoBox, LoadingIndicator, and HLine. GuildMarket commit `2501a4bf939fcb546dec363c41c54ad99bfa0cde` supplies the default cyan palette, input error treatment, and email layout conventions. Rubik is bundled locally using Fontsource; the original Bootstrap and Font Awesome icons are retained.

GuildMarket colors and dark mode are the defaults, rendered before hydration. The gallery also offers the SeppOS palette, and an explicitly saved light/dark preference is respected. Changing these controls does not introduce a separate component design.

Small template additions preserve the source appearance: error/hint associations, pending button state, a compact spinner option, and a form name on Switch. TextArea and the additional feedback/interaction components use the same tokens. SlideDown and FadeIn remain standalone reusable animations. The numbered backend layers remain unchanged.

## UI conventions

- Each styled component has its own adjacent, same-named CSS Module. Shared theme variables live in `globals.css`.
- Buttons preserve `filled`, `simple`, `danger`, `iconOnly`, and `bsicon` conventions. `icon` accepts a Font Awesome IconDefinition; icon-only controls require an accessible label. Pending buttons are disabled and expose busy state.
- Inputs preserve native value/defaultValue, reset, keyboard, disabled, and form submission semantics. Text inputs also support password reveal, field errors, hints, refs, and end adornments. NumberInput uses SeppOS’s custom stepper with native number semantics. SelectInput renders a native select and themes its picker where `appearance: base-select` and `::picker(select)` are supported.
- Pass `open` to control `SlideDown`, or omit it when placing `SlideDown` directly after a `summary` inside `details`. Set `--slide-down-duration` or `--slide-down-easing` to customize the motion. Closed content retains state and stays out of the tab order.
- FadeIn, loading, skeleton, and slide effects respect reduced-motion preferences. The alert traps focus, supports Escape dismissal, and returns focus on close. Tabs support arrow keys, Home, and End.
- `EmptyState` accepts a Bootstrap icon name, a React icon, or `null`. `ProfilePicture` accepts `src`, `alt`, and `size`, with an icon fallback for missing or failed images. Use `preload` to opt into preloading.
- `NavigationLink` accepts `showPending` to show an inline hint after 150 ms of pending navigation. Fragment links use native anchors.
- Themes are rendered from the same-site preference cookie, then updated in the document and cookie together. All tokens are scoped at the document level so dialogs inherit them. This preference cookie is not an authentication mechanism.

## Tabs

Give each panel a label and place its content inside a `Tab` child.

```tsx
import Tabs, { Tab } from '@frontend/components/ui/elements/Tabs';

<Tabs label="Project details">
    <Tab label="Overview">
        <h2>Overview</h2>
        <p>Project details go here.</p>
    </Tab>
    <Tab label="Settings">
        <h2>Settings</h2>
        <p>Project preferences go here.</p>
    </Tab>
</Tabs>
```

Panels stay mounted as you switch, so input values and local state are retained. The highlight moves with the active tab and snaps into place when reduced motion is requested.

For controlled tabs, give each `Tab` a unique `id` and pass `activeId` and `onChange` to `Tabs`. Set `center` to center the tab list.

## Alert dialog

`showAlert(type, title, content)` is the SweetAlert replacement. Import it from a Client Component or browser event handler:

```tsx
import { showAlert } from '@frontend/components/modules/Alert';

await showAlert('success', 'Saved', 'Your changes have been saved.');
```

Types are `info`, `warning`, `error`, and `success`. Content accepts plain text or React content; strings are escaped rather than interpreted as HTML. The returned promise resolves when the user dismisses the dialog with OK, the close button, Escape, or the backdrop. Calls made while an alert is open are displayed in order.

`showConfirm(title, content, confirmLabel?)` uses the same queue and resolves to `true` when the user confirms and `false` on dismissal. It focuses Cancel when it opens.

`<AlertHost />` is already mounted once in the root layout. Keep it there when reusing the template. The dialog uses the existing buttons, theme tokens, and native modal behavior for keyboard focus. Large, centered SVG icons draw in when each alert opens: a checkmark, cross, exclamation mark, or information symbol. Each animation runs once and respects reduced-motion preferences. The gallery has editable title/content fields and buttons for all four types. The existing inline `ui/elements/Alert` remains available for messages within a page.

## Verification

```sh
npm run check       # lint, strict typecheck, backend/utility tests
npm run build       # production compile and route validation
npx playwright install chromium
npm run test:e2e    # starts the production server; build first
PLAYWRIGHT_DEV=1 npm run test:e2e  # development interactions and origin checks
```

Backend tests cover validation, forged prices, serialization, FormData failures, checkbox semantics, mail escaping/template allowlisting, lazy configuration, and cancellation. Browser tests cover form failure/retry/success, email rendering, reset behavior, loading/empty states, motion, keyboard tabs/dialog focus, theme reload/navigation, mobile gallery layout, reduced motion, and error-free client execution. CI runs these checks on Node.js 24 using the Chrome already installed on GitHub's Ubuntu 24.04 runner. Local browser tests use Playwright's Chromium by default; `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can select an existing browser instead.

This repository intentionally has no project-specific auth, payment, analytics, storage provider, or user data copied from either source project.
