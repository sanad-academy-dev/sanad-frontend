import { RadiologyStage, RadiologyStatus } from "@/generated/prisma/enums";

// آلة حالات فحص الأشعة — المصدر الوحيد للانتقالات المسموحة.
// ملف بيانات/دوال نقية فقط (بدون db) — يُستورد من الخادم والواجهة معًا.
//
// الطلب الواحد قد يضم عدة فحوصات (صدر + بطن)، ولكل فحص سير عمله:
//   الطلبات → مجدول → تحضير الطفل → التصوير → كتابة التقرير → المراجعة → مكتملة
// «تحضير الطفل» ينقسم إلى:
//   فحص السلامة → تجهيز الطفل → تعيين الجهاز → الملخص والتسليم
// و«التصوير» ينقسم إلى:
//   الالتقاط → رفع الصور → فحص جودة الصور
// المراجعة: اعتماد ينقل إلى «مكتملة»، ورفض يُعيد إلى «كتابة التقرير» مع
// شارة «تم رفضها».
//
// حالة الطلب مشتقة من عناصره: أقلّها تقدّمًا (فالطلب ليس مكتملًا حتى يكتمل
// آخر فحوصاته).

export const RADIOLOGY_STATUS_LABELS: Record<RadiologyStatus, string> = {
	[RadiologyStatus.QUEUE]: "الطلبات",
	[RadiologyStatus.SCHEDULED]: "مجدول",
	[RadiologyStatus.PREPARATION]: "تحضير الطفل",
	[RadiologyStatus.IMAGING]: "التصوير",
	[RadiologyStatus.REPORTING]: "كتابة التقرير",
	[RadiologyStatus.UNDER_REVIEW]: "قيد المراجعة",
	[RadiologyStatus.COMPLETED]: "مكتملة",
	[RadiologyStatus.CANCELLED]: "ملغي",
};

export const RADIOLOGY_STAGE_LABELS: Record<RadiologyStage, string> = {
	[RadiologyStage.SAFETY_SCREENING]: "فحص السلامة",
	[RadiologyStage.PATIENT_PREP]: "تجهيز الطفل",
	[RadiologyStage.ROOM_ASSIGNMENT]: "تعيين الجهاز",
	[RadiologyStage.READY_CHECK]: "الملخص والتسليم",
	[RadiologyStage.ACQUISITION]: "الالتقاط",
	[RadiologyStage.IMAGE_UPLOAD]: "رفع الصور",
	[RadiologyStage.IMAGE_QC]: "جودة الصور",
};

export const ALLOWED_RADIOLOGY_TRANSITIONS: Record<
	RadiologyStatus,
	readonly RadiologyStatus[]
> = {
	[RadiologyStatus.QUEUE]: [RadiologyStatus.SCHEDULED, RadiologyStatus.CANCELLED],
	[RadiologyStatus.SCHEDULED]: [
		RadiologyStatus.PREPARATION,
		RadiologyStatus.QUEUE,
		RadiologyStatus.CANCELLED,
	],
	[RadiologyStatus.PREPARATION]: [
		RadiologyStatus.IMAGING,
		RadiologyStatus.SCHEDULED,
		RadiologyStatus.CANCELLED,
	],
	[RadiologyStatus.IMAGING]: [
		RadiologyStatus.REPORTING,
		RadiologyStatus.PREPARATION,
		RadiologyStatus.CANCELLED,
	],
	[RadiologyStatus.REPORTING]: [
		RadiologyStatus.UNDER_REVIEW,
		RadiologyStatus.IMAGING,
		RadiologyStatus.CANCELLED,
	],
	// المراجعة: اعتماد (مكتملة) أو رفض (العودة لكتابة التقرير)
	[RadiologyStatus.UNDER_REVIEW]: [RadiologyStatus.COMPLETED, RadiologyStatus.REPORTING],
	[RadiologyStatus.COMPLETED]: [],
	[RadiologyStatus.CANCELLED]: [],
};

export const RADIOLOGY_TERMINAL_STATUSES = [
	RadiologyStatus.COMPLETED,
	RadiologyStatus.CANCELLED,
] as const;

// ترتيب الحالات على اللوحة — يُستخدم لاشتقاق حالة الطلب من عناصره
export const RADIOLOGY_STATUS_ORDER = [
	RadiologyStatus.QUEUE,
	RadiologyStatus.SCHEDULED,
	RadiologyStatus.PREPARATION,
	RadiologyStatus.IMAGING,
	RadiologyStatus.REPORTING,
	RadiologyStatus.UNDER_REVIEW,
	RadiologyStatus.COMPLETED,
] as const;

// ترتيب المراحل الفرعية — التقدّم خطوة واحدة للأمام فقط
export const RADIOLOGY_STAGE_ORDER = [
	RadiologyStage.SAFETY_SCREENING,
	RadiologyStage.PATIENT_PREP,
	RadiologyStage.ROOM_ASSIGNMENT,
	RadiologyStage.READY_CHECK,
	RadiologyStage.ACQUISITION,
	RadiologyStage.IMAGE_UPLOAD,
	RadiologyStage.IMAGE_QC,
] as const;

// كل حالة تملك مراحلها الفرعية — التحضير يملك أول أربع مراحل والتصوير آخر ثلاث
export const STAGES_BY_RADIOLOGY_STATUS: Partial<
	Record<RadiologyStatus, readonly RadiologyStage[]>
> = {
	[RadiologyStatus.PREPARATION]: [
		RadiologyStage.SAFETY_SCREENING,
		RadiologyStage.PATIENT_PREP,
		RadiologyStage.ROOM_ASSIGNMENT,
		RadiologyStage.READY_CHECK,
	],
	[RadiologyStatus.IMAGING]: [
		RadiologyStage.ACQUISITION,
		RadiologyStage.IMAGE_UPLOAD,
		RadiologyStage.IMAGE_QC,
	],
};

/**
 * الأولوية تُعدَّل قبل بدء تحضير الطفل فقط. بعده صار للطلب أثر مادي
 * (طفل مُجهَّز وجهاز محجوز)، فترتيبه لم يعد مجرّد تفضيل يُعاد ضبطه.
 */
export const RADIOLOGY_PRIORITY_LOCKED_MESSAGE = "لا يمكن تغيير الأولوية بعد بدء تحضير الطفل";

export const canChangeRadiologyPriority = (orderStatus: RadiologyStatus): boolean => {
	const rank = RADIOLOGY_STATUS_ORDER.indexOf(
		orderStatus as (typeof RADIOLOGY_STATUS_ORDER)[number],
	);
	const lockRank = RADIOLOGY_STATUS_ORDER.indexOf(RadiologyStatus.PREPARATION);
	return rank >= 0 && rank < lockRank;
};

/** المرحلة التي يبدأ بها الفحص عند دخول حالة ما */
export const entryRadiologyStageFor = (status: RadiologyStatus): RadiologyStage => {
	const stages = STAGES_BY_RADIOLOGY_STATUS[status];
	return stages ? stages[0] : RadiologyStage.SAFETY_SCREENING;
};

/**
 * فهرس آخر مرحلة بلغها الفحص في RADIOLOGY_STAGE_ORDER، و-1 إذا لم يبدأ المسار.
 *
 * المرحلة الفرعية وحدها لا تكفي: `entryRadiologyStageFor` يُصفّرها عند كل تغيّر
 * حالة لا مراحل فرعية لها. الحالة هي المرجع، والمرحلة تفصّل داخل «تحضير
 * الطفل» و«التصوير» وحدهما.
 */
export const radiologyStageProgress = (
	status: RadiologyStatus,
	stage: RadiologyStage,
): number => {
	switch (status) {
		case RadiologyStatus.PREPARATION:
		case RadiologyStatus.IMAGING:
			return RADIOLOGY_STAGE_ORDER.indexOf(stage);
		case RadiologyStatus.REPORTING:
		case RadiologyStatus.UNDER_REVIEW:
		case RadiologyStatus.COMPLETED:
			return RADIOLOGY_STAGE_ORDER.length - 1;
		// الطلبات ومجدول وملغي: لم يبدأ التحضير بعد (أو توقّف المسار قبل أثره)
		default:
			return -1;
	}
};

export const isRadiologyTerminalStatus = (status: RadiologyStatus): boolean =>
	(RADIOLOGY_TERMINAL_STATUSES as readonly RadiologyStatus[]).includes(status);

export const canRadiologyTransition = (from: RadiologyStatus, to: RadiologyStatus): boolean =>
	ALLOWED_RADIOLOGY_TRANSITIONS[from].includes(to);

export const invalidRadiologyTransitionMessage = (
	from: RadiologyStatus,
	to: RadiologyStatus,
): string =>
	`لا يمكن نقل الفحص من "${RADIOLOGY_STATUS_LABELS[from]}" إلى "${RADIOLOGY_STATUS_LABELS[to]}"`;

/** المرحلة التالية ضمن الحالة نفسها، أو null إذا كانت آخر مرحلة فيها */
export const nextRadiologyStage = (
	stage: RadiologyStage,
	status?: RadiologyStatus,
): RadiologyStage | null => {
	const scope = (status && STAGES_BY_RADIOLOGY_STATUS[status]) ?? RADIOLOGY_STAGE_ORDER;
	const i = scope.indexOf(stage);
	return i >= 0 && i < scope.length - 1 ? scope[i + 1] : null;
};

/** المرحلة السابقة ضمن الحالة نفسها، أو null إذا كانت أولى مراحلها */
export const previousRadiologyStage = (
	stage: RadiologyStage,
	status?: RadiologyStatus,
): RadiologyStage | null => {
	const scope = (status && STAGES_BY_RADIOLOGY_STATUS[status]) ?? RADIOLOGY_STAGE_ORDER;
	const i = scope.indexOf(stage);
	return i > 0 ? scope[i - 1] : null;
};

/** لا يغادر الفحص مرحلة التحضير قبل بلوغ الملخص والتسليم */
export const canLeavePreparation = (status: RadiologyStatus, stage: RadiologyStage): boolean =>
	status === RadiologyStatus.PREPARATION && stage === RadiologyStage.READY_CHECK;

export const PREPARATION_BLOCKED_MESSAGE =
	"أكمل خطوات تحضير الطفل أولًا قبل الانتقال إلى التصوير";

/** لا يغادر الفحص مرحلة التصوير قبل فحص جودة الصور */
export const canLeaveImaging = (status: RadiologyStatus, stage: RadiologyStage): boolean =>
	status === RadiologyStatus.IMAGING && stage === RadiologyStage.IMAGE_QC;

export const IMAGING_BLOCKED_MESSAGE =
	"ارفع الصور وأكمل فحص جودتها أولًا قبل الانتقال إلى كتابة التقرير";

/** الانتقال إلى المراجعة مسموح فقط من كتابة التقرير */
export const canSendRadiologyToReview = (status: RadiologyStatus): boolean =>
	status === RadiologyStatus.REPORTING;

export const RADIOLOGY_REVIEW_BLOCKED_MESSAGE =
	"اكتب الموجودات والانطباع في التقرير أولًا قبل إرساله للمراجعة";

// ── الجدولة ────────────────────────────────────────────────────────────────

/**
 * الفحص المجدول يبقى في «مجدول» حتى يحين موعده: لا يُسحب منه تلقائيًا قبل
 * الوقت. الفنّي يستطيع بدأه يدويًا (وصول مبكّر أمر شائع)، لكن لا شيء يحرّكه
 * من تلقائه قبل موعده. غياب الموعد يعني «فور السداد» — سلوك ما قبل الجدولة.
 */
export const isRadiologyDue = (
	scheduledAt: Date | string | null | undefined,
	now: Date = new Date(),
): boolean => {
	if (!scheduledAt) return true;
	const at = typeof scheduledAt === "string" ? new Date(scheduledAt) : scheduledAt;
	return Number.isNaN(at.getTime()) || at.getTime() <= now.getTime();
};

/** كم بقي على الموعد — موجب: لم يحن بعد، سالب: تأخّر. بالدقائق */
export const radiologyMinutesUntilDue = (
	scheduledAt: Date | string | null | undefined,
	now: Date = new Date(),
): number | null => {
	if (!scheduledAt) return null;
	const at = typeof scheduledAt === "string" ? new Date(scheduledAt) : scheduledAt;
	if (Number.isNaN(at.getTime())) return null;
	return Math.round((at.getTime() - now.getTime()) / 60000);
};

// ── اشتقاق حالة الطلب من عناصره ────────────────────────────────────────────

/**
 * حالة الطلب = أقلّ عناصره تقدّمًا. الفحوصات الملغاة تُستثنى ما لم تكن كلها
 * ملغاة، فالطلب الذي أُلغي أحد فحوصاته لا يزال قائمًا ببقيّتها.
 */
export const deriveRadiologyOrderStatus = (
	items: readonly { status: RadiologyStatus }[],
): RadiologyStatus => {
	if (items.length === 0) return RadiologyStatus.QUEUE;
	const active = items.filter((i) => i.status !== RadiologyStatus.CANCELLED);
	if (active.length === 0) return RadiologyStatus.CANCELLED;

	let lowest = RADIOLOGY_STATUS_ORDER.length - 1;
	for (const item of active) {
		const rank = RADIOLOGY_STATUS_ORDER.indexOf(
			item.status as (typeof RADIOLOGY_STATUS_ORDER)[number],
		);
		if (rank >= 0 && rank < lowest) lowest = rank;
	}
	return RADIOLOGY_STATUS_ORDER[lowest];
};
