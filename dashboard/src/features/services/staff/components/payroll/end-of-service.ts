// حساب مكافأة نهاية الدورة وفق نظام العمل السعودي (المادتان 84 و85).
// دوال نقية — لا حالة ولا واجهة — لتسهيل الاختبار وإعادة الاستخدام.

// سبب انتهاء الدورة — يحدّد نسبة استحقاق المكافأة
export type EosReason =
	| "END_OF_CONTRACT" // انتهاء مدة العقد
	| "EMPLOYER_TERMINATION" // إنهاء من صاحب العمل
	| "RESIGNATION" // استقالة (تخضع للمادة 85)
	| "SPECIAL"; // حالة استثنائية (قوة قاهرة/زواج الموظفة...) → كاملة

export const EOS_REASONS: { value: EosReason; label: string }[] = [
	{ value: "END_OF_CONTRACT", label: "انتهاء مدة العقد" },
	{ value: "EMPLOYER_TERMINATION", label: "إنهاء من صاحب العمل" },
	{ value: "RESIGNATION", label: "استقالة" },
	{ value: "SPECIAL", label: "حالة استثنائية (تُصرف كاملة)" },
];

export interface EosInput {
	monthlyWage: number;
	startDate: string; // ISO date (YYYY-MM-DD)
	endDate: string; // ISO date (YYYY-MM-DD)
	reason: EosReason;
}

export interface EosResult {
	years: number; // السنوات المكتملة
	months: number; // الأشهر المتبقية
	days: number; // الأيام المتبقية
	totalDays: number;
	fractionalYears: number; // إجمالي المدة بالسنوات (كسري)
	firstFiveMonths: number; // أشهر أجر مستحقّة عن أول 5 سنوات
	beyondFiveMonths: number; // أشهر أجر مستحقّة عمّا بعد 5 سنوات
	fullAward: number; // المكافأة الكاملة (قبل نسبة الاستقالة)
	factor: number; // نسبة الاستحقاق (0..1)
	factorLabel: string; // وصف نسبة الاستحقاق
	finalAmount: number; // المبلغ النهائي المستحق
}

// تفكيك المدة إلى سنوات/أشهر/أيام + إجمالي الأيام
function serviceDuration(start: Date, end: Date) {
	let years = end.getFullYear() - start.getFullYear();
	let months = end.getMonth() - start.getMonth();
	let days = end.getDate() - start.getDate();
	if (days < 0) {
		months -= 1;
		// عدد أيام الشهر السابق لشهر النهاية
		const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
		days += prevMonthDays;
	}
	if (months < 0) {
		years -= 1;
		months += 12;
	}
	const totalDays = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
	return {
		years: Math.max(0, years),
		months: Math.max(0, months),
		days: Math.max(0, days),
		totalDays,
	};
}

// نسبة استحقاق المكافأة عند الاستقالة (المادة 85) بحسب سنوات الدورة
function resignationFactor(fractionalYears: number): { factor: number; label: string } {
	if (fractionalYears < 2)
		return { factor: 0, label: "لا تُستحق مكافأة (الدورة أقل من سنتين)" };
	if (fractionalYears < 5)
		return { factor: 1 / 3, label: "ثلث المكافأة (استقالة 2 – 5 سنوات)" };
	if (fractionalYears < 10)
		return { factor: 2 / 3, label: "ثلثا المكافأة (استقالة 5 – 10 سنوات)" };
	return { factor: 1, label: "المكافأة كاملة (استقالة 10 سنوات فأكثر)" };
}

const EMPTY_RESULT: EosResult = {
	years: 0,
	months: 0,
	days: 0,
	totalDays: 0,
	fractionalYears: 0,
	firstFiveMonths: 0,
	beyondFiveMonths: 0,
	fullAward: 0,
	factor: 1,
	factorLabel: "",
	finalAmount: 0,
};

export function calculateEndOfService(input: EosInput): EosResult {
	const wage = Number(input.monthlyWage);
	const start = new Date(input.startDate);
	const end = new Date(input.endDate);

	// مدخلات غير صالحة
	if (
		!Number.isFinite(wage) ||
		wage <= 0 ||
		Number.isNaN(start.getTime()) ||
		Number.isNaN(end.getTime()) ||
		end.getTime() <= start.getTime()
	) {
		return EMPTY_RESULT;
	}

	const { years, months, days, totalDays } = serviceDuration(start, end);
	const fractionalYears = totalDays / 365;

	// أول 5 سنوات: نصف شهر عن كل سنة — ما بعدها: شهر كامل عن كل سنة (المادة 84)
	const firstFivePortion = Math.min(fractionalYears, 5);
	const beyondFivePortion = Math.max(0, fractionalYears - 5);
	const firstFiveMonths = 0.5 * firstFivePortion;
	const beyondFiveMonths = 1 * beyondFivePortion;
	const fullAward = (firstFiveMonths + beyondFiveMonths) * wage;

	// نسبة الاستحقاق: كاملة إلا في حالة الاستقالة (المادة 85)
	const { factor, label } =
		input.reason === "RESIGNATION"
			? resignationFactor(fractionalYears)
			: { factor: 1, label: "المكافأة كاملة" };

	return {
		years,
		months,
		days,
		totalDays,
		fractionalYears,
		firstFiveMonths,
		beyondFiveMonths,
		fullAward,
		factor,
		factorLabel: label,
		finalAmount: fullAward * factor,
	};
}
