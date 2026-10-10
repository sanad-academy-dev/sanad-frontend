import Elysia from "elysia";
import type { AccountingAction, AccountingDoctypeKey } from "@/server/accounting/permissions/accounting-permissions";
/**
 * [P0.3] `requireAccounting` — the HTTP boundary of the permission matrix (BRD NFR-5).
 *
 * Supersedes the copy-pasted `requireClinic` macro for accounting controllers: it does
 * everything `requireClinic` does (session + `activeClinicId` → 401, contract C5 tenant
 * scoping) and additionally checks one doctype action → 403, then injects the resolved
 * {@link AccountingActor} so handlers can pass it straight to the lifecycle service.
 *
 * ```ts
 * .use(accountingPermissionsMacro)
 * .get("/", ({ clinicId }) => dao.list(clinicId), {
 *   requireAccounting: { doctype: "account", action: "read" },
 * })
 * ```
 */
export declare const accountingPermissionsMacro: Elysia<"", {
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
        readonly requireAccounting: {
            doctype: AccountingDoctypeKey;
            action: AccountingAction;
        };
    }>;
    macroFn: {
        readonly requireAccounting: (options: {
            doctype: AccountingDoctypeKey;
            action: AccountingAction;
        }) => {
            readonly resolve: ({ request }: {
                request: Request;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
            }, 403> | {
                clinicId: string;
                userId: string;
                actor: import("@/server/accounting/permissions/accounting-permissions.guard").AccountingActor;
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
