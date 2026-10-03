import type { PayrollEarningType, PayrollPaymentMethod, PayrollRunStatus, PayrollRunType, PayrollScope } from "@/generated/prisma/enums";
import { DEFAULT_PAYROLL_SETTINGS, type PayrollCalcInput, type PayrollCalcSettings } from "@/server/payroll/payroll-calc";
export interface PayrollPeriod {
    year: number;
    month: number;
}
export interface PayrollGatheredRow extends PayrollCalcInput {
    staffCode: string;
    defaultPaymentMethod: PayrollPaymentMethod;
    totalHours: number;
}
export declare class RunLockedError extends Error {
    constructor(status: PayrollRunStatus);
}
export declare class BlockingIssuesError extends Error {
    constructor(count: number);
}
export interface PendingRemoval {
    staffId: string;
    staffName: string;
    reasons: ("override" | "note" | "earnings")[];
}
export declare class ActiveRunExistsError extends Error {
    constructor();
}
export interface CreatePayrollRunInput {
    periodYear: number;
    periodMonth: number;
    type?: PayrollRunType;
    scope?: PayrollScope;
    scopeBranchId?: string | null;
    scopeRoleId?: string | null;
    payDate?: Date | null;
}
export interface OffCycleLineInput {
    staffId: string;
    type: PayrollEarningType;
    amount: number;
    note?: string | null;
}
export interface OffCycleRunInput {
    periodYear: number;
    periodMonth: number;
    payDate?: Date | null;
    reason: string;
    lines: OffCycleLineInput[];
}
export declare const payrollDao: {
    findActiveRegular(clinicId: string, periodYear: number, periodMonth: number): Promise<{
        id: string;
        code: string;
        status: PayrollRunStatus;
    } | null>;
    createRun(clinicId: string, createdById: string | null, input: CreatePayrollRunInput): Promise<{
        type: PayrollRunType;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        scope: PayrollScope;
        status: PayrollRunStatus;
        cancelledAt: Date | null;
        paidAt: Date | null;
        distribution: import("@prisma/client/runtime/client").JsonValue | null;
        scopeBranchId: string | null;
        approvedAt: Date | null;
        periodYear: number;
        periodMonth: number;
        payDate: Date | null;
        scopeRoleId: string | null;
        totalGross: import("@prisma/client-runtime-utils").Decimal | null;
        totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalNet: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
    }>;
    createOffCycleRun(clinicId: string, createdById: string | null, input: OffCycleRunInput): Promise<"invalid-staff" | {
        type: PayrollRunType;
        id: string;
        createdAt: Date;
        _count: {
            lines: number;
        };
        code: string;
        scope: PayrollScope;
        status: PayrollRunStatus;
        scopeBranchId: string | null;
        approvedAt: Date | null;
        periodYear: number;
        periodMonth: number;
        payDate: Date | null;
        scopeRoleId: string | null;
        totalGross: import("@prisma/client-runtime-utils").Decimal | null;
        totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalNet: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
    }>;
    approveRun(clinicId: string, runId: string, userId: string | null): Promise<{
        type: PayrollRunType;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        scope: PayrollScope;
        status: PayrollRunStatus;
        cancelledAt: Date | null;
        paidAt: Date | null;
        distribution: import("@prisma/client/runtime/client").JsonValue | null;
        scopeBranchId: string | null;
        approvedAt: Date | null;
        periodYear: number;
        periodMonth: number;
        payDate: Date | null;
        scopeRoleId: string | null;
        totalGross: import("@prisma/client-runtime-utils").Decimal | null;
        totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalNet: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
    } | null>;
    markPaid(clinicId: string, runId: string): Promise<{
        type: PayrollRunType;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        scope: PayrollScope;
        status: PayrollRunStatus;
        cancelledAt: Date | null;
        paidAt: Date | null;
        distribution: import("@prisma/client/runtime/client").JsonValue | null;
        scopeBranchId: string | null;
        approvedAt: Date | null;
        periodYear: number;
        periodMonth: number;
        payDate: Date | null;
        scopeRoleId: string | null;
        totalGross: import("@prisma/client-runtime-utils").Decimal | null;
        totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalNet: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
    } | null>;
    cancelRun(clinicId: string, runId: string): Promise<{
        type: PayrollRunType;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        scope: PayrollScope;
        status: PayrollRunStatus;
        cancelledAt: Date | null;
        paidAt: Date | null;
        distribution: import("@prisma/client/runtime/client").JsonValue | null;
        scopeBranchId: string | null;
        approvedAt: Date | null;
        periodYear: number;
        periodMonth: number;
        payDate: Date | null;
        scopeRoleId: string | null;
        totalGross: import("@prisma/client-runtime-utils").Decimal | null;
        totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalNet: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
    } | null>;
    settings(clinicId: string): Promise<PayrollCalcSettings>;
    gatherInputs(clinicId: string, period: PayrollPeriod, staffIds?: string[], forRunId?: string): Promise<PayrollGatheredRow[]>;
    calculateRun(clinicId: string, runId: string, options?: {
        confirmRemovals?: boolean;
    }): Promise<{
        status: "NEEDS_CONFIRMATION";
        removals: PendingRemoval[];
    } | {
        status: "CALCULATED";
        lineCount: number;
        removedCount: number;
    }>;
    resolveScope(clinicId: string, run: {
        scope: PayrollScope;
        scopeBranchId: string | null;
        scopeRoleId: string | null;
    }): Promise<string[] | undefined>;
    clearOverride(clinicId: string, lineId: string, field: "overtimeHours" | "paymentMethod"): Promise<{
        issues: import("@prisma/client/runtime/client").JsonValue | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        staffId: string;
        note: string | null;
        runId: string;
        staffName: string;
        staffCode: string;
        baseSalary: import("@prisma/client-runtime-utils").Decimal;
        allowancesTotal: import("@prisma/client-runtime-utils").Decimal;
        overtimeHoursSuggested: import("@prisma/client-runtime-utils").Decimal;
        overtimeHoursOverride: import("@prisma/client-runtime-utils").Decimal | null;
        paymentMethodSuggested: PayrollPaymentMethod;
        paymentMethodOverride: PayrollPaymentMethod | null;
        overtimePay: import("@prisma/client-runtime-utils").Decimal;
        leaveDeduction: import("@prisma/client-runtime-utils").Decimal;
        grossEarnings: import("@prisma/client-runtime-utils").Decimal;
        gosiBase: import("@prisma/client-runtime-utils").Decimal;
        employeeGosi: import("@prisma/client-runtime-utils").Decimal;
        companyGosi: import("@prisma/client-runtime-utils").Decimal;
        netPay: import("@prisma/client-runtime-utils").Decimal;
        companyCost: import("@prisma/client-runtime-utils").Decimal;
        excluded: boolean;
    } | null>;
};
export declare const payrollReadDao: {
    listRuns(clinicId: string): Promise<{
        type: PayrollRunType;
        id: string;
        createdAt: Date;
        _count: {
            lines: number;
        };
        code: string;
        scope: PayrollScope;
        status: PayrollRunStatus;
        scopeBranchId: string | null;
        approvedAt: Date | null;
        periodYear: number;
        periodMonth: number;
        payDate: Date | null;
        scopeRoleId: string | null;
        totalGross: import("@prisma/client-runtime-utils").Decimal | null;
        totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalNet: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
    }[]>;
    findRunForPeriod(clinicId: string, year: number, month: number): Promise<{
        type: PayrollRunType;
        id: string;
        createdAt: Date;
        _count: {
            lines: number;
        };
        code: string;
        scope: PayrollScope;
        status: PayrollRunStatus;
        scopeBranchId: string | null;
        approvedAt: Date | null;
        periodYear: number;
        periodMonth: number;
        payDate: Date | null;
        scopeRoleId: string | null;
        totalGross: import("@prisma/client-runtime-utils").Decimal | null;
        totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalNet: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
    } | null>;
    getRun(clinicId: string, runId: string): Promise<{
        type: PayrollRunType;
        id: string;
        createdAt: Date;
        _count: {
            lines: number;
        };
        code: string;
        scope: PayrollScope;
        status: PayrollRunStatus;
        lines: {
            issues: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            staffId: string;
            note: string | null;
            staffName: string;
            staffCode: string;
            baseSalary: import("@prisma/client-runtime-utils").Decimal;
            allowancesTotal: import("@prisma/client-runtime-utils").Decimal;
            overtimeHoursSuggested: import("@prisma/client-runtime-utils").Decimal;
            overtimeHoursOverride: import("@prisma/client-runtime-utils").Decimal | null;
            paymentMethodSuggested: PayrollPaymentMethod;
            paymentMethodOverride: PayrollPaymentMethod | null;
            overtimePay: import("@prisma/client-runtime-utils").Decimal;
            leaveDeduction: import("@prisma/client-runtime-utils").Decimal;
            grossEarnings: import("@prisma/client-runtime-utils").Decimal;
            gosiBase: import("@prisma/client-runtime-utils").Decimal;
            employeeGosi: import("@prisma/client-runtime-utils").Decimal;
            companyGosi: import("@prisma/client-runtime-utils").Decimal;
            netPay: import("@prisma/client-runtime-utils").Decimal;
            companyCost: import("@prisma/client-runtime-utils").Decimal;
            excluded: boolean;
            earnings: {
                type: PayrollEarningType;
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                note: string | null;
            }[];
        }[];
        distribution: import("@prisma/client/runtime/client").JsonValue;
        scopeBranchId: string | null;
        approvedAt: Date | null;
        periodYear: number;
        periodMonth: number;
        payDate: Date | null;
        scopeRoleId: string | null;
        totalGross: import("@prisma/client-runtime-utils").Decimal | null;
        totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
        totalNet: import("@prisma/client-runtime-utils").Decimal | null;
        totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
        approvalSteps: {
            id: string;
            title: string;
            comment: string | null;
            order: number;
            state: import("@/generated/prisma/enums").PayrollApprovalState;
            actedAt: Date | null;
            approver: {
                name: string;
                id: string;
            } | null;
        }[];
    } | null>;
    previousApprovedNet(clinicId: string, year: number, month: number): Promise<Map<string, number> | null>;
    updateLine(clinicId: string, lineId: string, data: {
        overtimeHoursOverride?: number | null;
        paymentMethodOverride?: PayrollPaymentMethod | null;
        note?: string | null;
        excluded?: boolean;
    }): Promise<{
        issues: import("@prisma/client/runtime/client").JsonValue | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        staffId: string;
        note: string | null;
        runId: string;
        staffName: string;
        staffCode: string;
        baseSalary: import("@prisma/client-runtime-utils").Decimal;
        allowancesTotal: import("@prisma/client-runtime-utils").Decimal;
        overtimeHoursSuggested: import("@prisma/client-runtime-utils").Decimal;
        overtimeHoursOverride: import("@prisma/client-runtime-utils").Decimal | null;
        paymentMethodSuggested: PayrollPaymentMethod;
        paymentMethodOverride: PayrollPaymentMethod | null;
        overtimePay: import("@prisma/client-runtime-utils").Decimal;
        leaveDeduction: import("@prisma/client-runtime-utils").Decimal;
        grossEarnings: import("@prisma/client-runtime-utils").Decimal;
        gosiBase: import("@prisma/client-runtime-utils").Decimal;
        employeeGosi: import("@prisma/client-runtime-utils").Decimal;
        companyGosi: import("@prisma/client-runtime-utils").Decimal;
        netPay: import("@prisma/client-runtime-utils").Decimal;
        companyCost: import("@prisma/client-runtime-utils").Decimal;
        excluded: boolean;
    } | null>;
    addEarning(clinicId: string, lineId: string, data: {
        type: PayrollEarningType;
        amount: number;
        note?: string | null;
    }): Promise<{
        type: PayrollEarningType;
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        lineId: string;
    } | null>;
    leaveBreakdown(clinicId: string, runId: string): Promise<{
        types: {
            slug: string;
            name: string;
        }[];
        rows: {
            staffId: string;
            staffName: string;
            leaves: {
                slug: string;
                name: string;
                payPercent: number;
                periodDays: number;
                remaining: number | null;
                entitlementDays: number | null;
            }[];
        }[];
    } | null>;
    removeEarning(clinicId: string, earningId: string): Promise<{
        type: PayrollEarningType;
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        lineId: string;
    } | null>;
};
export declare const effectiveOvertimeHours: (line: {
    overtimeHoursOverride: unknown;
    overtimeHoursSuggested: unknown;
}) => number;
export declare const effectivePaymentMethod: (line: {
    paymentMethodOverride: PayrollPaymentMethod | null;
    paymentMethodSuggested: PayrollPaymentMethod;
}) => PayrollPaymentMethod;
export { DEFAULT_PAYROLL_SETTINGS };
