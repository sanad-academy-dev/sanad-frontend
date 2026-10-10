import { AppointmentStatus, type TriageCategory } from "@/generated/prisma/enums";
/**
 * [E3] محرّك تجاوز هدف الانتظار — دالّة **نقيّة** على غرار `inpatient-due.service`.
 *
 * الخطة الحاكمة: `docs/emergency-workflow-plan.md` §4.5
 *
 * ── الحدّ المعروف، مذكورًا صراحةً ────────────────────────────────────────────
 *
 * لا مُجدوِل دوريّ في المستودع. فالتجاوز يُكتشف حين يفتح أحدٌ اللوحة أو يدقّ نبض
 * الواجهة — أي أنّه صامت في الثالثة فجرًا والتطبيق مغلق. هذا **نفس** حدّ وحدة
 * التنويم مع الجرعة الفائتة (§4.7 من خطتها)، وهو مسجَّل هنا لا مخفيّ.
 *
 * والدالّة مبنيّة لتقبل المُجدوِل بلا إعادة كتابة: هي بلا حالة، تأخذ `now` وسيطًا
 * ولا تقرؤه من الساعة، فيستدعيها المُجدوِل يوم يوجد كما تستدعيها اللوحة اليوم.
 */
/** الحالات التي «ما زال الطفل ينتظر فيها» — بعدها بدأت الدورة فتوقّف العدّاد */
export declare const WAITING_STATUSES: readonly ["WAITING", "CHECK_IN"];
export declare const isWaitingStatus: (status: AppointmentStatus) => boolean;
export type BreachRow = {
    appointmentId: string;
    category: TriageCategory;
    status: AppointmentStatus;
    /** وقت الوصول الفعلي — بدونه لا يُقاس شيء */
    arrivedAt: Date | null;
};
export type BreachState = "OK" | "IMMINENT" | "BREACHED";
export type BreachEvaluation = {
    appointmentId: string;
    category: TriageCategory;
    state: BreachState;
    /** دقائق الانتظار حتى `now` */
    waitedMinutes: number;
    /** هدف هذه الفئة */
    targetMinutes: number;
    /** المتبقّي حتى التجاوز — سالبٌ بعده */
    remainingMinutes: number;
};
/**
 * النسبة التي يصير عندها الاقتراب إنذارًا مبكّرًا.
 *
 * ٨٠٪ من الهدف: مبكّرٌ بما يكفي ليُفعل شيء، ومتأخّرٌ بما يكفي ألّا يصير كل طفل
 * إنذارًا فور دخوله. الأحمر مستثنى — هدفه صفر، فلا «اقتراب» فيه أصلًا.
 */
export declare const IMMINENT_THRESHOLD = 0.8;
export declare const evaluateBreach: (row: BreachRow, now: Date) => BreachEvaluation | null;
export type BreachSummary = {
    breached: BreachEvaluation[];
    imminent: BreachEvaluation[];
};
/**
 * تقييم دفعة صفوف — مرتَّبة بالأسوأ أوّلًا.
 *
 * الترتيب داخل المجموعة بالتجاوز لا باللون: برتقاليٌّ تجاوز هدفه بأربعين دقيقة
 * أحقُّ بالنظر من أصفرَ تجاوزه بخمس، ولو كان الأصفر أدنى لونًا. اللون رتّب الدخول،
 * والتجاوز يرتّب الإنقاذ.
 */
export declare const evaluateBreaches: (rows: readonly BreachRow[], now: Date) => BreachSummary;
/**
 * ترتيب اللوحة: اللون أوّلًا ثم الأقدم وصولًا.
 *
 * مصدر واحد يستعمله الخادم (لوحة الطوارئ) والعميل (عمود الطابور) معًا، فلا يختلف
 * ترتيب الشاشتين لطفلين متجاورين.
 */
export type TriageOrderRow = {
    /** اسم الحقل كما هو على الزيارة — كي يُمرَّر صفّ اللوحة كما جاء بلا إعادة تشكيل */
    triageCategory: TriageCategory | null;
    arrivedAt: Date | null;
    startsAt: Date;
};
export declare const compareTriageOrder: (a: TriageOrderRow, b: TriageOrderRow) => number;
