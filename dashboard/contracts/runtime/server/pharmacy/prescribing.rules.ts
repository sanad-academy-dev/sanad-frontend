import type { CatalogSpecies } from "@/generated/prisma/enums";

/**
 * [PH7.3] ذكاء الوصف — النظام يقود المستخدم، لا العكس.
 *
 * كل ما هنا **اشتقاق من بيانات موجودة**، لا اختراع لبيانات سريرية: مفردات تواتر
 * مضبوطة بدل نصّ حرّ، ونصّ تعليمات يُركَّب من حقول مُدخَلة، وحدود وزن تكشف الأخطاء
 * المطبعية. لا شيء منها يخترع جرعة (§0.4).
 */

// ── مفردات التواتر ────────────────────────────────────────────────────────────

/**
 * **لماذا قائمة مضبوطة بدل نصّ حرّ.** محرّك الجرعة يرفض تفسير `frequency` النصّي
 * («BID»، «q12h»، «مرتين يوميًا») لأن تحويله إلى رقم تخمين. والحلّ ليس أن يُحسب
 * التواتر يدويًّا في كل مرّة، بل ألّا يُكتب نصًّا أصلًا: المدرّب يختار من هذه القائمة،
 * فيصير `timesPerDay` **معلومًا** لا مستنتَجًا، وتُحسب الكمّية الإجمالية آليًّا.
 *
 * هذا هو الفرق العملي بين نظام يقود المستخدم ونظام يستجوبه.
 */
export const FREQUENCY_OPTIONS = [
	{ code: "SID", labelAr: "مرة واحدة يوميًا", perDay: { num: 1, den: 1 }, everyHours: 24 },
	{ code: "BID", labelAr: "مرتين يوميًا", perDay: { num: 2, den: 1 }, everyHours: 12 },
	{ code: "TID", labelAr: "ثلاث مرات يوميًا", perDay: { num: 3, den: 1 }, everyHours: 8 },
	{ code: "QID", labelAr: "أربع مرات يوميًا", perDay: { num: 4, den: 1 }, everyHours: 6 },
	{ code: "Q48H", labelAr: "مرة كل يومين", perDay: { num: 1, den: 2 }, everyHours: 48 },
	{ code: "EOD", labelAr: "يوم بعد يوم", perDay: { num: 1, den: 2 }, everyHours: 48 },
	{ code: "WEEKLY", labelAr: "مرة أسبوعيًا", perDay: { num: 1, den: 7 }, everyHours: 168 },
	// جرعة واحدة: المدّة لا تضرب شيئًا — «مرة واحدة لمدة ٧ أيام» تناقض، لا سبع جرعات
	{ code: "ONCE", labelAr: "جرعة واحدة فقط", perDay: { num: 1, den: 1 }, everyHours: 0 },
	{ code: "PRN", labelAr: "عند اللزوم", perDay: null, everyHours: null },
] as const;

export type FrequencyCode = (typeof FREQUENCY_OPTIONS)[number]["code"];

export const frequencyByCode = (code: string | null | undefined) =>
	FREQUENCY_OPTIONS.find((f) => f.code === code) ?? null;

/** جرعة واحدة لا تتكرّر — المدّة لا تُضرب فيها */
export const isSingleDose = (code: string | null | undefined) => code === "ONCE";

/**
 * التواتر **كسر صحيح** لا عدد عائم.
 *
 * كان `1/7` مخزَّنًا كـ`0.14285714285714285`، وضربُه في `Decimal` يُدخل خطأ العائم
 * في حساب كمّية دواء — وهو ما يمنعه قيد الدقّة C2 صراحةً («الحساب بمكتبة عشرية لا
 * بعائم JS»). البسط والمقام يبقيان صحيحين، والقسمة تقع مرّة واحدة في النهاية.
 *
 * `PRN` يُعيد `null` عمدًا: «عند اللزوم» ليس عددًا في اليوم، وإعطاؤه ١ يجعل النظام
 * يحسب كمّية إجمالية لا أساس لها. الكمّية عندها قرار المدرّب.
 */
export const perDayOf = (
	code: string | null | undefined,
): { num: number; den: number } | null => frequencyByCode(code)?.perDay ?? null;

/** للعرض وحده — لا يُستعمل في حساب كمّية (راجع `perDayOf`) */
export const timesPerDayOf = (code: string | null | undefined): number | null => {
	const f = perDayOf(code);
	return f ? f.num / f.den : null;
};

// ── طرق الإعطاء ───────────────────────────────────────────────────────────────

export const ROUTE_OPTIONS = [
	{ code: "PO", labelAr: "عن طريق الفم" },
	{ code: "IV", labelAr: "وريدي" },
	{ code: "IM", labelAr: "عضلي" },
	{ code: "SC", labelAr: "تحت الجلد" },
	{ code: "TOPICAL", labelAr: "موضعي" },
	{ code: "OTIC", labelAr: "في الأذن" },
	{ code: "OPHTH", labelAr: "في العين" },
	{ code: "INTRANASAL", labelAr: "في الأنف" },
	{ code: "IU", labelAr: "داخل الرحم" },
	{ code: "IMAM", labelAr: "داخل الضرع" },
] as const;

export const routeLabel = (code: string | null | undefined) =>
	ROUTE_OPTIONS.find((r) => r.code === code)?.labelAr ?? code ?? null;

// ── نصّ التعليمات (sig) ───────────────────────────────────────────────────────

/**
 * يُركّب تعليمات الاستعمال بالعربية من الحقول المُدخَلة.
 *
 * **يُقترح ولا يُفرض**: النصّ يُملأ في الحقل ويبقى قابلًا للتحرير. المدرّب يضيف ما
 * لا يعرفه النظام («مع الطعام»، «أوقف عند القيء»)، والاقتراح يوفّر عليه كتابة
 * الجزء الميكانيكي — وهو أيضًا الجزء الذي يُنسى فيه سطر كامل عند الاستعجال.
 */
export function buildSig(input: {
	measuredAmount?: string | null;
	measureUnit?: string | null;
	routeCode?: string | null;
	frequencyCode?: string | null;
	durationDays?: number | null;
	prn?: boolean;
}): string {
	const parts: string[] = [];

	if (input.measuredAmount && input.measureUnit)
		parts.push(`أعطِ ${input.measuredAmount} ${input.measureUnit}`);
	else parts.push("أعطِ الجرعة الموصوفة");

	const route = routeLabel(input.routeCode);
	if (route) parts.push(route);

	const freq = frequencyByCode(input.frequencyCode);
	if (freq) parts.push(freq.labelAr);

	if (input.durationDays && input.durationDays > 0)
		parts.push(`لمدة ${input.durationDays} يوم`);

	if (input.prn && input.frequencyCode !== "PRN") parts.push("عند اللزوم");

	return `${parts.join("، ")}.`;
}

// ── حدود الوزن المعقولة لكل نوع ───────────────────────────────────────────────

/**
 * **ليست بيانات سريرية ولا جرعات** — حدود بيولوجية عامّة تكشف الخطأ المطبعي.
 *
 * لماذا تستحقّ الوجود: الجرعة حاصل ضرب في الوزن، فخطأ خانة واحدة في الوزن يضرب
 * الجرعة عشرة أضعاف مباشرةً. قطّة وزنها ٤٥ كغ (بدل ٤٫٥) تُنتج جرعة قاتلة يقبلها
 * كل فحص آخر في النظام، لأن الحساب نفسه صحيح تمامًا.
 *
 * المدى واسع عمدًا: الغرض التقاط خطأ الخانة لا الحكم على حالة الطفل. والنتيجة
 * **تحذير لا رفض** — سلالات عملاقة موجودة، والنظام لا يعرف أفضل من المدرّب.
 */
export const SPECIES_WEIGHT_RANGE_KG: Partial<
	Record<CatalogSpecies, { min: number; max: number }>
> = {
	DOG: { min: 0.5, max: 100 },
	CAT: { min: 0.3, max: 15 },
	HORSE: { min: 50, max: 1200 },
	CATTLE: { min: 25, max: 1400 },
	SHEEP: { min: 2, max: 180 },
	GOAT: { min: 2, max: 140 },
	CAMEL: { min: 30, max: 1000 },
	POULTRY: { min: 0.03, max: 25 },
	RABBIT: { min: 0.3, max: 12 },
	SWINE: { min: 1, max: 400 },
};

export type WeightPlausibility =
	| { plausible: true }
	| { plausible: false; messageAr: string; min: number; max: number };

export function checkWeightPlausibility(
	species: CatalogSpecies | null,
	weightKg: number | null,
): WeightPlausibility {
	if (!species || weightKg === null || weightKg <= 0) return { plausible: true };

	const range = SPECIES_WEIGHT_RANGE_KG[species];
	if (!range) return { plausible: true };

	if (weightKg >= range.min && weightKg <= range.max) return { plausible: true };

	return {
		plausible: false,
		min: range.min,
		max: range.max,
		messageAr: `الوزن المسجَّل ${weightKg} كجم خارج المدى المتوقَّع لهذا النوع (${range.min}–${range.max} كجم) — تحقّق قبل اعتماد الجرعة`,
	};
}
