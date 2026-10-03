import type { CrmSlaStatus, Weekday } from "@/generated/prisma/enums";
/**
 * [CRM-P5] §10.2 — حاسبة وقت العمل، خالصة بلا قاعدة بيانات.
 *
 * كلّ ما في هذا الملفّ دوالّ نقيّة تأخذ التقويم صراحةً، لأنّ هذا هو الموضع الذي يتقرّر
 * فيه متى «تأخّرنا على العميل» — وهو أحقّ ما في المرحلة بالاختبار في الحزمة السريعة، لا
 * خلف أكاديميةٍ وجلسةٍ ومسار HTTP.
 *
 * ── ما يقوله التقويم (§17.2 صفّ ٢٢) ──────────────────────────────────────────
 * التقويم مقروءٌ من `ClinicSchedulingSettings` القائمة، ولا تُنشئ الوحدة جدول ساعاتٍ
 * خاصًّا بها: أيّام العمل من `workDays`، والنوافذ من الورديتين حين `shiftsEnabled` —
 * **والفجوة بينهما لا تُحرّك الساعة**. وحين تُطفأ الورديات يصير اليوم كلّه وقت عمل.
 *
 * ولا عطلات: لا يملك المستودع تقويم إغلاقاتٍ للأكاديمية أصلًا، وبناء واحدٍ خاصّ بـCRM كان
 * سيُهاجَر لاحقًا ([P13.16]). فقد يستحقّ هدفٌ في يومٍ كانت الأكاديمية فيه مغلقة، وهي ثغرة
 * v1 معلومة ومقبولة لا مفاجأة.
 *
 * ── والمنطقة الزمنية ليست تفصيلًا ────────────────────────────────────────────
 * الأعمدة دقائق من منتصف الليل **بتوقيت الأكاديمية**، والطوابع تُخزَّن UTC. فحساب النافذة
 * على UTC مباشرةً يزيح يوم العمل بثلاث ساعات في الرياض — أي أنّ نصف المساء يصير «خارج
 * الدوام» وأوّل الصباح «داخله». لذلك كلّ تحويلٍ هنا يمرّ بـ`Intl` على منطقة الأكاديمية.
 */
/** ما تحتاجه الحاسبة من إعدادات الأكاديمية — لا أكثر، ليبقى الاختبار بلا قاعدة بيانات. */
export type WorkingCalendar = {
    /** منطقة IANA، مثل «Asia/Riyadh» — من `ClinicSettings.timezone`. */
    timezone: string;
    workDays: Weekday[];
    shiftsEnabled: boolean;
    morningStartMinute: number;
    morningEndMinute: number;
    eveningStartMinute: number;
    eveningEndMinute: number;
};
type LocalParts = {
    year: number;
    month: number;
    day: number;
    minuteOfDay: number;
};
/** لحظة UTC → أجزاء التوقيت المحلّي للأكاديمية. */
export declare function toLocalParts(instant: Date, timeZone: string): LocalParts;
/** نوافذ العمل ليومٍ محلّي، بالدقائق من منتصف الليل. فارغة = ليس يوم عمل. */
export declare function windowsForDay(instant: Date, calendar: WorkingCalendar): [number, number][];
/**
 * §10.1 — موعد الاستجابة: يُضاف الهدف بدقائق **وقت العمل** إلى لحظة الإنشاء.
 *
 * يعيد `null` حين لا يمكن أن يحلّ الموعد أصلًا — أكاديميةٌ بلا أيّام عمل، أو بورديّاتٍ
 * فارغة. وهو ليس خطأً يُرمى: أكاديمية بهذا الضبط ببساطة لا تملك اتفاقية استجابة، والصمت
 * أصدق من موعدٍ مخترَع.
 */
export declare function addWorkingMinutes(start: Date, minutes: number, calendar: WorkingCalendar): Date | null;
/**
 * §10.3 — الدقائق المنقضية من **وقت العمل** بين لحظتين.
 *
 * هذه هي الدالّة التي تجعل ردًّا في الحادية عشرة ليلًا يساوي صفر دقيقة: النافذة مغلقة،
 * فلا شيء يُحتسب. والطابع نفسه لا تلمسه هذه الدالّة ولا أيّ دالّة أخرى هنا.
 */
export declare function elapsedWorkingMinutes(from: Date, to: Date, calendar: WorkingCalendar): number;
/**
 * §10.3 — حصيلة أوّل ردّ.
 *
 * **الطابع يخرج كما دخل.** هذه هي القاعدة التي يسهل نقضها بهدوء: إزاحة ردٍّ وصل ١١
 * ليلًا إلى «٨ صباح الغد» تجعل الخيط الزمني يكذب على من يقرؤه لاحقًا. الساعة والسجلّ
 * يجيبان سؤالين مختلفين: كم استغرقنا من وقت عملٍ، ومتى ردّ الإنسان فعلًا (§17.2 صفّ ٢٢).
 */
export declare function firstResponseOutcome(createdAt: Date, respondedAt: Date, responseBy: Date | null, calendar: WorkingCalendar): {
    firstRespondedAt: Date;
    firstResponseDuration: number;
    slaStatus: CrmSlaStatus;
};
/**
 * §10.3 — الحالة المشتقّة على القراءة. تبقى `DUE` حتى يمرّ الموعد، فتصير `FAILED` بلا
 * انتظار مهمّةٍ ليلية: المهمّة تُثبّت ما تراه القراءة، ولا تكون هي مصدره.
 */
export declare function deriveSlaStatus(input: {
    responseBy: Date | null;
    firstRespondedAt: Date | null;
    now: Date;
}): CrmSlaStatus | null;
/** ما تحتاجه دالّة الاختيار من صفّ السياسة — لا الصفّ كلّه، فتبقى نقيّة. */
export type SelectablePolicy = {
    id: string;
    appliesTo: "LEAD" | "DEAL" | "BOTH";
    firstResponseMinutes: number;
    order: number;
    sources: {
        sourceId: string;
        firstResponseMinutes: number | null;
    }[];
};
/**
 * §10.1 — **أوّل سياسةٍ فعّالة مطابِقة تنطبق** (قاعدة النظام المرجعيّ).
 *
 * «مطابِقة» على مستويين: الكيان (`appliesTo`)، ثمّ المصدر — وسياسةٌ **بلا صفوف مصادر
 * تنطبق على الكلّ**. هذا هو الفرق الذي يجعل التراجع مقصودًا لا عرَضيًّا: «لم يُحدَّد
 * مصدر» تعني الجميع، أمّا «حُدِّدت مصادر ولم يُطابِق أيٌّ منها» فتعني لا تنطبق.
 *
 * ويُفترض أن يصل `policies` مرتَّبًا بـ`order` ثمّ بأيّ فاصلٍ ثابت؛ الترتيب يقع في
 * الاستعلام لا هنا، لكنّ الدالّة تُعيد فرزه دفاعًا حتى لا تصير «الأولى» رهن ترتيب صفٍّ
 * عابر.
 */
export declare function selectPolicy(policies: SelectablePolicy[], referenceType: "LEAD" | "DEAL", sourceId: string | null): {
    policyId: string;
    firstResponseMinutes: number;
} | null;
export {};
