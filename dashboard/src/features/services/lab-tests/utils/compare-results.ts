import { LabResultFlag } from "@/generated/prisma/enums";

// منطق مقارنة نتيجتين لنفس التحليل — دالة نقية حتى تُختبر بلا واجهة.
//
// المطابقة بالمُحلِّل (parameterId) لا بالاسم: الاسم قد يُعدَّل بين طلبين
// فيبدو المُحلِّل مُحلِّلًا جديدًا ويضيع تاريخه. الاسم بديل احتياطي فقط
// للنتائج القديمة التي أُدخلت بلا معرّف مُحلِّل.

/** أقلّ ما تحتاجه المقارنة من النتيجة — يصدُق على النتيجة الحالية والسابقة */
export type ComparableResult = {
	id: string;
	parameterId: string | null;
	name: string;
	unit: string | null;
	value: string | null;
	numericValue: unknown;
	flag: LabResultFlag;
	order: number;
};

type ComparisonRow<T extends ComparableResult> = {
	current: T;
	previous: T | null;
	/** فرق رقمي — null حين تكون إحدى القيمتين غير رقمية أو مفقودة */
	delta: number | null;
	/** نسبة التغيّر — null حين تكون القيمة السابقة صفرًا (القسمة بلا معنى) */
	percent: number | null;
	/** كان ضمن النطاق فخرج عنه */
	worsened: boolean;
	/** كان خارج النطاق فعاد إليه */
	improved: boolean;
};

/** مفتاح المطابقة: المُحلِّل إن وُجد، وإلا الاسم */
const keyOf = (result: ComparableResult) => result.parameterId ?? `name:${result.name}`;

/** الرقم من النتيجة — numericValue حين توفّر وإلا تحليل النص */
export const numericOf = (result: ComparableResult): number | null => {
	if (result.numericValue != null) {
		const n = Number(result.numericValue);
		if (Number.isFinite(n)) return n;
	}
	// النص قد يحمل وحدةً أو رمز مقارنة («< 0.1») — نستخرج الرقم منه
	const parsed = Number.parseFloat(String(result.value ?? "").replace(/[^\d.-]/g, ""));
	return Number.isFinite(parsed) ? parsed : null;
};

export function buildComparisonRows<T extends ComparableResult>(
	current: readonly T[],
	previous: readonly T[],
): ComparisonRow<T>[] {
	const before = new Map(previous.map((result) => [keyOf(result), result] as const));

	return [...current]
		.sort((a, b) => a.order - b.order)
		.map((row) => {
			const match = before.get(keyOf(row)) ?? null;
			const now = numericOf(row);
			const then = match ? numericOf(match) : null;
			const delta = now != null && then != null ? now - then : null;
			const percent = delta != null && then ? (delta / Math.abs(then)) * 100 : null;

			return {
				current: row,
				previous: match,
				delta,
				percent,
				// الحكم على التحسّن والتدهور بتغيّر الحالة لا باتجاه الرقم:
				// ارتفاع القيمة ليس سيّئًا بذاته، والخروج عن النطاق هو ما يهمّ
				worsened:
					!!match && match.flag === LabResultFlag.NORMAL && row.flag !== LabResultFlag.NORMAL,
				improved:
					!!match && match.flag !== LabResultFlag.NORMAL && row.flag === LabResultFlag.NORMAL,
			};
		});
}
