import type { Prisma } from "@/generated/prisma/client";
import { parseBranchSettings } from "@/server/branches/branches.type";
/**
 * [E0] قراءة إعدادات الطوارئ للفرع.
 *
 * الإعدادات تعيش في عمود `Branch.settings` (JSON) — القرار D1، والسبب مزدوج:
 * فرعٌ واحد قد يدير طوارئ وبقيّة الفروع لا، ولا نوع Prisma جديد يُضاف إلى رسمٍ
 * بلغ سقفه.
 *
 * **الإطفاء هو الافتراضي، ومعناه سلوك اليوم حرفًا بحرف.** كل مستدعٍ يجب أن يسأل
 * `enabled` قبل أن يغيّر شيئًا: أكاديميةٌ لم تفعّل الوحدة يجب ألّا ترى فرقًا واحدًا في
 * شاشاتها.
 */
type Tx = Prisma.TransactionClient;
export type EmergencySettings = ReturnType<typeof parseBranchSettings>["emergency"];
export declare function emergencySettingsFor(branchId: string, client?: Tx): Promise<EmergencySettings>;
/** هل طبقة الطوارئ مفعّلة على هذا الفرع؟ */
export declare function isEmergencyEnabled(branchId: string, client?: Tx): Promise<boolean>;
/**
 * الفروع المفعَّل عليها الطوارئ في هذه الأكاديمية.
 *
 * يُقرأ مرّة ويُمرَّر، بدل سؤال الإعدادات لكل صفّ على اللوحة.
 */
export declare function emergencyEnabledBranchIds(clinicId: string, client?: Tx): Promise<string[]>;
/**
 * هل وقع هذا الوقت خارج نوافذ الورديات؟ — لسطر «خارج الدوام» (§4.3).
 *
 * يُقاس على نوافذ `ClinicSchedulingSettings` القائمة أصلًا، فلا جدول جلسات عمل
 * ثانٍ يُخترع هنا ثم يفترق عن الأوّل.
 */
export declare function isAfterHours(at: Date, scheduling: {
    shiftsEnabled: boolean;
    morningStartMinute: number;
    morningEndMinute: number;
    eveningStartMinute: number;
    eveningEndMinute: number;
} | null): boolean;
export {};
