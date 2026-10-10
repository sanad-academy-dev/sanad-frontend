import type { Prisma } from "@/generated/prisma/client";
import type { CrmReferenceType } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { type WorkingCalendar } from "@/server/crm/crm-sla/crm-sla.rules";
/**
 * تقويم الأكاديمية: أيّامها وورديّاتها من إعدادات الجدولة، ومنطقتها الزمنية من إعداداتها
 * العامّة. أكاديميةٌ لم تُنشئ صفّ جدولةٍ بعد تُعامَل بالافتراضيّات نفسها التي كان الصفّ
 * سيحملها — لا بغياب اتفاقية.
 */
export declare function loadWorkingCalendar(clinicId: string, client?: Prisma.TransactionClient | typeof db): Promise<WorkingCalendar>;
/**
 * §10.1 — يحسب لقطة الاتفاقية لسجلٍّ يُنشأ الآن.
 *
 * يعيد حقولًا تُدمج في `create` نفسه بدل تحديثٍ لاحق: سجلٌّ يوجد لحظةً بلا موعدٍ ثمّ
 * يكتسبه هو سجلٌّ يمكن أن يُقرأ في تلك اللحظة بلا اتفاقية.
 */
export declare function slaFieldsForNewRecord(clinicId: string, referenceType: CrmReferenceType, sourceId: string | null, createdAt: Date, client?: Prisma.TransactionClient | typeof db): Promise<{
    slaPolicyId: string | null;
    responseBy: Date | null;
    slaStatus: "DUE" | null;
}>;
/**
 * §10.3 — يسجّل أوّل ردّ. **متعادل**: أوّل ردٍّ هو الأوّل ولا يُعاد كتابته، فرسالةٌ
 * ثانية بعد ساعة لا تُحسّن رقمًا ولا تُصلح تأخّرًا وقع.
 *
 * يُستدعى من كلّ ما يُعدّ ردًّا في §10.3: بريدٌ صادر، واتساب صادر، ملاحظة مكالمة،
 * وزرّ «تم الرد» اليدويّ. ولا يرمي حين لا اتفاقية — سجلٌّ بلا موعد ببساطة لا يُقاس.
 */
export declare function markFirstResponse(clinicId: string, referenceType: CrmReferenceType, referenceId: string, respondedAt?: Date): Promise<void>;
