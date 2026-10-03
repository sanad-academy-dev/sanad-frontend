// مساعدات عرض مشتركة لشاشات الرواتب — لا منطق احتساب هنا، الاحتساب في الخادم.
import type { PayrollLineResponse, PayrollRunSummary } from "@/server/payroll/payroll.type";
import { formatPeriod } from "@sanad/contracts/runtime/server/payroll/payroll.type";

export { formatPeriod };

// تنسيق المبالغ يتم عبر `useCurrency()` (ADR-0001): العملة من جلسة الأكاديمية،
// فلا يُثبَّت رمز عملة في نص هنا.

export function getInitials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0])
		.join("");
}

// مشكلة محفوظة على السطر كـ JSON — تُقرأ كما كتبها المحرك
export interface LineIssue {
	code: string;
	message: string;
	severity: "error" | "warning";
	blocking: boolean;
}

export const lineIssues = (line: PayrollLineResponse): LineIssue[] =>
	(line.issues as LineIssue[] | null) ?? [];

// القيمة الفعّالة = التجاوز اليدوي إن وُجد، وإلا القيمة المقترحة
export const effectiveOvertime = (line: PayrollLineResponse): number =>
	line.overtimeHoursOverride !== null
		? Number(line.overtimeHoursOverride)
		: Number(line.overtimeHoursSuggested);

export const effectivePayment = (line: PayrollLineResponse) =>
	line.paymentMethodOverride ?? line.paymentMethodSuggested;

export const hasOverride = (line: PayrollLineResponse): boolean =>
	line.overtimeHoursOverride !== null || line.paymentMethodOverride !== null;

// الفترة الحالية بالتقويم الميلادي
export function currentPeriod(): { year: number; month: number } {
	const now = new Date();
	return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

// نطاق أيام الفترة للعرض: "1 يوليو - 31 يوليو"
export function periodRangeLabel(year: number, month: number): string {
	const days = new Date(year, month, 0).getDate();
	const name = formatPeriod(year, month).split(" ")[0];
	return `1 ${name} - ${days} ${name}`;
}

// آخر يوم في الفترة — تاريخ الصرف الافتراضي
export function defaultPayDateLabel(year: number, month: number): string {
	const days = new Date(year, month, 0).getDate();
	return `${days} ${formatPeriod(year, month)}`;
}

export const isRunEditable = (status: PayrollRunSummary["status"]): boolean =>
	status === "DRAFT" || status === "CALCULATED" || status === "PENDING_APPROVAL";
