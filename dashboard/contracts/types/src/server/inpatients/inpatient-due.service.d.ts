import { InpatientAdministrationStatus, type InpatientOrderKind } from "@/generated/prisma/enums";
/**
 * [IP2] محرّك الاستحقاق — «من يحتاج شيئًا الآن؟».
 *
 * نقيّ تمامًا: لا قاعدة بيانات، ولا ساعة داخلية (اللحظة تُمرَّر دائمًا). هذا هو
 * الملفّ الذي يقرّر ترتيب لوحة العنبر، وهو أهمّ سطر في الوحدة كلّها: عنبرٌ مرتّب
 * أبجديًّا يجعل الطاقم يبحث عمّن يحتاجه، وعنبرٌ مرتّب بالاستحقاق يقول له.
 *
 * ── المبدأ المستعار من محرّك استحقاق اللقاحات ────────────────────────────────
 *
 * الحالة تُصنَّف ولا تُخمَّن. غياب البيانات حالةٌ باسمها (`NO_BASELINE`) لا
 * «سليم»: عنبرٌ لم يُقَس فيه شيء منذ الدخول ليس عنبرًا منضبطًا، وقراءته كذلك
 * تُخفي بالضبط ما وُجد النظام ليُظهره.
 *
 * ── لماذا لا يوجد `MISSED` مخزَّنًا ────────────────────────────────────────
 *
 * «الجرعة فاتت» اشتقاقٌ من (`dueAt` + المهلة < الآن) على صفٍّ ما زال PENDING.
 * تخزينه يستلزم وظيفة دوريّة تكتبه، ولا مجدول في هذا المستودع (الخطة §4.7) —
 * فيصير العمود صادقًا فقط حين يكون أحدٌ مفتوحًا للشاشة، وهي اللحظة التي لا نحتاجه
 * فيها أصلًا. الاشتقاق عند القراءة يبقى صحيحًا دائمًا.
 */
/**
 * مهلة السماح للجرعة بالدقائق. الرقم ليس اعتباطيًّا: قاعدة «الثلاثين دقيقة»
 * ممارسة تطفلية قياسية — الجرعة «في موعدها» ضمن ±٣٠ دقيقة من الوقت المجدول،
 * وما بعدها انحرافٌ يُسجَّل. جعلها صفرًا يجعل كل جرعة متأخّرة إنذارًا، فيتعلّم
 * الطاقم تجاهل اللون الأحمر — وهو أسوأ ما يمكن أن يفعله نظام إنذار.
 */
export declare const DEFAULT_ADMINISTRATION_GRACE_MINUTES = 30;
/** نافذة «يقترب موعده» — ما يظهر أصفر على اللوحة قبل أن يستحقّ */
export declare const DEFAULT_DUE_SOON_MINUTES = 30;
export type InpatientDueStatus = "ON_TRACK" | "DUE_SOON" | "DUE" | "OVERDUE";
export declare const INPATIENT_DUE_STATUS_LABELS: Record<InpatientDueStatus, string>;
export declare const worstDueStatus: (statuses: readonly InpatientDueStatus[]) => InpatientDueStatus;
/** ما يحتاجه المحرّك من صفّ الإعطاء — لا يستورد النموذج كي يبقى نقيًّا */
export type DueAdministrationInput = {
    id: string;
    orderId: string;
    dueAt: Date;
    status: InpatientAdministrationStatus;
    orderKind: InpatientOrderKind;
    /** اسم المادة/الأمر كما يُعرض في القائمة */
    label: string;
};
export type EvaluatedAdministration = DueAdministrationInput & {
    dueStatus: InpatientDueStatus;
    /** دقائق التأخّر عن الموعد — موجبة فقط للمتأخّر، وإلا صفر */
    minutesLate: number;
};
/** حالة استحقاق القياس الدوري — منفصلة لأن غياب خطّ الأساس حالة قائمة بذاتها */
export type VitalsDueState = "NOT_SCHEDULED" | "NO_BASELINE" | "ON_TRACK" | "DUE" | "OVERDUE";
export declare const VITALS_DUE_STATE_LABELS: Record<VitalsDueState, string>;
export type InpatientDueEvaluation = {
    /** الحالة المجمَّعة — أسوأ ما في الإقامة، وهي ما يُلوَّن به كرت اللوحة */
    status: InpatientDueStatus;
    /** أقرب استحقاق قادم أو فائت — هو ما يُخزَّن كاشًا في `InpatientStay.nextDueAt` */
    nextDueAt: Date | null;
    overdue: readonly EvaluatedAdministration[];
    due: readonly EvaluatedAdministration[];
    dueSoon: readonly EvaluatedAdministration[];
    vitals: {
        state: VitalsDueState;
        dueAt: Date | null;
        minutesLate: number;
    };
};
export type DueEvaluationOptions = {
    graceMinutes?: number;
    dueSoonMinutes?: number;
};
/**
 * هل فات هذا الصفّ موعده؟ الشرطان معًا: معلَّق، ومضى موعده ومهلته.
 *
 * الصفّ المُعطى أو المتخطَّى أو الموقوف ليس فائتًا مهما قدُم — قرارٌ اتُّخذ
 * وسُجِّل، والفوات غياب قرار لا قدَم تاريخ.
 */
export declare const isAdministrationMissed: (admin: Pick<DueAdministrationInput, "dueAt" | "status">, at: Date, graceMinutes?: number) => boolean;
export declare const administrationDueStatus: (admin: Pick<DueAdministrationInput, "dueAt" | "status">, at: Date, options?: DueEvaluationOptions) => InpatientDueStatus;
/**
 * موعد القياس الدوري القادم = آخر قياس + الدورية.
 *
 * دوريّة غير موجبة تعني «لا مراقبة مجدولة» لا «كل صفر دقيقة»: إقامة فندقية أو
 * حالة مستقرّة قد تُضبط بلا جدولة، وقسمةُ ذلك على نفسه تُنتج إنذارًا كل ثانية.
 */
export declare const nextVitalsDueAt: (lastVitalsAt: Date | null, monitoringIntervalMinutes: number) => Date | null;
/**
 * حالة استحقاق القياس. مهلة السماح تضيق مع ضيق الدورية: مهلة ٣٠ دقيقة على
 * مراقبة كل ساعة تعني نصف الفترة، وهو ما يُفرغ الجدولة من معناها في العناية
 * المركّزة — حيث الدقائق هي المقصود أصلًا.
 */
export declare const evaluateVitalsDue: (input: {
    lastVitalsAt: Date | null;
    monitoringIntervalMinutes: number;
    at: Date;
    graceMinutes?: number;
}) => {
    state: VitalsDueState;
    dueAt: Date | null;
    minutesLate: number;
};
/**
 * تقييم إقامة واحدة. المخرجات ثلاث قوائم مفصولة (فائت/مستحقّ/يقترب) لأن الواجهة
 * تعرض الثلاث مختلفةً، ودمجُها يجبر كل مستدعٍ على إعادة الفرز.
 */
export declare const evaluateInpatientDue: (input: {
    administrations: readonly DueAdministrationInput[];
    monitoringIntervalMinutes: number;
    lastVitalsAt: Date | null;
    at: Date;
    options?: DueEvaluationOptions;
}) => InpatientDueEvaluation;
/**
 * جلسات الجرعات المشتقّة من جدول الأمر ضمن نافذة زمنية.
 *
 * دالّة نقيّة تُستدعى مرّتين: عند إنشاء الأمر (لتوليد صفوفه)، وعند تمديد الأفق
 * (لتوليد ما بعده). لا تُنشئ صفوفًا ولا تعرف عن قاعدة بيانات شيئًا — تُعيد لحظات
 * فقط، فيمكن اختبارها ومقارنة مخرجها بالمخزَّن بلا أثر جانبي.
 *
 * الجدولان لا يجتمعان: `scheduleTimes` (أوقات ثابتة من اليوم) يَجُبّ
 * `scheduleIntervalHours` حين يوجد — لأن «كل ٨ ساعات» و«٨ص و٤م و١٢م» جدولان
 * مختلفان لا يُدمجان، وطلبُ الاثنين خطأُ إدخال لا نيّةُ مضاعفة.
 */
export declare const generateAdministrationDueTimes: (input: {
    startAt: Date;
    endAt: Date | null;
    scheduleIntervalHours: number | null;
    /** "HH:mm" بتوقيت الأكاديمية */
    scheduleTimes: readonly string[];
    prn: boolean;
    /** آخر لحظة يُولَّد إليها — أفق التوليد */
    horizonEnd: Date;
    /** لا تُولَّد جلسات قبل هذه اللحظة (تمديد أفق أمر قائم) */
    generateAfter?: Date | null;
    /** سقف أمان لعدد الصفوف في الاستدعاء الواحد */
    maxOccurrences?: number;
}) => Date[];
/** "HH:mm" → أجزاء، أو null لصيغة غير صالحة (لا تُخمَّن ولا تُصحَّح) */
export declare const parseClockTime: (value: string) => {
    hours: number;
    minutes: number;
} | null;
/**
 * أفق التوليد الافتراضي بالأيام. يومان يكفيان لوردية ونصف ويُبقيان عدد الصفوف
 * معقولًا؛ التمديد يجري تلقائيًّا عند كل قراءة للورقة، فلا حاجة إلى مجدول.
 */
export declare const DEFAULT_GENERATION_HORIZON_DAYS = 2;
export declare const generationHorizonEnd: (from: Date, days?: number) => Date;
