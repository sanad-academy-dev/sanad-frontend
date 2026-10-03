import type { Prisma } from "@/generated/prisma/client";
declare const consultationTypeSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly name: true;
    readonly isDefault: true;
    readonly active: true;
    readonly order: true;
    readonly createdAt: true;
};
export declare const consultationTypeSelectShape: {
    readonly id: true;
    readonly clinicId: true;
    readonly name: true;
    readonly isDefault: true;
    readonly active: true;
    readonly order: true;
    readonly createdAt: true;
};
type ConsultationTypeBase = Prisma.ConsultationTypeGetPayload<{
    select: typeof consultationTypeSelect;
}>;
export type ConsultationTypeResponse = ConsultationTypeBase & {
    price: number | null;
    /** قالب الفحص الافتراضي لهذا الكشف — null = يسقط الترشيح إلى القالب العامّ */
    examTemplateId: string | null;
};
export {};
