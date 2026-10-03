// أنواع ومعطيات محاكاة لمعالج تشغيل مسير الرواتب (Payroll Run Wizard).
// واجهة فقط — لا يوجد موديل Prisma للرواتب بعد، فكل الحسابات محاكاة محلية.
import type { StaffResponse } from "@/server/staff/staff.type";

// نطاق تشغيل المسير
export type PayrollScope = "ALL" | "BRANCH" | "DEPARTMENT" | "CONTRACT" | "SPECIFIC";

// دورة حياة حالة الموظف داخل المسير
export type PayrollLineStatus =
	| "PENDING" // قيد الانتظار
	| "VALIDATED" // تم التحقق
	| "CALCULATED" // تم الاحتساب
	| "AWAITING_APPROVAL" // بانتظار الاعتماد
	| "APPROVED" // معتمد
	| "READY_TO_PAY" // جاهز للصرف
	| "PAID"; // تم الصرف

export type PayrollIssueSeverity = "warning" | "error";
export type PayrollIssueAction = "edit" | "review";

// سطر راتب موظف (محسوب)
export interface PayrollLine {
	id: string;
	name: string;
	code: string;
	baseSalary: number;
	allowances: number; // البدلات
	overtime: number; // العمل الإضافي
	bonuses: number; // المكافآت
	advances: number; // السلف
	penalties: number; // الجزاءات
	deductions: number; // الاستقطاعات (تأمينات/ضرائب)
	net: number; // الصافي
	prevNet: number; // صافي الشهر السابق (لكشف الفروقات)
	status: PayrollLineStatus;
}

// مشكلة اكتُشفت أثناء التحقق قبل الاعتماد
export interface PayrollIssue {
	id: string;
	label: string; // "لا يوجد IBAN"
	employeeName: string;
	severity: PayrollIssueSeverity;
	action: PayrollIssueAction;
}

// تنبيه ذكاء اصطناعي (محاكاة) في مرحلة الملخص
export interface PayrollAiInsight {
	id: string;
	tone: "warning" | "info" | "success";
	title: string;
}

// إجماليات المسير
export interface PayrollSummary {
	employeeCount: number;
	totalBase: number;
	totalAllowances: number;
	totalOvertime: number;
	totalDeductions: number;
	totalAdvances: number;
	netTotal: number;
}

// خطوة اعتماد ضمن سلسلة الموافقات
export interface PayrollApprovalStage {
	id: string;
	role: string; // "مدير الموارد البشرية"
	person: string;
	initials: string;
}

// ─── خرائط العرض (تسميات + ألوان) ─────────────────────────────

export const SCOPE_OPTIONS: { value: PayrollScope; label: string }[] = [
	{ value: "ALL", label: "جميع الموظفين" },
	{ value: "BRANCH", label: "فرع معيّن" },
	{ value: "DEPARTMENT", label: "قسم معيّن" },
	{ value: "CONTRACT", label: "نوع عقد معيّن" },
	{ value: "SPECIFIC", label: "موظفون محدّدون" },
];

export const LINE_STATUS_LABEL: Record<PayrollLineStatus, string> = {
	PENDING: "قيد الانتظار",
	VALIDATED: "تم التحقق",
	CALCULATED: "تم الاحتساب",
	AWAITING_APPROVAL: "بانتظار الاعتماد",
	APPROVED: "معتمد",
	READY_TO_PAY: "جاهز للصرف",
	PAID: "تم الصرف",
};

// لون الشارة لكل حالة: [نص, خلفية, نقطة]
export const LINE_STATUS_STYLE: Record<
	PayrollLineStatus,
	{ text: string; bg: string; dot: string }
> = {
	PENDING: { text: "#A16207", bg: "#FEF9C3", dot: "#EAB308" },
	VALIDATED: { text: "#1D4ED8", bg: "#DBEAFE", dot: "#3B82F6" },
	CALCULATED: { text: "#4338CA", bg: "#E0E7FF", dot: "#6366F1" },
	AWAITING_APPROVAL: { text: "#9A3412", bg: "#FFEDD5", dot: "#F97316" },
	APPROVED: { text: "#166534", bg: "#DCFCE7", dot: "#22C55E" },
	READY_TO_PAY: { text: "#0F766E", bg: "#CCFBF1", dot: "#14B8A6" },
	PAID: { text: "#065F46", bg: "#D1FAE5", dot: "#10B981" },
};

// ─── مولّدات المحاكاة ─────────────────────────────────────────

// تجزئة بسيطة ثابتة من نص → عدد (لتوليد قيم محاكاة حتمية بلا Math.random)
function hash(str: string): number {
	let h = 0;
	for (let i = 0; i < str.length; i++) {
		h = (h << 5) - h + str.charCodeAt(i);
		h |= 0;
	}
	return Math.abs(h);
}

// تنسيق مبلغ بالريال السعودي: "1,250,000 ر.س"
export function fmtSar(n: number): string {
	return `${Math.round(n).toLocaleString("en-US")} ر.س`;
}

export function getInitials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0])
		.join("");
}

// يولّد سطر راتب حتمي من بيانات الموظف (نفس الموظف ⇒ نفس القيم دائمًا)
export function buildPayrollLine(
	staff: Pick<StaffResponse, "id" | "name" | "code">,
): PayrollLine {
	const h = hash(staff.id || staff.code || staff.name);
	const baseSalary = 8000 + (h % 17) * 1000; // 8000 – 24000
	const allowances = 1000 + (h % 7) * 500; // 1000 – 4000
	const overtime = (h % 5) * 300; // 0 – 1200
	const bonuses = (h % 4) * 500; // 0 – 1500
	const advances = (h % 6) * 400; // 0 – 2000
	const penalties = (h % 9 === 0 ? 1 : 0) * 300;
	const deductions = Math.round(baseSalary * 0.0975); // تأمينات ~9.75%
	const net = baseSalary + allowances + overtime + bonuses - advances - penalties - deductions;
	// صافي الشهر السابق: انحراف بسيط حتمي لإظهار الفروقات
	const drift = ((h % 21) - 8) / 100; // -8% .. +12%
	const prevNet = Math.max(0, Math.round(net / (1 + drift)));
	return {
		id: staff.id,
		name: staff.name,
		code: staff.code,
		baseSalary,
		allowances,
		overtime,
		bonuses,
		advances,
		penalties,
		deductions,
		net,
		prevNet,
		status: "PENDING",
	};
}

export function buildSummary(lines: PayrollLine[]): PayrollSummary {
	return lines.reduce<PayrollSummary>(
		(acc, l) => ({
			employeeCount: acc.employeeCount + 1,
			totalBase: acc.totalBase + l.baseSalary,
			totalAllowances: acc.totalAllowances + l.allowances,
			totalOvertime: acc.totalOvertime + l.overtime,
			totalDeductions: acc.totalDeductions + l.deductions + l.penalties,
			totalAdvances: acc.totalAdvances + l.advances,
			netTotal: acc.netTotal + l.net,
		}),
		{
			employeeCount: 0,
			totalBase: 0,
			totalAllowances: 0,
			totalOvertime: 0,
			totalDeductions: 0,
			totalAdvances: 0,
			netTotal: 0,
		},
	);
}

// قوالب المشاكل المحتملة أثناء التحقق
const ISSUE_TEMPLATES: {
	label: string;
	severity: PayrollIssueSeverity;
	action: PayrollIssueAction;
}[] = [
	{ label: "لا يوجد IBAN للحساب البنكي", severity: "error", action: "edit" },
	{ label: "عقد الموظف منتهي", severity: "warning", action: "review" },
	{ label: "الراتب الأساسي فارغ", severity: "error", action: "edit" },
	{ label: "خصم أكبر من الراتب", severity: "warning", action: "review" },
	{ label: "ساعات إضافية غير معتمدة", severity: "warning", action: "review" },
	{ label: "إجازة غير مغلقة", severity: "warning", action: "review" },
	{ label: "موظف جديد بدون راتب أساسي", severity: "error", action: "edit" },
];

// يشتق قائمة مشاكل حتمية من عيّنة الموظفين (محاكاة التحقق)
export function buildIssues(lines: PayrollLine[]): PayrollIssue[] {
	const issues: PayrollIssue[] = [];
	lines.forEach((l, idx) => {
		const h = hash(l.id);
		if (h % 6 === 0) {
			const tpl = ISSUE_TEMPLATES[h % ISSUE_TEMPLATES.length];
			issues.push({
				id: `issue-${l.id}-${idx}`,
				label: tpl.label,
				employeeName: l.name,
				severity: tpl.severity,
				action: tpl.action,
			});
		}
	});
	return issues;
}

// يولّد تنبيهات ذكاء اصطناعي (محاكاة) بناءً على الفروقات والإجماليات
export function buildAiInsights(
	lines: PayrollLine[],
	summary: PayrollSummary,
): PayrollAiInsight[] {
	const insights: PayrollAiInsight[] = [];
	const bigRaises = lines.filter((l) => l.prevNet > 0 && l.net / l.prevNet - 1 >= 0.2);
	if (bigRaises.length > 0) {
		insights.push({
			id: "ai-raises",
			tone: "warning",
			title: `يوجد ${bigRaises.length} موظف ارتفع صافي راتبهم أكثر من 20% مقارنة بالشهر الماضي.`,
		});
	}
	const totalOt = lines.reduce((s, l) => s + l.overtime, 0);
	if (totalOt > 0) {
		insights.push({
			id: "ai-overtime",
			tone: "info",
			title: "تكلفة العمل الإضافي أعلى من المتوسط في بعض الفروع — يُنصح بمراجعتها.",
		});
	}
	const zeroNet = lines.filter((l) => l.net <= 0);
	if (zeroNet.length > 0) {
		insights.push({
			id: "ai-zero",
			tone: "warning",
			title: `يوجد ${zeroNet.length} موظف صافي راتبهم صفر أو أقل — راجع الخصومات قبل الاعتماد.`,
		});
	}
	insights.push({
		id: "ai-total",
		tone: "info",
		title: `يُتوقع أن يبلغ إجمالي صافي المسير ${summary.netTotal.toLocaleString("en-US")} ر.س هذا الشهر.`,
	});
	return insights;
}

// مراحل سلسلة الاعتماد (محاكاة)
export const APPROVAL_STAGES: PayrollApprovalStage[] = [
	{ id: "hr", role: "مدير الموارد البشرية", person: "حسين عصام", initials: "حع" },
	{ id: "finance", role: "المدير المالي", person: "سارة العتيبي", initials: "سع" },
	{ id: "ceo", role: "الرئيس التنفيذي", person: "أحمد محمد", initials: "أم" },
];
