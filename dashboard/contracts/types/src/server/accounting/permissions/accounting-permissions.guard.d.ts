import { type AccountingAction, type AccountingDoctypeKey } from "@/server/accounting/permissions/accounting-permissions";
/**
 * [P0.3] Enforcement for the accounting permission matrix (BRD NFR-5).
 *
 * Accounting authority is checked in two places on purpose:
 *  - at the HTTP boundary via the `requireAccounting` macro
 *    (`accounting-permissions.macro.ts`), which answers 401/403 before a handler runs, and
 *  - inside the voucher lifecycle service, so *every* caller of
 *    submit/cancel/amend/update — HTTP, background job (P0.5), or an existing-module
 *    posting adapter (contract C3) — passes the same gate. A ledger must not be one
 *    forgotten route away from an unauthorised posting.
 *
 * Fail-closed: an actor is never assumed privileged. Non-interactive callers must state so
 * explicitly with {@link SYSTEM_ACTOR}.
 *
 * Kept free of `elysia`/`auth` imports so the lifecycle service and its unit tests can
 * depend on it without dragging in the HTTP layer; the macro file owns that wiring.
 */
/**
 * Actor kinds. `ADMIN`/`MEMBER` mirror the repo's per-clinic `Role`; `SYSTEM` is the
 * non-interactive caller (queued jobs per AR-7, posting adapters) which acts with the
 * engine's own authority and carries no user permissions.
 */
export type AccountingActorRole = "ADMIN" | "MEMBER" | "SYSTEM";
export type AccountingActor = {
    userId: string | null;
    role: AccountingActorRole;
    permissions: readonly string[];
};
/** The engine's own actor for background jobs and posting adapters. */
export declare const SYSTEM_ACTOR: AccountingActor;
/** Authorisation failure — mapped to HTTP 403 in `src/server/app.ts`. */
export declare class AccountingPermissionError extends Error {
    constructor(message: string);
}
/** `Session.permissions` is a JSON-stringified string[] (MEMBER only) — parse defensively. */
export declare function parseSessionPermissions(raw: string | null | undefined): string[];
export declare function toAccountingActor(session: {
    userId?: string | null;
    role?: string | null;
    permissions?: string | null;
}): AccountingActor;
/**
 * ADMIN and SYSTEM hold every accounting permission — the same rule the rest of the app
 * already applies (`usePermissions`, `auth` seeds the admin staff role with
 * `ALL_PERMISSIONS`). MEMBERs hold exactly what their staff role grants.
 */
export declare function hasAccountingPermission(actor: AccountingActor, permission: string): boolean;
export declare function assertAccountingPermission(actor: AccountingActor, permission: string, labelAr?: string): void;
export declare const ACTION_LABEL_AR: Record<AccountingAction, string>;
export declare function canOnDoctype(actor: AccountingActor, doctype: AccountingDoctypeKey, action: AccountingAction): boolean;
/**
 * Assert a doctype action. An action the doctype does not support (submitting a master,
 * writing a ledger) is a programming error, not a permission the operator can be granted —
 * it fails loudly rather than resolving to "denied".
 */
export declare function assertCanOnDoctype(actor: AccountingActor, doctype: AccountingDoctypeKey, action: AccountingAction): void;
