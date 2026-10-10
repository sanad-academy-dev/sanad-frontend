import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const createDealSchema: z.ZodObject<{
    leadId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    ownerId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    sourceId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    statusId: z.ZodString;
    probability: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    expectedCloseDate: z.ZodOptional<z.ZodString>;
    dealValue: z.ZodOptional<z.ZodString>;
    ownerUserId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    notes: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    firstName: z.ZodString;
    lastName: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    gender: z.ZodOptional<z.ZodEnum<{
        readonly MALE: "MALE";
        readonly FEMALE: "FEMALE";
        readonly UNKNOWN: "UNKNOWN";
    }>>;
    mobile: z.ZodString;
    phone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodPipe<z.ZodLiteral<"">, z.ZodTransform<undefined, "">>]>;
    city: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    address: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    petSpecies: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    petCount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    petNotes: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
}, z.core.$strip>;
export type CreateDealFormInput = z.infer<typeof createDealSchema>;
/** ما يحمله النموذج قبل تشغيل Zod — نمط الثلاثة معاملات في `useForm` (كما في العملاء المحتملين). */
export type CreateDealFormValues = z.input<typeof createDealSchema>;
/** التحرير لا يمسّ الحالة ولا الروابط: للحالة مسارها الوحيد، وللروابط التحويل والفوز. */
export declare const updateDealSchema: z.ZodObject<{
    address: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodPipe<z.ZodLiteral<"">, z.ZodTransform<undefined, "">>]>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    gender: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        readonly MALE: "MALE";
        readonly FEMALE: "FEMALE";
        readonly UNKNOWN: "UNKNOWN";
    }>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    sourceId: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    petNotes: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    probability: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    expectedCloseDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dealValue: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    ownerUserId: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    mobile: z.ZodOptional<z.ZodString>;
    petSpecies: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    petCount: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type UpdateDealFormInput = z.infer<typeof updateDealSchema>;
/** §4 — تغيير الحالة مسارٌ واحد: السحب في اللوحة والقائمة في الصفحة كلاهما هنا. */
export declare const changeDealStatusSchema: z.ZodObject<{
    statusId: z.ZodString;
    lostReasonId: z.ZodOptional<z.ZodString>;
    lostNotes: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
}, z.core.$strip>;
export type ChangeDealStatusFormInput = z.infer<typeof changeDealStatusSchema>;
/**
 * BR-C4.2 — تعديل النسبة صراحةً. مسارٌ مستقلّ عن `updateDeal` لأنّ له أثرًا ثانيًا:
 * رفع علم التجاوز. `reset: true` هو الفعل الصريح المقابل («إعادة الافتراضي»).
 */
export declare const dealProbabilitySchema: z.ZodObject<{
    probability: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    reset: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type DealProbabilityFormInput = z.infer<typeof dealProbabilitySchema>;
export declare const dealProductSchema: z.ZodObject<{
    itemType: z.ZodEnum<{
        readonly SERVICE: "SERVICE";
        readonly MEMBERSHIP_PLAN: "MEMBERSHIP_PLAN";
        readonly FREE_TEXT: "FREE_TEXT";
    }>;
    itemId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    label: z.ZodString;
    qty: z.ZodString;
    unitPrice: z.ZodString;
}, z.core.$strip>;
export type DealProductFormInput = z.infer<typeof dealProductSchema>;
/** §6 — المحرّر يحفظ القائمة كاملة: صفٌّ غاب عن الحمولة صفٌّ حُذف. */
export declare const dealProductsSchema: z.ZodObject<{
    products: z.ZodArray<z.ZodObject<{
        itemType: z.ZodEnum<{
            readonly SERVICE: "SERVICE";
            readonly MEMBERSHIP_PLAN: "MEMBERSHIP_PLAN";
            readonly FREE_TEXT: "FREE_TEXT";
        }>;
        itemId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
        label: z.ZodString;
        qty: z.ZodString;
        unitPrice: z.ZodString;
    }, z.core.$strip>>;
    manualDealValue: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DealProductsFormInput = z.infer<typeof dealProductsSchema>;
export declare const dealListSelect: {
    readonly id: true;
    readonly code: true;
    readonly fullName: true;
    readonly mobile: true;
    readonly email: true;
    readonly city: true;
    readonly statusId: true;
    readonly sourceId: true;
    readonly probability: true;
    readonly dealValue: true;
    readonly expectedValue: true;
    readonly expectedCloseDate: true;
    readonly closedDate: true;
    readonly ownerUserId: true;
    readonly leadId: true;
    readonly ownerId: true;
    readonly wonOwnerId: true;
    readonly createdAt: true;
    readonly slaPolicyId: true;
    readonly responseBy: true;
    readonly firstRespondedAt: true;
    readonly slaStatus: true;
    readonly status: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly color: true;
            readonly kind: true;
            readonly order: true;
        };
    };
    readonly source: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly ownerUser: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmDealListResponse = Prisma.CrmDealGetPayload<{
    select: typeof dealListSelect;
}>;
export declare const dealProductSelect: {
    readonly id: true;
    readonly dealId: true;
    readonly itemType: true;
    readonly itemId: true;
    readonly label: true;
    readonly qty: true;
    readonly unitPrice: true;
    readonly lineTotal: true;
};
export type CrmDealProductResponse = Prisma.CrmDealProductGetPayload<{
    select: typeof dealProductSelect;
}>;
export declare const dealDetailSelect: {
    readonly firstName: true;
    readonly lastName: true;
    readonly gender: true;
    readonly phone: true;
    readonly address: true;
    readonly petSpecies: true;
    readonly petCount: true;
    readonly petNotes: true;
    readonly probabilityOverridden: true;
    readonly lostReasonId: true;
    readonly lostNotes: true;
    readonly notes: true;
    readonly updatedAt: true;
    readonly lostReason: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly lead: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly fullName: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
        };
    };
    readonly wonOwner: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
        };
    };
    readonly products: {
        readonly select: {
            readonly id: true;
            readonly dealId: true;
            readonly itemType: true;
            readonly itemId: true;
            readonly label: true;
            readonly qty: true;
            readonly unitPrice: true;
            readonly lineTotal: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly id: true;
    readonly code: true;
    readonly fullName: true;
    readonly mobile: true;
    readonly email: true;
    readonly city: true;
    readonly statusId: true;
    readonly sourceId: true;
    readonly probability: true;
    readonly dealValue: true;
    readonly expectedValue: true;
    readonly expectedCloseDate: true;
    readonly closedDate: true;
    readonly ownerUserId: true;
    readonly leadId: true;
    readonly ownerId: true;
    readonly wonOwnerId: true;
    readonly createdAt: true;
    readonly slaPolicyId: true;
    readonly responseBy: true;
    readonly firstRespondedAt: true;
    readonly slaStatus: true;
    readonly status: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly color: true;
            readonly kind: true;
            readonly order: true;
        };
    };
    readonly source: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly ownerUser: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmDealDetailResponse = Prisma.CrmDealGetPayload<{
    select: typeof dealDetailSelect;
}>;
