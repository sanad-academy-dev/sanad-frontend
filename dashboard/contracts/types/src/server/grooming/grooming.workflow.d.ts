import { GroomingBehaviorScore, GroomingDryingMethod, GroomingLane, GroomingSizeBand, GroomingStage, GroomingStatus, MattingGrade, ParasiteFinding } from "@/generated/prisma/enums";
export declare const GROOMING_STATUS_LABELS: Record<GroomingStatus, string>;
export declare const GROOMING_STAGE_LABELS: Record<GroomingStage, string>;
export declare const GROOMING_LANE_LABELS: Record<GroomingLane, string>;
export declare const GROOMING_DRYING_METHOD_LABELS: Record<GroomingDryingMethod, string>;
export declare const MATTING_GRADE_LABELS: Record<MattingGrade, string>;
export declare const GROOMING_BEHAVIOR_LABELS: Record<GroomingBehaviorScore, string>;
export declare const PARASITE_FINDING_LABELS: Record<ParasiteFinding, string>;
export declare const GROOMING_SIZE_BAND_LABELS: Record<GroomingSizeBand, string>;
export declare const MATTING_GRADE_ORDER: readonly ["NONE", "LIGHT", "MODERATE", "SEVERE", "PELTED"];
/** رتبة الدرجة 0..4 — الأساس الذي تقارن به عتبات الرسوم والبوابات */
export declare const mattingGradeRank: (grade: MattingGrade) => number;
/** العتبة الافتراضية التي تصبح عندها الحلاقة الاضطرارية شرطًا (البوابة G4) */
export declare const DEFAULT_SHAVE_DOWN_THRESHOLD: MattingGrade;
/**
 * شريحة الحجم من الوزن. الوزن الغائب لا يُخمَّن — يعود null، ويقع محرّك التسعير
 * حينها إلى رتبة أدنى في السلّم بدل تلفيق شريحة (نفس مبدأ «العمر غير معروف» في
 * محرّك استحقاق اللقاحات).
 */
export declare const sizeBandFromWeightKg: (weightKg: number | null | undefined) => GroomingSizeBand | null;
export declare const GROOMING_PATHWAY: readonly ["SCHEDULED", "CHECK_IN", "INTAKE", "IN_PROGRESS", "FINISHING", "READY", "PICKED_UP", "COMPLETED"];
/** الحالات الاعتراضية — تُغادَر إليها من خارج المسار ولا يُخرج منها */
export declare const GROOMING_TERMINAL_STATUSES: readonly ["COMPLETED", "CANCELLED", "NO_SHOW", "ESCALATED"];
export declare const isGroomingTerminalStatus: (status: GroomingStatus) => boolean;
/** الحالات التي يكون فيها الطفل في عهدة الأكاديمية — تُحسب في إشغال المحطات */
export declare const GROOMING_IN_CUSTODY_STATUSES: readonly ["CHECK_IN", "INTAKE", "IN_PROGRESS", "FINISHING", "READY"];
export declare const isGroomingInCustody: (status: GroomingStatus) => boolean;
/** «لم يحضر» لا معنى لها بعد أن يصل الطفل فعلًا */
export declare const canMarkGroomingNoShow: (status: GroomingStatus) => boolean;
export declare const GROOMING_NO_SHOW_BLOCKED_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0633\u062C\u064A\u0644 \u00AB\u0644\u0645 \u064A\u062D\u0636\u0631\u00BB \u0628\u0639\u062F \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0637\u0641\u0644";
/**
 * الإلغاء متاح ما دام لم يبدأ عمل لا يُمحى: القصّ. بعد بدء العمل يُنهى المسار
 * بالتسليم أو بالتحويل للمدرّب، ويوثَّق ما جرى — لا يُمحى بإلغاء.
 */
export declare const canCancelGrooming: (status: GroomingStatus) => boolean;
export declare const GROOMING_CANCEL_BLOCKED_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062C\u0644\u0633\u0629 \u0628\u0639\u062F \u0628\u062F\u0621 \u0627\u0644\u0639\u0645\u0644 \u2014 \u0623\u0646\u0647\u0650 \u0628\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0623\u0648 \u062D\u0648\u0651\u0644\u0647\u0627 \u0644\u0644\u0645\u062F\u0631\u0651\u0628";
/**
 * التحويل للمدرّب متاح من أي حالة يكون فيها الطفل في عهدة الأكاديمية: تُكتشف
 * العلة عند الفحص القبلي كما تُكتشف تحت الفرو أثناء القص.
 */
export declare const canEscalateGrooming: (status: GroomingStatus) => boolean;
export declare const GROOMING_ESCALATE_BLOCKED_MESSAGE = "\u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0644\u0644\u0645\u062F\u0631\u0651\u0628 \u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0648\u0627\u0644\u0637\u0641\u0644 \u0641\u064A \u0639\u0647\u062F\u0629 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629";
/**
 * خطوة واحدة للأمام أو للخلف ضمن المسار. الحالات الاعتراضية لها دوالّها أعلاه
 * لأنها تحتاج سياقًا أكثر من الحالة الحالية. الحالة النهائية لا تُغادَر.
 */
export declare const canGroomingTransition: (from: GroomingStatus, to: GroomingStatus) => boolean;
export declare const invalidGroomingTransitionMessage: (from: GroomingStatus, to: GroomingStatus) => string;
export declare const groomingStagesFor: (status: GroomingStatus) => readonly GroomingStage[];
/** المرحلة التي تبدأ بها الحالة عند دخولها — null لحالة بلا مراحل */
export declare const entryGroomingStageFor: (status: GroomingStatus) => GroomingStage | null;
/** المرحلة التالية ضمن الحالة نفسها، أو null إن كانت الأخيرة */
export declare const nextGroomingStage: (status: GroomingStatus, stage: GroomingStage) => GroomingStage | null;
/** المرحلة السابقة ضمن الحالة نفسها، أو null إن كانت الأولى */
export declare const previousGroomingStage: (status: GroomingStatus, stage: GroomingStage) => GroomingStage | null;
export type GroomingGate = "G1_VACCINATION" | "G2_CONSENT" | "G3_INTAKE" | "G4_SHAVE_DOWN_APPROVAL" | "G5_DRYING_METHOD" | "G6_VET_ORDER" | "G7_PARASITE_PROTOCOL" | "G8_POST_GROOM_CHECK" | "G9_PAYMENT" | "G10_INCIDENT_CLOSED";
export declare const GROOMING_GATE_BLOCKED_MESSAGES: Record<GroomingGate, string>;
/**
 * البوابات التي لا تُتجاوز مهما كانت الصلاحية أو السبب (الخطة §6.2).
 * G5: التجفيف الحارّ يقتل قصيري الخطم والمهدَّئين — لا سبب تشغيليًا يوازي ذلك.
 * G6: التهدئة قرار مدرّب لا قرار مُجمِّل.
 * G10: حادثة مطموسة بلا تقييم وإبلاغ = مسؤولية مدفونة.
 */
export declare const NON_OVERRIDABLE_GROOMING_GATES: readonly ["G5_DRYING_METHOD", "G6_VET_ORDER", "G10_INCIDENT_CLOSED"];
export declare const isGroomingGateOverridable: (gate: GroomingGate) => boolean;
export declare const GROOMING_OVERRIDE_REASON_REQUIRED_MESSAGE = "\u062A\u062C\u0627\u0648\u0632 \u0628\u0648\u0627\u0628\u0629 \u064A\u062A\u0637\u0644\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0633\u0628\u0628";
export declare const groomingGateNotOverridableMessage: (gate: GroomingGate) => string;
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
export type VaccinationProtectionState = "MISSING" | "NO_ONSET_DATA" | "INCUBATING" | "EXPIRED" | "PROTECTED";
export declare const vaccinationProtectionState: (record: VaccinationProtectionWindow | null | undefined, at: Date) => VaccinationProtectionState;
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
export declare const groomingVaccinationBlockReason: (latest: VaccinationProtectionWindow | null | undefined, at?: Date) => string;
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
export declare const requiresShaveDownApproval: (mattingGrade: MattingGrade | null | undefined, threshold?: MattingGrade) => boolean;
/** كل البوابات الإلزامية لهذه الجلسة — مرجع الواجهة لعرض المتطلبات مسبقًا */
export declare const requiredGroomingGates: (context?: GroomingGateContext) => readonly GroomingGate[];
/**
 * بوابات انتقال بعينه — تقاطع بوابات الجلسة مع موضع الانتقال في المسار.
 * التراجع خطوةً والانتقالات الاعتراضية بلا بوابات: البوابة تحرس التقدّم، ولا
 * يجوز أن تحبس طفلًا داخل عمود لأن متطلبًا إداريًا لم يُستوفَ.
 */
export declare const gatesForGroomingTransition: (from: GroomingStatus, to: GroomingStatus, context?: GroomingGateContext) => readonly GroomingGate[];
/**
 * الطرق المسموحة للطفل الممنوع من الحرارة. الأساس: قصيرو الخطم لا يبرّدون
 * أنفسهم بكفاءة، والقفص الحارّ الرطب قاعة ضربة شمس؛ والمهدَّأ يفقد اللهاث
 * أصلًا. الإرشاد القياسي: تجفيف يدوي بحرارة القاعة أو مراوح فقط، مع مراقبة
 * مستمرة. القفص بلا تسخين والهواء المضغوط مستبعدان هنا عمدًا — كلاهما يترك
 * الطفل بلا مراقبة مباشرة أو يرفع حرارته بالاحتكاك.
 */
export declare const HEAT_SAFE_DRYING_METHODS: readonly ["HAND_ROOM_TEMP", "FAN_ONLY"];
/**
 * هل تتداخل فترتان؟ نصف مفتوحة: النهاية لا تصطدم ببداية تليها مباشرة.
 *
 * شرطان لا شرط واحد. الاكتفاء بـ `a.start < b.end` يجعل كل جلسة سابقة في تاريخ
 * المُجمِّل متداخلةً مع أي حجز جديد مهما بَعُد — فيُرفض كل حجز برسالة «المُجمِّل
 * محجوز في هذا الوقت». والاكتفاء بـ `a.end > b.start` يقلب الخطأ إلى الجهة الأخرى.
 */
export declare const periodsOverlap: (a: {
    startsAt: Date;
    durationMin: number;
}, b: {
    startsAt: Date;
    durationMin: number;
}) => boolean;
export declare const isDryingMethodPermitted: (method: GroomingDryingMethod | null | undefined, heatDryProhibited: boolean) => boolean;
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
export declare const DEFAULT_SENIOR_AGE_YEARS = 8;
/** أسباب المنع مفصَّلة — الواجهة تعرضها للمستخدم بدل «ممنوع» صمّاء */
export declare const heatDryProhibitionReasons: (input: HeatDryRiskInput) => readonly string[];
export declare const isHeatDryProhibited: (input: HeatDryRiskInput) => boolean;
