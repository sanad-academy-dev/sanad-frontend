# Dashboard contributor guide

`sanad-frontend/dashboard` is a frontend-only admin application.

- Use `VITE_API_URL` to call `sanad-backend`; do not add API routes, Prisma, database clients,
  migrations, or server secrets here.
- Browser-safe shared types and helpers are imported from `sanad-contracts`.
- Keep authenticated requests credentialed (`credentials: "include"`) and configure the Backend
  CORS allow-list with the Dashboard origin.
- Run `bun run gen:routetree` after changing routes. The available checks are `bun run test:fast`
  and `bun run typecheck`; the latter may require substantial memory on this machine.

Backend implementation and database tests belong in `sanad-backend`.
