import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/**
 * [CRM-P0] المصادر المشتركة لبيانات إدارة العملاء المرجعية (BRD §2).
 *
 * §18.2 يلزم بإعلان أي قائمة تُستهلك في أكثر من موضع مرّةً واحدة مع اختبار تكافؤ — وهذا
 * الملف هو ذلك الموضع الواحد: قائمة الأنواع الخمسة وقائمة رموز الألوان تُشتقّ منهما كل
 * مخططات التحقق والمسارات والبذور.
 */
/** الأنواع الخمسة كما يعرّفها §2.1/§2.2 — مسار الـ API لكل نوع هو المفتاح نفسه. */
export declare const CRM_MASTER_KINDS: readonly ["lead-statuses", "deal-statuses", "lead-sources", "lost-reasons", "industries"];
export type CrmMasterKind = (typeof CRM_MASTER_KINDS)[number];
/**
 * §2.1 يقول «color». لا يوجد في المستودع كلّه لونُ واجهةٍ مخزَّن في قاعدة البيانات:
 * `mobile_unit.color` لون طلاء مركبة يُعرض نصًّا، وكل لون واجهة يأتي من رمز تصميم في
 * الشيفرة. وقاعدة CLAUDE.md الأولى تمنع الألوان الصريحة منعًا باتًّا — رموز التصميم فقط.
 * لذلك يخزّن العمود **مفتاح رمز** من هذه القائمة المغلقة، لا قيمة hex (قرار وليّ الأمر، §17.2
 * صف ٢). الرموز الثمانية معرَّفة في `src/styles.css` وتغطي لوحة كانبان بلا تكرار.
 */
export declare const CRM_STATUS_COLOR_TOKENS: readonly ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-7", "chart-8"];
export type CrmStatusColorToken = (typeof CRM_STATUS_COLOR_TOKENS)[number];
/** §2.2 — الأنواع المسطّحة الثلاثة: اسم فقط. */
export declare const crmFlatMasterSchema: z.ZodObject<{
    name: z.ZodString;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CrmFlatMasterFormInput = z.infer<typeof crmFlatMasterSchema>;
/** §2.1 — حالة عميل محتمل. */
export declare const crmLeadStatusSchema: z.ZodObject<{
    name: z.ZodString;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    color: z.ZodEnum<{
        "chart-1": "chart-1";
        "chart-2": "chart-2";
        "chart-3": "chart-3";
        "chart-4": "chart-4";
        "chart-5": "chart-5";
        "chart-6": "chart-6";
        "chart-7": "chart-7";
        "chart-8": "chart-8";
    }>;
    order: z.ZodCoercedNumber<unknown>;
    kind: z.ZodEnum<{
        readonly OPEN: "OPEN";
        readonly CONVERTED: "CONVERTED";
        readonly LOST: "LOST";
    }>;
}, z.core.$strip>;
export type CrmLeadStatusFormInput = z.infer<typeof crmLeadStatusSchema>;
/** §2.1 — حالة صفقة، ومعها الاحتمال الافتراضي للمرحلة. */
export declare const crmDealStatusSchema: z.ZodObject<{
    name: z.ZodString;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    color: z.ZodEnum<{
        "chart-1": "chart-1";
        "chart-2": "chart-2";
        "chart-3": "chart-3";
        "chart-4": "chart-4";
        "chart-5": "chart-5";
        "chart-6": "chart-6";
        "chart-7": "chart-7";
        "chart-8": "chart-8";
    }>;
    order: z.ZodCoercedNumber<unknown>;
    kind: z.ZodEnum<{
        readonly OPEN: "OPEN";
        readonly WON: "WON";
        readonly LOST: "LOST";
    }>;
    defaultProbability: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type CrmDealStatusFormInput = z.infer<typeof crmDealStatusSchema>;
declare const leadStatusSelect: {
    readonly id: true;
    readonly name: true;
    readonly color: true;
    readonly order: true;
    readonly kind: true;
    readonly active: true;
};
export type CrmLeadStatusResponse = Prisma.CrmLeadStatusGetPayload<{
    select: typeof leadStatusSelect;
}>;
declare const dealStatusSelect: {
    readonly id: true;
    readonly name: true;
    readonly color: true;
    readonly order: true;
    readonly kind: true;
    readonly defaultProbability: true;
    readonly active: true;
};
export type CrmDealStatusResponse = Prisma.CrmDealStatusGetPayload<{
    select: typeof dealStatusSelect;
}>;
declare const flatMasterSelect: {
    readonly id: true;
    readonly name: true;
    readonly active: true;
};
export type CrmLeadSourceResponse = Prisma.CrmLeadSourceGetPayload<{
    select: typeof flatMasterSelect;
}>;
export type CrmLostReasonResponse = Prisma.CrmLostReasonGetPayload<{
    select: typeof flatMasterSelect;
}>;
export type CrmIndustryResponse = Prisma.CrmIndustryGetPayload<{
    select: typeof flatMasterSelect;
}>;
export declare const CRM_SELECTS: {
    readonly leadStatus: {
        readonly id: true;
        readonly name: true;
        readonly color: true;
        readonly order: true;
        readonly kind: true;
        readonly active: true;
    };
    readonly dealStatus: {
        readonly id: true;
        readonly name: true;
        readonly color: true;
        readonly order: true;
        readonly kind: true;
        readonly defaultProbability: true;
        readonly active: true;
    };
    readonly flat: {
        readonly id: true;
        readonly name: true;
        readonly active: true;
    };
};
export {};
