import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ClinicDocumentCategory, DocumentKind } from "@/generated/prisma/enums";
export { ClinicDocumentCategory, DocumentKind };
/** المدة التي يُعتبر المستند خلالها «ينتهي قريبًا». */
export declare const EXPIRY_SOON_DAYS = 30;
export type ExpiryStatus = "NONE" | "VALID" | "EXPIRING" | "EXPIRED";
/** الأيام المتبقية حتى الانتهاء (سالبة = منتهية، null = بلا تاريخ انتهاء). */
export declare function daysUntilExpiry(expiresAt: Date | string | null | undefined): number | null;
export declare function resolveExpiryStatus(expiresAt: Date | string | null | undefined): ExpiryStatus;
/** خيارات فلتر الصلاحية في شريط الأدوات. */
export declare const EXPIRY_FILTERS: readonly ["all", "valid", "expiring", "expired"];
export type ExpiryFilter = (typeof EXPIRY_FILTERS)[number];
export declare const clinicDocumentFormSchema: z.ZodObject<{
    category: z.ZodEnum<{
        readonly LICENSE: "LICENSE";
        readonly REGISTRATION: "REGISTRATION";
        readonly CONTRACT: "CONTRACT";
        readonly INSURANCE: "INSURANCE";
        readonly POLICY: "POLICY";
        readonly FINANCIAL: "FINANCIAL";
        readonly OTHER: "OTHER";
    }>;
    kind: z.ZodEnum<{
        readonly FILE: "FILE";
        readonly LINK: "LINK";
    }>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    branchId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    issuedAt: z.ZodPipe<z.ZodUnion<[z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodLiteral<"">]>, z.ZodTransform<string | null, string | null | undefined>>;
    expiresAt: z.ZodPipe<z.ZodUnion<[z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodLiteral<"">]>, z.ZodTransform<string | null, string | null | undefined>>;
    url: z.ZodDefault<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type ClinicDocumentFormInput = z.input<typeof clinicDocumentFormSchema>;
export type ClinicDocumentFormValues = z.output<typeof clinicDocumentFormSchema>;
export type CreateClinicDocumentInput = Pick<Prisma.ClinicDocumentUncheckedCreateInput, "category" | "title" | "kind" | "url"> & Partial<Pick<Prisma.ClinicDocumentUncheckedCreateInput, "description" | "branchId" | "mimeType" | "sizeBytes" | "issuedAt" | "expiresAt">>;
export type UpdateClinicDocumentInput = Partial<CreateClinicDocumentInput>;
declare const clinicDocumentSelect: {
    id: true;
    clinicId: true;
    branchId: true;
    category: true;
    title: true;
    description: true;
    kind: true;
    url: true;
    mimeType: true;
    sizeBytes: true;
    issuedAt: true;
    expiresAt: true;
    createdAt: true;
    updatedAt: true;
    branch: {
        select: {
            id: true;
            name: true;
        };
    };
    author: {
        select: {
            id: true;
            name: true;
        };
    };
};
export declare const clinicDocumentSelectShape: {
    id: true;
    clinicId: true;
    branchId: true;
    category: true;
    title: true;
    description: true;
    kind: true;
    url: true;
    mimeType: true;
    sizeBytes: true;
    issuedAt: true;
    expiresAt: true;
    createdAt: true;
    updatedAt: true;
    branch: {
        select: {
            id: true;
            name: true;
        };
    };
    author: {
        select: {
            id: true;
            name: true;
        };
    };
};
export type ClinicDocumentResponse = Prisma.ClinicDocumentGetPayload<{
    select: typeof clinicDocumentSelect;
}>;
/** عدّادات بطاقات الإحصاء — قيم محسوبة، لا شكل جدول، فلا مصدر Prisma تُشتق منه. */
export type ClinicDocumentSummary = {
    total: number;
    expiring: number;
    expired: number;
    addedThisMonth: number;
};
