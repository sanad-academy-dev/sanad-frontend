import type { AllowanceType, OvertimeBase } from "@/generated/prisma/enums";
export declare const MONTHLY_DIVISOR = 30;
export declare const DAILY_HOURS = 8;
export declare const DEFAULT_PAYROLL_SETTINGS: PayrollCalcSettings;
export interface PayrollCalcSettings {
    gosiSaudiEmployeeRate: number;
    gosiSaudiCompanyRate: number;
    gosiNonSaudiEmployeeRate: number;
    gosiNonSaudiCompanyRate: number;
    gosiCeiling: number;
    overtimeBase: OvertimeBase;
    overtimeMultiplier: number;
}
export interface PayrollCalcAllowance {
    type: AllowanceType;
    amount: number;
}
export interface PayrollCalcLeave {
    slug: string;
    days: number;
    payPercent: number;
}
export interface PayrollCalcInput {
    staffId: string;
    name: string;
    isSaudi: boolean;
    isActive: boolean;
    hireDate: Date | null;
    compensation: {
        baseSalary: number;
        allowances: PayrollCalcAllowance[];
    } | null;
    period: {
        year: number;
        month: number;
    };
    leaves: PayrollCalcLeave[];
    overtimeHours: number;
    attendanceRecordCount: number;
    deductions?: PayrollCalcDeduction[];
}
export interface PayrollCalcDeduction {
    amount: number;
    sourceExpenseId?: string | null;
}
export type PayrollIssueCode = "MISSING_COMPENSATION" | "ZERO_BASE_SALARY" | "HIRED_AFTER_PERIOD" | "NO_ATTENDANCE_RECORDS" | "UNKNOWN_LEAVE_TYPE" | "INACTIVE_STAFF" | "NEGATIVE_NET";
export interface PayrollCalcIssue {
    code: PayrollIssueCode;
    message: string;
    severity: "error" | "warning";
    blocking: boolean;
}
export interface PayrollCalcResult {
    staffId: string;
    name: string;
    status: "CALCULATED" | "EXCLUDED";
    workedDays: number;
    baseSalary: number;
    allowancesTotal: number;
    overtimePay: number;
    unpaidLeaveDeduction: number;
    grossEarnings: number;
    gosiBase: number;
    employeeGosi: number;
    companyGosi: number;
    deductionsTotal: number;
    netPay: number;
    companyCost: number;
    issues: PayrollCalcIssue[];
}
export declare function periodBounds(period: {
    year: number;
    month: number;
}): {
    start: Date;
    end: Date;
};
export declare function clipDaysToPeriod(start: Date, end: Date, periodStart: Date, periodEnd: Date): number;
export declare function calculatePayrollLine(input: PayrollCalcInput, settings: PayrollCalcSettings): PayrollCalcResult;
