import type { Prisma } from "@/generated/prisma/client";
import type { AdBudgetKind, AdCampaignStatus } from "@/generated/prisma/enums";
import { type AdCampaignDetail, type AdCampaignFilters, type AdCampaignListItem, type AdCampaignSummary } from "@/server/ad-campaigns/ad-campaigns.type";
/**
 * نطاق القراءة: `null` يعني «كل حملات الأكاديمية» (مدير أو view_full)، وكائن الفرع يعني
 * حملات ذلك الفرع فقط (view_limited). نفس اصطلاح `clinic-documents.dao`.
 */
export type BranchScope = {
    branchId: string | null;
} | null;
export type CreateAdCampaignInput = Pick<Prisma.AdCampaignUncheckedCreateInput, "name" | "platform" | "objective"> & Partial<Pick<Prisma.AdCampaignUncheckedCreateInput, "branchId" | "socialAccountId" | "audienceId">>;
export type SaveCreativeInput = Pick<Prisma.AdCreativeUncheckedCreateInput, "primaryText" | "source"> & Partial<Pick<Prisma.AdCreativeUncheckedCreateInput, "headline" | "description" | "linkUrl" | "imageUrl" | "aiPrompt" | "aiStyle" | "toneFormal" | "toneFriendly" | "toneOptimist">>;
export type UpdateAdCampaignInput = Partial<Pick<Prisma.AdCampaignUncheckedUpdateInput, "name" | "platform" | "objective" | "branchId" | "socialAccountId" | "audienceId" | "status">>;
export declare const adCampaignsDao: {
    list(clinicId: string, scope: BranchScope, filters?: AdCampaignFilters): Promise<AdCampaignListItem[]>;
    summary(clinicId: string, scope: BranchScope): Promise<AdCampaignSummary>;
    get(clinicId: string, id: string): Promise<AdCampaignDetail | null>;
    create(clinicId: string, userId: string, input: CreateAdCampaignInput): Promise<{
        currency: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string | null;
        status: AdCampaignStatus;
        budgetAmount: import("@prisma/client-runtime-utils").Decimal | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
        startsAt: Date | null;
        durationDays: number | null;
        objective: import("@/generated/prisma/enums").AdObjective;
        createdByUserId: string | null;
        platform: import("@/generated/prisma/enums").AdPlatform;
        endsAt: Date | null;
        launchedAt: Date | null;
        socialAccount: {
            name: string;
            id: string;
            platform: import("@/generated/prisma/enums").AdPlatform;
        } | null;
        audience: {
            name: string;
            id: string;
            estimatedReach: number | null;
        } | null;
        budgetKind: AdBudgetKind | null;
        feeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        externalId: string | null;
        externalError: string | null;
        creatives: {
            id: string;
            description: string | null;
            source: import("@/generated/prisma/enums").AdCreativeSource;
            primaryText: string;
            headline: string | null;
            linkUrl: string | null;
            imageUrl: string | null;
            aiPrompt: string | null;
            aiStyle: string | null;
            toneFormal: number | null;
            toneFriendly: number | null;
            toneOptimist: number | null;
        }[];
    }>;
    update(clinicId: string, id: string, input: UpdateAdCampaignInput): Promise<AdCampaignDetail | null>;
    /**
     * نصّ الإعلان وصورته. الحملة تحمل مادّة إعلانية واحدة في الإصدار الأول (التصميم
     * يعرض معاينة واحدة)، فالحفظ استبدالٌ لا إضافة — وإلا تراكمت مسوّدات لا تظهر في
     * أي شاشة ولا يعرف أحد أيّها المعروض.
     */
    saveCreative(clinicId: string, campaignId: string, input: SaveCreativeInput): Promise<AdCampaignDetail | null>;
    /**
     * [MK6.1] الجدولة والميزانية. `durationDays` مشتقّ لا مُدخَل — عمود «المدة» في
     * الجدول يجب أن يطابق النافذة الزمنية دائمًا، وتخزينه مستقلًّا يخلق قيمتين
     * تتباعدان أوّل مرّة يعدّل فيها أحدهم التاريخين.
     */
    setSchedule(clinicId: string, id: string, input: {
        startsAt: Date;
        endsAt: Date;
        budgetKind: AdBudgetKind;
        budgetAmount: number;
        currency?: string;
    }): Promise<AdCampaignDetail | null>;
    /** يثبّت نتيجة الإطلاق. الحالة تأتي من المنفّذ لا من المتحكّم. */
    markLaunched(clinicId: string, id: string, result: {
        status: AdCampaignStatus;
        externalId: string | null;
    }): Promise<AdCampaignDetail | null>;
    remove(clinicId: string, id: string): Promise<boolean>;
};
