import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";

/** [CRM-P4] §9.2 — أنواع قناة واتساب. */

export const whatsappCredentialsSchema = z.object({
	instanceId: z
		.string({ error: "معرّف النسخة مطلوب" })
		.trim()
		.min(1, "معرّف النسخة مطلوب")
		.max(64),
	apiToken: z.string({ error: "رمز الوصول مطلوب" }).trim().min(1, "رمز الوصول مطلوب").max(256),
});
export type WhatsappCredentialsFormInput = z.infer<typeof whatsappCredentialsSchema>;

export const sendWhatsappSchema = z.object({
	body: z.string({ error: "نصّ الرسالة مطلوب" }).trim().min(1, "نصّ الرسالة مطلوب").max(4000),
});
export type SendWhatsappFormInput = z.infer<typeof sendWhatsappSchema>;

export const whatsappMessageSelect = {
	id: true,
	direction: true,
	chatId: true,
	body: true,
	status: true,
	failureReason: true,
	providerMessageId: true,
	referenceType: true,
	referenceId: true,
	at: true,
	sentBy: { select: { id: true, name: true } },
} as const;
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
