import type { Prisma } from "@/generated/prisma/client";
import type { AdTemplateCategory } from "@/generated/prisma/enums";
declare const templateSelect: {
    readonly id: true;
    readonly category: true;
    readonly title: true;
    readonly body: true;
    readonly clinicId: true;
};
export declare const adCopyTemplateSelect: {
    readonly id: true;
    readonly category: true;
    readonly title: true;
    readonly body: true;
    readonly clinicId: true;
};
export type AdCopyTemplateResponse = Prisma.AdCopyTemplateGetPayload<{
    select: typeof templateSelect;
}>;
/** تبويبات لوحة القوالب (شاشة 540226) — الترتيب هو ترتيب التصميم */
export declare const AD_TEMPLATE_CATEGORIES: {
    value: AdTemplateCategory;
    label: string;
}[];
/** رقاقات النمط في تبويب التوليد بالذكاء الاصطناعي (شاشة 543700) */
export declare const AD_IMAGE_STYLES: {
    value: string;
    label: string;
    promptFragment: string;
}[];
export declare const AD_IMAGE_STYLE_BY_VALUE: Map<string, {
    value: string;
    label: string;
    promptFragment: string;
}>;
export {};
