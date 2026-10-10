import { describe, expect, it } from "vitest";

import { LabResultFlag } from "@/generated/prisma/enums";
import { buildComparisonRows, type ComparableResult, numericOf } from "./compare-results";

// المقارنة تُقرأ كقرار سريري — خطأ في المطابقة أو في اتجاه التغيّر يعني
// عرض فرق لمُحلِّل غير المقصود، أو تلوين تدهورٍ تحسّنًا.

const result = (over: Partial<ComparableResult> = {}): ComparableResult => ({
	id: "r1",
	parameterId: "p1",
	name: "WBC",
	unit: "10³/µL",
	value: "10",
	numericValue: 10,
	flag: LabResultFlag.NORMAL,
	order: 1,
	...over,
});

describe("numericOf", () => {
	it("يفضّل numericValue على النص", () => {
		expect(numericOf(result({ numericValue: 7.5, value: "غير مقروء" }))).toBe(7.5);
	});

	it("يستخرج الرقم من نص يحمل رمزًا أو وحدة", () => {
		expect(numericOf(result({ numericValue: null, value: "< 0.1" }))).toBe(0.1);
		expect(numericOf(result({ numericValue: null, value: "12.4 mg/dL" }))).toBe(12.4);
	});

	it("يُعيد null للنص غير الرقمي", () => {
		expect(numericOf(result({ numericValue: null, value: "موجب" }))).toBeNull();
		expect(numericOf(result({ numericValue: null, value: null }))).toBeNull();
	});
});

describe("buildComparisonRows", () => {
	it("يطابق بالمُحلِّل لا بالاسم — الاسم قد يُعدَّل بين الطلبين", () => {
		const [row] = buildComparisonRows(
			[result({ parameterId: "p1", name: "كريات بيضاء", numericValue: 12 })],
			[result({ parameterId: "p1", name: "WBC", numericValue: 10 })],
		);
		expect(row.previous).not.toBeNull();
		expect(row.delta).toBe(2);
	});

	it("يقع على الاسم حين لا يوجد معرّف مُحلِّل", () => {
		const [row] = buildComparisonRows(
			[result({ parameterId: null, name: "ALT", numericValue: 60 })],
			[result({ parameterId: null, name: "ALT", numericValue: 40 })],
		);
		expect(row.delta).toBe(20);
	});

	it("لا يطابق مُحلِّلين مختلفين", () => {
		const [row] = buildComparisonRows(
			[result({ parameterId: "p1" })],
			[result({ parameterId: "p2" })],
		);
		expect(row.previous).toBeNull();
		expect(row.delta).toBeNull();
		expect(row.percent).toBeNull();
	});

	it("يحسب النسبة، ويتركها null حين تكون السابقة صفرًا", () => {
		const [up] = buildComparisonRows(
			[result({ numericValue: 15 })],
			[result({ numericValue: 10 })],
		);
		expect(up.percent).toBeCloseTo(50);

		const [fromZero] = buildComparisonRows(
			[result({ numericValue: 5 })],
			[result({ numericValue: 0 })],
		);
		expect(fromZero.delta).toBe(5);
		expect(fromZero.percent).toBeNull();
	});

	it("النسبة موجبة الاتجاه ولو كانت القيمة السابقة سالبة", () => {
		const [row] = buildComparisonRows(
			[result({ numericValue: -5 })],
			[result({ numericValue: -10 })],
		);
		// الفرق +5 على قيمة مطلقة 10 ⇒ +50%
		expect(row.delta).toBe(5);
		expect(row.percent).toBeCloseTo(50);
	});

	it("يرصد الخروج عن النطاق والعودة إليه — لا اتجاه الرقم", () => {
		const [worse] = buildComparisonRows(
			[result({ numericValue: 30, flag: LabResultFlag.HIGH })],
			[result({ numericValue: 10, flag: LabResultFlag.NORMAL })],
		);
		expect(worse.worsened).toBe(true);
		expect(worse.improved).toBe(false);

		const [better] = buildComparisonRows(
			[result({ numericValue: 12, flag: LabResultFlag.NORMAL })],
			[result({ numericValue: 30, flag: LabResultFlag.HIGH })],
		);
		expect(better.improved).toBe(true);
		expect(better.worsened).toBe(false);

		// ارتفاع داخل النطاق ليس تدهورًا
		const [stable] = buildComparisonRows(
			[result({ numericValue: 14, flag: LabResultFlag.NORMAL })],
			[result({ numericValue: 10, flag: LabResultFlag.NORMAL })],
		);
		expect(stable.worsened).toBe(false);
		expect(stable.improved).toBe(false);
	});

	it("بلا نتائج سابقة: كل الصفوف بلا مقابل ولا فروق", () => {
		const rows = buildComparisonRows([result(), result({ id: "r2", parameterId: "p2" })], []);
		expect(rows).toHaveLength(2);
		expect(rows.every((r) => r.previous === null && r.delta === null)).toBe(true);
	});

	it("يحافظ على ترتيب المُحلِّلات كما أُدخلت", () => {
		const rows = buildComparisonRows(
			[
				result({ id: "b", parameterId: "p2", order: 2 }),
				result({ id: "a", parameterId: "p1", order: 1 }),
			],
			[],
		);
		expect(rows.map((r) => r.current.id)).toEqual(["a", "b"]);
	});
});
