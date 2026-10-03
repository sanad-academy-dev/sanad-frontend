# Sanad contracts

This is not an application and it never connects to a database. It owns browser-safe shared
schemas, constants, types, and pure workflow helpers used by the Dashboard and, where needed,
the Website.

Rules:

- No database access, Elysia controller, authentication server, Node-only import, or environment
  secret may be added here. The generated Prisma directory is schema/type metadata copied from
  the backend; browser code may use its enums and type-only exports, never a database client.
- Any operation that needs data must be exposed by `sanad-backend` and called by a frontend API
  client.
- Backend-only source remains in `sanad-backend`.
