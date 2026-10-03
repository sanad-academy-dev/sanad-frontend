import type { Prisma } from "@/generated/prisma/client";
import {
	AllowanceType,
	OvertimeBase,
	PayrollApprovalState,
	PayrollEarningType,
	PayrollPaymentMethod,
	PayrollRunStatus,
	PayrollRunType,
	PayrollScope,
} from "@/generated/prisma/enums";

export {
	AllowanceType,
	OvertimeBase,
	PayrollApprovalState,
	PayrollEarningType,
	PayrollPaymentMethod,
	PayrollRunStatus,
	PayrollRunType,
	PayrollScope,
};

export const payrollRunSummarySelect = {
	id: true,
	code: true,
	type: true,
	status: true,
	periodYear: true,
	periodMonth: true,
	payDate: true,
	scope: true,
	scopeBranchId: true,
	scopeRoleId: true,
	totalGross: true,
	totalEmployeeGosi: true,
	totalCompanyGosi: true,
	totalNet: true,
	totalCompanyCost: true,
	approvedAt: true,
	createdAt: true,
	_count: { select: { lines: true } },
} satisfies Prisma.PayrollRunSelect;

export type PayrollRunSummary = Prisma.PayrollRunGetPayload<{
	select: typeof payrollRunSummarySelect;
}>;

export const payrollLineSelect = {
	id: true,
	staffId: true,
	staffName: true,
	staffCode: true,
	baseSalary: true,
	allowancesTotal: true,
	overtimeHoursSuggested: true,
	overtimeHoursOverride: true,
	paymentMethodSuggested: true,
	paymentMethodOverride: true,
	note: true,
	overtimePay: true,
	leaveDeduction: true,
	grossEarnings: true,
	gosiBase: true,
	employeeGosi: true,
	companyGosi: true,
	netPay: true,
	companyCost: true,
	issues: true,
	excluded: true,
	earnings: { select: { id: true, type: true, amount: true, note: true } },
} satisfies Prisma.PayrollLineSelect;

export type PayrollLineResponse = Prisma.PayrollLineGetPayload<{
	select: typeof payrollLineSelect;
}>;

export const payrollRunDetailSelect = {
	...payrollRunSummarySelect,
	distribution: true,
	lines: { select: payrollLineSelect, orderBy: { staffName: "asc" } },
	approvalSteps: {
		select: {
			id: true,
			order: true,
			title: true,
			state: true,
			actedAt: true,
			comment: true,
			approver: { select: { id: true, name: true } },
		},
		orderBy: { order: "asc" },
	},
} satisfies Prisma.PayrollRunSelect;

export type PayrollRunDetail = Prisma.PayrollRunGetPayload<{
	select: typeof payrollRunDetailSelect;
}>;

// ─── تسميات العرض ─────────────────────────────────────────────

export const RUN_STATUS_LABEL: Record<PayrollRunStatus, string> = {
	DRAFT: "مسودة",
	CALCULATED: "تم الاحتساب",
	PENDING_APPROVAL: "بانتظار الاعتماد",
	APPROVED: "معتمد",
	PAID: "تم الصرف",
	CANCELLED: "ملغى",
};

export const EARNING_TYPE_LABEL: Record<PayrollEarningType, string> = {
	ALLOWANCE: "بدلات",
	BONUS: "مكافآت",
	COMMISSION: "عمولات",
	EXPENSE_REIMBURSEMENT: "تعويض مصاريف",
};

export const SCOPE_LABEL: Record<PayrollScope, string> = {
	ALL: "جميع الموظفين",
	BRANCH: "فرع معيّن",
	DEPARTMENT: "قسم معيّن",
	CONTRACT: "نوع عقد معيّن",
	SPECIFIC: "موظفون محدّدون",
};

export const ARABIC_MONTHS = [
	"يناير",
	"فبراير",
	"مارس",
	"أبريل",
	"مايو",
	"يونيو",
	"يوليو",
	"أغسطس",
	"سبتمبر",
	"أكتوبر",
	"نوفمبر",
	"ديسمبر",
] as const;

export const formatPeriod = (year: number, month: number): string =>
	`${ARABIC_MONTHS[month - 1]} ${year}`;
