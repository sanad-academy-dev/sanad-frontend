import type { ReminderTrigger } from "@/generated/prisma/enums";
/**
 * [RC5] عقد الجامع — الطبقة التي تربط محرّكات الاستحقاق القائمة بالتذكير.
 *
 * ── القاعدة الحاكمة، وهي الأهمّ في الوحدة كلّها ───────────────────────────────
 *
 * **لا جامعَ يحسب موعد استحقاق.** كلّهم يقرؤون من المحرّك الذي يملك ذلك الحساب
 * أصلًا: التطعيمات من `vaccinationsDao.listDue` (وهو بدوره يستدعي المحرّك الخالص
 * لكل مُستضِدّ)، والتجميل من `nextGroomDueAt`، والتغذية من `nextRecheckAt`.
 *
 * نسخةٌ ثانية من منطق الجدولة تختلف عن الأولى حتمًا — والنتيجة أسوأ من عدم
 * التذكير: تذكيرٌ يقول تاريخًا غير الذي تعرضه الشاشة، فيتّصل وليّ الأمر ويجد الموظّف
 * يرى رقمًا آخر. الجامع **مُترجِم** لا محرّك.
 *
 * وكل جامعٍ يُرجع مرشَّحين لا رسائل: قرارُ القناة والقالب والإزاحة للقاعدة، وقرارُ
 * «هل أُرسلت من قبل؟» للصندوق الصادر. فصلُ هذه الثلاثة هو ما يجعل كل واحدةٍ منها
 * قابلةً للاختبار وحدها.
 */
/** استحقاقٌ واحد يستحقّ تذكيرًا — بلا رأي في القناة ولا في النصّ. */
export type ReminderCandidate = {
    trigger: ReminderTrigger;
    /** ما يُذكَّر عنه: الطفل غالبًا، والفاتورة/الموعد حين لا طفل */
    subjectId: string;
    /** تمييزٌ داخل الموضوع — رمز المُستضِدّ مثلًا، فلكل لقاحٍ استحقاقُه المستقلّ */
    discriminator: string | null;
    dueAt: Date | null;
    ownerId: string | null;
    ownerName: string | null;
    /** كما هو مخزَّن — التطبيع إلى E.164 يقع في طبقة الإدراج، مرّة واحدة */
    ownerPhone: string | null;
    ownerEmail: string | null;
    patientId: string | null;
    patientName: string | null;
    appointmentId: string | null;
    /** قيم القالب الخاصّة بهذا المرشَّح — تُدمج فوق القيم العامّة */
    vars: Readonly<Record<string, string | null>>;
    /** سالب = متأخّر. للعرض والترتيب في قائمة العمل. */
    daysUntilDue: number | null;
};
export type CollectorContext = {
    clinicId: string;
    now: Date;
    /** مدى الاستباق الذي طلبته القاعدة */
    horizonDays: number;
};
export type ReminderCollector = {
    trigger: ReminderTrigger;
    collect(ctx: CollectorContext): Promise<ReminderCandidate[]>;
};
export declare const formatDueDate: (d: Date | null) => string | null;
export declare const formatTime: (d: Date | null) => string | null;
export declare const MS_PER_DAY = 86400000;
/** أيامٌ حتى الاستحقاق — سالبٌ يعني تأخّرًا. مقصوصة إلى اليوم لا اللحظة. */
export declare const daysUntil: (dueAt: Date | null, now: Date) => number | null;
