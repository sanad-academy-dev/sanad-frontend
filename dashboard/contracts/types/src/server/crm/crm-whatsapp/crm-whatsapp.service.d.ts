import type { CrmReferenceType } from "@/generated/prisma/enums";
export declare function sendWhatsapp(clinicId: string, referenceType: CrmReferenceType, referenceId: string, body: string, actorUserId: string): Promise<{
    at: Date;
    id: string;
    status: import("@/generated/prisma/enums").CrmWhatsappStatus | null;
    body: string;
    referenceType: CrmReferenceType | null;
    referenceId: string | null;
    direction: import("@/generated/prisma/enums").CrmWhatsappDirection;
    failureReason: string | null;
    chatId: string;
    sentBy: {
        name: string;
        id: string;
    } | null;
    providerMessageId: string | null;
}>;
export declare function matchSubjectByPhone(clinicId: string, digits: string): Promise<{
    referenceType: CrmReferenceType;
    referenceId: string;
    ownerUserId: string | null;
} | null>;
/**
 * §9.2 — حفظ رسالةٍ واردة. غير المطابَقة **تُحفظ بلا مرجع** ولا تُرمى: فقدان رسالة عميل
 * أسوأ من صفٍّ بلا رابط. ولا إشعار لها — بلا مرجعٍ لا مُسنَد إليه يُشعَر.
 */
export declare function recordInbound(clinicId: string, input: {
    chatId: string;
    body: string;
    providerMessageId?: string;
}): Promise<{
    at: Date;
    id: string;
    status: import("@/generated/prisma/enums").CrmWhatsappStatus | null;
    body: string;
    referenceType: CrmReferenceType | null;
    referenceId: string | null;
    direction: import("@/generated/prisma/enums").CrmWhatsappDirection;
    failureReason: string | null;
    chatId: string;
    sentBy: {
        name: string;
        id: string;
    } | null;
    providerMessageId: string | null;
}>;
/** تحديث حالة رسالةٍ صادرة حين يصل إشعارها لاحقًا. */
export declare function applyStatusUpdate(clinicId: string, providerMessageId: string, status: "SENT" | "DELIVERED" | "READ" | "FAILED"): Promise<void>;
