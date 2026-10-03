import type { CrmLeadStatusKind, Gender } from "@/generated/prisma/enums";
/**
 * [CRM-P2] §5 — قواعد التحويل الخالصة (بلا قاعدة بيانات، فتعمل في الحزمة السريعة).
 */
/**
 * BR-C5.1 — العميل المحتمل يتحوّل مرّة واحدة. التحويل الثاني يخلق صفقةً ثانيةً لنفس
 * المحادثة، فتُحتسب التحويلات مرّتين ويصير معدّل التحويل في §12 كذبًا مُقاسًا.
 */
export declare function assertNotAlreadyConverted(convertedDealId: string | null | undefined, dealCode?: string | null): void;
/**
 * BR-C3.5 — العميل المحتمل «المحوَّل» للقراءة فقط، عدا الملاحظات. تحرير لقطته بعد
 * التحويل يجعل الصفقة والعميل يرويان روايتين مختلفتين عن الشخص نفسه، والصفقة هي
 * المستند الحيّ بعد هذه النقطة.
 */
export declare function assertLeadEditable(kind: CrmLeadStatusKind): void;
/** ما يقرأه التحويل من العميل المحتمل. مُعرَّف هنا حتى تبقى الدالة خالصةً وقابلةً للاختبار. */
export type LeadSnapshotSource = {
    firstName: string;
    lastName: string | null;
    gender: Gender | null;
    mobile: string;
    phone: string | null;
    email: string | null;
    city: string | null;
    address: string | null;
    petSpecies: string | null;
    petCount: number | null;
    petNotes: string | null;
    ownerUserId: string | null;
    notes: string | null;
    sourceId: string | null;
};
/** ما يسمح المُغيِّر (نافذة التحويل) بتعديله قبل التأكيد — كل حقلٍ اختياري. */
export type DealSnapshotOverrides = Partial<{
    firstName: string;
    lastName: string;
    gender: Gender;
    mobile: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    petSpecies: string;
    petCount: number;
    petNotes: string;
    ownerUserId: string;
    notes: string;
    sourceId: string;
}>;
/**
 * §5 خطوة ١ — نسخ الحقول المُعيَّنة. النافذة تسمح بالتعديل قبل التأكيد (سلوك النظام
 * المرجعي)، فالمُغيَّر يفوز حين يُرسَل، واللقطة تأخذ قيمة العميل المحتمل حين لا يُرسَل.
 *
 * `undefined` وحدها تعني «لم يُعدَّل»؛ ولذلك يمرّ كل حقلٍ عبر فحصٍ صريح بدل `??`، الذي
 * كان سيبتلع «مسح الحقل» لو أُرسِل فارغًا يومًا.
 */
export declare function buildDealSnapshotFromLead(lead: LeadSnapshotSource, overrides?: DealSnapshotOverrides): LeadSnapshotSource;
