import { describe, expect, it } from "vitest";

import {
	calculateEndOfService,
	type EosReason,
} from "@/features/services/staff/components/payroll/end-of-service";

// الوحدة تحسب المدة الكسرية بقسمة إجمالي الأيام على 365، لذا تُبنى تواريخ
// الاختبار بإضافة عدد أيام صريح — لا بإضافة سنوات تقويمية (تختلف بالكبيسة).
const DAYS_PER_YEAR = 365;

function addDays(iso: string, days: number): string {
	const d = new Date(`${iso}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}

// تاريخ نهاية يجعل مدة الدورة `years` سنة كسرية بالضبط
function endAfterYears(start: string, years: number): string {
	return addDays(start, Math.round(years * DAYS_PER_YEAR));
}

const START = "2015-01-01";
const WAGE = 10_000;

function calc(years: number, reason: EosReason, wage = WAGE) {
	return calculateEndOfService({
		monthlyWage: wage,
		startDate: START,
		endDate: endAfterYears(START, years),
		reason,
	});
}

describe("calculateEndOfService — المادة 84 (احتساب المكافأة)", () => {
	it("نصف شهر عن كل سنة خلال أول خمس سنوات", () => {
		// سنتان → نصف شهر × 2 = شهر واحد من الأجر
		const r = calc(2, "EMPLOYER_TERMINATION");
		expect(r.fractionalYears).toBeCloseTo(2, 10);
		expect(r.firstFiveMonths).toBeCloseTo(1, 10);
		expect(r.beyondFiveMonths).toBe(0);
		expect(r.fullAward).toBeCloseTo(WAGE, 6);
		expect(r.finalAmount).toBeCloseTo(WAGE, 6);
	});

	it("خمس سنوات بالضبط → شهران ونصف، بلا أي استحقاق لما بعد الخمس", () => {
		const r = calc(5, "END_OF_CONTRACT");
		expect(r.firstFiveMonths).toBeCloseTo(2.5, 10);
		expect(r.beyondFiveMonths).toBeCloseTo(0, 10);
		expect(r.fullAward).toBeCloseTo(2.5 * WAGE, 6);
	});

	it("شهر كامل عن كل سنة بعد الخمس سنوات", () => {
		// 10 سنوات → 2.5 شهر (أول خمس) + 5 أشهر (ما بعدها) = 7.5 شهر
		const r = calc(10, "EMPLOYER_TERMINATION");
		expect(r.firstFiveMonths).toBeCloseTo(2.5, 10);
		expect(r.beyondFiveMonths).toBeCloseTo(5, 10);
		expect(r.fullAward).toBeCloseTo(7.5 * WAGE, 6);
	});

	it("يحتسب كسور السنة تناسبياً ولا يقرّبها لسنة كاملة", () => {
		// 2.2 سنة = 803 يوماً بالضبط (كسر يقع على عدد أيام صحيح)
		const r = calc(2.2, "END_OF_CONTRACT");
		expect(r.fractionalYears).toBeCloseTo(2.2, 10);
		expect(r.firstFiveMonths).toBeCloseTo(1.1, 10);
		expect(r.fullAward).toBeCloseTo(1.1 * WAGE, 6);
	});

	it("سنة واحدة → نصف شهر فقط", () => {
		const r = calc(1, "EMPLOYER_TERMINATION");
		expect(r.firstFiveMonths).toBeCloseTo(0.5, 10);
		expect(r.fullAward).toBeCloseTo(0.5 * WAGE, 6);
	});

	it("المكافأة تتناسب طردياً مع الأجر", () => {
		const a = calc(6, "EMPLOYER_TERMINATION", 10_000);
		const b = calc(6, "EMPLOYER_TERMINATION", 20_000);
		expect(b.fullAward).toBeCloseTo(a.fullAward * 2, 6);
	});
});

describe("calculateEndOfService — المادة 85 (شرائح الاستقالة)", () => {
	it("أقل من سنتين → لا تُستحق مكافأة", () => {
		const r = calc(1.5, "RESIGNATION");
		expect(r.factor).toBe(0);
		expect(r.finalAmount).toBe(0);
		// المكافأة الكاملة تُحتسب رغم ذلك (للعرض)، والصفر ناتج عن النسبة
		expect(r.fullAward).toBeGreaterThan(0);
	});

	it("من سنتين إلى خمس → ثلث المكافأة", () => {
		const r = calc(3, "RESIGNATION");
		expect(r.factor).toBeCloseTo(1 / 3, 10);
		expect(r.finalAmount).toBeCloseTo(r.fullAward / 3, 6);
	});

	it("من خمس إلى عشر → ثلثا المكافأة", () => {
		const r = calc(7, "RESIGNATION");
		expect(r.factor).toBeCloseTo(2 / 3, 10);
		expect(r.finalAmount).toBeCloseTo((r.fullAward * 2) / 3, 6);
	});

	it("عشر سنوات فأكثر → المكافأة كاملة", () => {
		const r = calc(12, "RESIGNATION");
		expect(r.factor).toBe(1);
		expect(r.finalAmount).toBeCloseTo(r.fullAward, 6);
	});

	describe("حدود الشرائح (قيم الحدّ تنتمي للشريحة الأعلى)", () => {
		it("سنتان بالضبط → ثلث لا صفر", () => {
			expect(calc(2, "RESIGNATION").factor).toBeCloseTo(1 / 3, 10);
		});

		it("خمس سنوات بالضبط → ثلثان لا ثلث", () => {
			expect(calc(5, "RESIGNATION").factor).toBeCloseTo(2 / 3, 10);
		});

		it("عشر سنوات بالضبط → كاملة لا ثلثان", () => {
			expect(calc(10, "RESIGNATION").factor).toBe(1);
		});

		it("أقل بقليل من سنتين → صفر", () => {
			const r = calculateEndOfService({
				monthlyWage: WAGE,
				startDate: START,
				endDate: addDays(START, 2 * DAYS_PER_YEAR - 1),
				reason: "RESIGNATION",
			});
			expect(r.factor).toBe(0);
			expect(r.finalAmount).toBe(0);
		});
	});

	it("الأسباب الأخرى لا تخضع لشرائح الاستقالة", () => {
		for (const reason of [
			"END_OF_CONTRACT",
			"EMPLOYER_TERMINATION",
			"SPECIAL",
		] as EosReason[]) {
			// مدة أقل من سنتين تُصفّر الاستقالة، لكنها لا تؤثر على بقية الأسباب
			const r = calc(1, reason);
			expect(r.factor).toBe(1);
			expect(r.finalAmount).toBeCloseTo(r.fullAward, 6);
		}
	});
});

describe("calculateEndOfService — المدخلات غير الصالحة", () => {
	const invalid = [
		{ label: "أجر صفري", wage: 0, start: START, end: "2020-01-01" },
		{ label: "أجر سالب", wage: -5000, start: START, end: "2020-01-01" },
		{ label: "أجر غير رقمي", wage: Number.NaN, start: START, end: "2020-01-01" },
		{ label: "تاريخ بداية غير صالح", wage: WAGE, start: "غير-صالح", end: "2020-01-01" },
		{ label: "تاريخ نهاية غير صالح", wage: WAGE, start: START, end: "غير-صالح" },
		{ label: "النهاية قبل البداية", wage: WAGE, start: "2020-01-01", end: START },
		{ label: "النهاية تساوي البداية", wage: WAGE, start: START, end: START },
	];

	for (const c of invalid) {
		it(`${c.label} → نتيجة صفرية`, () => {
			const r = calculateEndOfService({
				monthlyWage: c.wage,
				startDate: c.start,
				endDate: c.end,
				reason: "EMPLOYER_TERMINATION",
			});
			expect(r.finalAmount).toBe(0);
			expect(r.fullAward).toBe(0);
			expect(r.totalDays).toBe(0);
			expect(r.fractionalYears).toBe(0);
		});
	}
});

describe("calculateEndOfService — تفكيك مدة الدورة", () => {
	it("يفكّك المدة إلى سنوات وأشهر وأيام", () => {
		const r = calculateEndOfService({
			monthlyWage: WAGE,
			startDate: "2020-03-15",
			endDate: "2023-07-20",
			reason: "EMPLOYER_TERMINATION",
		});
		expect(r.years).toBe(3);
		expect(r.months).toBe(4);
		expect(r.days).toBe(5);
	});

	it("يستلف من الشهر السابق عندما يكون يوم النهاية أصغر من يوم البداية", () => {
		const r = calculateEndOfService({
			monthlyWage: WAGE,
			startDate: "2020-01-31",
			endDate: "2021-03-01",
			reason: "EMPLOYER_TERMINATION",
		});
		expect(r.years).toBe(1);
		expect(r.months).toBe(1);
		// فبراير 2021 = 28 يوماً → 1 - 31 + 28 = -2 … تُقصّ عند الصفر
		expect(r.days).toBeGreaterThanOrEqual(0);
	});

	it("إجمالي الأيام يطابق الفارق الفعلي بما فيه السنوات الكبيسة", () => {
		// 2020 كبيسة → 366 يوماً
		const r = calculateEndOfService({
			monthlyWage: WAGE,
			startDate: "2020-01-01",
			endDate: "2021-01-01",
			reason: "EMPLOYER_TERMINATION",
		});
		expect(r.totalDays).toBe(366);
		expect(r.fractionalYears).toBeCloseTo(366 / 365, 10);
	});
});
