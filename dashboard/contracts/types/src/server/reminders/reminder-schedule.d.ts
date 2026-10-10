import type { NotificationChannel, ReminderTrigger } from "@/generated/prisma/enums";
/**
 * [RC3] محرّك جدولة التذكير — دوالّ **خالصة** بلا وصول إلى قاعدة البيانات.
 *
 * الخلوص هنا نفس الخلوص في `vaccination-due.service.ts` و`triage-breach.service.ts`،
 * وللسبب نفسه: السويّة السريعة في CI لا `DATABASE_URL` لها (القاعدة ١٤)، فمنطقٌ
 * يعيش داخل استعلام Prisma لا يُختبَر إلّا في السويّة الكاملة. وكل قرارٍ هنا
 * — متى تُرسل، وهل هذه ساعة هدوء، وأيّ قناة تفوز، وما بصمة عدم التكرار — قرارٌ
 * يجب أن ينكسر في اختبارٍ لا في رسالةٍ وصلت وليّ أمرًا في الثالثة فجرًا.
 *
 * ولا تقرأ أيّ دالّة هنا الساعة بنفسها: `now` وسيطٌ دائمًا. هذا ما يجعل الاختبار
 * ممكنًا أصلًا، وهو نفس العُرف الذي بُني عليه محرّك تجاوز الفرز.
 */
/**
 * العمود الحامل للوحدة كلّها.
 *
 * `NotificationOutbox.dedupeKey` فريدٌ على مستوى الأكاديمية، فبناؤه من (السبب،
 * الموضوع، بصمة الاستحقاق) يجعل تشغيل الـcron مئةَ مرّة في اليوم مساويًا لتشغيله
 * مرّة: أوّلُ إدراج يفوز، وما بعده يصطدم بالفرادة ويُهمَل بهدوء.
 *
 * **بصمة الاستحقاق جزءٌ من المفتاح لا زينة.** لولاها لَما أمكن تذكيرُ وليّ الأمر
 * بجرعة العام القادم بعد أن ذُكِّر بجرعة هذا العام — فالمفتاح نفسه.
 *
 * والتاريخ يُقصّ إلى اليوم عمدًا: استحقاقٌ في العاشرة صباحًا واستحقاقٌ في الثانية
 * ظهرًا من اليوم نفسه هما استحقاقٌ واحد في نظر وليّ الأمر.
 */
export declare function buildDedupeKey(input: {
    trigger: ReminderTrigger;
    /** الطفل أو الموعد أو الفاتورة — ما يُذكَّر عنه */
    subjectId: string;
    /** تمييزٌ داخل الموضوع الواحد: رمز المُستضِدّ مثلًا، فلكلّ لقاحٍ استحقاقُه */
    discriminator?: string | null;
    dueAt: Date | null;
    /** رقم الإرسال ضمن سلسلة التكرار (1 = الأولى) — يفصل التذكير الثاني عن الأوّل */
    sequence?: number;
}): string;
/** `YYYY-MM-DD` بتوقيت UTC — ثابتٌ لا يتحرّك مع منطقة تشغيل الخادم. */
export declare const isoDay: (d: Date) => string;
export declare const MS_PER_DAY = 86400000;
/**
 * لحظةُ الإرسال المستهدَفة: `offsetHours` **قبل** الاستحقاق.
 *
 * الموجب يسبق (تذكير قبل ٢٤ ساعة)، والسالب يلحق (استدعاءُ من تأخّر بعد ٧ أيام).
 * وهذا الاتجاه هو ما تقوله شاشة الإعدادات حرفيًّا، فعكسُه هنا يجعل كل قاعدة تعمل
 * بالمقلوب بلا خطأ يظهر.
 */
export declare function sendTimeFor(dueAt: Date, offsetHours: number): Date;
/**
 * هل حان وقت هذه الرسالة؟
 *
 * ما فات موعدُه يُرسَل فورًا لا يُهمَل: أكاديميةٌ فعّلت قاعدةً اليوم على استحقاقٍ كان
 * أمس يجب أن تُذكِّر، لا أن تصمت لأن اللحظة المثالية مضت. أمّا `graceDays` فتمنع
 * نبشَ استحقاقاتٍ قديمة جدًّا عند أوّل تشغيل — وهي الفرق بين تفعيلٍ هادئ وبين
 * ألف رسالة تخرج دفعةً واحدة.
 */
export declare function isSendable(sendAt: Date, now: Date, graceDays?: number): boolean;
/** أقصى قِدَمٍ يُقبل عند أوّل تشغيل — أسبوعان، مثل مدى الاستباق الافتراضي. */
export declare const DEFAULT_BACKFILL_GRACE_DAYS = 14;
export declare const MINUTES_PER_DAY = 1440;
/**
 * دقائق اليوم المحلّي لهذه اللحظة في منطقةٍ زمنية بعينها.
 *
 * تُحسب بـ`Intl` لا بحسابٍ يدويّ على `getTimezoneOffset`: الأخير يعطي إزاحة
 * **الخادم** لا إزاحة الأكاديمية، وخادمٌ في UTC يجعل «العاشرة ليلًا بالرياض» تُقرأ
 * السابعة مساءً — أي أن ساعات الهدوء تحمي الساعات الخطأ.
 */
export declare function localMinutes(at: Date, timezone: string): number;
/**
 * هل تقع هذه اللحظة داخل نافذة الهدوء؟
 *
 * النافذة **تلتفّ حول منتصف الليل** بالضرورة — «من ٢١:٠٠ إلى ٠٨:٠٠» هي الحالة
 * الطبيعية لا الاستثناء. فالمقارنة البسيطة `start <= m && m < end` تعطي عكس
 * المطلوب تمامًا في تلك الحالة: تصمت طوال النهار وترسل طوال الليل.
 */
export declare function inQuietHours(minutes: number, start: number | null, end: number | null): boolean;
/**
 * تؤجَّل الرسالة إلى نهاية نافذة الهدوء — **لا تُلغى**.
 *
 * الإلغاء يعني أن تذكير الغد يختفي لأن الـcron صادف الثانية فجرًا، وهو أسوأ من
 * التأخير بساعات.
 */
export declare function deferPastQuietHours(sendAt: Date, timezone: string, start: number | null, end: number | null): Date;
/** ما تحتاجه القناة لتكون قابلة للتسليم فعلًا. */
export type ChannelReadiness = {
    /** للقناة مزوّد مُهيّأ في هذه الحزمة */
    providerReady: boolean;
    /** للمستلِم عنوانٌ صالح على هذه القناة */
    hasAddress: boolean;
};
/**
 * أوّلُ قناةٍ **قابلة للتسليم** من قائمة تفضيل القاعدة.
 *
 * النزول للقناة التالية بدل الإسقاط مقصود: قاعدةٌ تفضّل SMS ثم واتساب يجب ألّا
 * تصمت لأن مزوّد الرسائل غير مُهيّأ بعد. وإرجاع `null` يعني «لا قناة صالحة»،
 * وهي حالةٌ تُسجَّل `SKIPPED` بسببٍ مُفصح لا تُبتلع.
 */
export declare function pickChannel(preferred: readonly NotificationChannel[], readiness: Readonly<Record<NotificationChannel, ChannelReadiness>>): NotificationChannel | null;
/** لماذا سقطت كل القنوات — نصٌّ عربيّ يُخزَّن في `lastError` ويُعرض كما هو. */
export declare function explainNoChannel(preferred: readonly NotificationChannel[], readiness: Readonly<Record<NotificationChannel, ChannelReadiness>>): string;
/**
 * موعد الإرسال التالي في سلسلة تكرار، أو `null` حين استُنفد السقف.
 *
 * السقف (`maxSends`) هو الحدّ الذي يفصل التذكير عن الإزعاج: قاعدةٌ بلا سقف تعني
 * أن وليّ أمرًا لا يردّ يتلقّى الرسالة نفسها إلى الأبد.
 */
export declare function nextRepeatAt(input: {
    lastSentAt: Date;
    repeatAfterDays: number | null;
    sendsSoFar: number;
    maxSends: number;
}): Date | null;
