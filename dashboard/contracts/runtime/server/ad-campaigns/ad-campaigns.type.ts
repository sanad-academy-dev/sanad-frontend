import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import {
	AdCampaignStatus,
	AdCreativeSource,
	AdObjective,
	AdPlatform,
} from "@/generated/prisma/enums";

/**
 * وحدة التسويق — أنواع الحملات الاعلانية. الخطة: docs/planning/marketing-module-plan.md
 *
 * القرار D2: المنصّات المدعومة في الإصدار الأول فيسبوك وإنستغرام فقط. الخمس الباقية
 * موجودة في المخطط (تظهر في القائمة معطَّلة بسبب معلن)، ولا يقبلها الخادم — تعطيلٌ في
 * الواجهة بلا رفضٍ في الخادم ليس تعطيلًا، إنما اقتراح.
 */
export const SUPPORTED_AD_PLATFORMS = [AdPlatform.FACEBOOK, AdPlatform.INSTAGRAM] as const;

export type SupportedAdPlatform = (typeof SUPPORTED_AD_PLATFORMS)[number];

export const isSupportedAdPlatform = (value: AdPlatform): value is SupportedAdPlatform =>
	(SUPPORTED_AD_PLATFORMS as readonly AdPlatform[]).includes(value);

// ── مخططات النماذج ───────────────────────────────────────────────────────────

/**
 * الخطوة الأولى من المعالج. `socialAccountId` و `objective` مُعلَّمان «مطلوب» في
 * التصميم، لكن الحملة تُحفظ مسودةً قبل اكتمالهما — فالمطلوب هنا هو ما يلزم لوجود
 * سجل، لا ما يلزم للإطلاق. شرط الإطلاق يعيش في `launchAdCampaignSchema`.
 */
export const createAdCampaignSchema = z.object({
	name: z.string({ error: "اسم الحملة مطلوب" }).min(1, "اسم الحملة مطلوب").max(120),
	platform: z.enum(SUPPORTED_AD_PLATFORMS, { error: "المنصّة غير مدعومة حاليًا" }),
	objective: z.enum(AdObjective, { error: "هدف الحملة مطلوب" }),
	socialAccountId: z.string().optional(),
	branchId: z.string().optional(),
});
export type CreateAdCampaignFormInput = z.infer<typeof createAdCampaignSchema>;

export const updateAdCampaignSchema = createAdCampaignSchema.partial().extend({
	audienceId: z.string().nullish(),
});
export type UpdateAdCampaignFormInput = z.infer<typeof updateAdCampaignSchema>;

/** نصّ الإعلان وصورته — تُحفظ مع كل «تطبيق» في المعالج */
export const adCreativeSchema = z.object({
	primaryText: z.string({ error: "نص الإعلان مطلوب" }).min(1, "نص الإعلان مطلوب"),
	headline: z.string().max(200).nullish(),
	description: z.string().max(500).nullish(),
	linkUrl: z.url("الرابط غير صالح").nullish(),
	imageUrl: z.string().nullish(),
	source: z.enum(AdCreativeSource),
	aiPrompt: z.string().nullish(),
	aiStyle: z.string().nullish(),
	// مؤشّرات «أسلوب المحتوى» الثلاثة — 0..100
	toneFormal: z.coerce.number().int().min(0).max(100).nullish(),
	toneFriendly: z.coerce.number().int().min(0).max(100).nullish(),
	toneOptimist: z.coerce.number().int().min(0).max(100).nullish(),
});
export type AdCreativeFormInput = z.infer<typeof adCreativeSchema>;

/** تصفية قائمة الحملات — تطابق شريط الأدوات في التصميم */
export const adCampaignFiltersSchema = z.object({
	search: z.string().optional(),
	platform: z.enum(AdPlatform).optional(),
	status: z.enum(AdCampaignStatus).optional(),
	branchId: z.string().optional(),
});
export type AdCampaignFilters = z.infer<typeof adCampaignFiltersSchema>;

// ── أنواع الاستجابة ──────────────────────────────────────────────────────────

const campaignListSelect = {
	id: true,
	code: true,
	name: true,
	platform: true,
	objective: true,
	status: true,
	durationDays: true,
	startsAt: true,
	endsAt: true,
	budgetAmount: true,
	launchedAt: true,
	createdAt: true,
	branchId: true,
	socialAccount: { select: { id: true, name: true, platform: true } },
	audience: { select: { id: true, name: true, estimatedReach: true } },
} as const;

export type AdCampaignListRow = Prisma.AdCampaignGetPayload<{
	select: typeof campaignListSelect;
}>;

export const adCampaignListSelect = campaignListSelect;

/**
 * صفّ الجدول = سجل الحملة + مجاميع أدائها. المجاميع لا تعيش على الحملة عمدًا:
 * الأداء صفوف يومية في `ad_campaign_metric`، وتخزين مجموعٍ مكرَّر بجانبها يخلق
 * مصدرَي حقيقة يتباعدان أوّل مرّة يفشل فيها استيراد.
 */
export type AdCampaignListItem = AdCampaignListRow & {
	impressions: number; // عدد الظهور
	reach: number; // الوصول
	engagements: number; // التفاعل
	spend: number;
};

/** بطاقات الإحصائيات الأربع أعلى الصفحة */
export type AdCampaignSummary = {
	total: number; // إجمالي الحملات الاعلانية
	active: number; // الحملات النشطة
	inactive: number; // الحملات غير النشطة
	totalSpend: number; // اجمالي المصروفات
};

const campaignDetailSelect = {
	...campaignListSelect,
	objective: true,
	budgetKind: true,
	currency: true,
	feeAmount: true,
	totalAmount: true,
	externalId: true,
	externalError: true,
	createdByUserId: true,
	updatedAt: true,
	creatives: {
		select: {
			id: true,
			primaryText: true,
			headline: true,
			description: true,
			linkUrl: true,
			imageUrl: true,
			source: true,
			aiPrompt: true,
			aiStyle: true,
			toneFormal: true,
			toneFriendly: true,
			toneOptimist: true,
		},
	},
} as const;

export const adCampaignDetailSelect = campaignDetailSelect;

type AdCampaignDetailRow = Prisma.AdCampaignGetPayload<{
	select: typeof campaignDetailSelect;
}>;

/**
 * التفاصيل + مجاميع الأداء. المجاميع مُشتقّة من `ad_campaign_metric` عند القراءة،
 * لا مخزّنة على الحملة — نفس سبب صفّ الجدول: مجموعٌ مكرَّر بجانب مصدره يتباعد عنه
 * أوّل مرّة يفشل فيها استيراد.
 */
export type AdCampaignDetail = AdCampaignDetailRow & {
	metricsTotals: {
		impressions: number;
		reach: number;
		engagements: number;
		clicks: number;
		spend: number;
	};
};

// ── تسميات عربية ─────────────────────────────────────────────────────────────

export const AD_OBJECTIVE_LABELS: Record<AdObjective, string> = {
	BRAND_AWARENESS: "زيادة الوعي بالعلامة التجارية",
	LEAD_GENERATION: "توليد العملاء المحتملين",
	STORE_VISITS: "زيارات المتجر",
	CUSTOMER_FEEDBACK: "جمع تعليقات العملاء",
	SALES: "زيادة المبيعات",
	PRODUCT_AWARENESS: "التوعية بالمنتج",
};

/**
 * التصميم يعرض حالتين فقط في عمود «الحالة» (نشيط / غير نشيط)، لكن دورة حياة الحملة
 * أطول من ذلك. نبقي الاصطلاح كاملًا ونسمّي كل حالة — إخفاء `FAILED` خلف «غير نشيط»
 * يُخفي عن المستخدم أن إطلاقه لم ينجح.
 */
export const AD_CAMPAIGN_STATUS_LABELS: Record<AdCampaignStatus, string> = {
	DRAFT: "مسودة",
	PENDING: "قيد المعالجة",
	SCHEDULED: "مجدولة",
	ACTIVE: "نشيط",
	PAUSED: "غير نشيط",
	COMPLETED: "منتهية",
	FAILED: "فشل الإطلاق",
};

export const AD_PLATFORM_LABELS: Record<AdPlatform, string> = {
	FACEBOOK: "Facebook",
	INSTAGRAM: "Instagram",
	LINKEDIN: "Linkedin",
	TIKTOK: "TikTok",
	X: "New-twitter",
	PINTEREST: "Pinterest",
	SNAPCHAT: "Snapchat",
};

/** الحالات التي تُحسب «نشطة» في بطاقة الإحصائيات */
export const ACTIVE_AD_STATUSES: AdCampaignStatus[] = [
	AdCampaignStatus.ACTIVE,
	AdCampaignStatus.SCHEDULED,
];
