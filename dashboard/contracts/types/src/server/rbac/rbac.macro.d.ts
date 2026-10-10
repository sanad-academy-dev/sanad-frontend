import Elysia from "elysia";
import type { PermissionScope } from "@/lib/rbac/rbac-registry";
/**
 * [RBAC P3] `requirePermission` — the HTTP boundary of the permission catalogue.
 *
 * Supersedes the ~83 copy-pasted `requireClinic` blocks: it does everything they did
 * (session + `activeClinicId` → 401, tenant scoping) and additionally checks one
 * resource/action pair → 403, then injects the resolved scope so the handler can filter.
 *
 * ```ts
 * .use(rbacMacro)
 * .get("/", ({ clinicId, scopeKind, scopeBranchId, scopeStaffId }) =>
 *     dao.list(clinicId, toScope(scopeKind, scopeBranchId, scopeStaffId)), {
 *   requirePermission: { resource: "patients", action: "read" },
 * })
 * ```
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * CONSTRAINT C-1 — THE RESOLVED CONTEXT CARRIES PRIMITIVES ONLY.
 *
 * An object, union, or function placed in a macro's resolved context propagates into every
 * route's inferred type and blows TypeScript's instantiation-depth ceiling. The error then
 * surfaces as **TS2589 in `src/server/app.ts`** — nowhere near the file that caused it,
 * which is why it has cost this repo real time in eight separate modules already.
 *
 * So: flat strings, booleans and `string | null` here; handlers rebuild the scope object
 * locally with {@link toScope}. Do not "tidy" this into a single `scope` object.
 * ─────────────────────────────────────────────────────────────────────────────────────
 */
/** The reassembled scope a DAO filters by. `null` = clinic-wide, no row filter. */
export type RbacScope = null | {
    branchId: string | null;
} | {
    staffId: string | null;
};
/** A branch-only scope, matching the `BranchScope` shape DAOs already use. */
export type BranchScope = {
    branchId: string | null;
} | null;
/** An owner-only scope, for resources filtered by the acting staff member. */
export type OwnScope = {
    staffId: string | null;
} | null;
/**
 * Rebuild the scope object inside a handler from the macro's flat primitives. These live
 * here rather than in the macro context because a FUNCTION in that context is itself a
 * C-1 violation.
 *
 * Prefer the narrow {@link toBranchScope} / {@link toOwnScope} at call sites: a DAO that
 * only knows how to filter by branch should not be handed a union it cannot represent.
 */
export declare function toScope(scopeKind: string, scopeBranchId: string | null, scopeStaffId: string | null): RbacScope;
export declare function toBranchScope(scopeKind: string, scopeBranchId: string | null): BranchScope;
export declare function toOwnScope(scopeKind: string, scopeStaffId: string | null): OwnScope;
export declare const rbacMacro: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requirePermission: {
            resource: string;
            action: string;
            /**
             * Minimum breadth the endpoint needs. Omit for row-filtered list/detail routes
             * (any scope is fine, the DAO narrows). Set `"ALL"` on routes that inherently
             * span the clinic — a cross-branch report must 403 rather than quietly answer
             * with one branch's numbers.
             */
            minimumScope?: PermissionScope;
        };
    }>;
    macroFn: {
        readonly requirePermission: (options: {
            resource: string;
            action: string;
            /**
             * Minimum breadth the endpoint needs. Omit for row-filtered list/detail routes
             * (any scope is fine, the DAO narrows). Set `"ALL"` on routes that inherently
             * span the clinic — a cross-branch report must 403 rather than quietly answer
             * with one branch's numbers.
             */
            minimumScope?: PermissionScope;
        }) => {
            readonly resolve: ({ request }: {
                request: Request;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
            }, 403> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
            }, 403> | {
                clinicId: string;
                userId: string;
                staffId: string | null;
                branchId: string | null;
                isSuperAdmin: boolean;
                scopeKind: string;
                scopeBranchId: string | null;
                scopeStaffId: string | null;
            }>;
        };
    };
    parser: {};
    response: {};
}, {}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
