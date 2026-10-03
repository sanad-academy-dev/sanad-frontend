import { LabSampleStage, LabTestStatus } from "@/generated/prisma/enums";

// آلة حالات التحليل المخبري — المصدر الوحيد للانتقالات المسموحة.
// ملف بيانات/دوال نقية فقط (بدون db) — يُستورد من الخادم والواجهة معًا.
//
// الطلب الواحد قد يضم عدة تحاليل (CBC + سكر الدم)، ولكل تحليل سير عمله:
//   الطابور → مجدول → سحب العينة → في المختبر → قيد المراجعة → مكتملة
// «سحب العينة» مرحلة مستقلة تمامًا تسبق «في المختبر»، وتنقسم إلى:
//   لم يتم سحب العينة → تم سحب العينة
// و«في المختبر» تنقسم إلى:
//   جاري التحليل → ظهرت النتائج
// المراجعة: قبول ينقل إلى «مكتملة»، ورفض يُعيد إلى «في المختبر» من «جاري
// التحليل» مع شارة «تم رفضها».
//
// حالة الطلب مشتقة من عناصره: أقلّها تقدّمًا (فالطلب ليس مكتملًا حتى يكتمل
// آخر تحاليله).

export const LAB_STATUS_LABELS: Record<LabTestStatus, string> = {
	[LabTestStatus.QUEUE]: "الطابور",
	[LabTestStatus.SCHEDULED]: "مجدول",
	[LabTestStatus.SAMPLE_COLLECTION]: "سحب العينة",
	[LabTestStatus.IN_LAB]: "في المختبر",
	[LabTestStatus.UNDER_REVIEW]: "قيد المراجعة",
	[LabTestStatus.COMPLETED]: "مكتملة",
	[LabTestStatus.CANCELLED]: "ملغي",
};

export const LAB_STAGE_LABELS: Record<LabSampleStage, string> = {
	[LabSampleStage.NOT_COLLECTED]: "لم يتم سحب العينة",
	[LabSampleStage.COLLECTED]: "تم سحب العينة",
	[LabSampleStage.QUALITY_CHECK]: "جودة العيّنة",
	[LabSampleStage.LABEL_PRINT]: "طباعة الملصق",
	[LabSampleStage.ANALYZER_ASSIGNMENT]: "تعيين جهاز التحليل",
	[LabSampleStage.HANDOVER_SUMMARY]: "الملخص",
	[LabSampleStage.ANALYZING]: "جاري التحليل",
	[LabSampleStage.RESULTS_READY]: "ظهرت النتائج",
};

export const ALLOWED_LAB_TRANSITIONS: Record<LabTestStatus, readonly LabTestStatus[]> = {
	[LabTestStatus.QUEUE]: [LabTestStatus.SCHEDULED, LabTestStatus.CANCELLED],
	[LabTestStatus.SCHEDULED]: [
		LabTestStatus.SAMPLE_COLLECTION,
		LabTestStatus.QUEUE,
		LabTestStatus.CANCELLED,
	],
	[LabTestStatus.SAMPLE_COLLECTION]: [
		LabTestStatus.IN_LAB,
		LabTestStatus.SCHEDULED,
		LabTestStatus.CANCELLED,
	],
	[LabTestStatus.IN_LAB]: [
		LabTestStatus.UNDER_REVIEW,
		LabTestStatus.SAMPLE_COLLECTION,
		LabTestStatus.CANCELLED,
	],
	// المراجعة: قبول (مكتملة) أو رفض (العودة للمختبر)
	[LabTestStatus.UNDER_REVIEW]: [LabTestStatus.COMPLETED, LabTestStatus.IN_LAB],
	[LabTestStatus.COMPLETED]: [],
	[LabTestStatus.CANCELLED]: [],
};

export const LAB_TERMINAL_STATUSES = [
	LabTestStatus.COMPLETED,
	LabTestStatus.CANCELLED,
] as const;

// ترتيب الحالات على اللوحة — يُستخدم لاشتقاق حالة الطلب من عناصره
export const LAB_STATUS_ORDER = [
	LabTestStatus.QUEUE,
	LabTestStatus.SCHEDULED,
	LabTestStatus.SAMPLE_COLLECTION,
	LabTestStatus.IN_LAB,
	LabTestStatus.UNDER_REVIEW,
	LabTestStatus.COMPLETED,
] as const;

// ترتيب مراحل العيّنة — التقدّم خطوة واحدة للأمام فقط
export const LAB_STAGE_ORDER = [
	LabSampleStage.NOT_COLLECTED,
	LabSampleStage.COLLECTED,
	LabSampleStage.QUALITY_CHECK,
	LabSampleStage.LABEL_PRINT,
	LabSampleStage.ANALYZER_ASSIGNMENT,
	LabSampleStage.HANDOVER_SUMMARY,
	LabSampleStage.ANALYZING,
	LabSampleStage.RESULTS_READY,
] as const;

// كل حالة تملك مراحلها الفرعية — سحب العيّنة يملك أول مرحلتين والمختبر آخر اثنتين
export const STAGES_BY_STATUS: Partial<Record<LabTestStatus, readonly LabSampleStage[]>> = {
	// سحب العيّنة ست خطوات: التقييم ← السحب ← الجودة ← الملصق ← الجهاز ← الملخص
	[LabTestStatus.SAMPLE_COLLECTION]: [
		LabSampleStage.NOT_COLLECTED,
		LabSampleStage.COLLECTED,
		LabSampleStage.QUALITY_CHECK,
		LabSampleStage.LABEL_PRINT,
		LabSampleStage.ANALYZER_ASSIGNMENT,
		LabSampleStage.HANDOVER_SUMMARY,
	],
	[LabTestStatus.IN_LAB]: [LabSampleStage.ANALYZING, LabSampleStage.RESULTS_READY],
};

/**
 * الأولوية تُعدَّل قبل بدء سحب العيّنة فقط. بعده صار للطلب أثر مادي في المختبر
 * (عيّنة مسحوبة وملصقة وجهاز محجوز)، فترتيبه لم يعد مجرّد تفضيل يُعاد ضبطه.
 */
export const PRIORITY_LOCKED_MESSAGE = "لا يمكن تغيير الأولوية بعد بدء سحب العيّنة";

export const canChangePriority = (orderStatus: LabTestStatus): boolean => {
	const rank = LAB_STATUS_ORDER.indexOf(orderStatus as (typeof LAB_STATUS_ORDER)[number]);
	const lockRank = LAB_STATUS_ORDER.indexOf(LabTestStatus.SAMPLE_COLLECTION);
	return rank >= 0 && rank < lockRank;
};

/** المرحلة التي يبدأ بها التحليل عند دخول حالة ما */
export const entryStageFor = (status: LabTestStatus): LabSampleStage => {
	const stages = STAGES_BY_STATUS[status];
	return stages ? stages[0] : LabSampleStage.NOT_COLLECTED;
};

/**
 * فهرس آخر مرحلة بلغها التحليل في LAB_STAGE_ORDER، و-1 إذا لم يبدأ المسار بعد.
 *
 * المرحلة الفرعية وحدها لا تكفي: `entryStageFor` يُصفّرها إلى NOT_COLLECTED عند
 * كل تغيّر حالة لا مراحل فرعية لها — فتحليل «مكتمل» يخزّن أول مرحلة لا آخرها.
 * الحالة هي المرجع، والمرحلة تفصّل داخل «سحب العيّنة» و«في المختبر» وحدهما.
 */
export const labStageProgress = (status: LabTestStatus, stage: LabSampleStage): number => {
	switch (status) {
		case LabTestStatus.SAMPLE_COLLECTION:
		case LabTestStatus.IN_LAB:
			return LAB_STAGE_ORDER.indexOf(stage);
		case LabTestStatus.UNDER_REVIEW:
		case LabTestStatus.COMPLETED:
			return LAB_STAGE_ORDER.length - 1;
		// الطابور ومجدول وملغي: لم تُلمس العيّنة بعد (أو توقّف المسار قبل أثره)
		default:
			return -1;
	}
};

export const isLabTerminalStatus = (status: LabTestStatus): boolean =>
	(LAB_TERMINAL_STATUSES as readonly LabTestStatus[]).includes(status);

export const canLabTransition = (from: LabTestStatus, to: LabTestStatus): boolean =>
	ALLOWED_LAB_TRANSITIONS[from].includes(to);

export const invalidLabTransitionMessage = (from: LabTestStatus, to: LabTestStatus): string =>
	`لا يمكن نقل التحليل من "${LAB_STATUS_LABELS[from]}" إلى "${LAB_STATUS_LABELS[to]}"`;

/** المرحلة التالية للعيّنة ضمن الحالة نفسها، أو null إذا كانت آخر مرحلة فيها */
export const nextSampleStage = (
	stage: LabSampleStage,
	status?: LabTestStatus,
): LabSampleStage | null => {
	const scope = (status && STAGES_BY_STATUS[status]) ?? LAB_STAGE_ORDER;
	const i = scope.indexOf(stage);
	return i >= 0 && i < scope.length - 1 ? scope[i + 1] : null;
};

/** المرحلة السابقة للعيّنة ضمن الحالة نفسها، أو null إذا كانت أولى مراحلها */
export const previousSampleStage = (
	stage: LabSampleStage,
	status?: LabTestStatus,
): LabSampleStage | null => {
	const scope = (status && STAGES_BY_STATUS[status]) ?? LAB_STAGE_ORDER;
	const i = scope.indexOf(stage);
	return i > 0 ? scope[i - 1] : null;
};

/** لا يغادر التحليل مرحلة السحب قبل تسجيل سحب العيّنة فعلًا */
export const canLeaveSampleCollection = (
	status: LabTestStatus,
	stage: LabSampleStage,
): boolean =>
	status === LabTestStatus.SAMPLE_COLLECTION && stage === LabSampleStage.HANDOVER_SUMMARY;

export const SAMPLE_BLOCKED_MESSAGE = "أكمل خطوات سحب العيّنة أولًا قبل إرسالها إلى المختبر";

/** الانتقال إلى المراجعة مسموح فقط بعد ظهور النتائج */
export const canSendToReview = (status: LabTestStatus, stage: LabSampleStage): boolean =>
	status === LabTestStatus.IN_LAB && stage === LabSampleStage.RESULTS_READY;

export const REVIEW_BLOCKED_MESSAGE = "أدخل النتائج وانتقل إلى «ظهرت النتائج» أولاً";

// ── اشتقاق حالة الطلب من عناصره ────────────────────────────────────────────

/**
 * حالة الطلب = أقلّ عناصره تقدّمًا. التحاليل الملغاة تُستثنى ما لم تكن كلها
 * ملغاة، فالطلب الذي أُلغي أحد تحاليله لا يزال قائمًا ببقيّتها.
 */
export const deriveOrderStatus = (
	items: readonly { status: LabTestStatus }[],
): LabTestStatus => {
	if (items.length === 0) return LabTestStatus.QUEUE;
	const active = items.filter((i) => i.status !== LabTestStatus.CANCELLED);
	if (active.length === 0) return LabTestStatus.CANCELLED;

	let lowest = LAB_STATUS_ORDER.length - 1;
	for (const item of active) {
		const rank = LAB_STATUS_ORDER.indexOf(item.status as (typeof LAB_STATUS_ORDER)[number]);
		if (rank >= 0 && rank < lowest) lowest = rank;
	}
	return LAB_STATUS_ORDER[lowest];
};
