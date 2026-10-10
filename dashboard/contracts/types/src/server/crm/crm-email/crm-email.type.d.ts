import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/** [CRM-P3] §9.1 — قوالب البريد. */
export declare const crmEmailTemplateSchema: z.ZodObject<{
    name: z.ZodString;
    subject: z.ZodString;
    body: z.ZodString;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type CrmEmailTemplateFormInput = z.infer<typeof crmEmailTemplateSchema>;
/** §9.1 — الإرسال: إمّا قالبٌ يُحَلّ، وإمّا نصٌّ يُكتب في اللحظة. */
export declare const sendCrmEmailSchema: z.ZodObject<{
    templateId: z.ZodOptional<z.ZodString>;
    subject: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SendCrmEmailFormInput = z.infer<typeof sendCrmEmailSchema>;
export declare const emailTemplateSelect: {
    readonly id: true;
    readonly name: true;
    readonly subject: true;
    readonly body: true;
    readonly active: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type CrmEmailTemplateResponse = Prisma.CrmEmailTemplateGetPayload<{
    select: typeof emailTemplateSelect;
}>;
