import {
	EmergencyStability,
	InboxImportance,
	InpatientAcuity,
	InpatientStayKind,
	OperationUrgency,
	TaskPriority,
	TriageCategory,
} from "@/generated/prisma/enums";

/**
 * [E0] قواعد الفرز — **الملفّ الذي يقرّر كل أثر يترتّب على لون الفرز**.
 *
 * الخطة الحاكمة: `docs/emergency-workflow-plan.md` §4.1
 *
 * ── لماذا جدول واحد لا شروط مبعثرة ──────────────────────────────────────────
 *
 * الوسم يُكتب مرّة واحدة على الزيارة، وكل وحدة أخرى تشتقّ مفرداتها هي منه: التحاليل
 * تشتقّ `priority`، والعمليات `urgency`، والتنويم `acuity`. لو كُتب كل اشتقاق عند
 * موضعه لانقسمت السياسة على ستّة ملفّات ولاختلفت بينها بعد شهرين. هنا صفٌّ واحد لكل
 * لون، ومن أراد تغيير سياسة الأحمر غيّر سطرًا واحدًا ورأى أثره كلّه.
 *
 * ── لماذا في الشيفرة لا في جدول إعدادات ─────────────────────────────────────
 *
 * نفس عقد `VITAL_REFERENCE_RANGES` و`DrugMonograph` حرفيًّا: **العتبة التي تقرّر من
 * يُرى أوّلًا تُراجَع في طلب دمج ويوقّعها إنسان.** هدفُ انتظارٍ يُحرَّر من شاشة
 * إعدادات بلا أثر ولا مراجعة هو هدفٌ سيُرخى أوّل ليلة مزدحمة، ثم يصير الرقم كذبًا
 * تُقاس عليه تقارير الالتزام.
 *
 * ── مصدر الأرقام ────────────────────────────────────────────────────────────
 *
 * الأهداف الزمنية هي أهداف قائمة الفرز البيطرية (VTL — Ruys et al. 2012) المشتقّة
 * من مقياس مانشستر الخماسي: 0 / 15 / 30–60 / 120 / 240 دقيقة. أُخذ الحدّ الأعلى في
 * الأصفر (60) لأن الهدف يُقاس عليه التزامٌ، والقياس على الحدّ الأضيق يجعل الالتزام
 * كذبًا مريحًا.
 *
 * وخريطة `operationUrgency` هي تصنيف NCEPOD نفسه الذي تستعمله وحدة العمليات (S3 في
 * خطتها) — فالأحمر يرث `IMMEDIATE`، وهي القيمة الوحيدة التي تفتح
 * `canOverrideOperationGates`. أي أن تجاوز بوابات العملية لحالة إنقاذ حياة يعمل
 * **بلا سطر شيفرة جديد** في وحدة العمليات.
 *
 * `reviewed: false` تعني «لم تُقرّها الأكاديمية بعد» فتظهر الشاشة الصفّ بعلامة — القرار
 * D6. وتوليد أيٍّ من هذه الأرقام من نموذج لغوي ممنوع.
 */

/** مستويات توجيه التنبيه — من يُوقَظ، ومتى */
export type TriageAlertTier =
	| "ER_TEAM_AND_ON_SHIFT" /// فريق الطوارئ + كل مدرّب في الوردية الآن */
	| "ER_TEAM" /// مستقبلو تنبيهات الطوارئ في الفرع */
	| "QUEUE_RESPONSIBLES" /// مسؤولو الطابور المحدَّدون في إعدادات الفرع */
	| "NONE"; /// لا تنبيه — اللون العادي لا يُوقظ أحدًا */

export type TriageRule = {
	/** هدف الانتظار بالدقائق — 0 يعني «الآن»، ويُعامَل كتجاوزٍ فور الوصول */
	targetMinutes: number;
	/**
	 * [E5] إيقاع إعادة التقييم بالدقائق بعد آخر تقييم. الطفل يتدهور في قاعة
	 * الانتظار، والتقييم الواحد لا يرى ذلك؛ تجاوز الإيقاع يظهر على اللوحة ويوقظ
	 * المدرّب المعالج. (القرار ٣ — الإيقاع في هذا الملفّ لا في شاشة إعدادات.)
	 */
	reassessmentMinutes: number;
	/** رتبة الترتيب في الطابور — الأصغر أوّلًا */
	queueRank: number;
	/** الأولوية الافتراضية لطلب تحليل يُفتح من هذه الزيارة */
	labPriority: TaskPriority;
	/** الأولوية الافتراضية لطلب أشعة */
	radiologyPriority: TaskPriority;
	/** إلحاح العملية الافتراضي (تصنيف NCEPOD) */
	operationUrgency: OperationUrgency;
	/** نوع التنويم الافتراضي عند الإدخال من هذه الزيارة */
	inpatientKind: InpatientStayKind;
	/** درجة الحرجية الافتراضية — منها يشتقّ التنويم فترة المراقبة */
	inpatientAcuity: InpatientAcuity;
	/** أهمية عنصر الوارد */
	inboxImportance: InboxImportance;
	/** من يُنبَّه */
	alertTier: TriageAlertTier;
	/** تأجيل واجهة التحصيل حتى `AWAITING_PAYMENT` — ترتيبُ واجهة لا مسٌّ بالدفتر */
	deferPaymentUx: boolean;
	/** المشي السريع في آلة الحالات عند الفرز (القرار D5) */
	fastWalk: boolean;
	/** مرجع الرقم */
	sourceCitation: string;
	/** false = مبدئي ينتظر إقرار الأكاديمية (D6) */
	reviewed: boolean;
};

const VTL_CITATION =
	"قائمة الفرز البيطرية (VTL) — Ruys et al. 2012، مشتقّة من مقياس مانشستر الخماسي؛ " +
	"إلحاح العملية بتصنيف NCEPOD كما في خطة وحدة العمليات §S3 — مبدئي ينتظر إقرار الأكاديمية (D6)";

export const TRIAGE_RULES: Record<TriageCategory, TriageRule> = {
	[TriageCategory.RED]: {
		targetMinutes: 0,
		reassessmentMinutes: 15,
		queueRank: 0,
		labPriority: TaskPriority.URGENT,
		radiologyPriority: TaskPriority.URGENT,
		operationUrgency: OperationUrgency.IMMEDIATE,
		inpatientKind: InpatientStayKind.ICU,
		inpatientAcuity: InpatientAcuity.CRITICAL,
		inboxImportance: InboxImportance.HIGH,
		alertTier: "ER_TEAM_AND_ON_SHIFT",
		deferPaymentUx: true,
		fastWalk: true,
		sourceCitation: VTL_CITATION,
		reviewed: false,
	},
	[TriageCategory.ORANGE]: {
		targetMinutes: 15,
		reassessmentMinutes: 30,
		queueRank: 1,
		labPriority: TaskPriority.URGENT,
		radiologyPriority: TaskPriority.URGENT,
		operationUrgency: OperationUrgency.URGENT,
		inpatientKind: InpatientStayKind.MEDICAL,
		inpatientAcuity: InpatientAcuity.HIGH,
		inboxImportance: InboxImportance.HIGH,
		alertTier: "ER_TEAM",
		deferPaymentUx: true,
		fastWalk: false,
		sourceCitation: VTL_CITATION,
		reviewed: false,
	},
	[TriageCategory.YELLOW]: {
		targetMinutes: 60,
		reassessmentMinutes: 60,
		queueRank: 2,
		labPriority: TaskPriority.HIGH,
		radiologyPriority: TaskPriority.HIGH,
		operationUrgency: OperationUrgency.EXPEDITED,
		inpatientKind: InpatientStayKind.MEDICAL,
		inpatientAcuity: InpatientAcuity.MEDIUM,
		inboxImportance: InboxImportance.NORMAL,
		alertTier: "QUEUE_RESPONSIBLES",
		deferPaymentUx: false,
		fastWalk: false,
		sourceCitation: VTL_CITATION,
		reviewed: false,
	},
	[TriageCategory.GREEN]: {
		targetMinutes: 120,
		reassessmentMinutes: 120,
		queueRank: 3,
		labPriority: TaskPriority.MEDIUM,
		radiologyPriority: TaskPriority.MEDIUM,
		operationUrgency: OperationUrgency.ELECTIVE,
		inpatientKind: InpatientStayKind.MEDICAL,
		inpatientAcuity: InpatientAcuity.MEDIUM,
		inboxImportance: InboxImportance.NORMAL,
		alertTier: "NONE",
		deferPaymentUx: false,
		fastWalk: false,
		sourceCitation: VTL_CITATION,
		reviewed: false,
	},
	[TriageCategory.BLUE]: {
		targetMinutes: 240,
		reassessmentMinutes: 240,
		queueRank: 4,
		labPriority: TaskPriority.LOW,
		radiologyPriority: TaskPriority.LOW,
		operationUrgency: OperationUrgency.ELECTIVE,
		inpatientKind: InpatientStayKind.MEDICAL,
		inpatientAcuity: InpatientAcuity.LOW,
		inboxImportance: InboxImportance.LOW,
		alertTier: "NONE",
		deferPaymentUx: false,
		fastWalk: false,
		sourceCitation: VTL_CITATION,
		reviewed: false,
	},
};

// ── العرض ──────────────────────────────────────────────────────────────────

export const TRIAGE_CATEGORY_LABELS: Record<TriageCategory, string> = {
	[TriageCategory.RED]: "أحمر — فوري",
	[TriageCategory.ORANGE]: "برتقالي — عاجل جدًا",
	[TriageCategory.YELLOW]: "أصفر — عاجل",
	[TriageCategory.GREEN]: "أخضر — عادي",
	[TriageCategory.BLUE]: "أزرق — غير عاجل",
};

/** الاسم المختصر — ما يظهر على شارة البطاقة حيث لا مكان للجملة */
export const TRIAGE_CATEGORY_SHORT: Record<TriageCategory, string> = {
	[TriageCategory.RED]: "أحمر",
	[TriageCategory.ORANGE]: "برتقالي",
	[TriageCategory.YELLOW]: "أصفر",
	[TriageCategory.GREEN]: "أخضر",
	[TriageCategory.BLUE]: "أزرق",
};

/**
 * ترتيب الألوان من الأشدّ إلى الأخفّ — مصدر واحد لكل ترتيب في النظام.
 *
 * لا يُشتقّ من `Object.keys(TRIAGE_RULES)`: ترتيب مفاتيح الكائن ليس عقدًا يُعتمد
 * عليه، وترتيبُ الفرز الطبّي ليس تفصيلًا يُترك لمحرّك اللغة.
 */
export const TRIAGE_CATEGORY_ORDER = [
	TriageCategory.RED,
	TriageCategory.ORANGE,
	TriageCategory.YELLOW,
	TriageCategory.GREEN,
	TriageCategory.BLUE,
] as const;

/** الفئات التي ترفع `isEmergency` — الإسقاط الذي يُبقي كل مستهلك قائم يعمل */
export const EMERGENCY_CATEGORIES = [TriageCategory.RED, TriageCategory.ORANGE] as const;

/**
 * الإسقاط إلى `Appointment.isEmergency`.
 *
 * هذه الدالّة هي كامل جسر التوافق مع ما قبل الوحدة: ترتيب الطابور
 * (`sortQueueCards`)، وشارة البطاقة، وصفّ الإنذار، ومهارة الوكيل، ومعالج الحجز —
 * كلّها تقرأ `isEmergency` ولا تعرف شيئًا عن الفرز، وتبقى صحيحة بلا تعديل.
 */
export const isEmergencyCategory = (category: TriageCategory): boolean =>
	(EMERGENCY_CATEGORIES as readonly TriageCategory[]).includes(category);

/** شدّة اللون كرقم — للمقارنة بين تقييمين (أصغر = أشدّ) */
export const triageSeverityRank = (category: TriageCategory): number =>
	TRIAGE_RULES[category].queueRank;

/**
 * هل التقييم الجديد **ترقية** (تدهور الحالة)؟
 *
 * الترقية وحدها تُنبِّه: تخفيض اللون خبرٌ سارّ لا يُوقظ أحدًا، لكنه يبقى ظاهرًا في
 * سلسلة التقييمات على الورقة.
 */
export const isTriageEscalation = (from: TriageCategory, to: TriageCategory): boolean =>
	triageSeverityRank(to) < triageSeverityRank(from);

// ── الاشتقاق إلى مفردات الوحدات الأخرى ──────────────────────────────────────

export type TriageDefaults = {
	labPriority: TaskPriority;
	radiologyPriority: TaskPriority;
	operationUrgency: OperationUrgency;
	inpatientKind: InpatientStayKind;
	inpatientAcuity: InpatientAcuity;
};

/**
 * الافتراضات التي ترثها المستندات المفتوحة من زيارة مفروزة.
 *
 * **تملأ الفارغ ولا تكتب فوق شيء.** قرار المدرّب الصريح يفوز دائمًا: لو اختار
 * أولوية للتحليل فهي أولويته، ولو ترك الحقل صامتًا تكلّم الفرز نيابةً عنه. هذا هو
 * الفرق بين «افتراض» و«فرض» — والثاني يجعل الطاقم يقاتل النظام.
 */
export const triageDefaults = (category: TriageCategory): TriageDefaults => {
	const rule = TRIAGE_RULES[category];
	return {
		labPriority: rule.labPriority,
		radiologyPriority: rule.radiologyPriority,
		operationUrgency: rule.operationUrgency,
		inpatientKind: rule.inpatientKind,
		inpatientAcuity: rule.inpatientAcuity,
	};
};

/**
 * الأولوية المؤثِّرة لطلب جديد: ما اختاره المستخدم، وإلّا اشتقاق الفرز، وإلّا لا شيء.
 *
 * مكتوبة مرّة هنا ويستدعيها كلٌّ من التحاليل والأشعة، كي لا يُعاد التعبير عن
 * «الصريح يفوز» في موضعين فيختلفا.
 */
export const resolveOrderPriority = (
	explicit: TaskPriority | null | undefined,
	category: TriageCategory | null | undefined,
	kind: "LAB" | "RADIOLOGY",
): TaskPriority | null => {
	if (explicit != null) return explicit;
	if (category == null) return null;
	const rule = TRIAGE_RULES[category];
	return kind === "LAB" ? rule.labPriority : rule.radiologyPriority;
};

// ── [E5] إعادة التقييم والاستقرار ──────────────────────────────────────────

/**
 * هل تأخّر تقييم هذه الحالة عن إيقاع لونها؟ `null` لآخر تقييم يعني «لم تُقيَّم
 * قطّ» ويُعدّ متأخّرًا — الصمت هنا ليس سلامة.
 */
export const isReassessmentOverdue = (
	category: TriageCategory,
	lastReassessedAt: Date | string | null | undefined,
	now: Date = new Date(),
): boolean => {
	if (!lastReassessedAt) return true;
	const last = new Date(lastReassessedAt).getTime();
	if (!Number.isFinite(last)) return true;
	const elapsed = (now.getTime() - last) / 60_000;
	return elapsed > TRIAGE_RULES[category].reassessmentMinutes;
};

/** الدقائق المتبقية قبل استحقاق إعادة التقييم — سالبة إن تأخّرت */
export const minutesUntilReassessment = (
	category: TriageCategory,
	lastReassessedAt: Date | string | null | undefined,
	now: Date = new Date(),
): number | null => {
	if (!lastReassessedAt) return null;
	const last = new Date(lastReassessedAt).getTime();
	if (!Number.isFinite(last)) return null;
	const elapsed = (now.getTime() - last) / 60_000;
	return Math.round(TRIAGE_RULES[category].reassessmentMinutes - elapsed);
};

/**
 * الاستقرار الافتراضي عند أوّل فرز — يُشتقّ من اللون ويبقى قابلًا للتصحيح.
 * أحمرُ مستقرّ تناقضٌ؛ وأخضرُ غير مستقرّ سؤالٌ للممرّض لا للجدول.
 */
export const defaultStabilityFor = (category: TriageCategory): EmergencyStability => {
	if (category === TriageCategory.RED) return EmergencyStability.CRITICAL;
	if (category === TriageCategory.ORANGE) return EmergencyStability.UNSTABLE;
	return EmergencyStability.STABLE;
};
