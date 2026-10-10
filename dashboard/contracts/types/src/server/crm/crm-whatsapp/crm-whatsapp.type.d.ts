import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/** [CRM-P4] §9.2 — أنواع قناة واتساب. */
export declare const whatsappCredentialsSchema: z.ZodObject<{
    instanceId: z.ZodString;
    apiToken: z.ZodString;
}, z.core.$strip>;
export type WhatsappCredentialsFormInput = z.infer<typeof whatsappCredentialsSchema>;
export declare const sendWhatsappSchema: z.ZodObject<{
    body: z.ZodString;
}, z.core.$strip>;
export type SendWhatsappFormInput = z.infer<typeof sendWhatsappSchema>;
export declare const whatsappMessageSelect: {
    readonly id: true;
    readonly direction: true;
    readonly chatId: true;
    readonly body: true;
    readonly status: true;
    readonly failureReason: true;
    readonly providerMessageId: true;
    readonly referenceType: true;
    readonly referenceId: true;
    readonly at: true;
    readonly sentBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmWhatsappMessageResponse = Prisma.CrmWhatsappMessageGetPayload<{
    select: typeof whatsappMessageSelect;
}>;
/**
 * ما تعرضه شاشة الإعدادات. **لا يحوي بيانات الاعتماد ولا صورتها المشفَّرة** — العميل
 * يحتاج أن يعرف «هل هي مضبوطة» لا «ما هي» (§17.2 صفّ ١٩).
 */
export type WhatsappSettingsResponse = {
    provider: "MANUAL" | "GREEN_API";
    configured: boolean;
    encryptionReady: boolean;
    connectionState: string | null;
    checkedAt: Date | null;
};
