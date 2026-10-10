import { z } from "zod";

/** مخطط لوحة «رسالة جديدة» — مصدر الحقيقة لنوع النموذج ولحساب نسبة الاكتمال */
export const newConversationSchema = z.object({
	recipientIds: z
		.array(z.string(), { error: "المستلم مطلوب" })
		.min(1, "اختر مستلمًا واحدًا على الأقل"),
	body: z.string({ error: "نص الرسالة مطلوب" }).trim().min(1, "نص الرسالة مطلوب"),
});

export type NewConversationFormInput = z.infer<typeof newConversationSchema>;
