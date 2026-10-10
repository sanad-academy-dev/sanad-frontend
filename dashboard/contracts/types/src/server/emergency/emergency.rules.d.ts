import { EmergencyStability, InboxImportance, InpatientAcuity, InpatientStayKind, OperationUrgency, TaskPriority, TriageCategory } from "@/generated/prisma/enums";
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
export type TriageAlertTier = "ER_TEAM_AND_ON_SHIFT" | "ER_TEAM" | "QUEUE_RESPONSIBLES" | "NONE";
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
export declare const TRIAGE_RULES: Record<TriageCategory, TriageRule>;
export declare const TRIAGE_CATEGORY_LABELS: Record<TriageCategory, string>;
/** الاسم المختصر — ما يظهر على شارة البطاقة حيث لا مكان للجملة */
export declare const TRIAGE_CATEGORY_SHORT: Record<TriageCategory, string>;
/**
 * ترتيب الألوان من الأشدّ إلى الأخفّ — مصدر واحد لكل ترتيب في النظام.
 *
 * لا يُشتقّ من `Object.keys(TRIAGE_RULES)`: ترتيب مفاتيح الكائن ليس عقدًا يُعتمد
 * عليه، وترتيبُ الفرز الطبّي ليس تفصيلًا يُترك لمحرّك اللغة.
 */
export declare const TRIAGE_CATEGORY_ORDER: readonly ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE"];
/** الفئات التي ترفع `isEmergency` — الإسقاط الذي يُبقي كل مستهلك قائم يعمل */
export declare const EMERGENCY_CATEGORIES: readonly ["RED", "ORANGE"];
/**
 * الإسقاط إلى `Appointment.isEmergency`.
 *
 * هذه الدالّة هي كامل جسر التوافق مع ما قبل الوحدة: ترتيب الطابور
 * (`sortQueueCards`)، وشارة البطاقة، وصفّ الإنذار، ومهارة الوكيل، ومعالج الحجز —
 * كلّها تقرأ `isEmergency` ولا تعرف شيئًا عن الفرز، وتبقى صحيحة بلا تعديل.
 */
export declare const isEmergencyCategory: (category: TriageCategory) => boolean;
/** شدّة اللون كرقم — للمقارنة بين تقييمين (أصغر = أشدّ) */
export declare const triageSeverityRank: (category: TriageCategory) => number;
/**
 * هل التقييم الجديد **ترقية** (تدهور الحالة)؟
 *
 * الترقية وحدها تُنبِّه: تخفيض اللون خبرٌ سارّ لا يُوقظ أحدًا، لكنه يبقى ظاهرًا في
 * سلسلة التقييمات على الورقة.
 */
export declare const isTriageEscalation: (from: TriageCategory, to: TriageCategory) => boolean;
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
export declare const triageDefaults: (category: TriageCategory) => TriageDefaults;
/**
 * الأولوية المؤثِّرة لطلب جديد: ما اختاره المستخدم، وإلّا اشتقاق الفرز، وإلّا لا شيء.
 *
 * مكتوبة مرّة هنا ويستدعيها كلٌّ من التحاليل والأشعة، كي لا يُعاد التعبير عن
 * «الصريح يفوز» في موضعين فيختلفا.
 */
export declare const resolveOrderPriority: (explicit: TaskPriority | null | undefined, category: TriageCategory | null | undefined, kind: "LAB" | "RADIOLOGY") => TaskPriority | null;
/**
 * هل تأخّر تقييم هذه الحالة عن إيقاع لونها؟ `null` لآخر تقييم يعني «لم تُقيَّم
 * قطّ» ويُعدّ متأخّرًا — الصمت هنا ليس سلامة.
 */
export declare const isReassessmentOverdue: (category: TriageCategory, lastReassessedAt: Date | string | null | undefined, now?: Date) => boolean;
/** الدقائق المتبقية قبل استحقاق إعادة التقييم — سالبة إن تأخّرت */
export declare const minutesUntilReassessment: (category: TriageCategory, lastReassessedAt: Date | string | null | undefined, now?: Date) => number | null;
/**
 * الاستقرار الافتراضي عند أوّل فرز — يُشتقّ من اللون ويبقى قابلًا للتصحيح.
 * أحمرُ مستقرّ تناقضٌ؛ وأخضرُ غير مستقرّ سؤالٌ للممرّض لا للجدول.
 */
export declare const defaultStabilityFor: (category: TriageCategory) => EmergencyStability;
