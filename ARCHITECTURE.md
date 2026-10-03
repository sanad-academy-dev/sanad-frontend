# Sanad frontend architecture

There are two independently deployable frontend applications:

| App | Local URL | Audience | API setting |
| --- | --- | --- | --- |
| `website` | `http://localhost:3000` | public visitors | `SANAD_API_URL=http://localhost:5180/api` |
| `dashboard` | `http://localhost:3001` | authenticated administrators and staff | `VITE_API_URL=http://localhost:5180` |

`sanad-backend` is the only project that owns Better Auth, Elysia routes, Prisma, migrations,
and database credentials. Neither frontend has database or migration commands in its supported
workflow.

The Dashboard sends API, session, onboarding, invitation, upload, download, and SSE requests
directly to `sanad-backend`; it has no local `/api` proxy. Browser-safe schemas and workflow
helpers live in `dashboard/contracts`. The old source tree is retained only in
the root `.migration-reference/dashboard-legacy` archive; it is not part of any deployable app.

## Local startup

1. Start `sanad-backend` on port `5180` with its own environment file.
2. Copy `website/.env.example` to `website/.env.local`, then start Website on port `3000`.
3. Copy `dashboard/.env.example` to `dashboard/.env`, then start Dashboard on port `3001`.

The backend `VAN_APP_ORIGINS` must include both frontend origins so authenticated cross-origin
requests are allowed.
