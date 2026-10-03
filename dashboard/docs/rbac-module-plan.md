# RBAC Module — Full Roles & Permissions

> Branch: `feat/roles-and-permissions`. Replaces the two parallel authorisation systems
> (the flat `PERMISSIONS` slug list and the accounting doctype matrix) with **one**
> registry-driven, relational, scope-aware model — and gates every route in the app.

## 0. Why

The audit that opened this work (2026-08-25):

| Fact | Number |
|---|---|
| Controllers, non-accounting | 88 |
| …of those, checking **any** permission | **12** |
| Route registrations, whole app | 973 |
| Ungated non-accounting controllers | **76** — auth-only, any clinic member can call |
| Permission slugs defined | ~165 (55 generic + ~110 accounting) |
| Slugs the roles editor can actually grant | ~55, several `comingSoon` with empty toggles |
| Accounting slugs grantable through the UI | **0** — ADMIN-only in practice |

Four structural defects, each addressed by a numbered phase below:

1. **Coverage** — 76 controllers have no gate. Nothing makes an omitted gate look wrong.
2. **Staleness** — `Session.permissions` is a JSON snapshot written *only* in
   `session.create.after`, refreshed *only* by deleting every affected session
   (`staff-roles.dao.ts:86`). A `roleId` change, a branch move, or a clinic switch leaves
   it wrong.
3. **Catalogue drift** — the roles editor's sections are a hardcoded array independent of
   `ALL_PERMISSIONS`; accounting appears in it zero times.
4. **`limited` means nothing shared** — scoping is re-invented per module (branch via
   `BranchUser` in clinic-documents, own-staff-id in grooming, absent everywhere else).

## 1. Decisions (owner, 2026-08-25)

| # | Decision | Consequence |
|---|---|---|
| D1 | **Multi-role** via a join table | `Staff.roleId` is kept as the *primary* role so payroll / course / quiz targeting keeps working unchanged; effective permissions are the **union** of all assigned roles. |
| D2 | **Code registry, DB-mirrored** | A TS resource registry generates slugs; a `Permission` table is synced from it by migration for FK integrity + reporting. Code stays authoritative and typed. |
| D3 | **Scope lives in the grant** | `RolePermission.scope ∈ {ALL, BRANCH, OWN}` replaces the ad-hoc `view_limited` / `view_full` pairs. |
| D4 | **One super-role bypasses everything** | A role flagged `isSuperAdmin` skips every check — see §3. |
| D5 | Sweep **everything**, phased, one branch | The app-wide ungated-route audit is the exit gate. |

## 2. Hard constraints discovered in the codebase

**C-1 — Macro context carries PRIMITIVES ONLY.** An object, union, or function placed in
an Elysia macro's resolved context propagates into every route's inferred type and blows
TypeScript's instantiation-depth ceiling; the error surfaces as **TS2589 in
`src/server/app.ts`**, pointing nowhere near the file that caused it. Confirmed in eight
existing files (`clinic-documents.controller.ts:56`, `mobile-auth.macro.ts:132`,
`sales.controller.ts:34`, …).

> The guard therefore resolves to flat primitives — `isSuperAdmin: boolean`,
> `scopeKind: string`, `scopeBranchId: string | null`, `scopeStaffId: string | null` — and
> each handler reassembles the scope object locally through a helper, exactly the shape
> `clinic-documents` already uses (`toScope`).

**C-2 — The Elysia chain is at its depth ceiling.** A 67th top-level `.use()` in
`src/server/index.ts` breaks typecheck. New controllers group into sub-servers
(`accountingServer`, `groomingServer`, `mobileClinicsServer`, …). The RBAC controller
joins an existing sub-server rather than the root chain.

**C-3 — No local database; CI is the source of truth for DB work** (CLAUDE.md rule 8).
Migrations are authored via `prisma migrate diff` (schema→schema), never `db:push`.

**C-4 — ADMIN bypass must be explicit, not a scattered short-circuit.** `if (isAdmin)
return true` repeated across 12 files is what hid the P12A "403 for everyone, including
ADMIN" bug for a whole phase: `doctypeSupportsAction` was checked *before* the bypass.
The new guard evaluates the super-admin bypass **first, unconditionally**.

## 3. The super-admin role (D4)

Today "System Manager" is identified by **comparing the Arabic role name string**
(`exists.name === "مدير النظام"` in `staff-roles.dao.ts:59,105`). That is replaced by a
real column.

```prisma
model StaffRole {
  isSuperAdmin Boolean @default(false)  // skips ALL permission checks
  isSystem     Boolean @default(false)  // built-in; cannot be deleted or renamed
}
```

Rules:

- `isSuperAdmin` short-circuits the guard **before** any registry lookup, scope
  resolution, or action-support check — the C-4 lesson. It cannot 403, ever.
- Its effective scope is always `ALL`.
- Every clinic is provisioned with exactly one `isSuperAdmin` + `isSystem` role
  ("مدير النظام"), assigned to the clinic creator.
- **The last super-admin assignment in a clinic cannot be removed** and the flag cannot be
  cleared on the last such role — otherwise a clinic locks itself out permanently.
- `ClinicUser.role = ADMIN` keeps working as a bypass during migration, then becomes a
  *derived* value (`ADMIN` ⟺ holds an `isSuperAdmin` role) so there is one source of truth.

## 4. Schema (Phase 1)

```prisma
enum PermissionScope { ALL BRANCH OWN }

model Permission {                    // mirrored from the registry, never hand-edited
  id        String  @id @default(cuid())
  key       String  @unique           // "patients.read"
  resource  String                    // "patients"
  action    String                    // "read"
  labelAr   String
  labelEn   String
  group     String                    // registry group, for the editor's sections
  scopable  Boolean @default(false)   // BRANCH/OWN meaningful for this resource
  roles     RolePermission[]
  @@index([resource])
  @@map("permission")
}

model RolePermission {
  id           String          @id @default(cuid())
  roleId       String
  permissionId String
  scope        PermissionScope @default(ALL)
  role         StaffRole  @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  @@unique([roleId, permissionId])
  @@map("role_permission")
}

model StaffRoleAssignment {           // D1 — multi-role
  id           String   @id @default(cuid())
  staffId      String
  roleId       String
  clinicId     String                 // denormalised for tenant-scoped uniqueness
  isPrimary    Boolean  @default(false)
  assignedById String?
  assignedAt   DateTime @default(now())
  @@unique([staffId, roleId])
  @@map("staff_role_assignment")
}

model PermissionAuditLog {            // every grant/revoke/assignment change
  id         String   @id @default(cuid())
  clinicId   String
  actorId    String?                  // null = SYSTEM
  action     String                   // "role.grant" | "role.revoke" | "staff.assign" | …
  roleId     String?
  staffId    String?
  before     Json?
  after      Json?
  createdAt  DateTime @default(now())
  @@index([clinicId, createdAt])
  @@map("permission_audit_log")
}
```

Additions to existing models:

- `StaffRole` — `isSuperAdmin`, `isSystem`, `description`, `grants RolePermission[]`,
  `assignments StaffRoleAssignment[]`. `permissions String[]` is **kept** through the
  migration as the legacy column and dropped only in Phase 7, after backfill is verified.
- `Clinic` — `rbacVersion Int @default(0)`, bumped on any role/grant/assignment write.
- `Session` — `rbacVersion Int?`, the version the cached snapshot was built from.

## 5. Session propagation (Phase 4) — fixing defect 2

The snapshot stays (it keeps the hot path free of a join), but it becomes
**self-healing** instead of delete-on-change:

1. Any write to a role, grant, or assignment bumps `Clinic.rbacVersion`.
2. The macro reads `rbacVersion` for the active clinic — one indexed column, cached
   in-process behind a short TTL.
3. If `session.rbacVersion !== clinic.rbacVersion`, the macro re-resolves permissions from
   the DB, rewrites the snapshot, and continues. **No logout.**

This also fixes the cases the current `deleteMany` never covered: `roleId` change, branch
move, clinic switch.

## 6. Phases

| Phase | Deliverable | Exit check |
|---|---|---|
| **P1** | Schema + migration + backfill of existing `String[]` grants | Migration Check green in CI |
| **P2** | Resource registry (`src/lib/rbac/`) — every resource, action, group, scopability | Registry covers all 126 controllers; unit test asserts no duplicate/orphan keys |
| **P3** | Pure guard + `requirePermission` macro (primitives only, C-1) | Guard unit tests incl. super-admin bypass ordering (C-4) |
| **P4** | Session propagation + `rbacVersion` invalidation | Test: grant change is visible without re-login |
| **P5** | **Sweep** — every controller gated, scope wired into DAOs | Per-module authorized-passes / unauthorized-403 controller tests |
| **P6** | Roles & permissions UI rendered from the registry | Every registry key reachable in the editor; accounting included |
| **P7** | App-wide ungated-route audit; drop legacy `permissions String[]` | Audit test green over `src/server`, not just accounting |

## 7. Testing rules carried over

- Per CLAUDE.md rule 12, **CI must exercise controllers, not just services**: every gated
  endpoint needs an authorized-passes / unauthorized-403 test. A green service suite says
  nothing about whether a user can reach the feature.
- The ungated-route audit from `src/server/accounting/permissions/ungated-routes.audit.test.ts`
  is generalised to the whole server tree in P7, keeping its `EXEMPT`-needs-a-reason rule.
