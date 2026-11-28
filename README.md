# templateNextjsApp

Next.js starter based on [GuildMarket](https://github.com/nicksaxer/guildmarket) and [SeppOS](https://github.com/nicksaxer/SeppOS). The app is a gallery of the shared components.

## Develop

```sh
npm ci
npm run dev     # http://localhost:3000, reruns tests on save
npm run check   # lint, types, tests
npm run build
```

Node.js 24. No env vars needed; see `.env.example` for optional MongoDB/SMTP.

On Coder, add the workspace hostname to `allowedDevOrigins` in `next.config.ts`.

## Deploy

CI publishes `ghcr.io/nicksaxer/templatenextjsapp` after checks pass on `main`. In Portainer, create a Git stack from `compose.yaml` and use **Pull and redeploy** for updates. `npm version patch` bumps the version and the image tag together.

## New project

Use as a GitHub template, rename in `package.json` and `app.config.ts`, then delete the `example` files and the Showcase module. Set `APP_IMAGE` to the new image path. There is no auth: add one before storing private data.

Structure and conventions: [docs/architecture.md](docs/architecture.md) and [AGENTS.md](AGENTS.md).
