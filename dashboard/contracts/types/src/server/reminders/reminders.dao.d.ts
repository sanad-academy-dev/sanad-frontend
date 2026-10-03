import type { Prisma } from "@/generated/prisma/client";
import type { OutboxStatus, ReminderTrigger } from "@/generated/prisma/enums";
import { type CreateRecallContactInput, type CreateReminderRuleInput, type OutboxMessageResponse, type RecallContactResponse, type ReminderRuleResponse, type UpdateReminderRuleInput } from "@/server/reminders/reminders.type";
/**
 * [RC0] استعلامات وحدة التذكيرات — Prisma وحدها (AGENTS.md: لا منطق أعمال في الـDAO).
 */
export declare const remindersDao: {
    /**
     * قواعد الأكاديمية، مع **إنشاء المجموعة الافتراضية عند أوّل قراءة**.
     *
     * الإنشاء الكسول لا البذر: `ensureGlobalDefaults` تقصر على قواعد بيانات مأهولة،
     * فبياناتٌ افتراضية تُشحن في ملفّ بذرٍ لا تصل أكاديميةً قائمة أبدًا (درسٌ مدفوع
     * ثمنُه). وهذا المسار يصل كل أكاديمية، قديمةً كانت أو جديدة، أوّلَ ما تُفتح الشاشة.
     *
     * والإنشاء `skipDuplicates` فطلبان متزامنان لا يُنتجان مجموعتين.
     */
    listRules(clinicId: string): Promise<ReminderRuleResponse[]>;
    findRule(clinicId: string, id: string): Promise<ReminderRuleResponse | null>;
    createRule(input: CreateReminderRuleInput): Promise<ReminderRuleResponse>;
    updateRule(clinicId: string, id: string, input: UpdateReminderRuleInput): Promise<ReminderRuleResponse | null>;
    deleteRule(clinicId: string, id: string): Promise<boolean>;
    listOutbox(clinicId: string, filter?: {
        status?: OutboxStatus;
        trigger?: ReminderTrigger;
        ownerId?: string;
        limit?: number;
    }): Promise<OutboxMessageResponse[]>;
    findOutbox(clinicId: string, id: string): Promise<OutboxMessageResponse | null>;
    /** عدّاد لكل حالة — بطاقات الشاشة، بلا سحب آلاف الصفوف لعدّها على العميل. */
    outboxCounts(clinicId: string): Promise<Record<string, number>>;
    /**
     * هل هذا وليّ الأمر موجود في هذه الأكاديمية؟
     *
     * فحصٌ صريح قبل الإنشاء لأنّ البديل هو ما أمسكه اختبار المتحكّم: مُعرّف وليّ أمر لا
     * وجود له يصطدم بمفتاح أجنبي في Prisma، ويخرج **٥٠٠ «حدث خطأ غير متوقّع»** بدل
     * رسالة عربية تقول ما الخلل. والنطاق بالأكاديمية جزءٌ من الفحص لا زينة: مُعرّفٌ من
     * أكاديمية أخرى يجب أن يُعامَل معاملة غير الموجود تمامًا.
     */
    ownerExists(clinicId: string, ownerId: string): Promise<boolean>;
    /** نفس الحجّة للموعد الذي يُغلق به الاستدعاء. */
    appointmentExists(clinicId: string, appointmentId: string): Promise<boolean>;
    createContact(input: CreateRecallContactInput): Promise<RecallContactResponse>;
    listContactsForOwner(clinicId: string, ownerId: string, limit?: number): Promise<RecallContactResponse[]>;
    /**
     * كل التواصلات المتعلّقة بمجموعة بصمات — القراءة الواحدة التي تُطوى بها قائمة
     * العمل. استعلامٌ لكل بصمة كان سيعني مئات الاستعلامات لصفحةٍ واحدة.
     */
    contactsForKeys(clinicId: string, dedupeKeys: readonly string[]): Promise<RecallContactResponse[]>;
    /** آخر رسالة آلية لكل بصمة — تُظهر «أُرسلت تلقائيًّا» في قائمة العمل. */
    outboxForKeys(clinicId: string, dedupeKeys: readonly string[]): Promise<OutboxMessageResponse[]>;
    countContactsSince(clinicId: string, since: Date): Promise<number>;
    ownersByIds(clinicId: string, ids: readonly string[]): Promise<never[]> | Prisma.PrismaPromise<{
        name: string;
        id: string;
        email: string | null;
        phone: string;
        phoneE164: string | null;
    }[]>;
};
