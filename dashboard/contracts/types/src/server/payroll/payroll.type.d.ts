import type { Prisma } from "@/generated/prisma/client";
import { AllowanceType, OvertimeBase, PayrollApprovalState, PayrollEarningType, PayrollPaymentMethod, PayrollRunStatus, PayrollRunType, PayrollScope } from "@/generated/prisma/enums";
export { AllowanceType, OvertimeBase, PayrollApprovalState, PayrollEarningType, PayrollPaymentMethod, PayrollRunStatus, PayrollRunType, PayrollScope, };
export declare const payrollRunSummarySelect: {
    id: true;
    code: true;
    type: true;
    status: true;
    periodYear: true;
    periodMonth: true;
    payDate: true;
    scope: true;
    scopeBranchId: true;
    scopeRoleId: true;
    totalGross: true;
    totalEmployeeGosi: true;
    totalCompanyGosi: true;
    totalNet: true;
    totalCompanyCost: true;
    approvedAt: true;
    createdAt: true;
    _count: {
        select: {
            lines: true;
        };
    };
};
export type PayrollRunSummary = Prisma.PayrollRunGetPayload<{
    select: typeof payrollRunSummarySelect;
}>;
export declare const payrollLineSelect: {
    id: true;
    staffId: true;
    staffName: true;
    staffCode: true;
    baseSalary: true;
    allowancesTotal: true;
    overtimeHoursSuggested: true;
    overtimeHoursOverride: true;
    paymentMethodSuggested: true;
    paymentMethodOverride: true;
    note: true;
    overtimePay: true;
    leaveDeduction: true;
    grossEarnings: true;
    gosiBase: true;
    employeeGosi: true;
    companyGosi: true;
    netPay: true;
    companyCost: true;
    issues: true;
    excluded: true;
    earnings: {
        select: {
            id: true;
            type: true;
            amount: true;
            note: true;
        };
    };
};
export type PayrollLineResponse = Prisma.PayrollLineGetPayload<{
    select: typeof payrollLineSelect;
}>;
export declare const payrollRunDetailSelect: {
    distribution: true;
    lines: {
        select: {
            id: true;
            staffId: true;
            staffName: true;
            staffCode: true;
            baseSalary: true;
            allowancesTotal: true;
            overtimeHoursSuggested: true;
            overtimeHoursOverride: true;
            paymentMethodSuggested: true;
            paymentMethodOverride: true;
            note: true;
            overtimePay: true;
            leaveDeduction: true;
            grossEarnings: true;
            gosiBase: true;
            employeeGosi: true;
            companyGosi: true;
            netPay: true;
            companyCost: true;
            issues: true;
            excluded: true;
            earnings: {
                select: {
                    id: true;
                    type: true;
                    amount: true;
                    note: true;
                };
            };
        };
        orderBy: {
            staffName: "asc";
        };
    };
    approvalSteps: {
        select: {
            id: true;
            order: true;
            title: true;
            state: true;
            actedAt: true;
            comment: true;
            approver: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
        orderBy: {
            order: "asc";
        };
    };
    id: true;
    code: true;
    type: true;
    status: true;
    periodYear: true;
    periodMonth: true;
    payDate: true;
    scope: true;
    scopeBranchId: true;
    scopeRoleId: true;
    totalGross: true;
    totalEmployeeGosi: true;
    totalCompanyGosi: true;
    totalNet: true;
    totalCompanyCost: true;
    approvedAt: true;
    createdAt: true;
    _count: {
        select: {
            lines: true;
        };
    };
};
export type PayrollRunDetail = Prisma.PayrollRunGetPayload<{
    select: typeof payrollRunDetailSelect;
}>;
export declare const RUN_STATUS_LABEL: Record<PayrollRunStatus, string>;
export declare const EARNING_TYPE_LABEL: Record<PayrollEarningType, string>;
export declare const SCOPE_LABEL: Record<PayrollScope, string>;
export declare const ARABIC_MONTHS: readonly ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
export declare const formatPeriod: (year: number, month: number) => string;
