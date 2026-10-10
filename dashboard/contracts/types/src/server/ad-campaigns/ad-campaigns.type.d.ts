import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { AdCampaignStatus, AdObjective, AdPlatform } from "@/generated/prisma/enums";
/**
 * وحدة التسويق — أنواع الحملات الاعلانية. الخطة: docs/planning/marketing-module-plan.md
 *
 * القرار D2: المنصّات المدعومة في الإصدار الأول فيسبوك وإنستغرام فقط. الخمس الباقية
 * موجودة في المخطط (تظهر في القائمة معطَّلة بسبب معلن)، ولا يقبلها الخادم — تعطيلٌ في
 * الواجهة بلا رفضٍ في الخادم ليس تعطيلًا، إنما اقتراح.
 */
export declare const SUPPORTED_AD_PLATFORMS: readonly ["FACEBOOK", "INSTAGRAM"];
export type SupportedAdPlatform = (typeof SUPPORTED_AD_PLATFORMS)[number];
export declare const isSupportedAdPlatform: (value: AdPlatform) => value is SupportedAdPlatform;
/**
 * الخطوة الأولى من المعالج. `socialAccountId` و `objective` مُعلَّمان «مطلوب» في
 * التصميم، لكن الحملة تُحفظ مسودةً قبل اكتمالهما — فالمطلوب هنا هو ما يلزم لوجود
 * سجل، لا ما يلزم للإطلاق. شرط الإطلاق يعيش في `launchAdCampaignSchema`.
 */
export declare const createAdCampaignSchema: z.ZodObject<{
    name: z.ZodString;
    platform: z.ZodEnum<{
        FACEBOOK: "FACEBOOK";
        INSTAGRAM: "INSTAGRAM";
    }>;
    objective: z.ZodEnum<{
        readonly BRAND_AWARENESS: "BRAND_AWARENESS";
        readonly LEAD_GENERATION: "LEAD_GENERATION";
        readonly STORE_VISITS: "STORE_VISITS";
        readonly CUSTOMER_FEEDBACK: "CUSTOMER_FEEDBACK";
        readonly SALES: "SALES";
        readonly PRODUCT_AWARENESS: "PRODUCT_AWARENESS";
    }>;
    socialAccountId: z.ZodOptional<z.ZodString>;
    branchId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateAdCampaignFormInput = z.infer<typeof createAdCampaignSchema>;
export declare const updateAdCampaignSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    platform: z.ZodOptional<z.ZodEnum<{
        FACEBOOK: "FACEBOOK";
        INSTAGRAM: "INSTAGRAM";
    }>>;
    objective: z.ZodOptional<z.ZodEnum<{
        readonly BRAND_AWARENESS: "BRAND_AWARENESS";
        readonly LEAD_GENERATION: "LEAD_GENERATION";
        readonly STORE_VISITS: "STORE_VISITS";
        readonly CUSTOMER_FEEDBACK: "CUSTOMER_FEEDBACK";
        readonly SALES: "SALES";
        readonly PRODUCT_AWARENESS: "PRODUCT_AWARENESS";
    }>>;
    socialAccountId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    branchId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    audienceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type UpdateAdCampaignFormInput = z.infer<typeof updateAdCampaignSchema>;
/** نصّ الإعلان وصورته — تُحفظ مع كل «تطبيق» في المعالج */
export declare const adCreativeSchema: z.ZodObject<{
    primaryText: z.ZodString;
    headline: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    linkUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    source: z.ZodEnum<{
        readonly AI_GENERATED: "AI_GENERATED";
        readonly LIBRARY: "LIBRARY";
        readonly UPLOAD: "UPLOAD";
        readonly TEMPLATE: "TEMPLATE";
    }>;
    aiPrompt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    aiStyle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    toneFormal: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    toneFriendly: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    toneOptimist: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type AdCreativeFormInput = z.infer<typeof adCreativeSchema>;
/** تصفية قائمة الحملات — تطابق شريط الأدوات في التصميم */
export declare const adCampaignFiltersSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    platform: z.ZodOptional<z.ZodEnum<{
        readonly FACEBOOK: "FACEBOOK";
        readonly INSTAGRAM: "INSTAGRAM";
        readonly LINKEDIN: "LINKEDIN";
        readonly TIKTOK: "TIKTOK";
        readonly X: "X";
        readonly PINTEREST: "PINTEREST";
        readonly SNAPCHAT: "SNAPCHAT";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        readonly DRAFT: "DRAFT";
        readonly PENDING: "PENDING";
        readonly SCHEDULED: "SCHEDULED";
        readonly ACTIVE: "ACTIVE";
        readonly PAUSED: "PAUSED";
        readonly COMPLETED: "COMPLETED";
        readonly FAILED: "FAILED";
    }>>;
    branchId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdCampaignFilters = z.infer<typeof adCampaignFiltersSchema>;
declare const campaignListSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly platform: true;
    readonly objective: true;
    readonly status: true;
    readonly durationDays: true;
    readonly startsAt: true;
    readonly endsAt: true;
    readonly budgetAmount: true;
    readonly launchedAt: true;
    readonly createdAt: true;
    readonly branchId: true;
    readonly socialAccount: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly platform: true;
        };
    };
    readonly audience: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly estimatedReach: true;
        };
    };
};
export type AdCampaignListRow = Prisma.AdCampaignGetPayload<{
    select: typeof campaignListSelect;
}>;
export declare const adCampaignListSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly platform: true;
    readonly objective: true;
    readonly status: true;
    readonly durationDays: true;
    readonly startsAt: true;
    readonly endsAt: true;
    readonly budgetAmount: true;
    readonly launchedAt: true;
    readonly createdAt: true;
    readonly branchId: true;
    readonly socialAccount: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly platform: true;
        };
    };
    readonly audience: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly estimatedReach: true;
        };
    };
};
/**
 * صفّ الجدول = سجل الحملة + مجاميع أدائها. المجاميع لا تعيش على الحملة عمدًا:
 * الأداء صفوف يومية في `ad_campaign_metric`، وتخزين مجموعٍ مكرَّر بجانبها يخلق
 * مصدرَي حقيقة يتباعدان أوّل مرّة يفشل فيها استيراد.
 */
export type AdCampaignListItem = AdCampaignListRow & {
    impressions: number;
    reach: number;
    engagements: number;
    spend: number;
};
/** بطاقات الإحصائيات الأربع أعلى الصفحة */
export type AdCampaignSummary = {
    total: number;
    active: number;
    inactive: number;
    totalSpend: number;
};
declare const campaignDetailSelect: {
    readonly objective: true;
    readonly budgetKind: true;
    readonly currency: true;
    readonly feeAmount: true;
    readonly totalAmount: true;
    readonly externalId: true;
    readonly externalError: true;
    readonly createdByUserId: true;
    readonly updatedAt: true;
    readonly creatives: {
        readonly select: {
            readonly id: true;
            readonly primaryText: true;
            readonly headline: true;
            readonly description: true;
            readonly linkUrl: true;
            readonly imageUrl: true;
            readonly source: true;
            readonly aiPrompt: true;
            readonly aiStyle: true;
            readonly toneFormal: true;
            readonly toneFriendly: true;
            readonly toneOptimist: true;
        };
    };
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly platform: true;
    readonly status: true;
    readonly durationDays: true;
    readonly startsAt: true;
    readonly endsAt: true;
    readonly budgetAmount: true;
    readonly launchedAt: true;
    readonly createdAt: true;
    readonly branchId: true;
    readonly socialAccount: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly platform: true;
        };
    };
    readonly audience: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly estimatedReach: true;
        };
    };
};
export declare const adCampaignDetailSelect: {
    readonly objective: true;
    readonly budgetKind: true;
    readonly currency: true;
    readonly feeAmount: true;
    readonly totalAmount: true;
    readonly externalId: true;
    readonly externalError: true;
    readonly createdByUserId: true;
    readonly updatedAt: true;
    readonly creatives: {
        readonly select: {
            readonly id: true;
            readonly primaryText: true;
            readonly headline: true;
            readonly description: true;
            readonly linkUrl: true;
            readonly imageUrl: true;
            readonly source: true;
            readonly aiPrompt: true;
            readonly aiStyle: true;
            readonly toneFormal: true;
            readonly toneFriendly: true;
            readonly toneOptimist: true;
        };
    };
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly platform: true;
    readonly status: true;
    readonly durationDays: true;
    readonly startsAt: true;
    readonly endsAt: true;
    readonly budgetAmount: true;
    readonly launchedAt: true;
    readonly createdAt: true;
    readonly branchId: true;
    readonly socialAccount: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly platform: true;
        };
    };
    readonly audience: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly estimatedReach: true;
        };
    };
};
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
export declare const AD_OBJECTIVE_LABELS: Record<AdObjective, string>;
/**
 * التصميم يعرض حالتين فقط في عمود «الحالة» (نشيط / غير نشيط)، لكن دورة حياة الحملة
 * أطول من ذلك. نبقي الاصطلاح كاملًا ونسمّي كل حالة — إخفاء `FAILED` خلف «غير نشيط»
 * يُخفي عن المستخدم أن إطلاقه لم ينجح.
 */
export declare const AD_CAMPAIGN_STATUS_LABELS: Record<AdCampaignStatus, string>;
export declare const AD_PLATFORM_LABELS: Record<AdPlatform, string>;
/** الحالات التي تُحسب «نشطة» في بطاقة الإحصائيات */
export declare const ACTIVE_AD_STATUSES: AdCampaignStatus[];
export {};
