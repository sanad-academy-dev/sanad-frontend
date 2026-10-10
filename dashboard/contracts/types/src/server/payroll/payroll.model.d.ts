import Elysia from "elysia";
export declare const payrollModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "payroll.run.create": import("@sinclair/typebox").TObject<{
            periodYear: import("@sinclair/typebox").TInteger;
            periodMonth: import("@sinclair/typebox").TInteger;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"REGULAR">, import("@sinclair/typebox").TLiteral<"OFF_CYCLE">]>>;
            scope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TLiteral<"BRANCH">, import("@sinclair/typebox").TLiteral<"DEPARTMENT">, import("@sinclair/typebox").TLiteral<"CONTRACT">, import("@sinclair/typebox").TLiteral<"SPECIFIC">]>>;
            scopeBranchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            scopeRoleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            payDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "payroll.run.offCycle": import("@sinclair/typebox").TObject<{
            periodYear: import("@sinclair/typebox").TInteger;
            periodMonth: import("@sinclair/typebox").TInteger;
            payDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            reason: import("@sinclair/typebox").TString;
            lines: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                staffId: import("@sinclair/typebox").TString;
                type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALLOWANCE">, import("@sinclair/typebox").TLiteral<"BONUS">, import("@sinclair/typebox").TLiteral<"COMMISSION">, import("@sinclair/typebox").TLiteral<"EXPENSE_REIMBURSEMENT">]>;
                amount: import("@sinclair/typebox").TNumber;
                note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>;
        }>;
        readonly "payroll.run.calculate": import("@sinclair/typebox").TObject<{
            confirmRemovals: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "payroll.line.update": import("@sinclair/typebox").TObject<{
            overtimeHoursOverride: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            paymentMethodOverride: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TRANSFER">, import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"CHECK">]>]>>;
            note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            excluded: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "payroll.earning.create": import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALLOWANCE">, import("@sinclair/typebox").TLiteral<"BONUS">, import("@sinclair/typebox").TLiteral<"COMMISSION">, import("@sinclair/typebox").TLiteral<"EXPENSE_REIMBURSEMENT">]>;
            amount: import("@sinclair/typebox").TNumber;
            note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
    };
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
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
