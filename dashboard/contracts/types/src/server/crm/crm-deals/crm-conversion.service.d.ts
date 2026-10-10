import { type DealSnapshotOverrides } from "@/server/crm/crm-deals/crm-conversion.rules";
import { type CrmDealDetailResponse } from "@/server/crm/crm-deals/crm-deals.type";
import { type CrmLeadDetailResponse } from "@/server/crm/crm-leads/crm-leads.type";
/**
 * BR-C5.3 — «هل هذا الشخص وليّ أمرٌ عندنا أصلًا؟». يُقرأ قبل فتح النافذة فتعرض الاقتراح،
 * ولا يربط شيئًا من تلقاء نفسه: الربط قرار المستخدم، لأن تطابق رقمٍ ليس تطابق شخص
 * (أرقام العائلة الواحدة تتكرّر في الأكاديميات).
 */
export declare function findOwnerCandidateByMobile(clinicId: string, mobile: string): Promise<{
    ownerCandidate: {
        name: string;
        id: string;
        phone: string;
        code: string;
    };
} | {
    ownerCandidate: null;
}>;
/** ما تعرضه النافذة قبل التأكيد: اللقطة المقترحة + مرشّح وليّ الأمر. */
export declare function conversionPreview(clinicId: string, leadId: string): Promise<{
    ownerCandidate: {
        name: string;
        id: string;
        phone: string;
        code: string;
    };
    snapshot: import("@/server/crm/crm-deals/crm-conversion.rules").LeadSnapshotSource;
    alreadyConverted: {
        id: string;
        code: string;
    } | null;
} | {
    ownerCandidate: null;
    snapshot: import("@/server/crm/crm-deals/crm-conversion.rules").LeadSnapshotSource;
    alreadyConverted: {
        id: string;
        code: string;
    } | null;
}>;
export type ConvertLeadInput = DealSnapshotOverrides & {
    statusId: string;
    ownerId?: string;
    probability?: number;
    expectedCloseDate?: string;
    dealValue?: string;
};
export declare function convertLead(clinicId: string, leadId: string, input: ConvertLeadInput, actorUserId: string): Promise<{
    deal: CrmDealDetailResponse;
    lead: CrmLeadDetailResponse;
}>;
