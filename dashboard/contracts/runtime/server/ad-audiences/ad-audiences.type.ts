import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";

const audienceSelect = {
	id: true,
	name: true,
	ageMin: true,
	ageMax: true,
	locations: true,
	languages: true,
	interests: true,
	estimatedReach: true,
	isAiSuggested: true,
	aiRationale: true,
	createdAt: true,
} as const;

export const adAudienceSelect = audienceSelect;

export type AdAudienceResponse = Prisma.AdAudienceGetPayload<{
	select: typeof audienceSelect;
}>;

/**
 * نموذج «إضافة جمهور جديد» (الفجوة G3 — غير مرسومة، مقترحة في الكود).
 * الحقول هي الأربعة التي تعرضها بطاقة الجمهور في التصميم، لا أكثر: أي حقل زائد
 * هنا يصير حقلًا لا تعرضه البطاقة فلا يرى المستخدم أثره.
 */
// بلا `z.coerce` وبلا `.default()`: كلاهما يجعل نوع الدخل مختلفًا عن نوع الخرج،
// فينكسر `zodResolver` مع `z.infer` الواحد الذي يفرضه اصطلاح المستودع. الأرقام
// تصل أرقامًا عبر `valueAsNumber` في `register`، والقيم الابتدائية للقوائم تأتي
// من `defaultValues` — وهو مكانها الطبيعي أصلًا.
export const createAdAudienceSchema = z
	.object({
		name: z.string({ error: "اسم الجمهور مطلوب" }).min(1, "اسم الجمهور مطلوب").max(80),
		ageMin: z
			.number({ error: "الحد الأدنى للعمر يجب أن يكون رقمًا" })
			.int()
			.min(13, "أقل عمر مسموح به على منصّات الإعلان هو 13")
			.max(65),
		ageMax: z.number({ error: "الحد الأعلى للعمر يجب أن يكون رقمًا" }).int().min(13).max(65),
		locations: z.array(z.string().min(1)).min(1, "أضف موقعًا واحدًا على الأقل"),
		languages: z.array(z.string().min(1)),
		interests: z.array(z.string().min(1)),
	})
	.refine((v) => v.ageMax >= v.ageMin, {
		error: "الحد الأعلى للعمر يجب أن يساوي الحد الأدنى أو يزيد عنه",
		path: ["ageMax"],
	});

export type CreateAdAudienceFormInput = z.infer<typeof createAdAudienceSchema>;
