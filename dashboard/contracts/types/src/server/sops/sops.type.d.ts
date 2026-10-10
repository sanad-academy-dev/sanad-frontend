import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { SopDomain } from "@/generated/prisma/enums";
/** شرط فئة الدورات لكل وحدة — يعيد استخدام مُحدِّدات الوحدات القائمة بلا تكرار */
export declare const sopDomainCategoryWhere: (domain: SopDomain) => Prisma.ServiceWhereInput;
/** تسميات الوحدات — تُستعمل في عناوين الشاشات ورسائل الخطأ */
export declare const SOP_DOMAIN_LABELS: Record<SopDomain, string>;
declare const sopTemplateSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly domain: true;
    readonly serviceId: true;
    readonly titleAr: true;
    readonly titleEn: true;
    readonly reference: true;
    readonly version: true;
    readonly active: true;
    readonly updatedAt: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly level: true;
            readonly parentId: true;
        };
    };
    readonly sections: {
        readonly select: {
            readonly id: true;
            readonly order: true;
            readonly titleAr: true;
            readonly titleEn: true;
            readonly steps: {
                readonly select: {
                    readonly id: true;
                    readonly order: true;
                    readonly textAr: true;
                    readonly textEn: true;
                    readonly ownerRole: true;
                    readonly duration: true;
                    readonly critical: true;
                    readonly required: true;
                    readonly note: true;
                    readonly responseType: true;
                };
                readonly orderBy: {
                    readonly order: "asc";
                };
            };
        };
        readonly orderBy: {
            readonly order: "asc";
        };
    };
};
export type SopTemplateResponse = Prisma.SopTemplateGetPayload<{
    select: typeof sopTemplateSelect;
}>;
export declare const sopTemplateSelectShape: {
    readonly id: true;
    readonly clinicId: true;
    readonly domain: true;
    readonly serviceId: true;
    readonly titleAr: true;
    readonly titleEn: true;
    readonly reference: true;
    readonly version: true;
    readonly active: true;
    readonly updatedAt: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly level: true;
            readonly parentId: true;
        };
    };
    readonly sections: {
        readonly select: {
            readonly id: true;
            readonly order: true;
            readonly titleAr: true;
            readonly titleEn: true;
            readonly steps: {
                readonly select: {
                    readonly id: true;
                    readonly order: true;
                    readonly textAr: true;
                    readonly textEn: true;
                    readonly ownerRole: true;
                    readonly duration: true;
                    readonly critical: true;
                    readonly required: true;
                    readonly note: true;
                    readonly responseType: true;
                };
                readonly orderBy: {
                    readonly order: "asc";
                };
            };
        };
        readonly orderBy: {
            readonly order: "asc";
        };
    };
};
export type SopSectionResponse = SopTemplateResponse["sections"][number];
export type SopStepResponse = SopSectionResponse["steps"][number];
/**
 * القالب الفعّال لدورة، مع بيان مصدره: القالب الموروث يُعرض للقراءة ويُنسخ
 * عند أول تعديل، فلا يظن المستخدم أنه يحرّر قالب العنصر وهو يحرّر قالب الفئة.
 */
export type ResolvedSopResponse = {
    template: SopTemplateResponse | null;
    /** مصدر القالب: الدورة نفسها أم أب في الشجرة أم لا قالب */
    origin: "SERVICE" | "INHERITED" | "NONE";
    /** اسم العقدة التي جاء منها القالب — يُعرض في شارة «موروث من …» */
    inheritedFromName: string | null;
    /** قالب أكاديمية يعلو قالب النظام — تُعرض شارة «مخصّص» */
    isClinicOverride: boolean;
};
/** صف في مكتبة البروتوكولات — دورة + قالبها الفعّال مختصرًا */
export type SopLibraryRowResponse = {
    serviceId: string;
    serviceName: string;
    categoryName: string;
    domain: SopDomain;
    templateId: string | null;
    title: string | null;
    version: number | null;
    stepCount: number;
    criticalCount: number;
    origin: ResolvedSopResponse["origin"];
    inheritedFromName: string | null;
    isClinicOverride: boolean;
};
declare const sopRunSelect: {
    readonly id: true;
    readonly templateId: true;
    readonly templateVersion: true;
    readonly domain: true;
    readonly labItemId: true;
    readonly radiologyItemId: true;
    readonly operationCaseId: true;
    readonly completedAt: true;
    readonly createdAt: true;
    readonly steps: {
        readonly select: {
            readonly id: true;
            readonly order: true;
            readonly sectionTitle: true;
            readonly textSnapshot: true;
            readonly ownerRole: true;
            readonly duration: true;
            readonly critical: true;
            readonly required: true;
            readonly responseType: true;
            readonly response: true;
            readonly valueText: true;
            readonly valueNumber: true;
            readonly respondedAt: true;
            readonly respondedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
        readonly orderBy: {
            readonly order: "asc";
        };
    };
};
export type SopRunResponse = Prisma.SopRunGetPayload<{
    select: typeof sopRunSelect;
}>;
export declare const sopRunSelectShape: {
    readonly id: true;
    readonly templateId: true;
    readonly templateVersion: true;
    readonly domain: true;
    readonly labItemId: true;
    readonly radiologyItemId: true;
    readonly operationCaseId: true;
    readonly completedAt: true;
    readonly createdAt: true;
    readonly steps: {
        readonly select: {
            readonly id: true;
            readonly order: true;
            readonly sectionTitle: true;
            readonly textSnapshot: true;
            readonly ownerRole: true;
            readonly duration: true;
            readonly critical: true;
            readonly required: true;
            readonly responseType: true;
            readonly response: true;
            readonly valueText: true;
            readonly valueNumber: true;
            readonly respondedAt: true;
            readonly respondedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
        readonly orderBy: {
            readonly order: "asc";
        };
    };
};
export type SopRunStepResponse = SopRunResponse["steps"][number];
/** هدف التشغيل — عمود واحد فقط يُملأ، ويضمن @unique تشغيلًا واحدًا لكل هدف */
export type SopRunTarget = {
    labItemId: string;
} | {
    radiologyItemId: string;
} | {
    operationCaseId: string;
};
export declare const sopStepSchema: z.ZodObject<{
    textAr: z.ZodString;
    textEn: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ownerRole: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    duration: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    critical: z.ZodDefault<z.ZodBoolean>;
    required: z.ZodDefault<z.ZodBoolean>;
    note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    responseType: z.ZodDefault<z.ZodEnum<{
        readonly CONFIRM: "CONFIRM";
        readonly YES_NO_NA: "YES_NO_NA";
        readonly TEXT: "TEXT";
        readonly NUMBER: "NUMBER";
    }>>;
}, z.core.$strip>;
export declare const sopSectionSchema: z.ZodObject<{
    titleAr: z.ZodString;
    titleEn: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    steps: z.ZodArray<z.ZodObject<{
        textAr: z.ZodString;
        textEn: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        ownerRole: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        duration: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        critical: z.ZodDefault<z.ZodBoolean>;
        required: z.ZodDefault<z.ZodBoolean>;
        note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        responseType: z.ZodDefault<z.ZodEnum<{
            readonly CONFIRM: "CONFIRM";
            readonly YES_NO_NA: "YES_NO_NA";
            readonly TEXT: "TEXT";
            readonly NUMBER: "NUMBER";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const sopTemplateSchema: z.ZodObject<{
    domain: z.ZodEnum<{
        readonly LAB: "LAB";
        readonly RADIOLOGY: "RADIOLOGY";
        readonly OPERATION: "OPERATION";
    }>;
    serviceId: z.ZodString;
    titleAr: z.ZodString;
    titleEn: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reference: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sections: z.ZodArray<z.ZodObject<{
        titleAr: z.ZodString;
        titleEn: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        steps: z.ZodArray<z.ZodObject<{
            textAr: z.ZodString;
            textEn: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            ownerRole: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            duration: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            critical: z.ZodDefault<z.ZodBoolean>;
            required: z.ZodDefault<z.ZodBoolean>;
            note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            responseType: z.ZodDefault<z.ZodEnum<{
                readonly CONFIRM: "CONFIRM";
                readonly YES_NO_NA: "YES_NO_NA";
                readonly TEXT: "TEXT";
                readonly NUMBER: "NUMBER";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SopStepFormInput = z.input<typeof sopStepSchema>;
export type SopSectionFormInput = z.input<typeof sopSectionSchema>;
export type SopTemplateFormInput = z.input<typeof sopTemplateSchema>;
export type SopTemplateFormValues = z.output<typeof sopTemplateSchema>;
/** مدخل حفظ القالب في الـ DAO — مشتق من مخطط النموذج، لا يُكتب يدويًا */
export type SaveSopTemplateInput = SopTemplateFormValues & {
    clinicId: string;
};
export {};
