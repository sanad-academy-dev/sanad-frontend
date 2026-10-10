# Dashboard architecture note

This directory is the Sanad admin frontend. Its only public configuration is:

```text
VITE_API_URL=http://localhost:5180
VITE_SENTRY_DSN=
VITE_MAP_STYLE_URL=
```

The Dashboard talks directly to `sanad-backend`; it owns no database, authentication server,
Prisma schema, migrations, or backend-only secrets. Historical full-stack guidance is preserved
under the repository-root `.migration-reference/dashboard-legacy` archive and must not be used
as current deployment guidance.
