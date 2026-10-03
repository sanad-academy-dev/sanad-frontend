import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
declare const audienceSelect: {
    readonly id: true;
    readonly name: true;
    readonly ageMin: true;
    readonly ageMax: true;
    readonly locations: true;
    readonly languages: true;
    readonly interests: true;
    readonly estimatedReach: true;
    readonly isAiSuggested: true;
    readonly aiRationale: true;
    readonly createdAt: true;
};
export declare const adAudienceSelect: {
    readonly id: true;
    readonly name: true;
    readonly ageMin: true;
    readonly ageMax: true;
    readonly locations: true;
    readonly languages: true;
    readonly interests: true;
    readonly estimatedReach: true;
    readonly isAiSuggested: true;
    readonly aiRationale: true;
    readonly createdAt: true;
};
export type AdAudienceResponse = Prisma.AdAudienceGetPayload<{
    select: typeof audienceSelect;
}>;
/**
 * نموذج «إضافة جمهور جديد» (الفجوة G3 — غير مرسومة، مقترحة في الكود).
 * الحقول هي الأربعة التي تعرضها بطاقة الجمهور في التصميم، لا أكثر: أي حقل زائد
 * هنا يصير حقلًا لا تعرضه البطاقة فلا يرى المستخدم أثره.
 */
export declare const createAdAudienceSchema: z.ZodObject<{
    name: z.ZodString;
    ageMin: z.ZodNumber;
    ageMax: z.ZodNumber;
    locations: z.ZodArray<z.ZodString>;
    languages: z.ZodArray<z.ZodString>;
    interests: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type CreateAdAudienceFormInput = z.infer<typeof createAdAudienceSchema>;
export {};
