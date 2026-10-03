import {
	GroomingBehaviorScore,
	GroomingDryingMethod,
	GroomingLane,
	GroomingSizeBand,
	GroomingStage,
	GroomingStatus,
	MattingGrade,
	ParasiteFinding,
} from "@/generated/prisma/enums";

// آلة حالات جلسة التجميل — المصدر الوحيد للمسار والانتقالات والبوابات.
// ملف بيانات/دوال نقية فقط (بلا db) — يُستورد من الخادم والواجهة معًا.
// الخطة الحاكمة: docs/grooming-module-plan.md (§6 الآلة والبوابات G1–G10).
//
// مسار واحد لكل جلسة، تجميلية كانت أم طبية:
//   مجدولة → الاستلام → الفحص القبلي → قيد العمل → التجفيف والتشطيب
//          → جاهز للاستلام → تم التسليم → مكتملة
// المسار (lane) لا يغيّر الآلة؛ يقرّر أي البوابات إلزامية (المسار الطبي يضيف
// أمر المدرّب G6 وملاحظة الاستجابة عند الإقفال).
//
// ثلاث بوابات بلا أي مسار تجاوز — G5 (طريقة التجفيف) وG6 (أمر المدرّب للتخدير)
// وG10 (حادثة مفتوحة). البقية تُتجاوز بسبب مسجَّل يظهر في سجل النشاط وتقرير
// الالتزام. سبب الاستثناء: هذه الثلاث هي التي تقتل طفلًا أو تدفن مسؤولية.

// ── التسميات العربية ────────────────────────────────────────────────────────

export const GROOMING_STATUS_LABELS: Record<GroomingStatus, string> = {
	[GroomingStatus.SCHEDULED]: "مجدولة",
	[GroomingStatus.CHECK_IN]: "الاستلام",
	[GroomingStatus.INTAKE]: "الفحص القبلي",
	[GroomingStatus.IN_PROGRESS]: "قيد العمل",
	[GroomingStatus.FINISHING]: "التجفيف والتشطيب",
	[GroomingStatus.READY]: "جاهز للاستلام",
	[GroomingStatus.PICKED_UP]: "تم التسليم",
	[GroomingStatus.COMPLETED]: "مكتملة",
	[GroomingStatus.CANCELLED]: "ملغاة",
	[GroomingStatus.NO_SHOW]: "لم يحضر",
	[GroomingStatus.ESCALATED]: "محوَّلة للمدرّب",
};

export const GROOMING_STAGE_LABELS: Record<GroomingStage, string> = {
	[GroomingStage.QUOTE_APPROVAL]: "إقرار التسعيرة",
	[GroomingStage.BATH]: "الاستحمام",
	[GroomingStage.DRYING]: "التجفيف",
	[GroomingStage.CLIP]: "القص بالماكينة",
	[GroomingStage.SCISSOR]: "التشطيب بالمقص",
	[GroomingStage.NAILS_EARS]: "الأظافر والأذن",
	[GroomingStage.FINISH_CHECK]: "فحص ما بعد التجميل",
	[GroomingStage.PHOTOS]: "صور «بعد»",
};

export const GROOMING_LANE_LABELS: Record<GroomingLane, string> = {
	[GroomingLane.COSMETIC]: "تجميلي",
	[GroomingLane.MEDICAL]: "طبي",
};

export const GROOMING_DRYING_METHOD_LABELS: Record<GroomingDryingMethod, string> = {
	[GroomingDryingMethod.HAND_ROOM_TEMP]: "تجفيف يدوي بحرارة القاعة",
	[GroomingDryingMethod.FAN_ONLY]: "مروحة بلا تسخين",
	[GroomingDryingMethod.CAGE_UNHEATED]: "قفص تجفيف بلا تسخين",
	[GroomingDryingMethod.FORCED_AIR]: "هواء مضغوط تحت إشراف مباشر",
	[GroomingDryingMethod.CAGE_HEATED]: "قفص تجفيف بعنصر تسخين",
};

export const MATTING_GRADE_LABELS: Record<MattingGrade, string> = {
	[MattingGrade.NONE]: "لا تعقّد",
	[MattingGrade.LIGHT]: "خفيف",
	[MattingGrade.MODERATE]: "متوسط",
	[MattingGrade.SEVERE]: "شديد",
	[MattingGrade.PELTED]: "ملبَّد بالكامل",
};

export const GROOMING_BEHAVIOR_LABELS: Record<GroomingBehaviorScore, string> = {
	[GroomingBehaviorScore.GREEN]: "يتعامل بسهولة",
	[GroomingBehaviorScore.YELLOW]: "يحتاج حذرًا",
	[GroomingBehaviorScore.RED]: "خطر — مُمسكان أو رفض",
};

export const PARASITE_FINDING_LABELS: Record<ParasiteFinding, string> = {
	[ParasiteFinding.NONE]: "لا طفيليات",
	[ParasiteFinding.FLEAS]: "براغيث",
	[ParasiteFinding.TICKS]: "قراد",
	[ParasiteFinding.LICE]: "قمل",
	[ParasiteFinding.MITES_SUSPECTED]: "اشتباه حلم",
	[ParasiteFinding.MULTIPLE]: "أكثر من نوع",
};

export const GROOMING_SIZE_BAND_LABELS: Record<GroomingSizeBand, string> = {
	[GroomingSizeBand.TOY]: "صغير جدًا",
	[GroomingSizeBand.SMALL]: "صغير",
	[GroomingSizeBand.MEDIUM]: "متوسط",
	[GroomingSizeBand.LARGE]: "كبير",
	[GroomingSizeBand.GIANT]: "ضخم",
};

// ── درجة التعقّد كسلّم مرتّب (0–4) ─────────────────────────────────────────

export const MATTING_GRADE_ORDER = [
	MattingGrade.NONE,
	MattingGrade.LIGHT,
	MattingGrade.MODERATE,
	MattingGrade.SEVERE,
	MattingGrade.PELTED,
] as const;

/** رتبة الدرجة 0..4 — الأساس الذي تقارن به عتبات الرسوم والبوابات */
export const mattingGradeRank = (grade: MattingGrade): number =>
	MATTING_GRADE_ORDER.indexOf(grade as (typeof MATTING_GRADE_ORDER)[number]);

/** العتبة الافتراضية التي تصبح عندها الحلاقة الاضطرارية شرطًا (البوابة G4) */
export const DEFAULT_SHAVE_DOWN_THRESHOLD: MattingGrade = MattingGrade.SEVERE;

// ── شرائح الحجم من الوزن (القرار D4) ───────────────────────────────────────

/** الحدّ الأعلى لكل شريحة بالكيلوغرام — الشريحة الأخيرة بلا سقف */
const SIZE_BAND_MAX_KG: readonly (readonly [GroomingSizeBand, number])[] = [
	[GroomingSizeBand.TOY, 5],
	[GroomingSizeBand.SMALL, 10],
	[GroomingSizeBand.MEDIUM, 25],
	[GroomingSizeBand.LARGE, 40],
] as const;

/**
 * شريحة الحجم من الوزن. الوزن الغائب لا يُخمَّن — يعود null، ويقع محرّك التسعير
 * حينها إلى رتبة أدنى في السلّم بدل تلفيق شريحة (نفس مبدأ «العمر غير معروف» في
 * محرّك استحقاق اللقاحات).
 */
export const sizeBandFromWeightKg = (weightKg: number | null | undefined) => {
	if (weightKg == null || !Number.isFinite(weightKg) || weightKg <= 0) return null;
	for (const [band, max] of SIZE_BAND_MAX_KG) {
		if (weightKg <= max) return band;
	}
	return GroomingSizeBand.GIANT;
};

// ── المسار والحالات النهائية ───────────────────────────────────────────────

export const GROOMING_PATHWAY = [
	GroomingStatus.SCHEDULED,
	GroomingStatus.CHECK_IN,
	GroomingStatus.INTAKE,
	GroomingStatus.IN_PROGRESS,
	GroomingStatus.FINISHING,
	GroomingStatus.READY,
	GroomingStatus.PICKED_UP,
	GroomingStatus.COMPLETED,
] as const;

/** الحالات الاعتراضية — تُغادَر إليها من خارج المسار ولا يُخرج منها */
export const GROOMING_TERMINAL_STATUSES = [
	GroomingStatus.COMPLETED,
	GroomingStatus.CANCELLED,
	GroomingStatus.NO_SHOW,
	GroomingStatus.ESCALATED,
] as const;

export const isGroomingTerminalStatus = (status: GroomingStatus): boolean =>
	(GROOMING_TERMINAL_STATUSES as readonly GroomingStatus[]).includes(status);

/** الحالات التي يكون فيها الطفل في عهدة الأكاديمية — تُحسب في إشغال المحطات */
export const GROOMING_IN_CUSTODY_STATUSES = [
	GroomingStatus.CHECK_IN,
	GroomingStatus.INTAKE,
	GroomingStatus.IN_PROGRESS,
	GroomingStatus.FINISHING,
	GroomingStatus.READY,
] as const;

export const isGroomingInCustody = (status: GroomingStatus): boolean =>
	(GROOMING_IN_CUSTODY_STATUSES as readonly GroomingStatus[]).includes(status);

// ── الانتقالات ─────────────────────────────────────────────────────────────

/** «لم يحضر» لا معنى لها بعد أن يصل الطفل فعلًا */
export const canMarkGroomingNoShow = (status: GroomingStatus): boolean =>
	status === GroomingStatus.SCHEDULED;

export const GROOMING_NO_SHOW_BLOCKED_MESSAGE = "لا يمكن تسجيل «لم يحضر» بعد استلام الطفل";

/**
 * الإلغاء متاح ما دام لم يبدأ عمل لا يُمحى: القصّ. بعد بدء العمل يُنهى المسار
 * بالتسليم أو بالتحويل للمدرّب، ويوثَّق ما جرى — لا يُمحى بإلغاء.
 */
export const canCancelGrooming = (status: GroomingStatus): boolean =>
	status === GroomingStatus.SCHEDULED ||
	status === GroomingStatus.CHECK_IN ||
	status === GroomingStatus.INTAKE;

export const GROOMING_CANCEL_BLOCKED_MESSAGE =
	"لا يمكن إلغاء الجلسة بعد بدء العمل — أنهِ بالتسليم أو حوّلها للمدرّب";

/**
 * التحويل للمدرّب متاح من أي حالة يكون فيها الطفل في عهدة الأكاديمية: تُكتشف
 * العلة عند الفحص القبلي كما تُكتشف تحت الفرو أثناء القص.
 */
export const canEscalateGrooming = (status: GroomingStatus): boolean =>
	isGroomingInCustody(status);

export const GROOMING_ESCALATE_BLOCKED_MESSAGE =
	"التحويل للمدرّب متاح فقط والطفل في عهدة الأكاديمية";

/**
 * خطوة واحدة للأمام أو للخلف ضمن المسار. الحالات الاعتراضية لها دوالّها أعلاه
 * لأنها تحتاج سياقًا أكثر من الحالة الحالية. الحالة النهائية لا تُغادَر.
 */
export const canGroomingTransition = (from: GroomingStatus, to: GroomingStatus): boolean => {
	if (from === to) return false;
	if (isGroomingTerminalStatus(from)) return false;
	if (to === GroomingStatus.CANCELLED) return canCancelGrooming(from);
	if (to === GroomingStatus.NO_SHOW) return canMarkGroomingNoShow(from);
	if (to === GroomingStatus.ESCALATED) return canEscalateGrooming(from);
	const fromIndex = GROOMING_PATHWAY.indexOf(from as (typeof GROOMING_PATHWAY)[number]);
	const toIndex = GROOMING_PATHWAY.indexOf(to as (typeof GROOMING_PATHWAY)[number]);
	if (fromIndex < 0 || toIndex < 0) return false;
	return toIndex === fromIndex + 1 || toIndex === fromIndex - 1;
};

export const invalidGroomingTransitionMessage = (
	from: GroomingStatus,
	to: GroomingStatus,
): string =>
	`لا يمكن نقل الجلسة من "${GROOMING_STATUS_LABELS[from]}" إلى "${GROOMING_STATUS_LABELS[to]}"`;

// ── المراحل الفرعية داخل الحالات ───────────────────────────────────────────

const STAGES_BY_STATUS: Partial<Record<GroomingStatus, readonly GroomingStage[]>> = {
	[GroomingStatus.INTAKE]: [GroomingStage.QUOTE_APPROVAL],
	[GroomingStatus.IN_PROGRESS]: [
		GroomingStage.BATH,
		GroomingStage.CLIP,
		GroomingStage.SCISSOR,
		GroomingStage.NAILS_EARS,
	],
	// التجفيف أول خطوات عمود التشطيب — ولهذا تحرس G5 دخول العمود لا مغادرته:
	// اختيار طريقة تجفيف ممنوعة يجب أن يُرفض قبل أن يبدأ التجفيف، لا بعده.
	[GroomingStatus.FINISHING]: [
		GroomingStage.DRYING,
		GroomingStage.FINISH_CHECK,
		GroomingStage.PHOTOS,
	],
};

export const groomingStagesFor = (status: GroomingStatus): readonly GroomingStage[] =>
	STAGES_BY_STATUS[status] ?? [];

/** المرحلة التي تبدأ بها الحالة عند دخولها — null لحالة بلا مراحل */
export const entryGroomingStageFor = (status: GroomingStatus): GroomingStage | null =>
	groomingStagesFor(status)[0] ?? null;

/** المرحلة التالية ضمن الحالة نفسها، أو null إن كانت الأخيرة */
export const nextGroomingStage = (
	status: GroomingStatus,
	stage: GroomingStage,
): GroomingStage | null => {
	const scope = groomingStagesFor(status);
	const i = scope.indexOf(stage);
	return i >= 0 && i < scope.length - 1 ? scope[i + 1] : null;
};

/** المرحلة السابقة ضمن الحالة نفسها، أو null إن كانت الأولى */
export const previousGroomingStage = (
	status: GroomingStatus,
	stage: GroomingStage,
): GroomingStage | null => {
	const scope = groomingStagesFor(status);
	const i = scope.indexOf(stage);
	return i > 0 ? scope[i - 1] : null;
};

// ── البوابات G1–G10 (الخطة §6.2) ───────────────────────────────────────────

export type GroomingGate =
	| "G1_VACCINATION"
	| "G2_CONSENT"
	| "G3_INTAKE"
	| "G4_SHAVE_DOWN_APPROVAL"
	| "G5_DRYING_METHOD"
	| "G6_VET_ORDER"
	| "G7_PARASITE_PROTOCOL"
	| "G8_POST_GROOM_CHECK"
	| "G9_PAYMENT"
	| "G10_INCIDENT_CLOSED";

export const GROOMING_GATE_BLOCKED_MESSAGES: Record<GroomingGate, string> = {
	// الرسالة العامة — يستبدلها `groomingGateBlockReason` بسبب محدَّد (لا سجل / داخل
	// فترة اكتساب المناعة / منتهٍ) لأن الثلاثة مختلفة العلاج تمامًا.
	G1_VACCINATION:
		"تطعيم السعار غير سارٍ أو لم تنقضِ فترة اكتساب مناعته — لا يمكن بدء الفحص القبلي قبل تحديثه",
	G2_CONSENT: "لا يمكن المتابعة قبل توقيع إقرار التجميل",
	G3_INTAKE: "أكمل الفحص القبلي (درجة التعقّد والسلوك وفحص الطفيليات) أولًا",
	G4_SHAVE_DOWN_APPROVAL:
		"الفرو يستلزم حلاقة اضطرارية — لا يمكن البدء قبل موافقة وليّ الأمر على الحلاقة والتسعيرة",
	G5_DRYING_METHOD:
		"هذا الطفل ممنوع من التجفيف الحارّ — اختر التجفيف اليدوي بحرارة القاعة أو المروحة",
	G6_VET_ORDER: "الجلسة الطبية أو المهدّأة تتطلب أمر مدرّب مسجَّلًا قبل البدء",
	G7_PARASITE_PROTOCOL: "رُصدت طفيليات — أضف المعالجة وأبلغ وليّ الأمر وأكّد العزل قبل المتابعة",
	G8_POST_GROOM_CHECK: "أكمل فحص ما بعد التجميل وصور «بعد» قبل تسليم الطفل",
	G9_PAYMENT: "لا يمكن التسليم قبل سداد الدفعة المطلوبة",
	G10_INCIDENT_CLOSED:
		"هناك حادثة مفتوحة — لا يمكن إقفال الجلسة قبل تقييم المدرّب وإبلاغ وليّ الأمر",
};

/**
 * البوابات التي لا تُتجاوز مهما كانت الصلاحية أو السبب (الخطة §6.2).
 * G5: التجفيف الحارّ يقتل قصيري الخطم والمهدَّئين — لا سبب تشغيليًا يوازي ذلك.
 * G6: التهدئة قرار مدرّب لا قرار مُجمِّل.
 * G10: حادثة مطموسة بلا تقييم وإبلاغ = مسؤولية مدفونة.
 */
export const NON_OVERRIDABLE_GROOMING_GATES = [
	"G5_DRYING_METHOD",
	"G6_VET_ORDER",
	"G10_INCIDENT_CLOSED",
] as const satisfies readonly GroomingGate[];

export const isGroomingGateOverridable = (gate: GroomingGate): boolean =>
	!(NON_OVERRIDABLE_GROOMING_GATES as readonly GroomingGate[]).includes(gate);

export const GROOMING_OVERRIDE_REASON_REQUIRED_MESSAGE = "تجاوز بوابة يتطلب تسجيل السبب";

export const groomingGateNotOverridableMessage = (gate: GroomingGate): string =>
	`${GROOMING_GATE_BLOCKED_MESSAGES[gate]} — هذه البوابة لا تقبل التجاوز`;

// ── بوابة التطعيم (G1): فترة اكتساب المناعة ────────────────────────────────

/**
 * جرعة تُقرأ في لحظة: هل هي حماية **الآن**؟
 *
 * الجرعة ليست حماية لحظة حقنها — بين الحقن وبدء الحماية فترة اكتساب مناعة تذكرها
 * نشرة كل مستحضر (٢١ يومًا للسعار في Nobivac/Rabisin، وهي مدّة اشتراطات السفر
 * الدولية). `protectiveFromAt` تُحسب وتُثبَّت لحظة الحقن، فتصير القراءة مقارنةً
 * لا اجتهادًا.
 */
export type VaccinationProtectionWindow = {
	administeredAt: Date;
	/** لحظة بدء الحماية = تاريخ الإعطاء + فترة اكتساب المناعة؛ null لسجل قديم بلا حساب */
	protectiveFromAt: Date | null;
	/** فترة اكتساب المناعة كما كانت لحظة الحقن — للعرض في سبب الرفض */
	immunityOnsetDaysSnapshot: number | null;
	/**
	 * نهاية سريان **هذه الجرعة** = تاريخ الإعطاء + دورية الجرعة المنشّطة.
	 *
	 * ليست `nextDueAt`: ذاك كاش على مستوى الطفل يحمل أقرب استحقاق عبر كل
	 * المُستضِدّات، فجرعة سعار سارية إلى ٢٠٢٩ على كلب لم يأخذ الرباعي قط تحمل
	 * `nextDueAt` في الماضي. قراءتها انتهاءً تُبطل تطعيمًا صحيحًا.
	 * null = لا دورية منشّطة مضبوطة على اللقاح، أي لا انتهاء مسجَّل.
	 */
	protectiveUntilAt: Date | null;
};

export type VaccinationProtectionState =
	| "MISSING"
	| "NO_ONSET_DATA"
	| "INCUBATING"
	| "EXPIRED"
	| "PROTECTED";

export const vaccinationProtectionState = (
	record: VaccinationProtectionWindow | null | undefined,
	at: Date,
): VaccinationProtectionState => {
	if (!record) return "MISSING";
	if (record.protectiveFromAt == null) return "NO_ONSET_DATA";
	// الترتيب مقصود: جرعةٌ داخل فترة الاكتساب قد يكون `nextDueAt` لها ماضيًا إن
	// أُدخل تاريخ إعطاء قديم؛ «لم تبدأ الحماية» أصدق من «انتهت الصلاحية».
	if (record.protectiveFromAt > at) return "INCUBATING";
	// بلا انتهاء مسجَّل تبقى الجرعة حاميةً: غياب دورية المنشّطة من الكتالوج نقصُ
	// إعداد لا انتهاءُ مناعة، ومنعُ الطفل بسببه يعاقبه على صفٍّ ناقص في شاشة أخرى.
	if (record.protectiveUntilAt != null && record.protectiveUntilAt <= at) return "EXPIRED";
	return "PROTECTED";
};

const gateDayFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

/**
 * سبب رفض بوابة التطعيم كما يُقرأ لا كما يُصنَّف.
 *
 * «تطعيم السعار غير سارٍ» تصف ثلاث حالات مختلفة العلاج تمامًا: لا سجل أصلًا،
 * أو سجل داخل فترة اكتساب المناعة (لا شيء يُفعل سوى الانتظار إلى تاريخ معلوم)،
 * أو سجل انتهت صلاحيته. الرسالة العامة تجعل الطاقم يُعيد حقن طفلٍ حُقن أمس.
 *
 * `latest` هو **آخر** سجل لا أفضلَه: تقييم البوابة يسأل «أتوجد أي جرعة حامية
 * الآن؟» — جرعة منشّطة أُعطيت أمس لا تُبطل سابقةً ما زالت سارية — أما الرسالة
 * فتصف ما بين يدَي الطاقم آخرَ مرّة.
 */
export const groomingVaccinationBlockReason = (
	latest: VaccinationProtectionWindow | null | undefined,
	at: Date = new Date(),
): string => {
	switch (vaccinationProtectionState(latest, at)) {
		case "MISSING":
			return "لا يوجد تطعيم سعار مسجَّل لهذا الطفل — سجّل الجرعة من شاشة التطعيمات قبل الاستلام";
		case "NO_ONSET_DATA":
			return "تطعيم السعار المسجَّل بلا فترة اكتساب مناعة محسوبة — اضبط «فترة اكتساب المناعة» على صفّ اللقاح في الكتالوج ثم أعد تسجيل الجرعة";
		case "INCUBATING": {
			const onset = latest?.immunityOnsetDaysSnapshot;
			return `تطعيم السعار أُعطي يوم ${gateDayFmt.format(
				latest?.administeredAt as Date,
			)} ولم تنقضِ فترة اكتساب المناعة${
				onset != null ? ` (${onset} يومًا)` : ""
			} — تبدأ الحماية يوم ${gateDayFmt.format(latest?.protectiveFromAt as Date)}`;
		}
		case "EXPIRED":
			return `انتهت صلاحية تطعيم السعار${
				latest?.protectiveUntilAt ? ` يوم ${gateDayFmt.format(latest.protectiveUntilAt)}` : ""
			} — لا يمكن بدء الفحص القبلي قبل تحديثه`;
		// حالة لا تُبلَّغ عمليًا: البوابة لا تُرفض وسجل حامٍ موجود. تبقى للاكتمال.
		case "PROTECTED":
			return GROOMING_GATE_BLOCKED_MESSAGES.G1_VACCINATION;
	}
};

export type GroomingGateContext = {
	/** المسار — الطبي يضيف بوابة أمر المدرّب */
	lane?: GroomingLane;
	/** تهدئة مخطَّطة — ترفع الجلسة التجميلية إلى متطلبات المسار الطبي */
	sedationPlanned?: boolean;
	/** درجة التعقّد المسجَّلة في الفحص القبلي — تقرّر إلزامية G4 */
	mattingGrade?: MattingGrade | null;
	/** نتيجة فحص الطفيليات — أي قيمة غير NONE تُفعّل G7 */
	parasiteFinding?: ParasiteFinding | null;
	/** عتبة الحلاقة الاضطرارية (إعداد أكاديمية) — الافتراضي «شديد» */
	shaveDownThreshold?: MattingGrade;
	/** بوابة السداد مفعّلة من إعداد الفرع (القرار D7 — معطّلة افتراضيًا) */
	paymentGateEnabled?: boolean;
	/** اشتراط صور «بعد» (القرار D8 — مفعّل افتراضيًا) */
	afterPhotosRequired?: boolean;
};

/** هل تستلزم درجة التعقّد المسجَّلة حلاقة اضطرارية؟ */
export const requiresShaveDownApproval = (
	mattingGrade: MattingGrade | null | undefined,
	threshold: MattingGrade = DEFAULT_SHAVE_DOWN_THRESHOLD,
): boolean =>
	mattingGrade != null && mattingGradeRank(mattingGrade) >= mattingGradeRank(threshold);

/** كل البوابات الإلزامية لهذه الجلسة — مرجع الواجهة لعرض المتطلبات مسبقًا */
export const requiredGroomingGates = (
	context: GroomingGateContext = {},
): readonly GroomingGate[] => {
	const medical = context.lane === GroomingLane.MEDICAL || context.sedationPlanned === true;
	const gates: GroomingGate[] = ["G1_VACCINATION", "G2_CONSENT", "G3_INTAKE"];
	if (requiresShaveDownApproval(context.mattingGrade, context.shaveDownThreshold)) {
		gates.push("G4_SHAVE_DOWN_APPROVAL");
	}
	gates.push("G5_DRYING_METHOD");
	if (medical) gates.push("G6_VET_ORDER");
	if (context.parasiteFinding != null && context.parasiteFinding !== ParasiteFinding.NONE) {
		gates.push("G7_PARASITE_PROTOCOL");
	}
	if (context.afterPhotosRequired !== false) gates.push("G8_POST_GROOM_CHECK");
	if (context.paymentGateEnabled) gates.push("G9_PAYMENT");
	gates.push("G10_INCIDENT_CLOSED");
	return gates;
};

/**
 * بوابات انتقال بعينه — تقاطع بوابات الجلسة مع موضع الانتقال في المسار.
 * التراجع خطوةً والانتقالات الاعتراضية بلا بوابات: البوابة تحرس التقدّم، ولا
 * يجوز أن تحبس طفلًا داخل عمود لأن متطلبًا إداريًا لم يُستوفَ.
 */
export const gatesForGroomingTransition = (
	from: GroomingStatus,
	to: GroomingStatus,
	context: GroomingGateContext = {},
): readonly GroomingGate[] => {
	const fromIndex = GROOMING_PATHWAY.indexOf(from as (typeof GROOMING_PATHWAY)[number]);
	const toIndex = GROOMING_PATHWAY.indexOf(to as (typeof GROOMING_PATHWAY)[number]);
	if (fromIndex < 0 || toIndex !== fromIndex + 1) return [];
	const required = requiredGroomingGates(context);
	const has = (gate: GroomingGate) => required.includes(gate);
	const gates: GroomingGate[] = [];

	if (from === GroomingStatus.CHECK_IN) {
		if (has("G1_VACCINATION")) gates.push("G1_VACCINATION");
		if (has("G2_CONSENT")) gates.push("G2_CONSENT");
	}
	if (from === GroomingStatus.INTAKE) {
		if (has("G3_INTAKE")) gates.push("G3_INTAKE");
		if (has("G4_SHAVE_DOWN_APPROVAL")) gates.push("G4_SHAVE_DOWN_APPROVAL");
		if (has("G6_VET_ORDER")) gates.push("G6_VET_ORDER");
		if (has("G7_PARASITE_PROTOCOL")) gates.push("G7_PARASITE_PROTOCOL");
	}
	// G5 تحرس دخول عمود التشطيب — أي قبل أن يبدأ التجفيف لا بعده
	if (from === GroomingStatus.IN_PROGRESS && has("G5_DRYING_METHOD")) {
		gates.push("G5_DRYING_METHOD");
	}
	if (from === GroomingStatus.FINISHING && has("G8_POST_GROOM_CHECK")) {
		gates.push("G8_POST_GROOM_CHECK");
	}
	if (from === GroomingStatus.READY && has("G9_PAYMENT")) gates.push("G9_PAYMENT");
	if (from === GroomingStatus.PICKED_UP && has("G10_INCIDENT_CLOSED")) {
		gates.push("G10_INCIDENT_CLOSED");
	}

	return gates;
};

// ── سلامة التجفيف (البوابة G5) ─────────────────────────────────────────────

/**
 * الطرق المسموحة للطفل الممنوع من الحرارة. الأساس: قصيرو الخطم لا يبرّدون
 * أنفسهم بكفاءة، والقفص الحارّ الرطب قاعة ضربة شمس؛ والمهدَّأ يفقد اللهاث
 * أصلًا. الإرشاد القياسي: تجفيف يدوي بحرارة القاعة أو مراوح فقط، مع مراقبة
 * مستمرة. القفص بلا تسخين والهواء المضغوط مستبعدان هنا عمدًا — كلاهما يترك
 * الطفل بلا مراقبة مباشرة أو يرفع حرارته بالاحتكاك.
 */
export const HEAT_SAFE_DRYING_METHODS = [
	GroomingDryingMethod.HAND_ROOM_TEMP,
	GroomingDryingMethod.FAN_ONLY,
] as const satisfies readonly GroomingDryingMethod[];

/**
 * هل تتداخل فترتان؟ نصف مفتوحة: النهاية لا تصطدم ببداية تليها مباشرة.
 *
 * شرطان لا شرط واحد. الاكتفاء بـ `a.start < b.end` يجعل كل جلسة سابقة في تاريخ
 * المُجمِّل متداخلةً مع أي حجز جديد مهما بَعُد — فيُرفض كل حجز برسالة «المُجمِّل
 * محجوز في هذا الوقت». والاكتفاء بـ `a.end > b.start` يقلب الخطأ إلى الجهة الأخرى.
 */
export const periodsOverlap = (
	a: { startsAt: Date; durationMin: number },
	b: { startsAt: Date; durationMin: number },
): boolean => {
	const aStart = a.startsAt.getTime();
	const bStart = b.startsAt.getTime();
	return aStart < bStart + b.durationMin * 60_000 && aStart + a.durationMin * 60_000 > bStart;
};

export const isDryingMethodPermitted = (
	method: GroomingDryingMethod | null | undefined,
	heatDryProhibited: boolean,
): boolean => {
	if (method == null) return false;
	if (!heatDryProhibited) return true;
	return (HEAT_SAFE_DRYING_METHODS as readonly GroomingDryingMethod[]).includes(method);
};

/**
 * منع التجفيف الحارّ يُشتق آليًا ولا يُترك لتقدير اللحظة. أي سبب واحد يكفي —
 * والاستثناء اليدوي على كرت التجميل يُسجَّل بسببه ولا يُلغي هذا الاشتقاق.
 */
export type HeatDryRiskInput = {
	isBrachycephalic?: boolean;
	ageYears?: number | null;
	seniorAgeYears?: number;
	hasCardiacOrRespiratoryCondition?: boolean;
	sedationPlanned?: boolean;
	/** تعليم يدوي على كرت التجميل — يضيف المنع ولا يرفعه */
	manualProhibition?: boolean;
};

export const DEFAULT_SENIOR_AGE_YEARS = 8;

/** أسباب المنع مفصَّلة — الواجهة تعرضها للمستخدم بدل «ممنوع» صمّاء */
export const heatDryProhibitionReasons = (input: HeatDryRiskInput): readonly string[] => {
	const seniorAge = input.seniorAgeYears ?? DEFAULT_SENIOR_AGE_YEARS;
	const reasons: string[] = [];
	if (input.isBrachycephalic) reasons.push("سلالة قصيرة الخطم");
	if (input.ageYears != null && input.ageYears >= seniorAge) reasons.push("طفل مسنّ");
	if (input.hasCardiacOrRespiratoryCondition) reasons.push("حالة قلبية أو تنفسية");
	if (input.sedationPlanned) reasons.push("تهدئة مخطَّطة");
	if (input.manualProhibition) reasons.push("تعليم يدوي على كرت التجميل");
	return reasons;
};

export const isHeatDryProhibited = (input: HeatDryRiskInput): boolean =>
	heatDryProhibitionReasons(input).length > 0;
