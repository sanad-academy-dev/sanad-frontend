import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ConsentLocale, ConsentStatus } from "@/generated/prisma/enums";
declare const consentListSelect: {
    readonly id: true;
    readonly type: true;
    readonly status: true;
    readonly locale: true;
    readonly templateKey: true;
    readonly templateVersion: true;
    readonly operationCaseId: true;
    readonly appointmentId: true;
    readonly signerName: true;
    readonly signedAt: true;
    readonly revokedAt: true;
    readonly revokeReason: true;
    readonly extractedByAi: true;
    readonly createdAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
};
export type PatientConsentListResponse = Prisma.PatientConsentGetPayload<{
    select: typeof consentListSelect;
}>;
export declare const patientConsentListSelect: {
    readonly id: true;
    readonly type: true;
    readonly status: true;
    readonly locale: true;
    readonly templateKey: true;
    readonly templateVersion: true;
    readonly operationCaseId: true;
    readonly appointmentId: true;
    readonly signerName: true;
    readonly signedAt: true;
    readonly revokedAt: true;
    readonly revokeReason: true;
    readonly extractedByAi: true;
    readonly createdAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
};
declare const consentDetailSelect: {
    readonly fieldValues: true;
    readonly textSnapshot: true;
    readonly signerRelationship: true;
    readonly signatureMethod: true;
    readonly signatureUrl: true;
    readonly sourceScanUrl: true;
    readonly updatedAt: true;
    readonly witnessStaff: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly signedByStaff: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly template: {
        readonly select: {
            readonly id: true;
            readonly key: true;
            readonly version: true;
            readonly titleAr: true;
            readonly titleEn: true;
            readonly defaultLocale: true;
            readonly speciesKey: true;
            readonly blocks: true;
        };
    };
    readonly id: true;
    readonly type: true;
    readonly status: true;
    readonly locale: true;
    readonly templateKey: true;
    readonly templateVersion: true;
    readonly operationCaseId: true;
    readonly appointmentId: true;
    readonly signerName: true;
    readonly signedAt: true;
    readonly revokedAt: true;
    readonly revokeReason: true;
    readonly extractedByAi: true;
    readonly createdAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
};
export type PatientConsentDetailResponse = Prisma.PatientConsentGetPayload<{
    select: typeof consentDetailSelect;
}>;
export declare const patientConsentDetailSelect: {
    readonly fieldValues: true;
    readonly textSnapshot: true;
    readonly signerRelationship: true;
    readonly signatureMethod: true;
    readonly signatureUrl: true;
    readonly sourceScanUrl: true;
    readonly updatedAt: true;
    readonly witnessStaff: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly signedByStaff: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly template: {
        readonly select: {
            readonly id: true;
            readonly key: true;
            readonly version: true;
            readonly titleAr: true;
            readonly titleEn: true;
            readonly defaultLocale: true;
            readonly speciesKey: true;
            readonly blocks: true;
        };
    };
    readonly id: true;
    readonly type: true;
    readonly status: true;
    readonly locale: true;
    readonly templateKey: true;
    readonly templateVersion: true;
    readonly operationCaseId: true;
    readonly appointmentId: true;
    readonly signerName: true;
    readonly signedAt: true;
    readonly revokedAt: true;
    readonly revokeReason: true;
    readonly extractedByAi: true;
    readonly createdAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
};
declare const templateListSelect: {
    readonly id: true;
    readonly key: true;
    readonly version: true;
    readonly type: true;
    readonly titleAr: true;
    readonly titleEn: true;
    readonly defaultLocale: true;
    readonly speciesKey: true;
    readonly active: true;
    readonly isDefault: true;
};
export type ConsentTemplateListResponse = Prisma.ConsentTemplateGetPayload<{
    select: typeof templateListSelect;
}>;
export declare const consentTemplateListSelect: {
    readonly id: true;
    readonly key: true;
    readonly version: true;
    readonly type: true;
    readonly titleAr: true;
    readonly titleEn: true;
    readonly defaultLocale: true;
    readonly speciesKey: true;
    readonly active: true;
    readonly isDefault: true;
};
/** قيم الحقول — مفتاح الحقل إلى قيمته: نص، أو مصفوفة في قوائم التحقق */
export declare const consentFieldValuesSchema: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>, z.ZodBoolean, z.ZodNull]>>;
export type ConsentFieldValues = z.infer<typeof consentFieldValuesSchema>;
export declare const signConsentSchema: z.ZodObject<{
    signerName: z.ZodString;
    signerRelationship: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    signatureMethod: z.ZodEnum<{
        readonly DRAWN: "DRAWN";
        readonly TYPED: "TYPED";
        readonly UPLOADED: "UPLOADED";
        readonly VERBAL_WITNESSED: "VERBAL_WITNESSED";
    }>;
    signatureUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    witnessStaffId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type SignConsentFormInput = z.infer<typeof signConsentSchema>;
export declare const CONSENT_STATUS_LABELS: Record<ConsentStatus, string>;
export declare const CONSENT_LOCALE_LABELS: Record<ConsentLocale, string>;
/** الموافقة الموقَّعة سجل قانوني — لا تُحرَّر ولا تُحذف، وتصحيحها بموافقة جديدة */
export declare const isConsentEditable: (status: ConsentStatus) => boolean;
export type CreatePatientConsentInput = Pick<Prisma.PatientConsentUncheckedCreateInput, "clinicId" | "patientId" | "ownerId" | "templateKey" | "templateVersion" | "type" | "locale"> & Partial<Pick<Prisma.PatientConsentUncheckedCreateInput, "templateId" | "operationCaseId" | "appointmentId" | "inpatientStayId" | "fieldValues" | "textSnapshot">>;
export {};
