# Sanad Dashboard

The administrator and staff frontend for Sanad. It is a standalone frontend application:
the API, authentication server, database, Prisma schema, and migrations are owned by
`../../sanad-backend`.

## Local development

```sh
cp .env.example .env
# Set VITE_API_URL to the running sanad-backend origin.
bun install
bun run dev
```

The Dashboard runs at `http://localhost:3001` and calls `VITE_API_URL` directly. Configure
`VAN_APP_ORIGINS` in `sanad-backend` to include `http://localhost:3001` so cookie-based sessions
and SSE streams work correctly.

## Checks

```sh
bun run gen:routetree
bun run test:fast
bun run typecheck
```

`typecheck` can require significant memory for this codebase. Browser-safe shared contracts are
in `./contracts`; never reintroduce backend source into this project.

## Docker

Build from this Dashboard directory:

```sh
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  -t sanad-dashboard .
```

The resulting image serves only the Dashboard on port `3001`; it contains no database migration
or backend startup step.

## Vercel

Set the Vercel project Root Directory to this `dashboard` directory. The required shared
contracts are inside `./contracts`, so the build does not need access to any parent folder or a
special Vercel monorepo setting. Add `VITE_API_URL` in the Vercel project environment variables.
