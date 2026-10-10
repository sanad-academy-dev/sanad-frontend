// السجل التاريخي لمسير الرواتب — بيانات محاكاة للفترات السابقة.
// واجهة فقط (لا يوجد باك إند للرواتب بعد)؛ تُولَّد بشكل حتمي من قائمة الموظفين.
import {
	buildPayrollLine,
	buildSummary,
	type PayrollLine,
	type PayrollLineStatus,
	type PayrollSummary,
} from "@/features/services/staff/components/payroll/payroll-wizard.types";
import type { StaffResponse } from "@/server/staff/staff.type";

// مسير رواتب لفترة واحدة (محفوظ في السجل)
export interface PayrollRunRecord {
	id: string;
	period: string; // "يونيو 2026"
	payDate: string; // "30 يونيو 2026"
	runDate: string; // تاريخ التشغيل الفعلي
	status: PayrollLineStatus; // حالة المسير (غالبًا PAID للفترات السابقة)
	lines: PayrollLine[];
	summary: PayrollSummary;
}

// تعريف فترة تاريخية + معامل تفاوت الأجور لإظهار اتجاه النمو بين الأشهر
interface PeriodDef {
	id: string;
	period: string;
	payDate: string;
	runDate: string;
	factor: number;
	status: PayrollLineStatus;
}

// الفترات السابقة (الأحدث أولًا) — يناير حتى يونيو 2026
const HISTORY_PERIODS: PeriodDef[] = [
	{
		id: "2026-06",
		period: "يونيو 2026",
		payDate: "30 يونيو 2026",
		runDate: "30 يونيو 2026",
		factor: 1,
		status: "PAID",
	},
	{
		id: "2026-05",
		period: "مايو 2026",
		payDate: "31 مايو 2026",
		runDate: "31 مايو 2026",
		factor: 0.98,
		status: "PAID",
	},
	{
		id: "2026-04",
		period: "أبريل 2026",
		payDate: "30 أبريل 2026",
		runDate: "30 أبريل 2026",
		factor: 0.97,
		status: "PAID",
	},
	{
		id: "2026-03",
		period: "مارس 2026",
		payDate: "31 مارس 2026",
		runDate: "31 مارس 2026",
		factor: 0.955,
		status: "PAID",
	},
	{
		id: "2026-02",
		period: "فبراير 2026",
		payDate: "28 فبراير 2026",
		runDate: "28 فبراير 2026",
		factor: 0.96,
		status: "PAID",
	},
	{
		id: "2026-01",
		period: "يناير 2026",
		payDate: "31 يناير 2026",
		runDate: "31 يناير 2026",
		factor: 0.94,
		status: "PAID",
	},
];

// يطبّق معامل التفاوت على سطر راتب ويعيد حساب الصافي ليبقى متّسقًا
function scaleLine(line: PayrollLine, factor: number, status: PayrollLineStatus): PayrollLine {
	const baseSalary = Math.round(line.baseSalary * factor);
	const allowances = Math.round(line.allowances * factor);
	const overtime = Math.round(line.overtime * factor);
	const bonuses = Math.round(line.bonuses * factor);
	const advances = Math.round(line.advances * factor);
	const penalties = Math.round(line.penalties * factor);
	const deductions = Math.round(baseSalary * 0.0975);
	const net = baseSalary + allowances + overtime + bonuses - advances - penalties - deductions;
	return {
		...line,
		baseSalary,
		allowances,
		overtime,
		bonuses,
		advances,
		penalties,
		deductions,
		net,
		prevNet: Math.round(line.net * factor * 0.97),
		status,
	};
}

function buildHistoricalRun(staff: StaffResponse[], def: PeriodDef): PayrollRunRecord {
	const lines = staff.map((s) => scaleLine(buildPayrollLine(s), def.factor, def.status));
	return {
		id: def.id,
		period: def.period,
		payDate: def.payDate,
		runDate: def.runDate,
		status: def.status,
		lines,
		summary: buildSummary(lines),
	};
}

// يبني قائمة السجل التاريخي كاملة من قائمة الموظفين
export function buildPayrollHistory(staff: StaffResponse[]): PayrollRunRecord[] {
	if (staff.length === 0) return [];
	return HISTORY_PERIODS.map((def) => buildHistoricalRun(staff, def));
}
