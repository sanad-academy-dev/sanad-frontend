import {
	ChecklistScope,
	OperationStage,
	OperationStatus,
	OperationTier,
	OperationUrgency,
} from "@/generated/prisma/enums";

// آلة حالات العملية الجراحية — المصدر الوحيد للمسارات والانتقالات والبوابات.
// ملف بيانات/دوال نقية فقط (بدون db) — يُستورد من الخادم والواجهة معًا.
// الخطة الحاكمة: docs/operations-module-plan.md (§3 المسارات، §5 البوابات G1–G10).
//
// مسار واحد لكل شيء — من خياطة جرح إلى فتح بطن:
//   مجدولة → التحضير → التخدير → العملية → الإفاقة → الخروج → المتابعة → مكتملة
// درجة التعقيد (tier) لا تغيّر الآلة؛ تحدد الأعمدة الفعّالة والبوابات الإلزامية:
//   الصغرى تختصر: مجدولة → التحضير → العملية → الخروج → مكتملة
// الطوارئ (IMMEDIATE) تتجاوز أي بوابة بسبب مسجَّل — لا تمنع البوابات إنقاذ حياة،
// لكن كل تجاوز يبقى مرئيًا في سجل النشاط وتقارير الالتزام (S21).

export const OPERATION_STATUS_LABELS: Record<OperationStatus, string> = {
	[OperationStatus.SCHEDULED]: "مجدولة",
	[OperationStatus.PREP]: "التحضير",
	[OperationStatus.ANESTHESIA]: "التخدير",
	[OperationStatus.SURGERY]: "العملية",
	[OperationStatus.RECOVERY]: "الإفاقة",
	[OperationStatus.DISCHARGE]: "الخروج",
	[OperationStatus.FOLLOW_UP]: "المتابعة",
	[OperationStatus.COMPLETED]: "مكتملة",
	[OperationStatus.CANCELLED]: "ملغاة",
};

export const OPERATION_STAGE_LABELS: Record<OperationStage, string> = {
	[OperationStage.CONSENT]: "الموافقات",
	[OperationStage.FASTING_CHECK]: "التحقق من الصيام",
	[OperationStage.ASSESSMENT]: "تقييم ما قبل التخدير",
	[OperationStage.PREMED]: "التمهيد الدوائي",
	[OperationStage.SIGN_IN]: "قائمة الدخول",
	[OperationStage.INDUCTION]: "بدء التخدير",
	[OperationStage.MAINTENANCE]: "استمرار التخدير",
	[OperationStage.TIME_OUT]: "الوقفة الآمنة",
	[OperationStage.IN_PROGRESS]: "الجراحة جارية",
	[OperationStage.CLOSING]: "الإغلاق",
	[OperationStage.SIGN_OUT]: "قائمة الخروج",
	[OperationStage.MONITORING]: "مراقبة الإفاقة",
	[OperationStage.READY_FOR_DISCHARGE]: "جاهز للخروج",
};

export const OPERATION_TIER_LABELS: Record<OperationTier, string> = {
	[OperationTier.MINOR]: "صغرى",
	[OperationTier.INTERMEDIATE]: "متوسطة",
	[OperationTier.MAJOR]: "كبرى",
};

// تصنيف NCEPOD للأولوية الجراحية (S3)
export const OPERATION_URGENCY_LABELS: Record<OperationUrgency, string> = {
	[OperationUrgency.IMMEDIATE]: "فورية",
	[OperationUrgency.URGENT]: "عاجلة",
	[OperationUrgency.EXPEDITED]: "مبكرة",
	[OperationUrgency.ELECTIVE]: "اختيارية",
};

// الأشد إلحاحًا أولًا — لترتيب اللوحة والتنبيهات
export const OPERATION_URGENCY_ORDER = [
	OperationUrgency.IMMEDIATE,
	OperationUrgency.URGENT,
	OperationUrgency.EXPEDITED,
	OperationUrgency.ELECTIVE,
] as const;

// ── درجات التعقيد ──────────────────────────────────────────────────────────

export const OPERATION_TIER_ORDER = [
	OperationTier.MINOR,
	OperationTier.INTERMEDIATE,
	OperationTier.MAJOR,
] as const;

export const operationTierRank = (tier: OperationTier): number =>
	OPERATION_TIER_ORDER.indexOf(tier as (typeof OPERATION_TIER_ORDER)[number]);

/** درجة الحالة = أعلى درجات إجراءاتها — إضافة إجراء صغير لجراحة كبرى لا تخفّض السقف */
export const maxOperationTier = (tiers: readonly OperationTier[]): OperationTier => {
	let max: OperationTier = OperationTier.MINOR;
	for (const tier of tiers) {
		if (operationTierRank(tier) > operationTierRank(max)) max = tier;
	}
	return max;
};

// ── المسارات — الأعمدة الفعّالة حسب الدرجة (الخطة §3.1) ────────────────────

export type OperationPathway = readonly OperationStatus[];

export const FULL_OPERATION_PATHWAY: OperationPathway = [
	OperationStatus.SCHEDULED,
	OperationStatus.PREP,
	OperationStatus.ANESTHESIA,
	OperationStatus.SURGERY,
	OperationStatus.RECOVERY,
	OperationStatus.DISCHARGE,
	OperationStatus.FOLLOW_UP,
	OperationStatus.COMPLETED,
] as const;

// الصغرى: بلا عمود تخدير مستقل ولا إفاقة مراقَبة ولا متابعة إلزامية
export const MINOR_OPERATION_PATHWAY: OperationPathway = [
	OperationStatus.SCHEDULED,
	OperationStatus.PREP,
	OperationStatus.SURGERY,
	OperationStatus.DISCHARGE,
	OperationStatus.COMPLETED,
] as const;

export const operationPathwayFor = (tier: OperationTier): OperationPathway =>
	tier === OperationTier.MINOR ? MINOR_OPERATION_PATHWAY : FULL_OPERATION_PATHWAY;

export const OPERATION_TERMINAL_STATUSES = [
	OperationStatus.COMPLETED,
	OperationStatus.CANCELLED,
] as const;

export const isOperationTerminalStatus = (status: OperationStatus): boolean =>
	(OPERATION_TERMINAL_STATUSES as readonly OperationStatus[]).includes(status);

// ── الانتقالات — خطوة واحدة للأمام أو للخلف ضمن مسار الدرجة ────────────────

/**
 * الإلغاء مسموح ما لم يبدأ فعل جراحي لا يُمحى: حتى نهاية «الوقفة الآمنة».
 * بعد بدء الجراحة فعليًا يوثَّق الإيقاف في التقرير الجراحي، لا كإلغاء.
 */
export const canCancelOperation = (
	status: OperationStatus,
	stage: OperationStage | null,
): boolean => {
	if (isOperationTerminalStatus(status)) return false;
	if (status === OperationStatus.SURGERY) return stage === OperationStage.TIME_OUT;
	return (
		status === OperationStatus.SCHEDULED ||
		status === OperationStatus.PREP ||
		status === OperationStatus.ANESTHESIA
	);
};

export const OPERATION_CANCEL_BLOCKED_MESSAGE =
	"لا يمكن إلغاء العملية بعد بدء الجراحة — يوثَّق الإيقاف في التقرير الجراحي";

/**
 * خطوة واحدة للأمام أو للخلف ضمن مسار الدرجة. الإلغاء له مساره الخاص
 * (canCancelOperation لأنه يحتاج المرحلة). الحالات النهائية لا تُغادَر (S21).
 */
export const canOperationTransition = (
	tier: OperationTier,
	from: OperationStatus,
	to: OperationStatus,
): boolean => {
	if (from === to) return false;
	if (isOperationTerminalStatus(from)) return false;
	if (to === OperationStatus.CANCELLED) return true; // البوابة الفعلية في canCancelOperation
	const pathway = operationPathwayFor(tier);
	const fromIndex = pathway.indexOf(from);
	const toIndex = pathway.indexOf(to);
	if (fromIndex < 0 || toIndex < 0) return false;
	return toIndex === fromIndex + 1 || toIndex === fromIndex - 1;
};

export const invalidOperationTransitionMessage = (
	from: OperationStatus,
	to: OperationStatus,
): string =>
	`لا يمكن نقل العملية من "${OPERATION_STATUS_LABELS[from]}" إلى "${OPERATION_STATUS_LABELS[to]}"`;

// ── المراحل الفرعية داخل الحالات (نمط RadiologyStage) ──────────────────────

const FULL_STAGES_BY_STATUS: Partial<Record<OperationStatus, readonly OperationStage[]>> = {
	[OperationStatus.PREP]: [
		OperationStage.CONSENT,
		OperationStage.FASTING_CHECK,
		OperationStage.ASSESSMENT,
		OperationStage.PREMED,
	],
	[OperationStatus.ANESTHESIA]: [
		OperationStage.SIGN_IN,
		OperationStage.INDUCTION,
		OperationStage.MAINTENANCE,
	],
	[OperationStatus.SURGERY]: [
		OperationStage.TIME_OUT,
		OperationStage.IN_PROGRESS,
		OperationStage.CLOSING,
		OperationStage.SIGN_OUT,
	],
	[OperationStatus.RECOVERY]: [OperationStage.MONITORING, OperationStage.READY_FOR_DISCHARGE],
};

// الصغرى: تحضير مختصر، والقائمة الموحدة تسبق دخول «العملية» فلا وقفة مستقلة
const MINOR_STAGES_BY_STATUS: Partial<Record<OperationStatus, readonly OperationStage[]>> = {
	[OperationStatus.PREP]: [OperationStage.CONSENT, OperationStage.ASSESSMENT],
	[OperationStatus.SURGERY]: [OperationStage.IN_PROGRESS, OperationStage.CLOSING],
};

export const operationStagesFor = (
	status: OperationStatus,
	tier: OperationTier,
): readonly OperationStage[] =>
	(tier === OperationTier.MINOR ? MINOR_STAGES_BY_STATUS : FULL_STAGES_BY_STATUS)[status] ??
	[];

/** المرحلة التي تبدأ بها الحالة عند دخولها — null لحالة بلا مراحل فرعية */
export const entryOperationStageFor = (
	status: OperationStatus,
	tier: OperationTier,
): OperationStage | null => operationStagesFor(status, tier)[0] ?? null;

/** المرحلة التالية ضمن الحالة نفسها، أو null إذا كانت الأخيرة */
export const nextOperationStage = (
	status: OperationStatus,
	tier: OperationTier,
	stage: OperationStage,
): OperationStage | null => {
	const scope = operationStagesFor(status, tier);
	const i = scope.indexOf(stage);
	return i >= 0 && i < scope.length - 1 ? scope[i + 1] : null;
};

/** المرحلة السابقة ضمن الحالة نفسها، أو null إذا كانت الأولى */
export const previousOperationStage = (
	status: OperationStatus,
	tier: OperationTier,
	stage: OperationStage,
): OperationStage | null => {
	const scope = operationStagesFor(status, tier);
	const i = scope.indexOf(stage);
	return i > 0 ? scope[i - 1] : null;
};

// ── البوابات G1–G10 (الخطة §5.2) ───────────────────────────────────────────

export type OperationGate =
	| "G1_CONSENT"
	| "G2_FASTING"
	| "G3_ASSESSMENT"
	| "G4_SIGN_IN"
	| "G5_TIME_OUT"
	| "G6_SIGN_OUT"
	| "G7_OPERATIVE_NOTE"
	| "G8_RECOVERY_SCORE"
	| "G9_DISCHARGE_ORDERS"
	| "G10_PAYMENT";

export const OPERATION_GATE_BLOCKED_MESSAGES: Record<OperationGate, string> = {
	G1_CONSENT: "لا يمكن المتابعة قبل توقيع الموافقات المطلوبة",
	G2_FASTING: "لا يمكن المتابعة قبل التحقق من الصيام وتسجيل أوقاته",
	G3_ASSESSMENT: "لا يمكن المتابعة قبل إكمال تقييم ما قبل التخدير وتحديد درجة ASA",
	G4_SIGN_IN: "أكمل قائمة الدخول (Sign-In) أولًا",
	G5_TIME_OUT: "لا شقّ جراحيًا قبل إكمال الوقفة الآمنة (Time-Out)",
	G6_SIGN_OUT: "أكمل قائمة الخروج (Sign-Out) — العدّ والعينات — قبل مغادرة قاعة العمليات",
	G7_OPERATIVE_NOTE: "وقّع التقرير الجراحي أولًا",
	G8_RECOVERY_SCORE: "درجة الإفاقة دون الحد المطلوب للخروج",
	G9_DISCHARGE_ORDERS: "أصدر تعليمات الخروج والرعاية المنزلية أولًا",
	G10_PAYMENT: "لا يمكن المتابعة قبل سداد الدفعة المطلوبة",
};

export type OperationGateContext = {
	/** تخدير/تهدئة مخطَّطة — ترفع متطلبات الصغرى إلى بوابات التخدير */
	sedationPlanned?: boolean;
	/** بوابة السداد مفعّلة من إعدادات الأكاديمية (G10 — القرار D3: معطّلة افتراضيًا) */
	paymentGateEnabled?: boolean;
	/** العدّ الجراحي مطلوب للصغرى أيضًا (القرار D7 — إعداد أكاديمية، معطّل افتراضيًا) */
	countsForMinor?: boolean;
};

/** كل البوابات الإلزامية لهذه الدرجة — مرجع الواجهة لعرض المتطلبات مسبقًا */
export const requiredOperationGates = (
	tier: OperationTier,
	context: OperationGateContext = {},
): readonly OperationGate[] => {
	const intermediateUp = tier !== OperationTier.MINOR;
	const anesthetic = intermediateUp || context.sedationPlanned === true;
	const gates: OperationGate[] = ["G1_CONSENT"];
	if (anesthetic) gates.push("G2_FASTING", "G3_ASSESSMENT");
	gates.push("G4_SIGN_IN");
	if (intermediateUp) gates.push("G5_TIME_OUT");
	// قائمة الخروج (العدّ والعينات): للمتوسطة فما فوق، وللصغرى حين تفعّلها الأكاديمية (D7)
	if (intermediateUp || context.countsForMinor) gates.push("G6_SIGN_OUT");
	gates.push("G7_OPERATIVE_NOTE");
	if (intermediateUp) gates.push("G8_RECOVERY_SCORE");
	gates.push("G9_DISCHARGE_ORDERS");
	if (context.paymentGateEnabled) gates.push("G10_PAYMENT");
	return gates;
};

/**
 * بوابات انتقال حالة بعينه — تقاطع بوابات الدرجة مع موضع الانتقال في المسار.
 * G5 (الوقفة الآمنة) بوابة مرحلة لا حالة: تحرس TIME_OUT → IN_PROGRESS عبر
 * gatesForOperationStageAdvance.
 */
export const gatesForOperationTransition = (
	tier: OperationTier,
	from: OperationStatus,
	to: OperationStatus,
	context: OperationGateContext = {},
): readonly OperationGate[] => {
	const pathway = operationPathwayFor(tier);
	const fromIndex = pathway.indexOf(from);
	const toIndex = pathway.indexOf(to);
	if (fromIndex < 0 || toIndex !== fromIndex + 1) return []; // التراجع والإلغاء بلا بوابات
	const required = requiredOperationGates(tier, context);
	const has = (gate: OperationGate) => required.includes(gate);
	const gates: OperationGate[] = [];

	if (from === OperationStatus.SCHEDULED && has("G10_PAYMENT")) gates.push("G10_PAYMENT");
	if (from === OperationStatus.PREP) {
		if (has("G1_CONSENT")) gates.push("G1_CONSENT");
		if (has("G2_FASTING")) gates.push("G2_FASTING");
		if (has("G3_ASSESSMENT")) gates.push("G3_ASSESSMENT");
		// الصغرى بلا عمود تخدير — قائمتها الموحدة تسبق دخول «العملية» مباشرة
		if (tier === OperationTier.MINOR && has("G4_SIGN_IN")) gates.push("G4_SIGN_IN");
	}
	if (from === OperationStatus.ANESTHESIA && has("G4_SIGN_IN")) gates.push("G4_SIGN_IN");
	if (from === OperationStatus.SURGERY) {
		if (has("G6_SIGN_OUT")) gates.push("G6_SIGN_OUT");
		// الصغرى بلا إفاقة — التقرير الجراحي شرط مغادرة «العملية» نفسها
		if (tier === OperationTier.MINOR && has("G7_OPERATIVE_NOTE"))
			gates.push("G7_OPERATIVE_NOTE");
	}
	if (from === OperationStatus.RECOVERY) {
		if (has("G7_OPERATIVE_NOTE")) gates.push("G7_OPERATIVE_NOTE");
		if (has("G8_RECOVERY_SCORE")) gates.push("G8_RECOVERY_SCORE");
	}
	if (from === OperationStatus.DISCHARGE && has("G9_DISCHARGE_ORDERS"))
		gates.push("G9_DISCHARGE_ORDERS");

	return gates;
};

/** بوابة مغادرة كل مرحلة — لا تخطّي مرحلة قبل استيفاء متطلباتها */
const GATE_BY_STAGE_EXIT: Partial<Record<OperationStage, OperationGate>> = {
	[OperationStage.CONSENT]: "G1_CONSENT",
	[OperationStage.FASTING_CHECK]: "G2_FASTING",
	[OperationStage.ASSESSMENT]: "G3_ASSESSMENT",
	[OperationStage.SIGN_IN]: "G4_SIGN_IN",
	[OperationStage.TIME_OUT]: "G5_TIME_OUT",
	[OperationStage.MONITORING]: "G8_RECOVERY_SCORE",
};

/**
 * بوابات تقدّم المراحل داخل الحالة — كل مرحلة محروسة لا تُغادَر قبل استيفاء
 * متطلباتها (الموافقة، الصيام، التقييم، القوائم، درجة الإفاقة). الوقفة الآمنة
 * تحرس بدء الشق الجراحي (S1, S4).
 */
export const gatesForOperationStageAdvance = (
	tier: OperationTier,
	_status: OperationStatus,
	fromStage: OperationStage,
	context: OperationGateContext = {},
): readonly OperationGate[] => {
	const gate = GATE_BY_STAGE_EXIT[fromStage];
	if (!gate) return [];
	const required = requiredOperationGates(tier, context);
	return required.includes(gate) ? [gate] : [];
};

// ── قوائم التحقق — أي نطاق يخدم أي بوابة (S1) ──────────────────────────────

export const checklistScopeForGate = (
	gate: OperationGate,
	tier: OperationTier,
): ChecklistScope | null => {
	switch (gate) {
		case "G4_SIGN_IN":
			return tier === OperationTier.MINOR
				? ChecklistScope.OPERATION_MINOR_COMBINED
				: ChecklistScope.OPERATION_SIGN_IN;
		case "G5_TIME_OUT":
			return ChecklistScope.OPERATION_TIME_OUT;
		case "G6_SIGN_OUT":
			return ChecklistScope.OPERATION_SIGN_OUT;
		default:
			return null;
	}
};

// ── درجة الإفاقة (S14) ─────────────────────────────────────────────────────

/**
 * حد الخروج من الإفاقة على مقياس 0–10 (نمط Aldrete؛ المعيار البشري ≥9،
 * والبيطري الشائع ≥8). يصبح إعداد أكاديمية في OP8 (ClinicProtocols).
 */
export const RECOVERY_DISCHARGE_SCORE_MIN = 8;

// ── تجاوز الطوارئ (break-glass — الخطة §5.2، S21) ──────────────────────────

/**
 * الحالة الفورية وحدها تتجاوز البوابات — بسبب إلزامي يُسجَّل في سجل النشاط
 * ويظهر في تقارير الالتزام. البوابات لا تمنع إنقاذ حياة أبدًا.
 */
export const canOverrideOperationGates = (urgency: OperationUrgency): boolean =>
	urgency === OperationUrgency.IMMEDIATE;

export const OPERATION_OVERRIDE_REASON_REQUIRED_MESSAGE = "تجاوز بوابة أمان يتطلب تسجيل السبب";

export const OPERATION_OVERRIDE_FORBIDDEN_MESSAGE =
	"تجاوز بوابات الأمان متاح للحالات الفورية (إنقاذ حياة) فقط";

// ── الأولوية — التصعيد دائمًا، والتخفيض قبل بدء التخدير فقط ────────────────

export const canChangeOperationUrgency = (
	status: OperationStatus,
	from: OperationUrgency,
	to: OperationUrgency,
): boolean => {
	if (isOperationTerminalStatus(status)) return false;
	const escalating =
		OPERATION_URGENCY_ORDER.indexOf(to as (typeof OPERATION_URGENCY_ORDER)[number]) <
		OPERATION_URGENCY_ORDER.indexOf(from as (typeof OPERATION_URGENCY_ORDER)[number]);
	if (escalating) return true; // التدهور السريري لا ينتظر عمودًا بعينه
	return status === OperationStatus.SCHEDULED || status === OperationStatus.PREP;
};

export const OPERATION_URGENCY_LOCKED_MESSAGE = "لا يمكن تخفيض أولوية العملية بعد بدء التخدير";

// ── الجدولة (نمط الأشعة) ───────────────────────────────────────────────────

/** حان موعد العملية المجدولة؟ غياب الموعد يعني «جاهزة الآن» */
export const isOperationDue = (
	scheduledAt: Date | string | null | undefined,
	now: Date = new Date(),
): boolean => {
	if (!scheduledAt) return true;
	const at = typeof scheduledAt === "string" ? new Date(scheduledAt) : scheduledAt;
	return Number.isNaN(at.getTime()) || at.getTime() <= now.getTime();
};

/** كم بقي على الموعد — موجب: لم يحن بعد، سالب: تأخّر. بالدقائق */
export const operationMinutesUntilDue = (
	scheduledAt: Date | string | null | undefined,
	now: Date = new Date(),
): number | null => {
	if (!scheduledAt) return null;
	const at = typeof scheduledAt === "string" ? new Date(scheduledAt) : scheduledAt;
	if (Number.isNaN(at.getTime())) return null;
	return Math.round((at.getTime() - now.getTime()) / 60000);
};

// ── استيفاء البوابات من لقطة الحالة — نفس منطق الخادم للواجهة (§5.2) ─────────

/** ما تحتاجه دوال الاستيفاء من الحالة — بنيوي كي يقبل استجابة التفاصيل كما هي */
export type OperationGateSnapshot = {
	consents: readonly {
		type: string;
		signedAt: Date | string | null;
		revokedAt: Date | string | null;
	}[];
	assessment: { asaClass: number | null; fastingVerified: boolean } | null;
	checklistRuns: readonly { scope: string; completedAt: Date | string | null }[];
	/** مرتّبة الأحدث أولًا — كما تُرجعها استجابة التفاصيل */
	recoveryAssessments: readonly { score: number | null }[];
};

/**
 * هل استوفت الحالة بوابة بعينها؟ — مرآة واجهة لمنطق الخادم كي تُعطَّل
 * أزرار التقدّم بالسبب نفسه قبل نداء يُرفض حتمًا. الخادم يبقى الحكم.
 */
export const isOperationGateMet = (
	gate: OperationGate,
	snapshot: OperationGateSnapshot,
	tier: OperationTier,
	context: OperationGateContext = {},
	recoveryScoreMin: number = RECOVERY_DISCHARGE_SCORE_MIN,
): boolean => {
	switch (gate) {
		case "G1_CONSENT": {
			const signed = new Set(
				snapshot.consents
					.filter((consent) => consent.signedAt && !consent.revokedAt)
					.map((consent) => consent.type),
			);
			return signed.has("SURGICAL") && (!context.sedationPlanned || signed.has("ANESTHESIA"));
		}
		case "G2_FASTING":
			return snapshot.assessment?.fastingVerified === true;
		case "G3_ASSESSMENT":
			return snapshot.assessment?.asaClass != null;
		case "G4_SIGN_IN":
		case "G5_TIME_OUT":
		case "G6_SIGN_OUT": {
			const scope = checklistScopeForGate(gate, tier);
			return (
				!!scope && snapshot.checklistRuns.some((run) => run.scope === scope && run.completedAt)
			);
		}
		case "G8_RECOVERY_SCORE": {
			const latest = snapshot.recoveryAssessments.find((r) => r.score != null);
			return latest?.score != null && latest.score >= recoveryScoreMin;
		}
		default:
			// G7/G9/G10 تُقيَّم لدى الخادم وحده (التقرير والأوامر والسداد ليست في اللقطة)
			return true;
	}
};

/** البوابة غير المستوفاة التي تمنع مغادرة المرحلة الحالية — null: الطريق سالك */
export const unmetOperationStageGate = (
	snapshot: OperationGateSnapshot,
	tier: OperationTier,
	status: OperationStatus,
	stage: OperationStage | null,
	context: OperationGateContext = {},
	recoveryScoreMin: number = RECOVERY_DISCHARGE_SCORE_MIN,
): OperationGate | null => {
	if (!stage) return null;
	const gates = gatesForOperationStageAdvance(tier, status, stage, context);
	return (
		gates.find((g) => !isOperationGateMet(g, snapshot, tier, context, recoveryScoreMin)) ??
		null
	);
};
