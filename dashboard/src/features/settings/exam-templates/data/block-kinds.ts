import type {
	ExamBlock,
	ExamBlockKind,
	SoapSection,
} from "@/server/clinical-notes/clinical-notes.type";

/**
 * [S3] وصف أنواع الكتل للمحرّر — التسميات والقيم الابتدائية في مكان واحد.
 *
 * الأقسام الأربعة ليست تصنيفًا شكليًّا: القسم هو ما يقرّر أين يظهر نصّ الكتلة في
 * الملاحظة المُصيَّرة، وهو الفرق بين قالب SOAP وبانٍ عامّ للنماذج.
 */

export const SECTION_LABELS: Record<SoapSection, string> = {
	S: "الشكوى والتاريخ (S)",
	O: "الفحص الموضوعي (O)",
	A: "التقييم (A)",
	P: "الخطة (P)",
};

export const SECTION_HINTS: Record<SoapSection, string> = {
	S: "ما يرويه وليّ الأمر — الشكوى ومدّتها وما لاحظه",
	O: "ما يقيسه المدرّب — العلامات والأجهزة وقوائم البروتوكول",
	A: "ما يستنتجه — الوصف التشخيصي (وقائمة التشخيصات تُدار في الزيارة)",
	P: "ما سيفعله — النظام الغذائي والمتابعة، والطلبات تُضاف من الزيارة",
};

export const KIND_LABELS: Record<ExamBlockKind, string> = {
	prose: "نصّ حرّ",
	select: "اختيار واحد",
	multiselect: "اختيار متعدّد",
	scale: "مقياس رقمي",
	bodySystems: "فحص أجهزة",
	checklist: "قائمة تحقّق",
	vitalsRef: "العلامات الحيوية",
};

export const KIND_HINTS: Record<ExamBlockKind, string> = {
	prose: "سطر أو فقرة يكتبها المدرّب",
	select: "قيمة واحدة من قائمة",
	multiselect: "عدّة قيم من قائمة",
	scale: "رقم بين حدّين — الألم مثلًا 0 إلى 10",
	bodySystems: "طبيعي / غير طبيعي / لم يُفحص لكل جهاز",
	checklist: "بنود تُؤشَّر، وتُطبع المُنجَزة منها وحدها",
	vitalsRef: "يعرض القياس المرتبط للقراءة فقط — لا يكتبه",
};

/** كتلة جديدة بقيم صالحة، فلا يبدأ المحرّر من حالة مرفوضة */
export function emptyBlock(kind: ExamBlockKind, section: SoapSection, id: string): ExamBlock {
	const base = { id, section, labelAr: "" };
	switch (kind) {
		case "select":
		case "multiselect":
			return { ...base, kind, options: [{ value: "OPTION_1", labelAr: "" }] };
		case "checklist":
			return { ...base, kind, items: [{ key: "item_1", labelAr: "" }] };
		case "bodySystems":
			return { ...base, kind, systems: [{ key: "system_1", labelAr: "" }] };
		case "scale":
			return { ...base, kind, min: 0, max: 10 };
		case "vitalsRef":
			return { ...base, kind };
		default:
			return { ...base, kind: "prose" };
	}
}

/** معرّف كتلة مقترح من عنوانها، ويبقى قابلًا للتحرير — فهو مفتاح الإجابات */
export function suggestBlockId(existing: readonly string[]): string {
	let index = existing.length + 1;
	while (existing.includes(`block_${index}`)) index += 1;
	return `block_${index}`;
}
