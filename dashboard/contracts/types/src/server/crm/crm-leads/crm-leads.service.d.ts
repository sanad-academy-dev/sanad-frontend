import { type CreateLeadFormInput, type CrmLeadDetailResponse } from "@/server/crm/crm-leads/crm-leads.type";
/**
 * [CRM-P1] منطق العميل المحتمل (§3).
 *
 * **تغيير الحالة مسارٌ واحد** (`changeLeadStatus`): السحب في لوحة كانبان والقائمة
 * المنسدلة في صفحة العميل كلاهما يناديه. تطبيقان لنفس الانتقال يعني قاعدةً تُطبَّق في
 * أحدهما فقط — وهو بالضبط صنف الانحراف الذي تحذّر منه §18.2.
 */
/** الشكل القابل للمقارنة وحده (Q2): يُشتقّ عند كل كتابة، ولا يُعرَض للمستخدم أبدًا. */
export declare const toComparableMobile: (raw: string) => string | null;
/**
 * BR-C3.2 — البحث عن مطابق بالجوال. يقارن بالشكل المُطبَّع حين يتوفّر، ويتراجع إلى
 * المطابقة الحرفية حين يعجز المُطبِّع عن قراءة الرقم — فرقمٌ لا يفهمه المُطبِّع يبقى
 * قابلًا للمطابقة مع رقمٍ آخر أُدخل بنفس الشكل.
 */
export declare function findDuplicateByMobile(clinicId: string, mobile: string, exceptId?: string): Promise<import("@/server/crm/crm-leads/crm-leads.rules").DuplicateWarning>;
export declare function createLead(clinicId: string, input: CreateLeadFormInput, actorUserId: string): Promise<{
    lead: CrmLeadDetailResponse;
    duplicateWarning: Awaited<ReturnType<typeof findDuplicateByMobile>>;
}>;
/**
 * §3 — المسار الوحيد لتغيير الحالة. يفرض BR-C3.3 وBR-C3.5، ويكتب سجلّ BR-C3.4 بمدّته،
 * كله في معاملةٍ واحدة: حالةٌ تغيّرت بلا سطر سجلّ تُفسد تقارير السرعة إلى الأبد.
 */
export declare function changeLeadStatus(clinicId: string, leadId: string, input: {
    statusId: string;
    lostReasonId?: string;
    lostNotes?: string;
}, actorUserId: string): Promise<CrmLeadDetailResponse>;
export declare function assignLead(clinicId: string, leadId: string, ownerUserId: string | null, actorUserId: string): Promise<CrmLeadDetailResponse>;
