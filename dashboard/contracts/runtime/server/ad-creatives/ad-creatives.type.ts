import type { Prisma } from "@/generated/prisma/client";
import type { AdTemplateCategory } from "@/generated/prisma/enums";

const templateSelect = {
	id: true,
	category: true,
	title: true,
	body: true,
	clinicId: true,
} as const;

export const adCopyTemplateSelect = templateSelect;

export type AdCopyTemplateResponse = Prisma.AdCopyTemplateGetPayload<{
	select: typeof templateSelect;
}>;

/** تبويبات لوحة القوالب (شاشة 540226) — الترتيب هو ترتيب التصميم */
export const AD_TEMPLATE_CATEGORIES: { value: AdTemplateCategory; label: string }[] = [
	{ value: "SEO", label: "تحسين محركات البحث" },
	{ value: "PAID_ADS", label: "إعلانات مدفوعة" },
	{ value: "SALES", label: "المبيعات" },
	{ value: "SOCIAL", label: "وسائل التواصل" },
	{ value: "EMAIL", label: "تسويق بريدي" },
];

/** رقاقات النمط في تبويب التوليد بالذكاء الاصطناعي (شاشة 543700) */
export const AD_IMAGE_STYLES: { value: string; label: string; promptFragment: string }[] = [
	{ value: "none", label: "بدون", promptFragment: "" },
	{
		value: "burn",
		label: "احتراق",
		promptFragment: "high-contrast burned highlights, dramatic",
	},
	{
		value: "photo",
		label: "فوتوغراف",
		promptFragment: "professional photography, natural light",
	},
	{ value: "digital", label: "فن رقمي", promptFragment: "digital art, vivid colors" },
	{ value: "lineart", label: "رسم خطي", promptFragment: "clean line art, minimal" },
	{ value: "analog", label: "فيلم تناظري", promptFragment: "35mm analog film, grain" },
	{
		value: "cinematic",
		label: "سينمائي",
		promptFragment: "cinematic lighting, shallow depth of field",
	},
	{ value: "texture", label: "نسيج", promptFragment: "rich tactile texture, macro detail" },
	{ value: "pixel", label: "فن البكسل", promptFragment: "pixel art, 16-bit" },
	{ value: "aesthetic", label: "جمالي", promptFragment: "soft aesthetic palette, pastel" },
];

export const AD_IMAGE_STYLE_BY_VALUE = new Map(AD_IMAGE_STYLES.map((s) => [s.value, s]));
