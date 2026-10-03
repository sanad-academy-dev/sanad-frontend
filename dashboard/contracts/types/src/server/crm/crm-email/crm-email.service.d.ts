import type { CrmReferenceType } from "@/generated/prisma/enums";
/**
 * §14 — الاسم الظاهر: مفتاح الـCRM أوّلًا، ثم اسم الأكاديمية في إعداداتها، ثم اسم المنشأة.
 * والردّ: بريد الأكاديمية. غيابه يعني أنّ الردود تصل إلى الصندوق العالميّ الذي لا يقرؤه
 * أحد — لا يمنع الإرسال، لكنّ الواجهة تحذّر منه والسجلّ يحفظ أنّه كان فارغًا.
 */
export declare function resolveSenderIdentity(clinicId: string): Promise<{
    fromName: string | null;
    replyTo: string | null;
}>;
export declare function sendCrmEmail(clinicId: string, referenceType: CrmReferenceType, referenceId: string, input: {
    templateId?: string;
    subject?: string;
    body?: string;
    to?: string;
}, actorUserId: string): Promise<{
    subject: string;
    replyTo: string | null;
    id: string;
    templateId: string | null;
    status: import("@/generated/prisma/enums").CrmEmailStatus;
    body: string;
    failureReason: string | null;
    sentBy: {
        name: string;
        id: string;
    } | null;
    toAddress: string;
    sentAt: Date;
}>;
