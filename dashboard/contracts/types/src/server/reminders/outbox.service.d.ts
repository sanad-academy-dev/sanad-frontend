import { NotificationChannel } from "@/generated/prisma/enums";
import type { EnqueueSummary, PreviewRow, ReminderRuleResponse } from "@/server/reminders/reminders.type";
export type { EnqueueSummary, PreviewRow } from "@/server/reminders/reminders.type";
import { type ChannelReadiness } from "@/server/reminders/reminder-schedule";
/**
 * [RC2] الصندوق الصادر — الإدراج والتوزيع.
 *
 * الوحدة كلّها تمرّ من هنا في اتجاهين:
 *
 *   جمعٌ  →  {@link enqueueForRule}  →  صفوف QUEUED في `notification_outbox`
 *   توزيعٌ →  {@link dispatchDue}    →  القناة → SENT / FAILED / SKIPPED / AWAITING_MANUAL
 *
 * وفصلُ الاتجاهين شرطٌ لا ترتيب: الجمع يقرأ محرّكات استحقاق قد تكون بطيئة، والتوزيع
 * يلمس الشبكة. دمجُهما يعني أن تعثّر SMTP يمنع اكتشاف بقيّة الاستحقاقات — وهو نفس
 * السبب الذي جعل `AccountingJob` يفصل «التسجيل» عن «التنفيذ» (AR-7).
 *
 * **ولا شيء هنا يرمي إلى الأعلى.** الوظيفة الخلفية تعالج آلاف الصفوف؛ صفٌّ واحد
 * فاسد يجب أن يُسجَّل في `lastError` لا أن يُسقط الدفعة كلّها.
 */
export type ClinicContext = {
    clinicId: string;
    clinicName: string;
    timezone: string;
};
/** اسمُ الأكاديمية ومنطقتُها الزمنية — قراءةٌ واحدة تخدم كل رسائل الدفعة. */
export declare function clinicContext(clinicId: string): Promise<ClinicContext>;
/**
 * ما يحتاجه الإدراج من القاعدة — مشتقٌّ بـ`Pick` من شكل الاستجابة، لا مكتوبًا بيد
 * (AGENTS.md). و`Pick` لا `GetPayload` عمدًا: الشكل بذلك **بنيويّ**، فصفٌّ قادم من
 * تحديدٍ أوسع (شاشة القواعد تقرأ `createdAt` أيضًا) يمرّ بلا تحويل نوع.
 */
export type ReminderRuleRow = Pick<ReminderRuleResponse, "id" | "clinicId" | "trigger" | "name" | "active" | "offsetHours" | "repeatAfterDays" | "maxSends" | "channels" | "subjectTemplate" | "bodyTemplate" | "quietHoursStart" | "quietHoursEnd" | "horizonDays">;
export declare const reminderRuleSelect: {
    id: true;
    clinicId: true;
    trigger: true;
    name: true;
    active: true;
    offsetHours: true;
    repeatAfterDays: true;
    maxSends: true;
    channels: true;
    subjectTemplate: true;
    bodyTemplate: true;
    quietHoursStart: true;
    quietHoursEnd: true;
    horizonDays: true;
};
/**
 * يجمع مرشَّحي قاعدةٍ واحدة ويُدرج ما حان وقتُه.
 *
 * `dryRun` يفعل كل شيء عدا الكتابة — وهو ما تستدعيه المعاينة في الشاشة. معاينةٌ
 * تسلك مسارًا آخر غير مسار الإرسال ليست معاينة، بل تخمينٌ متفائل.
 */
export declare function enqueueForRule(ctx: ClinicContext, rule: ReminderRuleRow, now: Date, options?: {
    dryRun?: boolean;
    limit?: number;
}): Promise<{
    summary: EnqueueSummary;
    preview: PreviewRow[];
}>;
type Contact = {
    phone: string | null;
    email: string | null;
};
/** أيّ قناةٍ لها مزوّد **ولها عنوان لدى هذا المستلِم** — المدخل الوحيد لـ`pickChannel`. */
export declare function channelReadiness(contact: Contact): Record<NotificationChannel, ChannelReadiness>;
export type DispatchSummary = {
    claimed: number;
    sent: number;
    failed: number;
    skipped: number;
    awaitingManual: number;
};
/**
 * يُسلِّم ما حان موعده.
 *
 * المطالبة ذرّية على مستوى الصفّ (`updateMany` مشروط بـQUEUED) — نفس نمط
 * `accountingJobsDao.claim`. وهذا هو ما يمنع إرسال الرسالة مرّتين حين يدقّ الـcron
 * بينما موظّفٌ يضغط «شغّل الآن»: من يفوز بالتحديث يملكها، والآخر يراها مأخوذة.
 */
export declare function dispatchDue(clinicId: string, options?: {
    limit?: number;
    now?: Date;
}): Promise<DispatchSummary>;
/**
 * موظّفٌ ضغط رابط واتساب — تُعلَّم مُرسَلة **باسمه**.
 *
 * لماذا فعلٌ صريح بدل افتراض: فتحُ الرابط لا يثبت أن الرسالة أُرسلت. الضغطة تقول
 * «فعلتُها»، والتوقيع يجعلها قابلة للمساءلة — وهذا أصدق من علامة «مُرسَل» يكتبها
 * النظام عن شيءٍ لم يفعله.
 */
export declare function markManualSent(clinicId: string, outboxId: string, userId: string | null, now?: Date): Promise<boolean>;
/**
 * يُلغي كل ما لم يُرسل بعد لبصمةٍ ما — يُستدعى حين ينتفي السبب (حُجز الموعد).
 *
 * الملغى لا يُحذف: صفٌّ يقول «كنّا سنرسل هذا ثم لم نعد بحاجة» أنفعُ في التشخيص من
 * غيابٍ لا يفسّر نفسه.
 */
export declare function cancelPendingFor(clinicId: string, dedupeKeys: readonly string[]): Promise<number>;
